require("dotenv").config();
const RSSParser = require("rss-parser");
const puppeteer = require("puppeteer");
const { OpenAI } = require("openai");
const mysql = require("mysql2/promise");

const parser = new RSSParser();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function summarizeArticle(article) {
    // SCRAPE ARTICLE TEXT
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(article.link, { waitUntil: "load" });

    const articleText = await page.evaluate(() => {
        const container = document.querySelector("article, #main-content");
        if (!container) return "";
        return Array.from(container.querySelectorAll("p"))
            .map(el => el.innerText)
            .join("\n");
    });

    await browser.close();

    // GPT SUMMARY
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

    const data = JSON.parse(content);
    return { headline: data.headline, summary: data.summary };
}

async function run() {
    // 1. RSS
    const feed = await parser.parseURL("https://feeds.bbci.co.uk/news/rss.xml");
    const topArticles = feed.items.slice(0, 3); // top 3 stories

    // 2. DB connection (open once)
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    for (const article of topArticles) {
        try {
            const { headline, summary } = await summarizeArticle(article);

            console.log("URL:", article.link);
            console.log("Headline:", headline);
            console.log("Summary:", summary);
            console.log("--------------------------------------------------");

            // INSERT INTO MYSQL
            const articleDate = new Date(article.pubDate);
            const source = "BBC";
            const category = "News";
            const url = article.link;

            await db.execute(
                "INSERT INTO articles (source, category, url, headline, summary, updated) VALUES (?, ?, ?, ?, ?, ?)",
                [source, category, url, headline, summary, articleDate]
            );

            console.log("Saved to DB!");
        } catch (err) {
            console.error("Error processing article:", article.link, err);
        }
    }

    await db.end();
}

run();
