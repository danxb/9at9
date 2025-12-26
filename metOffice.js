import "dotenv/config";
import mysql from "mysql2/promise";

const cities = [
  { city: "London", latitude: 51.5074, longitude: -0.1278 },
  { city: "Paris", latitude: 48.8566, longitude: 2.3522 },
  { city: "Berlin", latitude: 52.52, longitude: 13.405 },
  { city: "Rome", latitude: 41.9028, longitude: 12.4964 },
  { city: "Madrid", latitude: 40.4168, longitude: -3.7038 },
  { city: "Lisbon", latitude: 38.7223, longitude: -9.1393 },
  { city: "Athens", latitude: 37.9838, longitude: 23.7275 },
  { city: "Vienna", latitude: 48.2082, longitude: 16.3738 },
  { city: "Edinburgh", latitude: 55.9533, longitude: -3.1883 }
];

function buildWeatherUrl() {
  const lats = cities.map(c => c.latitude).join(",");
  const lons = cities.map(c => c.longitude).join(",");

  return `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lats}` +
    `&longitude=${lons}` +
    `&daily=temperature_2m_max` +
    `&timezone=UTC`;
}

async function fetchTemperatures() {
  const url = buildWeatherUrl();
  const res = await fetch(url);
  const results = await res.json(); // ARRAY

  const date = results[0].daily.time[0]; // same date for all

  const temperatures = results.map((result, index) => ({
    city: cities[index].city,
    temp: result.daily.temperature_2m_max[0]
  }));

  return { date, temperatures };
}

async function runDailyWeatherJob() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  const { date, temperatures } = await fetchTemperatures();

  await db.execute(
    `INSERT INTO daily_temperatures (date, temperatures)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE temperatures = VALUES(temperatures)`,
    [date, JSON.stringify(temperatures)]
  );

  await db.end();
  console.log(`Stored temperatures for ${date}`);
}

runDailyWeatherJob().catch(console.error);
