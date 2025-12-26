import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

const dbConfig: mysql.ConnectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

export async function GET() {
  let connection: mysql.Connection | undefined;
  try {
    connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute<RowDataPacket[]>(`
      SELECT a.id, a.films
      FROM tv_guide a
      JOIN daily_load d
        ON DATE(a.date) = DATE(d.last_updated)
      WHERE d.last_updated = (SELECT MAX(last_updated) FROM daily_load)
      ORDER BY a.id
      LIMIT 1
    `);

    console.log("FILMS 1:", rows);
    if (rows.length === 0) {
      return NextResponse.json({ films: [] });
    }

    const row = rows[0];
    const films = row.films;

    console.log("FILMS ROW:", row);
    console.log("FILMS:", films);

    return NextResponse.json({
      id: row.id,
      films,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ films: [] }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
