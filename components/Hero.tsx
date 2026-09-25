import { nameArt } from "@/data/nameArt";
import { profile } from "@/data/profile";

// 이름 ASCII 아트를 글자가 아닌 SVG 도형으로 그림. 휴대폰에서 사용자가 지정한 글꼴이나
// 대체 글꼴이 쓰이면 글자 폭이 달라져 아트가 깨지기 때문.
// 한 칸 = JetBrains Mono 한 글자 (폭 600, 줄 높이 1150, 기준선 935 / 1000 단위)
const CELL_W = 600;
const CELL_H = 1150;
const BASELINE = 935;
// JetBrains Mono Bold(700)의 '#'과 '.' 외곽선 (기준선이 y=0)
const HASH =
  "M166 0L75 0L108-182L26-182L26-268L123-268L157-462L58-462L58-548L172-548L204-730L295-730L262-548L402-548L434-730L525-730L492-548L574-548L574-462L477-462L443-268L542-268L542-182L428-182L396 0L305 0L338-182L198-182L166 0M247-462L213-268L353-268L387-462Z";
const DOT =
  "M300 10Q257 10 232-15Q206-40 206-83Q206-126 232-151Q257-177 300-177Q343-177 369-151Q394-126 394-83Q394-40 369-15Q343 10 300 10Z";

const artCols = Math.max(...nameArt.map((line) => line.length));
const artW = artCols * CELL_W;
const artH = nameArt.length * CELL_H;

/** 각 줄을 '#' 묶음과 '.' 묶음으로 나눠, 묶음마다 해당 글자 패턴으로 채운 사각형 하나씩 */
const artRuns = nameArt.flatMap((line, row) =>
  [...line.matchAll(/#+|[^#]+/g)].map((m) => ({
    ink: m[0][0] === "#",
    x: m.index * CELL_W,
    y: row * CELL_H,
    w: m[0].length * CELL_W,
  })),
);

function NameArt() {
  const cell = (id: string, d: string, fill: string) => (
    <pattern id={id} width={CELL_W} height={CELL_H} patternUnits="userSpaceOnUse">
      <path d={d} fill={fill} transform={`translate(0 ${BASELINE})`} />
    </pattern>
  );
  const runs = (ink: boolean) =>
    artRuns
      .filter((r) => r.ink === ink)
      .map((r) => <rect key={`${r.x},${r.y}`} x={r.x} y={r.y} width={r.w} height={CELL_H} />);

  return (
    <svg
      aria-hidden="true"
      className="name-art"
      viewBox={`0 0 ${artW} ${artH}`}
      overflow="visible"
    >
      <defs>
        {cell("name-ink", HASH, "#5ef08f")}
        {cell("name-blank", DOT, "rgba(94, 240, 143, 0.16)")}
        {/* 글자 크기에 비례하는 초록 빛번짐 */}
        <filter id="name-glow" filterUnits="userSpaceOnUse" x={-3000} y={-3000} width={artW + 6000} height={artH + 6000}>
          <feGaussianBlur in="SourceAlpha" stdDeviation="300" result="near" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="850" result="far" />
          <feFlood floodColor="#5ef08f" floodOpacity="0.55" />
          <feComposite in2="near" operator="in" result="nearGlow" />
          <feFlood floodColor="#5ef08f" floodOpacity="0.25" />
          <feComposite in2="far" operator="in" result="farGlow" />
          <feMerge>
            <feMergeNode in="farGlow" />
            <feMergeNode in="nearGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g fill="url(#name-blank)">{runs(false)}</g>
      <g fill="url(#name-ink)" filter="url(#name-glow)">{runs(true)}</g>
    </svg>
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
      className="hero flex min-h-svh flex-col items-center gap-6 px-4 py-8 sm:px-12 sm:py-10 short:gap-4 short:py-4"
    >
      {/* 아래 SCROLL 버튼과 같은 높이를 위에도 비워 터미널이 화면 가운데 오게 함 */}
      <div aria-hidden="true" className="h-16 shrink-0" />

      {/* 640px 이상은 16:9 가로형(크기는 globals.css의 .terminal). 내용이 더 길면 비율보다 늘어남 */}
      <div className="terminal relative my-auto flex w-full max-w-[960px] flex-col rounded-xl border border-[#1f2b24] bg-[rgba(10,14,12,0.92)] sm:rounded-[14px]">
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
        <div className="relative flex grow flex-col justify-center gap-2.5 rounded-b-[11px] px-5 py-6 font-mono text-[15px] leading-normal sm:gap-4 sm:rounded-b-[13px] sm:px-11 sm:py-10 sm:text-xl short:gap-3 short:py-6">
          <div>
            <Prompt />
            <span className="type text-fg">whoami</span>
          </div>

          <h1 className="name-glow my-1 sm:my-2">
            <span className="sr-only">{profile.name}</span>
            <NameArt />
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

          {/* 주사선 효과만 잘라냄. 본문에 overflow-hidden을 두면 내용이 길 때 위아래가 잘림 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-b-[11px] sm:rounded-b-[13px]"
          >
            <div className="scanlines absolute inset-0" />
            <div className="scanband absolute inset-x-0" />
          </div>
        </div>
      </div>

      <a
        href="#about"
        aria-label="다음 섹션으로 스크롤"
        className="hero-scroll flex min-h-16 w-20 shrink-0 flex-col items-center justify-end gap-1.5 pl-[0.3em] font-mono text-[11px] tracking-[0.3em] text-muted no-underline transition-colors hover:text-green sm:text-xs"
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
