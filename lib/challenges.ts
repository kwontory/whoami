import { randomUUID } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import { clearCookie, cookieOptions } from "@/lib/cookies";
import { db } from "@/lib/db";

const CHALLENGE_SECONDS = 5 * 60;
const REGISTER_COOKIE = "__Host-whoami-register";
const LOGIN_COOKIE = "__Host-whoami-login";
export type Purpose = "register" | "login";

export type Challenge = {
  id: string;
  challenge: string;
  purpose: Purpose;
  user_id: string | null;
  display_name: string | null;
  nickname: string | null;
  webauthn_user_id: string | null;
};

function challengeCookie(purpose: Purpose) {
  return purpose === "register" ? REGISTER_COOKIE : LOGIN_COOKIE;
}

export async function saveChallenge(
  request: NextRequest,
  response: NextResponse,
  data: Omit<Challenge, "id">,
) {
  const name = challengeCookie(data.purpose);
  const previous = request.cookies.get(name)?.value;
  if (previous) await db().query("DELETE FROM challenges WHERE id = $1", [previous]);
  await db().query("DELETE FROM challenges WHERE expires_at <= now()");
  const id = randomUUID();
  await db().query(
    `INSERT INTO challenges
       (id, challenge, purpose, user_id, display_name, nickname, webauthn_user_id, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, now() + make_interval(secs => $8))`,
    [id, data.challenge, data.purpose, data.user_id, data.display_name,
      data.nickname, data.webauthn_user_id, CHALLENGE_SECONDS],
  );
  response.cookies.set(name, id, cookieOptions(CHALLENGE_SECONDS));
}

// 서명을 검증하기 전에 DELETE ... RETURNING으로 질문을 한 번에 소비함
export async function consumeChallenge(request: NextRequest, purpose: Purpose) {
  const id = request.cookies.get(challengeCookie(purpose))?.value;
  if (!id) return null;
  const rows = await db().query(
    `DELETE FROM challenges
     WHERE id = $1 AND purpose = $2 AND expires_at > now()
     RETURNING id, challenge, purpose, user_id, display_name, nickname, webauthn_user_id`,
    [id, purpose],
  );
  return (rows[0] as Challenge | undefined) ?? null;
}

export function clearChallengeCookie(response: NextResponse, purpose: Purpose) {
  clearCookie(response, challengeCookie(purpose));
  return response;
}

// 브라우저 창에서 취소하는 등 끝나지 않은 질문을 지움
export async function discardChallenge(request: NextRequest, response: NextResponse, purpose: Purpose) {
  const id = request.cookies.get(challengeCookie(purpose))?.value;
  if (id) await db().query("DELETE FROM challenges WHERE id = $1 AND purpose = $2", [id, purpose]);
  return clearChallengeCookie(response, purpose);
}
