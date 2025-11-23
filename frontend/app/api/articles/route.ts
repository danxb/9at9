import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Use proper typing for config
const dbConfig: mysql.ConnectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

export async function GET() {
  let connection: mysql.Connection | undefined;
  try {
    connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(`
      SELECT a.id, a.source, a.category, a.headline AS title, a.summary, a.url
      FROM articles a
      JOIN daily_load d
        ON DATE(a.published) = DATE(d.last_updated)
      WHERE d.last_updated = (SELECT MAX(last_updated) FROM daily_load)
      ORDER BY a.id
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
