import Link from "next/link";
import { privateCopy as copy } from "@/data/private";

export default function PrivateGate() {
  return (
    <section aria-labelledby="private-gate-title" className="px-4 pt-28 pb-10 sm:px-12 md:pt-[120px]">
      <div className="mx-auto max-w-[760px]">
        <div className="flex items-center gap-4 font-mono text-xs text-muted">
          <span className="h-px flex-1 bg-line-strong" />
          <span>{copy.boundary}</span>
          <span className="h-px flex-1 bg-line-strong" />
        </div>
        <div className="mt-9 rounded-xl border border-line-strong bg-panel p-6 sm:p-8">
          <p className="font-mono text-sm text-muted"><span className="text-fg">$</span> {copy.command}</p>
          <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-[480px]">
              <p className="font-mono text-xs text-muted">{copy.lockedLabel}</p>
              <h2 id="private-gate-title" className="mt-2 text-2xl font-bold text-fg-strong">{copy.gateTitle}</h2>
              <p className="mt-3 text-sm leading-7 break-keep text-body">{copy.gateBody}</p>
            </div>
            <Link href="/private" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-fg px-5 text-sm font-medium text-fg no-underline transition-colors hover:bg-panel-deep">
              {copy.gateLink} <span aria-hidden="true" className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
