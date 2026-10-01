import type { WebAuthnCredential } from "@simplewebauthn/server";
import { db } from "@/lib/db";

// 패스키 행. 공개키만 저장하고 개인키는 서버로 오지 않음

export type NewCredential = {
  id: string;
  publicKey: Uint8Array;
  counter: number;
  transports: string[];
  aaguid: string;
  backedUp: boolean;
  deviceType: string;
  nickname: string;
};

export type StoredCredential = WebAuthnCredential & { userId: string };

export type Passkey = {
  id: string;
  nickname: string;
  created_at: string;
  last_used_at: string | null;
};

export async function webauthnUserId(userId: string) {
  const rows = await db().query("SELECT webauthn_user_id FROM users WHERE id = $1", [userId]);
  return String(rows[0].webauthn_user_id);
}

// 같은 인증기를 두 번 등록하지 않도록 브라우저에 넘길 기존 패스키 목록
export async function credentialDescriptors(userId: string) {
  const rows = await db().query("SELECT id, transports FROM credentials WHERE user_id = $1", [userId]);
  return rows.map((row) => ({ id: String(row.id), transports: row.transports as string[] }));
}

function credentialValues(credential: NewCredential) {
  return [credential.id, Buffer.from(credential.publicKey).toString("hex"), credential.counter,
    credential.transports, credential.aaguid, credential.backedUp, credential.deviceType,
    credential.nickname];
}

// 첫 계정과 패스키를 한 문장으로 넣어 어느 한쪽만 남지 않게 함
export async function createAccount(
  user: { id: string; displayName: string; webauthnUserId: string },
  credential: NewCredential,
) {
  await db().query(
    `WITH new_user AS (
       INSERT INTO users (id, display_name, webauthn_user_id)
       VALUES ($9, $10, $11) RETURNING id
     )
     INSERT INTO credentials
       (id, user_id, public_key, counter, transports, aaguid, backed_up, device_type, nickname)
     SELECT $1, id, decode($2, 'hex'), $3, $4, $5, $6, $7, $8 FROM new_user`,
    [...credentialValues(credential), user.id, user.displayName, user.webauthnUserId],
  );
}

export async function addCredential(userId: string, credential: NewCredential) {
  await db().query(
    `INSERT INTO credentials
       (id, user_id, public_key, counter, transports, aaguid, backed_up, device_type, nickname)
     VALUES ($1, $9, decode($2, 'hex'), $3, $4, $5, $6, $7, $8)`,
    [...credentialValues(credential), userId],
  );
}

export async function findCredential(id: string): Promise<StoredCredential | null> {
  const rows = await db().query(
    `SELECT id, user_id, encode(public_key, 'hex') AS public_key_hex, counter, transports
     FROM credentials WHERE id = $1`,
    [id],
  );
  const row = rows[0];
  if (!row) return null;
  return {
    id: String(row.id),
    userId: String(row.user_id),
    publicKey: new Uint8Array(Buffer.from(String(row.public_key_hex), "hex")),
    counter: Number(row.counter),
    transports: row.transports as string[],
  };
}

// 카운터를 이전 값과 비교해 갱신함. 동시에 로그인해도 새 카운터를 덮어쓰거나
// 지운 패스키를 되살리지 못함. 그사이 행이 바뀌었으면 false
export async function recordCredentialUse(credential: StoredCredential, newCounter: number) {
  const rows = await db().query(
    `UPDATE credentials SET counter = $1, last_used_at = now()
     WHERE id = $2 AND counter = $3 RETURNING id`,
    [newCounter, credential.id, credential.counter],
  );
  return rows.length === 1;
}

export async function listPasskeys(userId: string) {
  const rows = await db().query(
    `SELECT id, nickname, created_at, last_used_at
     FROM credentials WHERE user_id = $1 ORDER BY created_at ASC`,
    [userId],
  );
  return rows as Passkey[];
}

export type DeleteResult = "deleted" | "last" | "missing" | "conflict";

// 이 계정의 패스키를 정해진 순서로 모두 잠근 뒤 개수를 셈.
// 두 삭제 요청이 동시에 와도 마지막 패스키는 지워지지 않음
export async function deletePasskey(userId: string, id: string): Promise<DeleteResult> {
  try {
    const deleted = await db().query(
      `WITH locked AS MATERIALIZED (
         SELECT id FROM credentials WHERE user_id = $1 ORDER BY id FOR UPDATE
       )
       DELETE FROM credentials
       WHERE id = $2 AND user_id = $1 AND (SELECT count(*) FROM locked) > 1
       RETURNING id`,
      [userId, id],
    );
    if (deleted.length === 1) return "deleted";
  } catch {
    return "conflict";
  }
  const own = await db().query("SELECT id FROM credentials WHERE id = $1 AND user_id = $2", [id, userId]);
  return own.length ? "last" : "missing";
}
