import { journey, journeyTitle, type JourneyEntry } from "@/data/journey";
import ClampText from "./ClampText";
import RevealItem from "./RevealItem";

/** 끝에 붙은 "(2018 — 2020)" 같은 괄호는 줄이 바뀌어도 한 덩어리로 넘어가게 함 */
function HighlightText({ text }: { text: string }) {
  const match = text.match(/^(.*?)\s*(\([^()]*\))$/);
  if (!match) return <span className="text-soft">{text}</span>;
  return (
    <span className="text-soft">
      {match[1]} <span className="whitespace-nowrap">{match[2]}</span>
    </span>
  );
}

/** 폰에서 태그 대신 쓰는 한 줄 텍스트. 예: "stack Java · SQL · Spring Boot" */
function TagLine({ label, tags }: { label: string; tags: string[] }) {
  return (
    <p className="font-mono text-xs leading-[1.7] text-body sm:hidden">
      <span className="text-green">{label}</span> {tags.join(" · ")}
    </p>
  );
}

function Card({ entry }: { entry: JourneyEntry }) {
  const current = entry.current ?? false;

  return (
    <article
      className={`reveal-card flex flex-col gap-3.5 rounded-xl break-keep border px-5 py-[22px] sm:px-[30px] sm:py-7 ${
        current ? "card-current border-amber/45 bg-[#120f0a]" : "border-line bg-panel"
      }`}
    >
      <div className="flex items-center justify-between gap-3 font-mono text-[13px]">
        <span
          className={`rounded-md border px-2.5 py-1 ${
            current
              ? "border-amber/40 bg-amber/12 text-amber"
              : "border-green/25 bg-green/10 text-green"
          }`}
        >
          {entry.kind}
        </span>
        {entry.period && (
          <span className={`text-right ${current ? "text-amber" : "text-muted"}`}>{entry.period}</span>
        )}
      </div>

      <h3
        className={`text-xl font-bold sm:text-[23px] ${current ? "text-[#ffd6a3]" : "text-fg-strong"}`}
      >
        {entry.title}
      </h3>

      {entry.logs && (
        <div className="rounded-lg border border-[#1a241e] bg-panel-deep px-4 py-3 font-mono text-[13px] leading-[1.7]">
          {entry.logs.map((log, i) => (
            <div key={i}>
              <span className="text-muted">{log.time}</span>{" "}
              <span
                className={`font-bold ${
                  log.level === "ALERT" ? "text-amber" : log.level === "INFO" ? "text-fg" : "text-green"
                }`}
              >
                {log.level}
              </span>{" "}
              <span className="text-soft">{log.message}</span>
            </div>
          ))}
        </div>
      )}

      <ClampText
        text={entry.description}
        className={`text-[15px] leading-[1.75] ${current ? "text-[#c9bba8]" : "text-body"}`}
      />

      {entry.highlights && (
        <ul className="flex flex-col gap-2 rounded-lg border border-[#1a241e] bg-panel-deep px-4 py-3.5 font-mono text-[13px] leading-normal">
          {entry.highlights.map((item) => (
            <li key={item}>
              <span className="text-green" aria-hidden="true">
                ✓
              </span>{" "}
              <HighlightText text={item} />
            </li>
          ))}
        </ul>
      )}

      {entry.stack && <TagLine label="stack" tags={entry.stack} />}
      {entry.stack && (
        <ul aria-label="사용 스택" className="hidden flex-wrap gap-2 font-mono text-xs sm:flex">
          {entry.stack.map((tag) => (
            <li key={tag} className="rounded-md border border-line-strong px-2.5 py-[5px] text-soft">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {entry.certs && (
        <div className="rounded-lg border border-[#1a241e] bg-panel-deep px-4 py-3 font-mono text-[13px] leading-[1.8]">
          <p className="text-muted">
            <span className="text-green">$</span> ls -tr ~/certs
          </p>
          <ul aria-label="자격증">
            {entry.certs.map((cert) => (
              <li key={cert.name} className="flex justify-between gap-4">
                <span className="text-soft">{cert.name}</span>
                <span className="shrink-0 text-muted">{cert.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {entry.skills && <TagLine label="focus" tags={entry.skills} />}
      {entry.skills && (
        <ul aria-label="학습 중인 기술" className="hidden flex-wrap gap-2 font-mono text-[13px] sm:flex">
          {entry.skills.map((tag) => (
            <li key={tag} className="rounded-md border border-green/30 bg-green/7 px-3 py-1.5 text-green">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {entry.command && (
        <div className="font-mono text-[13px] text-amber">
          $ {entry.command}
          <span className="cursor cursor-amber ml-1.5" aria-hidden="true" />
        </div>
      )}
    </article>
  );
}

export default function Timeline() {
  return (
    <section
      id="timeline"
      aria-labelledby="journey-title"
      className="flex scroll-mt-4 flex-col gap-12 px-4 pt-24 pb-10 sm:px-12 md:items-center md:gap-[72px] md:pt-[120px] md:pb-20"
    >
      <header className="flex flex-col gap-3 md:items-center md:gap-4 md:text-center">
        <p className="font-mono text-sm text-muted md:text-lg">
          <span className="text-green">$</span> cat ~/journey.log
        </p>
        <h2
          id="journey-title"
          className="max-w-[20ch] text-[clamp(1.75rem,6vw,2.625rem)] leading-[1.3] font-black tracking-[-0.02em] break-keep text-balance text-fg-strong"
        >
          {journeyTitle}
        </h2>
      </header>

      <div className="relative w-full max-w-[1200px]">
        {/* 1120px 미만: 왼쪽 세로선 한 줄 배치. 화면 끝→동그라미와 동그라미→카드 간격을
            섹션 좌우 여백(폰 16px, 640px 이상 48px)과 같게 맞춤. 동그라미 12px, 중심 6px.
            1120px 이상: 가운데 세로선 기준 좌우 번갈아 배치 */}
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[5px] w-0.5 bg-rail min-[1120px]:left-1/2 min-[1120px]:-translate-x-1/2"
        />

        <ol className="flex flex-col gap-5 md:gap-8">
          {journey.map((entry, i) => {
            const onRight = i % 2 === 1;
            return (
              <RevealItem
                key={entry.kind + i}
                className="relative pl-7 sm:pl-[60px] min-[1120px]:grid min-[1120px]:grid-cols-[minmax(0,1fr)_96px_minmax(0,1fr)] min-[1120px]:items-start min-[1120px]:pl-0!"
              >
                <div
                  className="absolute top-7 left-0 min-[1120px]:static min-[1120px]:col-start-2 min-[1120px]:row-start-1 min-[1120px]:flex min-[1120px]:justify-center min-[1120px]:pt-[34px]"
                >
                  <span
                    aria-hidden="true"
                    className={`timeline-dot block size-3 rounded-full min-[1120px]:size-3.5 ${
                      entry.current ? "timeline-dot-current" : ""
                    }`}
                  />
                </div>
                <div className={`min-[1120px]:row-start-1 ${onRight ? "min-[1120px]:col-start-3" : "min-[1120px]:col-start-1"}`}>
                  <Card entry={entry} />
                </div>
              </RevealItem>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
