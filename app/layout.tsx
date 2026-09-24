import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Noto_Sans_KR } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.from} → ${profile.to}`,
  description: "백엔드 개발자에서 인프라 엔지니어로, 커리어 전환 이야기",
};

export const viewport: Viewport = {
  themeColor: "#07090a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${jetbrainsMono.variable} ${notoSansKr.variable}`}>
      <body>
        {children}
        {/* JS가 꺼져 있으면 타임라인 카드를 바로 표시 */}
        <noscript>
          <style>{`.reveal-card{opacity:1;transform:none}.timeline-dot{background-color:#5ef08f}.timeline-dot-current{background-color:#ffb45c}`}</style>
        </noscript>
      </body>
    </html>
  );
}
