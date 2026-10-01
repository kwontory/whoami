import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";

type Row = Record<string, unknown>;
type Database = { query: (text: string, params?: unknown[]) => Promise<Row[]> };
let cached: Database | undefined;

// 서버 인스턴스마다 연결 하나. 로컬 Postgres는 TCP, Neon은 HTTP
export function db(): Database {
  if (cached) return cached;
  // APP_DATABASE_URL이 있으면 최소 권한 역할로 접속. 마이그레이션은 DATABASE_URL(소유자)을 씀
  const url = process.env.APP_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  if (["localhost", "127.0.0.1"].includes(new URL(url).hostname)) {
    const pool = new Pool({ connectionString: url, max: 5 });
    cached = { query: async (text, params = []) => (await pool.query(text, params)).rows as Row[] };
  } else {
    const sql = neon(url);
    cached = { query: async (text, params = []) => await sql.query(text, params) as Row[] };
  }
  return cached;
}

export function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}
