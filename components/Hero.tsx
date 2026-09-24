import { nameArt } from "@/data/nameArt";
import { profile } from "@/data/profile";

const artCols = Math.max(...nameArt.map((line) => line.length));

/** 한 줄을 '#' 묶음과 '.' 묶음으로 나눠 각각 다른 색으로 칠함 */
function ArtLine({ line }: { line: string }) {
  return (
    <span className="block">
      {line.match(/#+|[^#]+/g)?.map((run, i) => (
        <span key={i} className={run[0] === "#" ? "name-ink" : "name-blank"}>
          {run}
        </span>
      ))}
    </span>
  );
}

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
      {/* 데스크톱은 16:9 가로형. 내용이 더 길면 비율보다 늘어남
          (overflow-hidden을 여기 두면 aspect-ratio 박스가 내용만큼 늘어나지 않으므로 안쪽에서 처리) */}
      <div className="terminal relative flex w-full max-w-[960px] flex-col sm:aspect-video rounded-xl border border-[#1f2b24] bg-[rgba(10,14,12,0.92)] sm:rounded-[14px]">
        {/* 타이틀 바 */}
        <div className="flex h-[38px] items-center gap-[7px] rounded-t-[11px] border-b border-[#1a241e] bg-bar px-3.5 sm:h-11 sm:gap-2 sm:rounded-t-[13px] sm:px-[18px]">
          <span aria-hidden="true" className="size-[11px] rounded-full bg-[#ff5f57] sm:size-3" />
          <span aria-hidden="true" className="size-[11px] rounded-full bg-[#febc2e] sm:size-3" />
          <span aria-hidden="true" className="size-[11px] rounded-full bg-[#28c840] sm:size-3" />
          <span className="mr-[46px] grow text-center font-mono text-[11px] text-muted sm:mr-[52px] sm:text-[13px]">
            guest@portfolio: ~<span className="hidden sm:inline"> — zsh — 120×32</span>
          </span>
        </div>

        {/* 본문: 위아래 여백을 같게 두고 내용을 세로 가운데 정렬 */}
        <div className="relative flex grow flex-col justify-center gap-2.5 overflow-hidden rounded-b-[11px] px-5 py-6 font-mono text-[15px] leading-normal sm:gap-4 sm:rounded-b-[13px] sm:px-11 sm:py-10 sm:text-xl">
          <div>
            <Prompt />
            <span className="type text-fg">whoami</span>
          </div>

          <h1 className="name-glow my-1 sm:my-2">
            <span className="sr-only">{profile.name}</span>
            <span
              aria-hidden="true"
              className="name-art"
              style={{ "--cols": artCols } as React.CSSProperties}
            >
              {nameArt.map((line, i) => (
                <ArtLine key={i} line={line} />
              ))}
            </span>
          </h1>

          {/* 화살표 양옆 간격은 gap 하나로 맞춤. 줄이 바뀌면 화살표가 다음 직함과 함께 넘어감 */}
          <p className="hero-sub flex flex-wrap items-baseline gap-x-3 text-[15px] leading-[1.7] break-keep text-soft sm:text-xl sm:leading-normal">
            <span>{profile.from}</span>
            <span className="inline-flex items-baseline gap-x-3 whitespace-nowrap">
              <span className="text-amber">→</span>
              <span className="font-bold text-white">{profile.to}</span>
            </span>
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
        href="#about"
        aria-label="다음 섹션으로 스크롤"
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
