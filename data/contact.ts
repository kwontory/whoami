// 마지막 섹션 프롬프트에 표시할 명령어 (`$ ` 뒤에 붙음)
export const outroCommand = "./goodbye.sh";

// 명령어 아래 제목. 배열 하나가 한 문장이고,
// 화면이 좁아지면 문장 사이에서만 줄이 바뀝니다.
export const contactTitle: string[] = ["감사합니다."];

// 연락처 버튼. icon은 components/Contact.tsx의 아이콘 이름과 맞춰야 합니다.
// 버튼을 숨기려면 hidden: true, 다시 보이게 하려면 그 줄을 지우면 됩니다.

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
  /** true면 화면에 표시하지 않음 */
  hidden?: boolean;
};

export const contacts: ContactLink[] = [
  {
    label: "Email",
    value: "[YOUR EMAIL]",
    href: "mailto:[YOUR EMAIL]",
    ariaLabel: "이메일 보내기: [YOUR EMAIL]",
    icon: "mail",
    hidden: true,
  },
  {
    label: "GitHub",
    value: "github.com/[USERNAME]",
    href: "https://github.com/[USERNAME]",
    ariaLabel: "GitHub 프로필 열기 (새 탭)",
    icon: "github",
    external: true,
    hidden: true,
  },
  {
    label: "Blog",
    value: "[BLOG URL]",
    href: "https://[BLOG URL]",
    ariaLabel: "블로그 열기 (새 탭)",
    icon: "blog",
    external: true,
    hidden: true,
  },
];
