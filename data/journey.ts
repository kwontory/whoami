// `$ cat ~/journey.log` 아래 섹션 제목.
// 줄바꿈은 화면 너비에 맞춰 단어 단위로 자동 조절되니 <br>이나 \n 없이 한 줄로 적으면 됩니다.
export const journeyTitle = "동작하는 코드에서 그 기반까지";

// 타임라인 항목. 배열 순서대로 위에서 아래로 표시됩니다.
// 선택 필드(stack, skills, highlights, logs, certs, command)는 있는 것만 렌더링됩니다.

export type JourneyKind = "init" | "build" | "incident" | "learn" | "now";

export type LogLine = {
  time: string;
  level: "ALERT" | "INFO" | "RESOLVED";
  message: string;
};

export type Cert = {
  name: string;
  /** 취득 시기. 예: "2024.04" */
  date: string;
};

export type JourneyEntry = {
  kind: JourneyKind;
  /** 비워두면 날짜를 표시하지 않음 */
  period?: string;
  title: string;
  description: string;
  /** 회색 테두리 태그 (사용 스택). 언어 → 프레임워크 → DB → 도구 순으로 적기 */
  stack?: string[];
  /** 초록색 강조 태그 (학습 중인 기술) */
  skills?: string[];
  /** ✓ 체크리스트 (대표 성과) */
  highlights?: string[];
  /** 터미널 로그 블록 (장애 기록) */
  logs?: LogLine[];
  /** `$ ls -tr ~/certs` 자격증 목록. 취득한 순서(오래된 것부터)로 적기 */
  certs?: Cert[];
  /** 카드 하단 커맨드 라인 */
  command?: string;
  /** 현재 위치: 앰버 색으로 강조 */
  current?: boolean;
};

export const journey: JourneyEntry[] = [
  {
    kind: "init",
    period: "2016.03 — 2023.11",
    title: "데이터를 보던 눈으로, 첫 커밋",
    description:
      "경제와 통계를 전공하며 Python과 SQL로 데이터를 다뤘고, 이때 개발에 관심을 갖게 되었습니다. 이후 웹 개발 과정에서 Java·Spring 백엔드와 DB 설계를 배웠습니다. 과정 중에는 담당 선생님이 매주 직접 오가며 출결을 확인하시는 모습이 불편해 보여, 팀 프로젝트로 출결 관리 시스템을 처음 구상하고 만들었습니다.",
    highlights: [
      "학부연구생 · 연구 데이터 전처리, STATA 통계 분석 지원 (2018 — 2020)",
      "MERS 사태 연구 참여, 국제 학술지(SSCI) 공동 저자 등재 (2021.04)",
      "웹 개발 과정 984시간 수료 (2023.03 — 2023.11)",
    ],
    stack: ["Java", "SQL", "Spring Boot", "Spring Data JPA", "MariaDB", "Git", "Docker"],
  },
  {
    kind: "build",
    period: "2023.11 — 2024.10",
    title: "공공기관 시스템을 만들고, 운영하다",
    description:
      "SI 개발부에서 백엔드 개발자로 일하며 공공기관 정보시스템 3건을 구축하고 3건을 유지보수했습니다. 예약 시스템과 MIS 등의 설계부터 쿼리 튜닝, 운영까지 맡았습니다.",
    highlights: [
      "예약번호 동시성 문제 해결 → 중복 예약 0건",
      "예약 조회 5~10초 → 1초 이내 (인덱스 튜닝)",
      "통합 예약 API 응답 1.8초 → 0.8초",
      "간접원가 배부 프로시저 1분 → 1초 이내",
    ],
    stack: [
      "Java",
      "JavaScript",
      "SQL",
      "Spring Framework",
      "Spring Boot",
      "Spring Data JPA",
      "MyBatis",
      "Oracle",
      "Tibero",
      "MySQL",
    ],
  },
  {
    kind: "incident",
    title: "응용 계층 아래가 궁금해지다",
    logs: [
      { time: "T+0", level: "ALERT", message: "솔루션 연동 요청 응답 없음 (timeout)" },
      { time: "T+1", level: "INFO", message: "\"방화벽에서 막혔을 수도 있어요\"" },
      { time: "T+2", level: "INFO", message: "웹 취약점 점검 결과 조치" },
    ],
    description:
      "외부 솔루션과 연동하던 중 요청이 서버에 닿지 않는 문제가 있었고, 방화벽에서 막혔을 수 있다는 이야기를 들었습니다. 이후 공공기관의 망분리 환경을 겪으면서 애플리케이션 아래의 인프라가 궁금해졌습니다. 운영 중인 사이트의 웹 취약점 점검에 대응하면서 보안에도 관심을 갖게 되었습니다.",
  },
  {
    kind: "learn",
    period: "2024.10 — present",
    title: "코드 아래의 세계를 공부하다",
    description:
      "인프라 직무에 도전하기에는 기초가 많이 부족했고 자신도 없었습니다. 그래서 퇴사 후 처음부터 다시 공부하기로 했습니다. 서버와 네트워크를 직접 구성해 보며 부족한 부분을 하나씩 채우고 있습니다.",
    highlights: [
      "Linux 서버 구축과 기본 서비스 운영",
      "스위치·라우터 기반 네트워크 구성",
      "네트워크·웹 보안의 기본 원리",
      "로그와 기술 문서를 원문으로 읽기 위한 영어 공부",
    ],
    certs: [
      { name: "SQLD", date: "2024.04" },
      { name: "정보처리기사", date: "2024.06" },
      { name: "OPIc IH", date: "2025.09" },
      { name: "네트워크관리사 2급", date: "2026.03" },
      { name: "DAsP", date: "2026.04" },
      { name: "TOEIC 865", date: "2026.05" },
      { name: "리눅스마스터 2급", date: "2026.07" },
      { name: "SQLP", date: "2026.09" },
    ],
    skills: ["Linux", "Network", "Security"],
  },
  {
    kind: "now",
    period: "HEAD → main",
    title: "인프라 엔지니어로",
    description:
      "시스템을 개발하고 운영해 본 경험을 바탕으로, 레거시 환경을 더 안정적이고 안전한 기반으로 개선하는 인프라 엔지니어가 되고자 합니다.",
    command: "git checkout -b infra",
    current: true,
  },
];
