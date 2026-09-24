import { Fragment } from "react";
import { contacts, contactTitle, outroCommand, type ContactIcon } from "@/data/contact";
import { profile } from "@/data/profile";

const iconPaths: Record<ContactIcon, React.ReactNode> = {
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  github: (
    <>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="8" r="2.2" />
      <path d="M6 8.2v7.6" />
      <path d="M18 10.2c0 4-6 3-11 6.2" />
    </>
  ),
  blog: (
    <>
      <path d="M4 20h4L19 9l-4-4L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
    </>
  ),
};

// hidden 버튼은 제외
const visibleContacts = contacts.filter((c) => !c.hidden);

export default function Contact() {
  return (
    <section
      aria-labelledby="contact-title"
      className="flex flex-col items-center gap-9 px-4 pt-24 pb-10 sm:px-12 md:pt-[120px] md:pb-12"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="font-mono text-sm text-muted md:text-lg">
          <span className="text-green">$</span> {outroCommand}
        </p>
        {/* 문장마다 inline-block으로 묶어 문장 사이에서만 줄바꿈.
            아주 좁은 화면에서 한 문장이 넘치면 그 안에서는 단어 단위로 줄바꿈 */}
        <h2
          id="contact-title"
          className="text-[clamp(1.375rem,5.5vw,2rem)] leading-[1.4] font-bold break-keep text-fg-strong"
        >
          {contactTitle.map((sentence, i) => (
            <Fragment key={sentence}>
              {i > 0 && " "}
              <span className="inline-block">{sentence}</span>
            </Fragment>
          ))}
        </h2>
      </div>

      {/* 보이는 버튼이 하나도 없으면 버튼 영역을 그리지 않음 */}
      {visibleContacts.length > 0 && (
        <>
          {/* 버튼 수만큼 같은 너비의 칸을 만들고, 전체 너비도 버튼당 280px로 맞춤 */}
          <nav aria-label="연락처" className="w-full" style={{ maxWidth: visibleContacts.length * 280 }}>
            <ul className="grid grid-cols-1 gap-3 sm:auto-cols-fr sm:grid-flow-col sm:gap-4">
              {visibleContacts.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    aria-label={c.ariaLabel}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="contact-btn flex min-h-[72px] items-center gap-4 rounded-xl border border-line-strong bg-panel px-[22px] py-[18px] text-fg no-underline sm:min-h-[88px]"
                  >
                    <svg
                      className="shrink-0"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#5ef08f"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {iconPaths[c.icon]}
                    </svg>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-base font-bold">{c.label}</span>
                      <span className="truncate font-mono text-xs text-muted">{c.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}

      <footer className="flex flex-col items-center gap-1.5 pt-16 font-mono text-xs text-faint">
        <span>
          <span className="text-green">exit</span> 0
        </span>
        <span>
          © {profile.since} {profile.name}
        </span>
      </footer>
    </section>
  );
}
