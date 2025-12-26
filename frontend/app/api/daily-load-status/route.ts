// app/api/daily-load-status/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  const dbConfig: mysql.ConnectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    dateStrings: true,
  };

  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute<mysql.RowDataPacket[]>(
    `SELECT in_progress, last_updated
     FROM daily_load
     WHERE ID = 1`
  );
  await connection.end();

  const { in_progress, last_updated } = rows[0];
  return NextResponse.json({ in_progress, last_updated });
}
