import { verifyAuthenticationResponse, type AuthenticationResponseJSON } from "@simplewebauthn/server";
import type { NextRequest } from "next/server";
import { clearChallengeCookie, consumeChallenge } from "@/lib/challenges";
import { findCredential, recordCredentialUse } from "@/lib/credentials";
import { allowedOrigin, failure, forbiddenOrigin, json, readJson, tooManyAttempts } from "@/lib/http";
import { LOGIN_LIMIT, rateLimited } from "@/lib/rateLimit";
import { issueSession } from "@/lib/session";
import { privateCopy as copy } from "@/data/private";

export async function POST(request: NextRequest) {
  const rp = allowedOrigin(request);
  if (!rp) return forbiddenOrigin();
  const wait = await rateLimited(request, LOGIN_LIMIT);
  if (wait) return tooManyAttempts(wait);
  const pending = await consumeChallenge(request, "login");
  if (!pending) return clearChallengeCookie(failure(400, copy.expiredLogin), "login");
  const body = await readJson(request);
  const response = body?.credential;
  if (!response || typeof response !== "object" || !("id" in response) || typeof response.id !== "string") {
    return clearChallengeCookie(failure(400, copy.missingCredential), "login");
  }
  const saved = await findCredential(response.id);
  if (!saved) return clearChallengeCookie(failure(401, copy.unknownPasskey), "login");

  let verified;
  try {
    verified = await verifyAuthenticationResponse({
      response: response as AuthenticationResponseJSON,
      expectedChallenge: pending.challenge,
      expectedOrigin: rp.origin,
      expectedRPID: rp.id,
      credential: saved,
      requireUserVerification: true,
    });
  } catch {
    return clearChallengeCookie(failure(401, copy.invalidSignature), "login");
  }
  if (!verified.verified) {
    return clearChallengeCookie(failure(401, copy.invalidSignature), "login");
  }

  if (!await recordCredentialUse(saved, verified.authenticationInfo.newCounter)) {
    return clearChallengeCookie(failure(401, copy.changedPasskey), "login");
  }
  const result = json({ verified: true });
  await issueSession(request, result, saved.userId);
  return clearChallengeCookie(result, "login");
}
