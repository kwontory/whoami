import type { NextRequest } from "next/server";
import { currentUser } from "@/lib/session";
import { failure, json } from "@/lib/http";
import { privateCopy as copy } from "@/data/private";

export async function GET(request: NextRequest) {
  const user = await currentUser(request);
  return user ? json({ user }) : failure(401, copy.loginRequired);
}
