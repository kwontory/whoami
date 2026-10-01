import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";

type Limit = { name: string; max: number; windowSeconds: number };

// 로그인 options와 verify가 한 카운터를 같이 씀. 정상 로그인 한 번에 2회
export const LOGIN_LIMIT: Limit = { name: "login", max: 30, windowSeconds: 15 * 60 };
// 세션 없는 방문자의 가입 코드 입력
export const SIGNUP_LIMIT: Limit = { name: "signup", max: 10, windowSeconds: 60 * 60 };

// Vercel은 x-real-ip와 x-forwarded-for를 덮어쓰므로 클라이언트가 바꿀 수 없음
function clientIp(request: NextRequest) {
  return request.headers.get("x-real-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown";
}

// IP별 고정 창 방식. IP는 해시로만 저장함.
// 한도를 넘으면 기다릴 초를, 아니면 null을 돌려줌
export async function rateLimited(request: NextRequest, limit: Limit): Promise<number | null> {
  const key = `${limit.name}:${createHash("sha256").update(clientIp(request)).digest("hex")}`;
  const rows = await db().query(
    `WITH stale AS (
       DELETE FROM rate_limits WHERE window_start < now() - interval '1 day' AND key <> $1
     )
     INSERT INTO rate_limits AS r (key, window_start, hits) VALUES ($1, now(), 1)
     ON CONFLICT (key) DO UPDATE SET
       hits = CASE WHEN r.window_start <= now() - make_interval(secs => $2) THEN 1 ELSE r.hits + 1 END,
       window_start = CASE WHEN r.window_start <= now() - make_interval(secs => $2) THEN now() ELSE r.window_start END
     RETURNING hits,
       ceil(extract(epoch FROM r.window_start + make_interval(secs => $2) - now()))::int AS retry_after`,
    [key, limit.windowSeconds],
  );
  const { hits, retry_after } = rows[0] as { hits: number; retry_after: number };
  return hits > limit.max ? Math.max(retry_after, 1) : null;
}
