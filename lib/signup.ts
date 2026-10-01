import { createHash, timingSafeEqual } from "node:crypto";

export function signupEnabled() {
  return Boolean(process.env.SIGNUP_CODE);
}

// 양쪽을 해시해 길이를 맞춘 뒤 일정한 시간에 비교함
export function matchesSignupCode(value: unknown) {
  const expected = process.env.SIGNUP_CODE;
  if (!expected || typeof value !== "string") return false;
  const actualHash = createHash("sha256").update(value).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(actualHash, expectedHash);
}
