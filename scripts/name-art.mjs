// 이름을 #/. 도트 ASCII 아트로 변환해 data/nameArt.ts에 저장합니다.
// 픽셀 격자에 맞춰 디자인된 한글 픽셀 글꼴(갈무리 11 Bold)의 픽셀을 그대로 옮깁니다.
// 사용법: npm run name-art -- 권지현
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";

const text = process.argv[2];
if (!text) {
  console.error("사용법: npm run name-art -- <이름>");
  process.exit(1);
}

const FONT = new URL("../node_modules/galmuri/dist/Galmuri11-Bold.ttf", import.meta.url);
const LETTER_GAP = 2; // 글자 사이 빈 픽셀 수

const font = opentype.parse(readFileSync(FONT).buffer);
const glyphs = [...text].map((ch) => font.charToGlyph(ch));

// 픽셀 한 칸의 크기 = 외곽선 좌표들의 최대공약수
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
let unit = 0;
for (const glyph of glyphs) {
  for (const c of glyph.path.commands) {
    if (c.x !== undefined) unit = gcd(unit, Math.abs(Math.round(c.x)));
    if (c.y !== undefined) unit = gcd(unit, Math.abs(Math.round(c.y)));
  }
}

// 픽셀 글꼴이라 외곽선은 직선(M/L/Z)뿐
function polygons(glyph) {
  const polys = [];
  let cur = [];
  for (const c of glyph.path.commands) {
    if (c.type === "M") {
      if (cur.length) polys.push(cur);
      cur = [[c.x, c.y]];
    } else if (c.type === "L") {
      cur.push([c.x, c.y]);
    } else if (c.type === "Z") {
      polys.push(cur);
      cur = [];
    }
  }
  if (cur.length) polys.push(cur);
  return polys;
}

// nonzero winding 규칙으로 점이 글자 안에 있는지 판정
function inside(polys, px, py) {
  let winding = 0;
  for (const p of polys) {
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const [xi, yi] = p[i];
      const [xj, yj] = p[j];
      const cross = (xi - xj) * (py - yj) - (px - xj) * (yi - yj);
      if (yj <= py) {
        if (yi > py && cross > 0) winding++;
      } else if (yi <= py && cross < 0) {
        winding--;
      }
    }
  }
  return winding !== 0;
}

// 각 픽셀 중심이 글자 안이면 채움
const filled = new Set();
let [minX, maxX, minY, maxY] = [Infinity, -Infinity, Infinity, -Infinity];
let penX = 0;
for (const glyph of glyphs) {
  const polys = polygons(glyph);
  const bb = glyph.getBoundingBox();
  for (let y = Math.floor(bb.y1 / unit); y < Math.ceil(bb.y2 / unit); y++) {
    for (let x = Math.floor(bb.x1 / unit); x < Math.ceil(bb.x2 / unit); x++) {
      if (!inside(polys, (x + 0.5) * unit, (y + 0.5) * unit)) continue;
      const X = x + penX;
      filled.add(`${X},${y}`);
      [minX, maxX, minY, maxY] = [Math.min(minX, X), Math.max(maxX, X), Math.min(minY, y), Math.max(maxY, y)];
    }
  }
  penX += Math.round(glyph.advanceWidth / unit) + LETTER_GAP - 1;
}

// 한 픽셀 = 가로 2글자 (고정폭 글자가 세로로 길어서), 위아래를 뒤집어 위쪽부터 출력
const lines = [];
for (let y = maxY; y >= minY; y--) {
  let line = ".";
  for (let x = minX; x <= maxX; x++) line += filled.has(`${x},${y}`) ? "##" : "..";
  lines.push(line + ".");
}

const out = `// 자동 생성 파일입니다. 직접 고치지 말고 \`npm run name-art -- ${text}\`로 다시 만드세요.
export const nameArt: readonly string[] = [
${lines.map((l) => `  "${l}",`).join("\n")}
];
`;
writeFileSync(fileURLToPath(new URL("../data/nameArt.ts", import.meta.url)), out);
console.log(lines.join("\n"));
