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
      SELECT a.id, a.temperatures
      FROM daily_temperatures a
      JOIN daily_load d
        ON DATE(a.date) = DATE(d.last_updated)
      WHERE d.last_updated = (SELECT MAX(last_updated) FROM daily_load)
      ORDER BY a.id
      LIMIT 1
    `);

    if (rows.length === 0) {
      return NextResponse.json({ cities: [] });
    }

    const row = rows[0];
    const cities = row.temperatures;

    return NextResponse.json({
      id: row.id,
      cities,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ cities: [] }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
