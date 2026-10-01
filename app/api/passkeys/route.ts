import type { NextRequest } from "next/server";
import { listPasskeys } from "@/lib/credentials";
import { failure, json } from "@/lib/http";
import { currentUser } from "@/lib/session";
import { privateCopy as copy } from "@/data/private";

export async function GET(request: NextRequest) {
  const user = await currentUser(request);
  if (!user) return failure(401, copy.loginRequired);
  return json({ passkeys: await listPasskeys(user.id) });
}
