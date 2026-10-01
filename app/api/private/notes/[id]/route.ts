import type { NextRequest } from "next/server";
import { currentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { failure, json } from "@/lib/http";
import { privateCopy as copy } from "@/data/private";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser(request);
  if (!user) return failure(401, copy.loginRequired);
  const { id } = await context.params;
  // 형식이 틀린 ID는 Postgres uuid 오류로 넘기지 않고 없는 항목처럼 404로 응답함
  if (!UUID.test(id)) return failure(404, copy.missingNote);
  const rows = await db().query(
    `SELECT id, title, body, created_at FROM notes
     WHERE id = $1 AND user_id = $2`,
    [id, user.id],
  );
  return rows[0] ? json({ note: rows[0] }) : failure(404, copy.missingNote);
}
