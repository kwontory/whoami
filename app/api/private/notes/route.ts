import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { currentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { allowedOrigin, failure, forbiddenOrigin, json, readJson } from "@/lib/http";
import { privateCopy as copy } from "@/data/private";

const NOTE_LIMIT = 200;

export async function GET(request: NextRequest) {
  const user = await currentUser(request);
  if (!user) return failure(401, copy.loginRequired);
  // 계정은 URL 값이 아니라 항상 서버 세션에서 정함
  const notes = await db().query(
    `SELECT id, title, body, created_at FROM notes
     WHERE user_id = $1 ORDER BY created_at DESC`,
    [user.id],
  );
  return json({ notes });
}

export async function POST(request: NextRequest) {
  if (!allowedOrigin(request)) return forbiddenOrigin();
  const user = await currentUser(request);
  if (!user) return failure(401, copy.loginRequired);
  const input = await readJson(request);
  const title = typeof input?.title === "string" ? input.title.trim() : "";
  const body = typeof input?.body === "string" ? input.body.trim() : "";
  if (!title || title.length > 120 || !body || body.length > 5000) {
    return failure(400, copy.invalidNote);
  }
  // 가입 코드가 새더라도 무료 DB 용량을 다 채우지 못하게 상한을 둠
  const rows = await db().query(
    `INSERT INTO notes (id, user_id, title, body)
     SELECT $1, $2, $3, $4
     WHERE (SELECT count(*) FROM notes WHERE user_id = $2) < $5
     RETURNING id, title, body, created_at`,
    [randomUUID(), user.id, title, body, NOTE_LIMIT],
  );
  if (!rows[0]) return failure(409, copy.noteLimit(NOTE_LIMIT));
  return json({ note: rows[0] }, 201);
}
