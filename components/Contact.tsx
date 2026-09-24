import { contacts, type ContactIcon } from "@/data/contact";
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

export default function Contact() {
  return (
    <section
      aria-labelledby="contact-title"
      className="flex flex-col items-center gap-9 px-4 pt-24 pb-10 sm:px-12 md:pt-[120px] md:pb-12"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="font-mono text-sm text-muted md:text-lg">
          <span className="text-green">$</span> ./contact.sh
        </p>
        <h2 id="contact-title" className="text-2xl font-bold text-fg-strong md:text-[32px]">
          연결할 채널을 선택하세요
        </h2>
      </div>

      <nav aria-label="연락처" className="w-full max-w-[840px]">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {contacts.map((c) => (
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
