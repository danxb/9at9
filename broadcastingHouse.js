import "dotenv/config";
import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import mysql from "mysql2/promise";

const EPG_URL =
  "https://raw.githubusercontent.com/dp247/Freeview-EPG/master/epg.xml";

// Leave empty for now – defaults to 6.0
const OMDB_API_KEY = "c9fde3c2";

// Channels you explicitly do NOT want
const EXCLUDE_CHANNELS = new Set(["Film4 HD"]);

function getTodayNinePM() {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}210000 +0000`;
}

// Fix title and description
function normalizeTitleAndDesc(title, desc) {
  let cleanDesc = desc.trim();

  // Remove leading "..." in description
  if (cleanDesc.startsWith("...")) {
    const colonIndex = cleanDesc.indexOf(":");
    if (colonIndex !== -1) {
      cleanDesc = cleanDesc.slice(colonIndex + 1).trim();
    }
  }

  // Fix truncated title ending with "..."
  if (title.endsWith("...")) {
    const match = desc.match(/^\.{3}([^:]+):/);
    if (match) {
      title = title.replace(/\.\.\.$/, match[1].trim());
    }
  }

  // Insert space before capital letters stuck together (e.g., DeadReckoning → Dead Reckoning)
  title = title.replace(/([a-z])([A-Z])/g, "$1 $2");

  return { title, desc: cleanDesc };
}

// Fetch IMDb rating (falls back to 6.0)
async function getImdbRating(title, year) {
  if (!OMDB_API_KEY || !year) return 6.0;

  try {
    const url = `http://www.omdbapi.com/?t=${encodeURIComponent(
      title
    )}&y=${year}&apikey=${OMDB_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "True" && data.imdbRating !== "N/A") {
      return Number(data.imdbRating);
    }
  } catch (err) {
    console.error("OMDb error:", err);
  }

  return 6.0;
}

(async () => {
  const xml = await fetch(EPG_URL).then(r => r.text());
  const epg = await parseStringPromise(xml, { explicitArray: false });

  const targetStart = getTodayNinePM();

  // Map channel ID => display-name
  const channelMap = {};
  const channels = Array.isArray(epg.tv.channel) ? epg.tv.channel : [epg.tv.channel];
  for (const ch of channels) {
    const name = ch["display-name"]?._ || ch["display-name"];
    if (name) channelMap[ch.$.id] = name.trim();
  }

  const seen = new Set();
  const films = [];

  const programmes = Array.isArray(epg.tv.programme)
    ? epg.tv.programme
    : [epg.tv.programme];

  for (const p of programmes) {
    if (p.$.start !== targetStart) continue;

    const channelName = channelMap[p.$.channel] || p.$.channel;
    if (EXCLUDE_CHANNELS.has(channelName)) continue;

    const descRaw = p.desc?._ || p.desc;
    if (!descRaw || !/\(\d{4}\)/.test(descRaw)) continue;

    const rawTitle = (p.title._ || p.title).trim();
    const descTrim = descRaw.trim();

    const { title, desc: cleanDesc } = normalizeTitleAndDesc(rawTitle, descTrim);

    // Deduplicate by content
    const key = `${title}::${cleanDesc}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const yearMatch = cleanDesc.match(/\((\d{4})\)/);
    const year = yearMatch ? yearMatch[1] : null;

    const imdbRating = await getImdbRating(title, year);

    // Quality filter – only decent films
    if (imdbRating < 5.9) continue;

    films.push({
      channel: channelName,
      title,
      year,
      imdbRating,
      desc: cleanDesc
    });
  }

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  await db.execute(
    `
    INSERT INTO tv_guide (date, films)
    VALUES (CURDATE(), ?)
    ON DUPLICATE KEY UPDATE
      films = VALUES(films)
  `,
    [JSON.stringify(films)]
  );

  await db.end();

  console.log(`Saved ${films.length} films`);
})();
