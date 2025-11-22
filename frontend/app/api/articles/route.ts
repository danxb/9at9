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

    const [rows] = await connection.execute(
      "SELECT id, source, category, headline as title, summary, url FROM articles ORDER BY id DESC"
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
