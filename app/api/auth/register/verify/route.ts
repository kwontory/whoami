import { verifyRegistrationResponse, type RegistrationResponseJSON } from "@simplewebauthn/server";
import type { NextRequest } from "next/server";
import { clearChallengeCookie, consumeChallenge } from "@/lib/challenges";
import { addCredential, createAccount, type NewCredential } from "@/lib/credentials";
import { isUniqueViolation } from "@/lib/db";
import { allowedOrigin, failure, forbiddenOrigin, json, readJson } from "@/lib/http";
import { currentUser, issueSession } from "@/lib/session";
import { privateCopy as copy } from "@/data/private";

export async function POST(request: NextRequest) {
  const rp = allowedOrigin(request);
  if (!rp) return forbiddenOrigin();
  const pending = await consumeChallenge(request, "register");
  if (!pending || !pending.user_id || !pending.nickname) {
    return clearChallengeCookie(failure(400, copy.expiredRegistration), "register");
  }
  const body = await readJson(request);
  if (!body || !body.credential || typeof body.credential !== "object") {
    return clearChallengeCookie(failure(400, copy.missingCredential), "register");
  }
  // 가입은 로그아웃 상태에서, 패스키 추가는 시작한 계정 그대로 끝나야 함
  const user = await currentUser(request);
  const isSignup = Boolean(pending.display_name && pending.webauthn_user_id);
  if (isSignup ? user !== null : user?.id !== pending.user_id) {
    return clearChallengeCookie(failure(403, copy.wrongAccount), "register");
  }

  let verified;
  try {
    verified = await verifyRegistrationResponse({
      response: body.credential as RegistrationResponseJSON,
      expectedChallenge: pending.challenge,
      expectedOrigin: rp.origin,
      expectedRPID: rp.id,
      requireUserVerification: true,
    });
  } catch {
    return clearChallengeCookie(failure(400, copy.invalidRegistration), "register");
  }
  if (!verified.verified) {
    return clearChallengeCookie(failure(400, copy.invalidRegistration), "register");
  }

  const { credential, aaguid, credentialBackedUp, credentialDeviceType } = verified.registrationInfo;
  const passkey: NewCredential = {
    id: credential.id,
    publicKey: credential.publicKey,
    counter: credential.counter,
    transports: credential.transports ?? [],
    aaguid,
    backedUp: credentialBackedUp,
    deviceType: credentialDeviceType,
    nickname: pending.nickname,
  };
  try {
    if (isSignup) {
      await createAccount({
        id: pending.user_id,
        displayName: pending.display_name!,
        webauthnUserId: pending.webauthn_user_id!,
      }, passkey);
    } else {
      await addCredential(pending.user_id, passkey);
    }
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
    return clearChallengeCookie(failure(409, copy.duplicatePasskey), "register");
  }
  const response = json({ verified: true });
  if (isSignup) await issueSession(request, response, pending.user_id);
  return clearChallengeCookie(response, "register");
}
