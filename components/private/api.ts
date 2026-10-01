import { privateCopy as copy } from "@/data/private";

export type User = { id: string; display_name: string };
export type Passkey = { id: string; nickname: string; created_at: string; last_used_at: string | null };
export type Note = { id: string; title: string; body: string; created_at: string };

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export async function api<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({ error: copy.requestFailed })) as T & { error?: string };
  if (!response.ok) throw new ApiError(payload.error ?? copy.requestFailed, response.status);
  return payload;
}

// 브라우저의 WebAuthn 오류는 영어 문구라 자주 나오는 것은 한국어 안내로 바꿈
export function errorMessage(error: unknown, canceled: string) {
  if (!(error instanceof Error)) return copy.requestFailed;
  if (error.name === "NotAllowedError") return canceled;
  if (error.name === "InvalidStateError") return copy.alreadyRegistered;
  return error.message;
}
