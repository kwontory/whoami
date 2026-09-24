# whoami

백엔드 개발자 → 인프라 엔지니어 커리어 전환을 보여주는 개인 페이지.
Next.js (App Router) · TypeScript · Tailwind CSS v4.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드
```

## 내용 수정

`[YOUR NAME]` 같은 자리표시자는 모두 `data/` 폴더에 있습니다. 컴포넌트는 건드리지 않아도 됩니다.

| 파일 | 내용 |
| --- | --- |
| `data/profile.ts` | 이름, 직함(from → to), 저작권 연도 |
| `data/journey.ts` | 타임라인 섹션 제목(`journeyTitle`)과 항목. `stack`, `skills`, `highlights`, `logs`, `command`는 선택 필드이고, `current: true`인 항목은 앰버 색으로 강조됩니다 |
| `data/about.ts` | 타임라인 위 `$ cat ~/about.txt` 섹션. 크게 보이는 핵심 문장(`aboutKey`, 강조할 부분은 `highlight`)과 소개 글(문자열 하나 = 문단 하나) |
| `data/contact.ts` | 마지막 섹션 명령어(`outroCommand`)·제목(`contactTitle`)과 연락처 버튼. 버튼은 `hidden: true`로 숨김 |
| `data/nameArt.ts` | 첫 화면의 이름 ASCII 아트 (자동 생성) |

이름을 바꿨다면 ASCII 아트도 다시 만드세요. 한글 픽셀 글꼴 [갈무리](https://github.com/quiple/galmuri) 11 Bold의 픽셀을 `#`/`.` 도트로 옮깁니다.

```bash
npm run name-art -- 권지현
```

## 구조

```
app/
  layout.tsx       폰트(JetBrains Mono: next/font, Pretendard: npm), 메타데이터
  page.tsx         섹션 조합
  globals.css      테마 색상, 애니메이션, reduced-motion 처리
components/
  Hero.tsx         터미널 + whoami 타이핑
  About.tsx        about.txt 소개 글
  Timeline.tsx     journey.log 타임라인
  RevealItem.tsx   IntersectionObserver로 스크롤 등장 처리 (client)
  Contact.tsx      마지막 인사 + 연락처 버튼 + exit 0
data/              수정용 데이터
```

## 배포

Vercel에서 이 저장소를 Import하면 추가 설정 없이 배포됩니다 (Framework Preset: Next.js).
