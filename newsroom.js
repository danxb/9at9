require("dotenv").config();
const RSSParser = require("rss-parser");
const puppeteer = require("puppeteer");
const { OpenAI } = require("openai");
const mysql = require("mysql2/promise");

const parser = new RSSParser();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper to clean CDATA
function cleanCDATA(str) {
    if (!str) return "";
    return str.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

async function summarizeArticle(article) {
    const browser = await puppeteer.launch({ headless: true });
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

    if (!articleText.trim()) return null; // skip empty text

    const completion = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            {
                role: "user",
                content: `
Return ONLY valid JSON, no code fences, in this format:

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

async function run() {
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

    for (const feedInfo of feeds) {
        try {
            const feed = await parser.parseURL(feedInfo.rss);
            let articles = feed.items;

            // Clean CDATA for all fields we use
            articles = articles.map(item => ({
                ...item,
                title: cleanCDATA(item.title),
                link: cleanCDATA(item.link),
                description: cleanCDATA(item.description),
            }));

            // Filter out “live” articles if needed
            if (feedInfo.filterLive) {
                articles = articles.filter(item => !/live/i.test(item.title));
                articles = articles.filter(item => !/watch/i.test(item.link));
            }

            const topArticles = articles.slice(0, 3);

            for (const article of topArticles) {
                try {
                    const result = await summarizeArticle(article);
                    if (!result) continue;

                    console.log(`[${feedInfo.category}] URL:`, article.link);
                    console.log("Headline:", result.headline);
                    console.log("Summary:", result.summary);
                    console.log("--------------------------------------------------");

                    const articleDate = new Date(article.pubDate);
                    await db.execute(
                        "INSERT INTO articles (source, category, url, headline, summary, updated) VALUES (?, ?, ?, ?, ?, ?)",
                        [feedInfo.source, feedInfo.category, article.link, result.headline, result.summary, articleDate]
                    );

                    console.log("Saved to DB!");
                } catch (err) {
                    console.error("Error processing article:", article.link, err);
                }
            }
        } catch (err) {
            console.error("Error fetching feed:", feedInfo.rss, err);
        }
    }

    await db.end();
}

run();