import { useState, type FormEvent } from "react";
import { privateCopy as copy } from "@/data/private";
import { buttonClass, inputClass, panelClass } from "./styles";

export type SignupInput = { displayName: string; signupCode: string; nickname: string };

type Props = {
  busy: boolean;
  onLogin: () => void;
  onSignup: (input: SignupInput) => Promise<boolean>;
};

export default function AuthPanels({ busy, onLogin, onSignup }: Props) {
  const [displayName, setDisplayName] = useState("");
  const [signupCode, setSignupCode] = useState("");
  const [nickname, setNickname] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await onSignup({ displayName, signupCode, nickname })) {
      setSignupCode("");
      setNickname("");
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className={panelClass} aria-labelledby="login-heading">
        <h2 id="login-heading" className="text-lg font-bold">{copy.signIn}</h2>
        <p className="mt-3 text-sm leading-6 text-body">{copy.registerHelp}</p>
        <button type="button" className={`${buttonClass} mt-6`} disabled={busy} onClick={onLogin}>{copy.signIn}</button>
      </section>
      <section className={panelClass} aria-labelledby="register-heading">
        <h2 id="register-heading" className="text-lg font-bold">{copy.createAccount}</h2>
        <form className="mt-5 space-y-4" onSubmit={(event) => void submit(event)}>
          <label className="block text-sm text-body">{copy.displayName}
            <input className={inputClass} value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={80} required />
          </label>
          <label className="block text-sm text-body">{copy.signupCode}
            <input className={inputClass} value={signupCode} onChange={(event) => setSignupCode(event.target.value)} autoComplete="off" required />
          </label>
          <label className="block text-sm text-body">{copy.passkeyName}
            <input className={inputClass} value={nickname} onChange={(event) => setNickname(event.target.value)} maxLength={60} required />
          </label>
          <button className={buttonClass} disabled={busy} type="submit">{copy.register}</button>
        </form>
      </section>
    </div>
  );
}
