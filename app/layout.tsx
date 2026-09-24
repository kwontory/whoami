import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { profile } from "@/data/profile";
// Pretendard: 페이지에 쓰인 글자가 든 조각만 내려받는 dynamic subset 버전
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-jetbrains-mono",
  display: "swap",
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
    <html lang="ko" className={jetbrainsMono.variable}>
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
