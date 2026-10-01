import { useState, type FormEvent } from "react";
import { privateCopy as copy } from "@/data/private";
import type { Passkey } from "./api";
import { buttonClass, formatDate, inputClass, panelClass } from "./styles";

type Props = {
  passkeys: Passkey[];
  busy: boolean;
  onAdd: (nickname: string) => Promise<boolean>;
  onRemove: (id: string) => void;
};

export default function PasskeyList({ passkeys, busy, onAdd, onRemove }: Props) {
  const [nickname, setNickname] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await onAdd(nickname)) setNickname("");
  }

  return (
    <section className={panelClass} aria-labelledby="passkeys-heading">
      <h2 id="passkeys-heading" className="text-lg font-bold">{copy.passkeys}</h2>
      {passkeys.length === 0 ? <p className="mt-4 text-sm text-body">{copy.noPasskeys}</p> : (
        <ul className="mt-5 divide-y divide-line">
          {passkeys.map((key) => (
            <li key={key.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-fg">{key.nickname}</p>
                <p className="mt-1 font-mono text-xs text-muted">{formatDate(key.created_at)}</p>
              </div>
              <button type="button" className={buttonClass} disabled={busy || passkeys.length <= 1}
                onClick={() => onRemove(key.id)}>{copy.deletePasskey}</button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-5 text-sm leading-6 break-keep text-body">{copy.lastPasskey}</p>
      <form className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={(event) => void submit(event)}>
        <label className="block flex-1 text-sm text-body">{copy.passkeyName}
          <input className={inputClass} value={nickname} onChange={(event) => setNickname(event.target.value)} maxLength={60} required />
        </label>
        <button className={buttonClass} disabled={busy} type="submit">{copy.addPasskey}</button>
      </form>
    </section>
  );
}
