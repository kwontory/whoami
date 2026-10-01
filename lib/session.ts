import { createHash, randomBytes } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import { clearCookie, cookieOptions } from "@/lib/cookies";
import { db } from "@/lib/db";

const SESSION_COOKIE = "__Host-whoami-session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

export type CurrentUser = { id: string; display_name: string };

// 쿠키에는 무작위 토큰, DB에는 그 SHA-256 해시만 저장함
function tokenHash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function sessionHash(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return token ? tokenHash(token) : null;
}

export async function currentUser(request: NextRequest): Promise<CurrentUser | null> {
  const hash = sessionHash(request);
  if (!hash) return null;
  const rows = await db().query(
    `SELECT u.id, u.display_name FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [hash],
  );
  return (rows[0] as CurrentUser | undefined) ?? null;
}

// 이 브라우저의 기존 세션을 바꾸고 만료된 세션을 지움
export async function issueSession(request: NextRequest, response: NextResponse, userId: string) {
  const previous = sessionHash(request);
  if (previous) await db().query("DELETE FROM sessions WHERE token_hash = $1", [previous]);
  await db().query("DELETE FROM sessions WHERE expires_at <= now()");
  const token = randomBytes(32).toString("base64url");
  await db().query(
    `INSERT INTO sessions (token_hash, user_id, expires_at)
     VALUES ($1, $2, now() + make_interval(secs => $3))`,
    [tokenHash(token), userId, SESSION_SECONDS],
  );
  response.cookies.set(SESSION_COOKIE, token, cookieOptions(SESSION_SECONDS));
}

export async function endSession(request: NextRequest, response: NextResponse) {
  const hash = sessionHash(request);
  if (hash) await db().query("DELETE FROM sessions WHERE token_hash = $1", [hash]);
  clearCookie(response, SESSION_COOKIE);
}

// 패스키를 지운 뒤처럼, 이 계정의 다른 브라우저를 모두 로그아웃시킴
export async function revokeOtherSessions(request: NextRequest, userId: string) {
  await db().query(
    "DELETE FROM sessions WHERE user_id = $1 AND token_hash IS DISTINCT FROM $2",
    [userId, sessionHash(request)],
  );
}
