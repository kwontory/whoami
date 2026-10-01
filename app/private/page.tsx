import type { Metadata } from "next";
import Link from "next/link";
import Dashboard from "@/components/private/Dashboard";
import { privateCopy as copy } from "@/data/private";

export const metadata: Metadata = {
  title: copy.pageTitle,
  robots: { index: false, follow: false },
};

export default function PrivatePage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-12 sm:py-20">
      <div className="mx-auto max-w-[860px]">
        <Link href="/" className="font-mono text-sm text-muted underline-offset-4 hover:underline">← {copy.home}</Link>
        <p className="mt-14 font-mono text-sm text-muted"><span className="text-fg">$</span> {copy.pageCommand}</p>
        <h1 className="mt-3 text-[clamp(1.75rem,5vw,2.5rem)] font-bold text-fg-strong">{copy.pageTitle}</h1>
        <p className="mt-3 text-sm leading-7 break-keep text-body">{copy.pageIntro}</p>
        <Dashboard />
      </div>
    </main>
  );
}
