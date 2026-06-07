#!/usr/bin/env node
/**
 * 4개 데이터 소스 간 티커 일관성 검사
 * 실행: node scripts/check_consistency.js
 */

const fs = require("fs");
const path = require("path");

// ── 1. fields.js에서 티커 수집 ─────────────────────────────────
const fieldsRaw = fs.readFileSync(path.join(__dirname, "../src/data/fields.js"), "utf8");
const fieldTickers = new Set();
for (const m of fieldsRaw.matchAll(/ticker\s*:\s*["']([A-Z0-9.]+)["']/g)) {
  fieldTickers.add(m[1]);
}

// ── 2. symbols.js에서 티커 수집 ────────────────────────────────
const symbolsRaw = fs.readFileSync(path.join(__dirname, "../src/data/symbols.js"), "utf8");
const symbolTickers = new Set();
for (const m of symbolsRaw.matchAll(/["']([A-Z0-9.]+)["']\s*:/g)) {
  symbolTickers.add(m[1]);
}

// ── 3. analysis.js에서 티커 수집 ───────────────────────────────
const analysisRaw = fs.readFileSync(path.join(__dirname, "../src/data/analysis.js"), "utf8");
const analysisTickers = new Set();
for (const m of analysisRaw.matchAll(/["']([A-Z0-9.]+)["']\s*:\s*\{/g)) {
  analysisTickers.add(m[1]);
}

// ── 4. fetch_stocks.py에서 티커 수집 ───────────────────────────
const pyRaw = fs.readFileSync(path.join(__dirname, "fetch_stocks.py"), "utf8");
const pyTickers = new Set();
for (const m of pyRaw.matchAll(/"([A-Z0-9.]+)"\s*:/g)) {
  pyTickers.add(m[1]);
}

// ── 비교 ───────────────────────────────────────────────────────
let ok = true;

const check = (name, ref, target) => {
  const missing = [...ref].filter(t => !target.has(t));
  const extra   = [...target].filter(t => !ref.has(t));
  if (missing.length) {
    console.error(`❌ ${name} 누락 (${missing.length}개): ${missing.join(", ")}`);
    ok = false;
  }
  if (extra.length) {
    console.warn(`⚠️  ${name} 초과 (${extra.length}개): ${extra.join(", ")}`);
  }
};

console.log(`\n📊 fields.js 기준 티커: ${fieldTickers.size}개`);
check("symbols.js",      fieldTickers, symbolTickers);
check("analysis.js",     fieldTickers, analysisTickers);
check("fetch_stocks.py", fieldTickers, pyTickers);

if (ok) {
  console.log(`✅ 모든 데이터 소스 일치 (${fieldTickers.size}개 티커)\n`);
} else {
  console.log(`\n위 항목을 수정 후 재실행하세요.\n`);
  process.exit(1);
}
