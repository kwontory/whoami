// `$ cat ~/journey.log` 아래 섹션 제목.
// 줄바꿈은 화면 너비에 맞춰 단어 단위로 자동 조절되니 <br>이나 \n 없이 한 줄로 적으면 됩니다.
export const journeyTitle = "동작하는 코드에서 그 기반까지";

// 타임라인 항목. 배열 순서대로 위에서 아래로 표시됩니다.
// 선택 필드(stack, skills, highlights, logs, command)는 있는 것만 렌더링됩니다.

export type JourneyKind = "init" | "build" | "incident" | "learn" | "now";

export type LogLine = {
  time: string;
  level: "ALERT" | "RESOLVED";
  message: string;
};

export type JourneyEntry = {
  kind: JourneyKind;
  period: string;
  title: string;
  description: string;
  /** 회색 테두리 태그 (사용 스택) */
  stack?: string[];
  /** 초록색 강조 태그 (학습 중인 기술) */
  skills?: string[];
  /** ✓ 체크리스트 (대표 성과) */
  highlights?: string[];
  /** 터미널 로그 블록 (장애 기록) */
  logs?: LogLine[];
  /** 카드 하단 커맨드 라인 */
  command?: string;
  /** 현재 위치: 앰버 색으로 강조 */
  current?: boolean;
};

export const journey: JourneyEntry[] = [
  {
    kind: "init",
    period: "[YYYY.MM] — [YYYY.MM]",
    title: "백엔드 개발자로 첫 커밋",
    description: "[COMPANY NAME]에 백엔드 개발자로 합류. [담당 서비스·도메인 한 줄 설명]",
    stack: ["[LANGUAGE]", "[FRAMEWORK]", "[DATABASE]"],
  },
  {
    kind: "build",
    period: "[YYYY.MM] — [YYYY.MM]",
    title: "서비스를 설계하고, 운영하다",
    description: "[서비스명]의 [설계·운영 경험 설명]",
    highlights: ["[대표 성과 1 — 예: 응답 시간 N% 단축]", "[대표 성과 2]"],
  },
  {
    kind: "incident",
    period: "[YYYY.MM]",
    title: "장애가 알려준 것",
    description: "[장애 상황과 대응 과정]. [이 경험이 인프라에 관심을 갖게 된 계기]",
    logs: [
      { time: "[HH:MM:SS]", level: "ALERT", message: "[장애 알림 메시지]" },
      { time: "[HH:MM:SS]", level: "RESOLVED", message: "[복구 조치]" },
    ],
  },
  {
    kind: "learn",
    period: "[YYYY.MM] — present",
    title: "코드 아래의 세계를 공부하다",
    description: "[학습 방식 — 예: 사이드 프로젝트, 스터디, 자격증]",
    skills: ["Linux", "Docker", "Kubernetes", "AWS", "Terraform"],
  },
  {
    kind: "now",
    period: "HEAD → main",
    title: "인프라 엔지니어로",
    description: "[인프라 엔지니어로서의 목표]",
    command: "git checkout -b infra",
    current: true,
  },
];
