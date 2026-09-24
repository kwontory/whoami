import { journey, journeyTitle, type JourneyEntry } from "@/data/journey";
import RevealItem from "./RevealItem";

function Card({ entry }: { entry: JourneyEntry }) {
  const current = entry.current ?? false;

  return (
    <article
      className={`reveal-card flex flex-col gap-3.5 rounded-xl border px-5 py-[22px] sm:px-[30px] sm:py-7 ${
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
        <span className={`text-right ${current ? "text-amber" : "text-muted"}`}>{entry.period}</span>
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
              <span className={`font-bold ${log.level === "ALERT" ? "text-amber" : "text-green"}`}>
                {log.level}
              </span>{" "}
              <span className="text-soft">{log.message}</span>
            </div>
          ))}
        </div>
      )}

      <p className={`text-[15px] leading-[1.75] ${current ? "text-[#c9bba8]" : "text-body"}`}>
        {entry.description}
      </p>

      {entry.highlights && (
        <ul className="flex flex-col gap-2 rounded-lg border border-[#1a241e] bg-panel-deep px-4 py-3.5 font-mono text-[13px] leading-normal">
          {entry.highlights.map((item) => (
            <li key={item}>
              <span className="text-green" aria-hidden="true">
                ✓
              </span>{" "}
              <span className="text-soft">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {entry.stack && (
        <ul aria-label="사용 스택" className="flex flex-wrap gap-2 font-mono text-xs">
          {entry.stack.map((tag) => (
            <li key={tag} className="rounded-md border border-line-strong px-2.5 py-[5px] text-soft">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {entry.skills && (
        <ul aria-label="학습 중인 기술" className="flex flex-wrap gap-2 font-mono text-[13px]">
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
        {/* 세로선: 모바일은 왼쪽, 데스크톱은 가운데 */}
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-3 w-0.5 bg-rail md:left-1/2 md:-translate-x-1/2"
        />

        <ol className="flex flex-col gap-5 md:gap-8">
          {journey.map((entry, i) => {
            const onRight = i % 2 === 1;
            return (
              <RevealItem
                key={entry.kind + i}
                className="relative pl-9 md:grid md:grid-cols-[minmax(0,1fr)_96px_minmax(0,1fr)] md:items-start md:pl-0"
              >
                <div
                  className="absolute top-7 left-[7px] md:static md:col-start-2 md:row-start-1 md:flex md:justify-center md:pt-[34px]"
                >
                  <span
                    aria-hidden="true"
                    className={`timeline-dot block size-3 rounded-full md:size-3.5 ${
                      entry.current ? "timeline-dot-current" : ""
                    }`}
                  />
                </div>
                <div className={`md:row-start-1 ${onRight ? "md:col-start-3" : "md:col-start-1"}`}>
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
