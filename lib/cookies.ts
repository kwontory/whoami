import type { NextResponse } from "next/server";

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

export function clearCookie(response: NextResponse, name: string) {
  response.cookies.set(name, "", cookieOptions(0));
}
