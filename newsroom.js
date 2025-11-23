require("dotenv").config();
const RSSParser = require("rss-parser");
const puppeteer = require("puppeteer");
const { OpenAI } = require("openai");
const mysql = require("mysql2/promise");

const parser = new RSSParser();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Clean CDATA ---
function cleanCDATA(str) {
    if (!str) return "";
    return str.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

async function startBatch(db) {
    await db.execute(`
        UPDATE daily_load
        SET current_batch = NOW(),
            in_progress = 1
        WHERE id = 1
    `);
}

async function finishBatch(db) {
    await db.execute(`
        UPDATE daily_load
        SET last_updated = NOW(),
            in_progress = 0
        WHERE id = 1
    `);
}

// --- Check if article URL already exists ---
async function articleExists(db, url) {
    const [rows] = await db.execute(
        "SELECT 1 FROM articles WHERE url = ? LIMIT 1",
        [url]
    );
    return rows.length > 0;
}

// --- Summarise article using OpenAI ---
async function summarizeArticle(article, browser) {
    const page = await browser.newPage();

    await page.goto(article.link, { waitUntil: "load" });

    const articleText = await page.evaluate(() => {
        const container = document.querySelector(".article, .sdc-article-body, #main-content");
        if (!container) return "";
        return Array.from(container.querySelectorAll("p"))
            .map(el => el.innerText)
            .join("\n");
    });

    await browser.close();

    if (!articleText.trim()) return null;

    const completion = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            {
                role: "user",
                content: `
Return ONLY valid JSON:

{
  "headline": "<1-3 word snappy headline>",
  "summary": "<1-2 paragraph summary>"
}

Text to summarise:
${articleText}
`
            }
        ]
    });

    let content = completion.choices[0].message.content;
    content = content.replace(/```json\s*|```/g, "").trim();

    try {
        const data = JSON.parse(content);
        return { headline: data.headline, summary: data.summary };
    } catch (err) {
        console.error("GPT returned invalid JSON:", content);
        return null;
    }
}

// --- MAIN RUN ---
async function run() {
    
    const browser = await puppeteer.launch({ headless: true });

    const feeds = [
        { source: "BBC", category: "News", rss: "https://feeds.bbci.co.uk/news/rss.xml" },
        { source: "Sky Sports", category: "Sport", rss: "https://www.skysports.com/rss/12040", filterLive: true },
        { source: "Metro", category: "Entertainment", rss: "https://metro.co.uk/entertainment/showbiz/feed" },
    ];

    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    
    await startBatch(db);
    console.log("Starting batch");

    for (const feedInfo of feeds) {
        try {
            const feed = await parser.parseURL(feedInfo.rss);
            let articles = feed.items;

            // Clean
            articles = articles.map(item => ({
                ...item,
                title: cleanCDATA(item.title),
                link: cleanCDATA(item.link),
                description: cleanCDATA(item.description),
            }));

            // Apply filters
            if (feedInfo.filterLive) {
                articles = articles.filter(item => !/live/i.test(item.title));
                articles = articles.filter(item => !/watch/i.test(item.link));
            }

            // --- Pull a few extra to avoid duplicates (6 instead of 3) ---
            const candidateArticles = articles.slice(0, 6);

            let added = 0;
            for (const article of candidateArticles) {
                if (added >= 3) break;

                // Skip duplicates BEFORE OpenAI call (saves £££)
                if (await articleExists(db, article.link)) {
                    console.log("Already exists, skipping:", article.link);
                    continue;
                }

                // Summarise
                const result = await summarizeArticle(article, browser);
                if (!result) continue;

                console.log(`[${feedInfo.category}] URL:`, article.link);
                console.log("Headline:", result.headline);

                const articleDate = new Date(article.pubDate);

                // Insert
                const [res] = await db.execute(
                    "INSERT INTO articles (source, category, url, headline, summary, updated) VALUES (?, ?, ?, ?, ?, ?)",
                    [feedInfo.source, feedInfo.category, article.link, result.headline, result.summary, articleDate]
                );

                if (res.affectedRows > 0) {
                    console.log("Saved!");
                    added++;
                }
            }

            console.log(`Finished ${feedInfo.source}: added ${added} articles.`);

        } catch (err) {
            console.error("Error fetching feed:", feedInfo.rss, err);
        }
    }

    await browser.close();
    await browser.process()?.kill("SIGKILL");

    await finishBatch(db);
    console.log("Batch completed.");

    await db.end();
}

run();
