# AI 투자 대시보드 (stock_guide) — 프로젝트지침

> 커밋/푸시 규칙은 전역지침(`~/.claude/CLAUDE.md`)에서 관리합니다.

## 프로젝트 개요
AI 테마 종목 분석 대시보드. 종목 발굴·비교·분석을 위한 개인 투자 리서치 도구.
자동매매는 별도 레포(`stock_auto`)에서 분리 운영 예정.

## 기술 스택
- **프론트엔드:** React 18 + Vite 5
- **배포:** GitHub Pages (GitHub Actions 자동 빌드)
- **패키지 관리:** npm (`package-lock.json` 존재, `npm install` 사용)
- **차트(개별):** TradingView Embed Widget
- **차트(비교):** lightweight-charts v4.2.3
- **AI 뉴스:** Anthropic Claude API (claude-sonnet-4-20250514)

## 저장소 구조
```
stock_guide/
├── src/
│   ├── App.jsx           # 모든 UI 컴포넌트 (단일 파일 유지)
│   ├── main.jsx          # React 진입점
│   └── data/
│       ├── symbols.js    # TradingView 심볼 매핑 (TV_SYMBOL)
│       ├── fields.js     # 탭/섹터/종목 구성 (FIELDS, TYPE)
│       └── analysis.js   # 종목별 투자 분석 데이터 (ANALYSIS)
├── scripts/
│   ├── fetch_stocks.py        # yfinance로 주가 데이터 수집 → public/stockdata.json
│   └── check_consistency.js  # 4개 데이터 소스 일관성 검사 (node 실행)
├── public/
│   └── stockdata.json    # GitHub Actions가 생성 (로컬에는 없음)
├── index.html
├── vite.config.js        # base: '/stock_guide/' 설정 필수
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml    # main 푸시 시 fetch_stocks.py → npm build → Pages 배포
```

## 배포 흐름
1. `main` 브랜치에 push
2. GitHub Actions: `pip install yfinance` → `python scripts/fetch_stocks.py` → `npm run build`
3. `dist/` 폴더를 GitHub Pages에 배포
4. 배포 URL: https://ryunzino.github.io/stock_guide/

> **주의:** `vite.config.js`의 `base: '/stock_guide/'` 는 절대 제거하지 말 것.

## App.jsx 컴포넌트 구조
- `MetricGrid` — 2열 지표 그리드 (재사용)
- `InfoSection` — 제목+내용 섹션 (재사용)
- `TradingViewChart` — 개별 종목 TradingView 차트 임베드
- `NewsPanel` — Claude API로 최신 뉴스 검색
- `AnalysisPanel` — 투자 분석 (밸류에이션/재무/성장/경쟁사/촉매/진입전략)
- `StockDetail` — 우측 슬라이드 패널 (차트+뉴스+분석)
- `CompareChart` — lightweight-charts 기반 다중 종목 수익률 비교 차트
  - 기간 프리셋(1M/3M/6M/1Y/3Y/5Y/전체) + 커스텀 날짜 직접 입력
  - 커서 기준 휠 줌, 좌클릭 팬, 우클릭 드래그 영역줌, 키보드 단축키(←→+-F)
  - y=0 기준선, 선택 기간 수익률 표시
- `CompareGrid` — CompareChart를 1~4개 그리드로 배치
- `InvestmentDashboard` — 최상위 컴포넌트
- `RANGE_PRESETS` — 기간 프리셋 배열 (모듈 레벨 상수)

## 현재 탭 구성 (10개)
| 탭 ID | 탭 이름 | 비고 |
|-------|---------|------|
| physicalAI | 🤖 Physical AI | 5섹터 |
| aiInfra | 🏗️ AI 인프라 | 7섹터 |
| space | 🚀 우주 테마 | 4섹터 |
| trumpTheme | 🇺🇸 트럼프 테마 | 6섹터 |
| aiXBio | 🧬 AI × 바이오 | 5섹터 |
| obesity | 💉 비만·대사 혁명 | 4섹터 |
| watchlist | 📌 요청 종목 | 사용자 요청 종목 |
| nuclear | 🔋 핵에너지 & AI 전력 | 3섹터 |
| cyber | 🌐 사이버보안 | 3섹터 |
| quantum | ⚛️ 양자 컴퓨팅 | 2섹터 |

**총 166개 티커** (일부 종목은 복수 탭에 중복 등장 — 의도적 크로스테마 배치)

## 📌 요청 종목 탭 운영 규칙
사용자가 특정 종목 분석을 요청하면 아래 순서로 처리:

1. **analysis.js** — 분석 데이터 추가 (따옴표 키 형식: `"TICKER":{ ... }`)
2. **fields.js** — `watchlist.sectors[0].stocks` 배열에 종목 추가
3. **symbols.js** — TradingView 심볼 추가
4. **fetch_stocks.py** — `TV_SYMBOLS` 딕셔너리에 추가
5. 일관성 검사: `node scripts/check_consistency.js`
6. 빌드 확인 후 커밋·푸시

종목 추가 형식 (fields.js):
```js
{ ticker:"ARM", name:"Arm Holdings", exchange:"NASDAQ",
  role:"CPU 설계 IP 독점, 모바일·AI 에지 칩 90%+ 채택",
  note:"핵심 분석 포인트 한 줄", type:"bottleneck" }
```

type 선택 기준:
- `bottleneck` — 해당 분야 병목 장악 기업
- `share` — 시장 점유율 상위권
- `emerging` — 고성장 소형/중형주

## 데이터 파이프라인 (fetch_stocks.py)
- yfinance로 `period="5y"`, `interval="1wk"` 주봉 데이터 수집
- `series > 0` 필터로 상장 이전 0값 제거
- 결과: `public/stockdata.json` (GitHub Actions가 빌드 시 생성, 로컬에 없음)
- 거래소별 Yahoo 심볼 변환: KRX→`.KS`, TSE→`.T`, HKEX→`.HK`, AMEX→그대로
- 클라이언트에서도 `filter(d => d.value > 0)` 이중 필터 적용

## 일관성 검사 (핵심 도구)
종목 추가/수정 후 반드시 실행:
```bash
node scripts/check_consistency.js
```
- fields.js / symbols.js / analysis.js / fetch_stocks.py 4개 소스 교차 검증
- 누락·초과 티커를 명확히 출력
- exit code 1 반환 시 커밋 전 수정

## 코딩 규칙
- 모든 스타일은 인라인으로 작성 (별도 CSS 파일 없음)
- `App.jsx` 단일 파일 유지 (컴포넌트 분리 금지)
- `analysis.js` 키는 반드시 따옴표 형식: `"TICKER":{ ... }`
- 한국어 주석 및 UI 텍스트 사용
- 키보드 단축키 핸들러는 INPUT/TEXTAREA 포커스 시 비활성화 필수

## 향후 로드맵
- [ ] 자동매매 엔진 — 별도 레포 `stock_auto`로 분리 운영
- [ ] 포트폴리오 수익률 추적
- [ ] 종목 알림 기능
- [ ] 일봉 데이터 지원 (현재 주봉)

## 주의사항
- `vite.config.js`의 `base: '/stock_guide/'` 절대 제거 금지
- 데이터 수정 시 4개 파일 모두 확인 후 `check_consistency.js` 실행
- GitHub Actions 빌드 실패 시 즉시 원인 파악
- `stockdata.json`은 로컬에 없음 — GitHub Actions가 빌드 시 생성
