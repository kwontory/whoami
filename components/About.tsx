import { about, aboutKey } from "@/data/about";

/** 핵심 문장에서 highlight 부분만 초록색으로 */
function KeySentence() {
  const { text, highlight } = aboutKey;
  const at = highlight ? text.indexOf(highlight) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="text-green">{highlight}</span>
      {text.slice(at + highlight.length)}
    </>
  );
}

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="flex scroll-mt-4 flex-col items-center px-4 pt-24 sm:px-12 md:pt-[120px]"
    >
      {/* 핵심 문장을 크게 먼저, 구분선 아래에 소개 글 */}
      <div className="flex w-full max-w-[680px] flex-col gap-5 md:gap-7">
        <h2 id="about-title" className="font-mono text-sm font-normal text-muted md:text-lg">
          <span className="text-green">$</span> cat ~/about.txt
        </h2>
        <p className="text-[clamp(1.5rem,5vw,2.125rem)] leading-[1.45] font-extrabold tracking-[-0.02em] break-keep text-balance text-fg-strong">
          <KeySentence />
        </p>
        <div className="flex flex-col gap-3.5 border-t border-[#1a241e] pt-5 text-[15px] leading-[1.9] break-keep text-soft md:pt-6 md:text-base">
          {about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
