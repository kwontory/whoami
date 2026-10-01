import { randomBytes, randomUUID } from "node:crypto";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import type { NextRequest } from "next/server";
import { saveChallenge } from "@/lib/challenges";
import { credentialDescriptors, webauthnUserId } from "@/lib/credentials";
import { allowedOrigin, failure, forbiddenOrigin, json, readJson, tooManyAttempts } from "@/lib/http";
import { rateLimited, SIGNUP_LIMIT } from "@/lib/rateLimit";
import { currentUser } from "@/lib/session";
import { matchesSignupCode, signupEnabled } from "@/lib/signup";
import { privateCopy as copy } from "@/data/private";

// 새 계정 만들기(가입 코드 필요) 또는 로그인한 계정에 패스키 추가를 시작함
export async function POST(request: NextRequest) {
  const rp = allowedOrigin(request);
  if (!rp) return forbiddenOrigin();
  const body = await readJson(request);
  if (!body) return failure(400, copy.invalidRequest);
  const nickname = typeof body.nickname === "string" ? body.nickname.trim() : "";
  if (!nickname || nickname.length > 60) return failure(400, copy.invalidName);

  const user = await currentUser(request);
  let account: { id: string; displayName: string; webauthnUserId: string };
  let excludeCredentials: { id: string; transports: string[] }[] = [];
  if (user) {
    account = { id: user.id, displayName: user.display_name, webauthnUserId: await webauthnUserId(user.id) };
    excludeCredentials = await credentialDescriptors(user.id);
  } else {
    if (!signupEnabled()) return failure(503, copy.signupUnavailable);
    const wait = await rateLimited(request, SIGNUP_LIMIT);
    if (wait) return tooManyAttempts(wait);
    if (!matchesSignupCode(body.signupCode)) return failure(403, copy.invalidSignupCode);
    const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
    if (!displayName || displayName.length > 80) return failure(400, copy.invalidDisplayName);
    account = { id: randomUUID(), displayName, webauthnUserId: randomBytes(32).toString("base64url") };
  }

  const options = await generateRegistrationOptions({
    rpName: "whoami private",
    rpID: rp.id,
    userName: account.displayName,
    userDisplayName: account.displayName,
    userID: Buffer.from(account.webauthnUserId, "base64url"),
    attestationType: "none",
    timeout: 300_000,
    authenticatorSelection: { residentKey: "required", userVerification: "required" },
    excludeCredentials,
  });
  const response = json(options);
  // 새 계정은 패스키 검증이 끝날 때까지 질문 행에만 보관함
  await saveChallenge(request, response, {
    challenge: options.challenge,
    purpose: "register",
    user_id: account.id,
    display_name: user ? null : account.displayName,
    nickname,
    webauthn_user_id: user ? null : account.webauthnUserId,
  });
  return response;
}
