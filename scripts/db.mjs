import { neon } from "@neondatabase/serverless";
import pg from "pg";

// lib/db.ts와 같은 분기. 로컬 Postgres는 TCP, Neon은 HTTP
export function connect(url = process.env.DATABASE_URL) {
  if (!url) throw new Error("DATABASE_URL is required. Use --env-file=.env.local.");
  if (["localhost", "127.0.0.1"].includes(new URL(url).hostname)) {
    const pool = new pg.Pool({ connectionString: url });
    return {
      query: async (text, params = []) => (await pool.query(text, params)).rows,
      end: () => pool.end(),
    };
  }
  const sql = neon(url);
  return { query: (text, params = []) => sql.query(text, params), end: async () => {} };
}
