"use client";

import { useCallback, useEffect, useState } from "react";
import {
  browserSupportsWebAuthn,
  startAuthentication,
  startRegistration,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/browser";
import { privateCopy as copy } from "@/data/private";
import { api, ApiError, errorMessage, type Note, type Passkey, type User } from "./api";
import AuthPanels, { type SignupInput } from "./AuthPanels";
import NoteList from "./NoteList";
import PasskeyList from "./PasskeyList";
import { buttonClass } from "./styles";

// 계정 상태와 WebAuthn 흐름을 맡음. 각 구역 컴포넌트는 화면 표시와 입력만 담당
export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const clearAccount = useCallback(() => {
    setUser(null);
    setPasskeys([]);
    setNotes([]);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const me = await api<{ user: User }>("/api/auth/me");
      const [keys, cards] = await Promise.all([
        api<{ passkeys: Passkey[] }>("/api/passkeys"),
        api<{ notes: Note[] }>("/api/private/notes"),
      ]);
      setUser(me.user);
      setPasskeys(keys.passkeys);
      setNotes(cards.notes);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) clearAccount();
      else setMessage(errorMessage(error, copy.requestFailed));
    } finally {
      setLoading(false);
    }
  }, [clearAccount]);

  useEffect(() => { void refresh(); }, [refresh]);

  // 처리 중 표시와 안내 문구를 한곳에서 처리. 성공하면 true
  async function run(task: () => Promise<string | void>, canceled: string = copy.requestFailed) {
    setBusy(true);
    setMessage("");
    try {
      const done = await task();
      if (done) setMessage(done);
      return true;
    } catch (error) {
      setMessage(errorMessage(error, canceled));
      return false;
    } finally {
      setBusy(false);
    }
  }

  // 가입(로그아웃 상태)과 패스키 추가(로그인 상태)는 같은 서버 흐름을 씀
  async function registerPasskey(input: Partial<SignupInput> & { nickname: string }) {
    if (!browserSupportsWebAuthn()) { setMessage(copy.unsupported); return false; }
    return run(async () => {
      let issued = false;
      try {
        const options = await api<PublicKeyCredentialCreationOptionsJSON>("/api/auth/register/options", "POST", input);
        issued = true;
        const credential = await startRegistration({ optionsJSON: options });
        await api("/api/auth/register/verify", "POST", { credential });
        issued = false;
      } finally {
        if (issued) {
          try { await api("/api/auth/register/cancel", "POST"); } catch { /* 5-minute expiry remains */ }
        }
      }
      await refresh();
      return copy.saved;
    }, copy.registrationCanceled);
  }

  function login() {
    if (!browserSupportsWebAuthn()) { setMessage(copy.unsupported); return; }
    void run(async () => {
      const options = await api<PublicKeyCredentialRequestOptionsJSON>("/api/auth/login/options", "POST");
      const credential = await startAuthentication({ optionsJSON: options });
      await api("/api/auth/login/verify", "POST", { credential });
      await refresh();
    }, copy.loginCanceled);
  }

  function logout() {
    void run(async () => {
      await api("/api/auth/logout", "POST");
      clearAccount();
    });
  }

  function removePasskey(id: string) {
    if (!window.confirm(copy.deleteConfirm)) return;
    void run(async () => {
      await api(`/api/passkeys/${encodeURIComponent(id)}`, "DELETE");
      await refresh();
      return copy.removed;
    });
  }

  function addNote(title: string, body: string) {
    return run(async () => {
      await api("/api/private/notes", "POST", { title, body });
      await refresh();
      return copy.saved;
    });
  }

  if (loading) return <p className="mt-10 text-sm text-muted" role="status">{copy.loading}</p>;

  return (
    <div className="mt-10">
      {message && <p role="status" className="rounded-lg border border-line-strong bg-panel-deep px-4 py-3 text-sm break-keep text-fg">{message}</p>}
      {busy && <p role="status" className="mt-3 text-xs text-muted">{copy.working}</p>}

      {!user ? (
        <AuthPanels busy={busy} onLogin={login} onSignup={registerPasskey} />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <p className="text-sm text-body"><span className="font-bold text-fg">{user.display_name}</span></p>
            <button type="button" className={buttonClass} disabled={busy} onClick={logout}>{copy.logout}</button>
          </div>
          <PasskeyList passkeys={passkeys} busy={busy} onAdd={(nickname) => registerPasskey({ nickname })} onRemove={removePasskey} />
          <NoteList notes={notes} busy={busy} onAdd={addNote} />
        </>
      )}
    </div>
  );
}
