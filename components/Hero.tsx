import { profile } from "@/data/profile";

function Prompt() {
  return (
    <>
      <span className="text-green">guest@portfolio</span>
      <span className="text-muted">:</span>
      <span className="text-amber">~</span>
      <span className="text-muted">$ </span>
    </>
  );
}

export default function Hero() {
  return (
    <section
      aria-label="소개"
      className="relative flex min-h-svh flex-col items-center justify-center px-4 py-24 sm:px-12"
    >
      <div className="terminal relative w-full max-w-[780px] overflow-hidden rounded-xl border border-[#1f2b24] bg-[rgba(10,14,12,0.92)] sm:rounded-[14px]">
        {/* 타이틀 바 */}
        <div className="flex h-[38px] items-center gap-[7px] border-b border-[#1a241e] bg-bar px-3.5 sm:h-11 sm:gap-2 sm:px-[18px]">
          <span aria-hidden="true" className="size-[11px] rounded-full bg-[#ff5f57] sm:size-3" />
          <span aria-hidden="true" className="size-[11px] rounded-full bg-[#febc2e] sm:size-3" />
          <span aria-hidden="true" className="size-[11px] rounded-full bg-[#28c840] sm:size-3" />
          <span className="mr-[46px] grow text-center font-mono text-[11px] text-muted sm:mr-[52px] sm:text-[13px]">
            guest@portfolio: ~<span className="hidden sm:inline"> — zsh — 80×24</span>
          </span>
        </div>

        {/* 본문 */}
        <div className="relative flex min-h-[300px] flex-col gap-3.5 px-5 pt-7 pb-8 font-mono text-[15px] leading-normal sm:min-h-[340px] sm:gap-[18px] sm:px-11 sm:pt-10 sm:pb-12 sm:text-xl">
          <div>
            <Prompt />
            <span className="type text-fg">whoami</span>
          </div>

          <h1 className="name-glow mt-1 font-mono text-[clamp(2.25rem,7vw,4.25rem)] leading-[1.12] font-extrabold tracking-[-0.02em] break-words text-green sm:mt-1.5">
            {profile.name}
          </h1>

          <p className="hero-sub text-sm leading-[1.7] text-soft sm:text-xl sm:leading-normal">
            {profile.from}
            <br className="sm:hidden" />
            <span className="pr-1.5 text-amber sm:px-1.5">
              →
            </span>
            <span className="font-bold text-white">{profile.to}</span>
          </p>

          <div className="hero-prompt mt-2.5 sm:mt-3.5">
            <Prompt />
            <span className="cursor" aria-hidden="true" />
          </div>

          <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0" />
          <div aria-hidden="true" className="scanband pointer-events-none absolute inset-x-0" />
        </div>
      </div>

      <a
        href="#timeline"
        aria-label="타임라인 섹션으로 스크롤"
        className="hero-scroll absolute bottom-8 left-1/2 flex min-h-16 w-20 -translate-x-1/2 flex-col items-center gap-1.5 pl-[0.3em] font-mono text-[11px] tracking-[0.3em] text-muted no-underline transition-colors hover:text-green sm:bottom-10 sm:text-xs"
      >
        <span>SCROLL</span>
        <svg
          className="bob"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#5ef08f"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
