import type { NextRequest } from "next/server";
import { discardChallenge } from "@/lib/challenges";
import { allowedOrigin, forbiddenOrigin, json } from "@/lib/http";

export async function POST(request: NextRequest) {
  if (!allowedOrigin(request)) return forbiddenOrigin();
  return discardChallenge(request, json({ canceled: true }), "register");
}
