import { about } from "@/data/about";

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="flex scroll-mt-4 flex-col items-center px-4 pt-24 sm:px-12 md:pt-[120px]"
    >
      {/* 여러 문단이라 가운데 정렬 대신, 가운데 놓인 좁은 칸 안에서 왼쪽 정렬 */}
      <div className="flex w-full max-w-[640px] flex-col gap-5 md:gap-6">
        <h2 id="about-title" className="font-mono text-sm font-normal text-muted md:text-lg">
          <span className="text-green">$</span> cat ~/about.txt
        </h2>
        <div className="flex flex-col gap-4 text-base leading-[1.9] break-keep text-soft md:text-[17px]">
          {about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
