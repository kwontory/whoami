// 연락처 버튼. icon은 components/Contact.tsx의 아이콘 이름과 맞춰야 합니다.

export type ContactIcon = "mail" | "github" | "blog";

export type ContactLink = {
  label: string;
  /** 버튼 아래 작게 표시되는 값 */
  value: string;
  href: string;
  /** 스크린리더용 설명 */
  ariaLabel: string;
  icon: ContactIcon;
  /** true면 새 탭으로 엽니다 */
  external?: boolean;
};

export const contacts: ContactLink[] = [
  {
    label: "Email",
    value: "[YOUR EMAIL]",
    href: "mailto:[YOUR EMAIL]",
    ariaLabel: "이메일 보내기: [YOUR EMAIL]",
    icon: "mail",
  },
  {
    label: "GitHub",
    value: "github.com/[USERNAME]",
    href: "https://github.com/[USERNAME]",
    ariaLabel: "GitHub 프로필 열기 (새 탭)",
    icon: "github",
    external: true,
  },
  {
    label: "Blog",
    value: "[BLOG URL]",
    href: "https://[BLOG URL]",
    ariaLabel: "블로그 열기 (새 탭)",
    icon: "blog",
    external: true,
  },
];
