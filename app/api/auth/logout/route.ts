import type { NextRequest } from "next/server";
import { allowedOrigin, forbiddenOrigin, json } from "@/lib/http";
import { endSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  if (!allowedOrigin(request)) return forbiddenOrigin();
  const response = json({ loggedOut: true });
  await endSession(request, response);
  return response;
}
