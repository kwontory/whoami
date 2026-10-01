import { NextRequest, NextResponse } from "next/server";
import { privateCopy as copy } from "@/data/private";

const PRODUCTION_ORIGIN = "https://whoami-hazel-one.vercel.app";

function relyingParty(request: NextRequest) {
  const url = new URL(request.url);
  if (url.origin === PRODUCTION_ORIGIN) {
    return { origin: PRODUCTION_ORIGIN, id: "whoami-hazel-one.vercel.app" };
  }
  if (url.hostname === "localhost" && url.protocol === "http:") {
    return { origin: url.origin, id: "localhost" };
  }
  return null;
}

// 요청이 같은 출처에서 왔을 때만 RP 정보를 돌려줌
export function allowedOrigin(request: NextRequest) {
  const rp = relyingParty(request);
  return rp && request.headers.get("origin") === rp.origin ? rp : null;
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export function failure(status: number, message: string) {
  return json({ error: message }, status);
}

export function tooManyAttempts(retryAfter: number) {
  const response = failure(429, copy.tooManyAttempts(Math.ceil(retryAfter / 60)));
  response.headers.set("Retry-After", String(retryAfter));
  return response;
}

export function forbiddenOrigin() {
  return failure(403, copy.invalidOrigin);
}

export async function readJson(request: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const value: unknown = await request.json();
    return value !== null && typeof value === "object" && !Array.isArray(value)
      ? value as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}
