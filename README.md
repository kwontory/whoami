# whoami

백엔드 개발자에서 인프라 엔지니어로 방향을 바꾸기까지의 과정을 담은 개인 페이지입니다.

**사이트:** https://whoami-hazel-one.vercel.app/

리눅스 터미널을 모티브로 만들었습니다. 첫 화면의 `whoami`부터 마지막 `exit 0`까지, 페이지 전체가 하나의 셸 세션처럼 읽히도록 구성했습니다.

## 기술 스택

- Next.js (App Router), TypeScript, Tailwind CSS v4
- 애니메이션은 외부 라이브러리 없이 CSS와 IntersectionObserver로 구현했습니다.
- 배포는 Vercel을 사용합니다.

## 로컬에서 실행하기

Node.js 20.9 이상이 필요합니다.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 프로덕션 빌드 확인
```

## 내용 수정하기

페이지에 들어가는 글은 모두 `data/` 폴더에 모아 두었습니다. 문구를 바꿀 때는 컴포넌트를 열어 볼 필요 없이 이 파일들만 고치면 됩니다.

| 파일 | 내용 |
| --- | --- |
| `data/profile.ts` | 이름, 직함, 푸터에 표시되는 연도 |
| `data/about.ts` | 크게 보이는 핵심 문장(`aboutKey`)과 그 아래 소개 글. `highlight`에 적은 부분이 초록색으로 강조됩니다. |
| `data/journey.ts` | 타임라인 제목과 카드 목록. `period`, `logs`, `highlights`, `certs`, `stack`, `skills`, `command`는 필요한 것만 적으면 되고, `current: true`인 카드는 앰버 색으로 표시됩니다. |
| `data/contact.ts` | 마지막 섹션의 명령어와 인사말, 연락처 버튼. 버튼은 `hidden: true`로 숨길 수 있습니다. |

### 이름 아트 다시 만들기

첫 화면의 이름은 한글 픽셀 글꼴인 [갈무리](https://github.com/quiple/galmuri) 11 Bold를 `#`과 `.`으로 옮긴 ASCII 아트입니다. `data/profile.ts`에서 이름을 바꿨다면 아래 명령으로 다시 만들어 주세요. 결과는 `data/nameArt.ts`에 저장됩니다.

```bash
npm run name-art -- 권지현
```

화면에는 글자가 아니라 SVG 도형으로 그립니다. JetBrains Mono Bold의 `#`과 `.` 외곽선을 `components/Hero.tsx`에 넣어 두고, 한 칸씩 반복되는 패턴으로 채웁니다. 휴대폰에서 사용자가 지정한 글꼴이나 대체 글꼴이 쓰여도 아트 모양이 달라지지 않습니다.

## 폴더 구조

```
app/
  layout.tsx        글꼴, 메타데이터
  page.tsx          섹션 배치
  globals.css       테마 색상, 애니메이션, 모션 줄이기 설정
components/
  Hero.tsx          첫 화면 터미널과 이름 아트(SVG)
  About.tsx         about.txt 소개
  Timeline.tsx      journey.log 타임라인
  RevealItem.tsx    스크롤하면 카드가 나타나게 하는 부분
  ClampText.tsx     폰에서 긴 설명을 3줄로 줄이고 "더 보기"로 펼치는 부분
  Contact.tsx       마지막 인사와 연락처
data/               페이지에 들어가는 글
scripts/
  name-art.mjs      이름 ASCII 아트 생성 스크립트
```

## 참고할 점

- Tailwind는 `app/`과 `components/` 폴더만 읽습니다. 다른 폴더에서 Tailwind 클래스를 쓰려면 `app/globals.css` 맨 위에 `@source`를 한 줄 추가해 주세요.
- JetBrains Mono는 `next/font`가 빌드할 때 Google Fonts에서 받아오기 때문에, 빌드 환경에 인터넷 연결이 필요합니다.
- 브라우저에서 모션 줄이기 설정을 켜 두면 애니메이션 없이 완성된 화면이 바로 보입니다.
- 첫 화면 터미널은 640px 이상에서 16:9 비율이고, 내용이 길면 그만큼 늘어납니다. 가로로 둔 태블릿처럼 높이가 낮은 화면(폭 640px 이상, 높이 780px 이하)에서는 터미널과 SCROLL 버튼이 한 화면에 들어오도록 크기와 여백을 줄입니다. 이 조건은 `app/globals.css`의 `short` 변형으로 정해 두었습니다.

## 글꼴

- [JetBrains Mono](https://www.jetbrains.com/lp/mono/): 코드와 터미널 텍스트, 이름 아트의 `#`·`.` 모양
- [Pretendard](https://github.com/orioncactus/pretendard): 한글 본문
- [갈무리](https://github.com/quiple/galmuri): 이름 아트 생성에만 사용

세 글꼴 모두 SIL Open Font License를 따릅니다.
