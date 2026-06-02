# AI 투자 대시보드

Physical AI / AI 인프라 분야 투자 분석 대시보드

## 구조
- **분야**: Physical AI, AI 인프라
- **섹터**: 각 분야별 5개 섹터
- **종목**: 34개 종목 — 바틀넥 / 점유율 / 유망 소형주 구분
- **기능**: 실시간 차트 (TradingView) + 뉴스 (Claude API) + 장기 투자 분석

## 로컬 실행

```bash
npm install
npm run dev
```

## 새 분야 추가 방법

`src/App.jsx` 의 `FIELDS` 객체에 새 분야를 추가하면 탭이 자동으로 늘어납니다.

```js
FIELDS.방산 = {
  id: "방산",
  label: "방산",
  emoji: "🛡️",
  fieldBottleneck: { sector: "...", reason: "..." },
  sectors: [ ... ]
}
```

## 새 종목 분석 추가 방법

`src/App.jsx` 의 `ANALYSIS` 객체에 티커를 키로 추가합니다.

```js
ANALYSIS["티커"] = {
  verdict: "장기 매수",
  verdictColor: "#00ff88",
  horizon: "5~10년",
  moat: "경쟁 우위",
  thesis: "투자 근거 요약",
  bull: ["강세 근거 1", "강세 근거 2"],
  bear: ["리스크 1", "리스크 2"],
  current: "$000",
  target: "$000",
}
```

## 배포 (Vercel)

```bash
npm run build
# Vercel에 dist 폴더 배포 또는 GitHub 연동 자동 배포
```
