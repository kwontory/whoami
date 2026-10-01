import { generateAuthenticationOptions } from "@simplewebauthn/server";
import type { NextRequest } from "next/server";
import { saveChallenge } from "@/lib/challenges";
import { allowedOrigin, forbiddenOrigin, json, tooManyAttempts } from "@/lib/http";
import { LOGIN_LIMIT, rateLimited } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const rp = allowedOrigin(request);
  if (!rp) return forbiddenOrigin();
  const wait = await rateLimited(request, LOGIN_LIMIT);
  if (wait) return tooManyAttempts(wait);
  const options = await generateAuthenticationOptions({
    rpID: rp.id,
    allowCredentials: [],
    userVerification: "required",
    timeout: 300_000,
  });
  const response = json(options);
  await saveChallenge(request, response, {
    challenge: options.challenge,
    purpose: "login",
    user_id: null,
    display_name: null,
    nickname: null,
    webauthn_user_id: null,
  });
  return response;
}
