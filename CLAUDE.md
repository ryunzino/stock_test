# AI 투자 대시보드 — Claude 프로젝트 지침

## 프로젝트 개요
주식 종목 정리 및 자동매매를 목표로 하는 개인 투자 도구.
현재는 AI 테마 종목 분석 대시보드로 구성되어 있으며, 이후 자동매매 기능을 추가할 예정.

## 기술 스택
- **프론트엔드:** React 18 + Vite 5
- **배포:** GitHub Pages (GitHub Actions 자동 빌드)
- **패키지 관리:** npm (package-lock.json 없음, `npm install` 사용)
- **차트:** TradingView Embed Widget
- **AI 뉴스:** Anthropic Claude API (claude-sonnet-4-20250514)

## 저장소 구조
```
stock_test/
├── src/
│   ├── App.jsx        # 메인 컴포넌트 (전체 대시보드 로직)
│   └── main.jsx       # React 진입점
├── index.html         # Vite HTML 템플릿
├── vite.config.js     # base: '/stock_test/' 설정 필수
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml # main 푸시 시 자동 빌드 & 배포
```

## 배포 흐름
1. `main` 브랜치에 push
2. GitHub Actions가 자동으로 `npm install && npm run build` 실행
3. `dist/` 폴더를 GitHub Pages에 배포
4. 배포 URL: https://ryunzino.github.io/stock_test/

> **주의:** `vite.config.js`의 `base: '/stock_test/'` 는 절대 제거하지 말 것.
> 제거하면 GitHub Pages에서 assets 경로가 깨짐.

## App.jsx 구조
- `TYPE` — 종목 구분 (바틀넥/점유율/유망주) 스타일 정의
- `TV_SYMBOL` — TradingView 심볼 매핑
- `ANALYSIS` — 종목별 상세 투자 분석 데이터
- `FIELDS` — 탭(분야) 및 섹터/종목 구성
- `TradingViewChart` — 차트 컴포넌트
- `NewsPanel` — Claude API로 최신 뉴스 검색
- `AnalysisPanel` — 투자 분석 표시
- `StockDetail` — 우측 슬라이드 패널 (차트+뉴스+분석)
- `InvestmentDashboard` — 최상위 컴포넌트

## 현재 탭 구성
| 탭 | 섹터 수 | 종목 수 |
|----|---------|--------|
| 🤖 Physical AI | 5 | 15 |
| 🏗️ AI 인프라 | 5 | 17 |

## 향후 로드맵
- [ ] 🛡️ 방산주 탭 추가
- [ ] 📈 자동매매 프로그램 연동
- [ ] 포트폴리오 수익률 추적
- [ ] 종목 알림 기능

## 코딩 규칙
- 모든 스타일은 인라인으로 작성 (별도 CSS 파일 없음)
- 새 종목 추가 시 `TV_SYMBOL`, `ANALYSIS`, `FIELDS` 세 곳 모두 업데이트
- 한국어 주석 및 UI 텍스트 사용
- 컴포넌트 분리보다 App.jsx 단일 파일 유지 (현재 방식 그대로)

## 커밋 & 푸시 규칙

### 자동 커밋 조건 (Claude가 확인 없이 즉시 실행)
1. 사용자가 **"커밋해줘"**, **"commit"**, **"푸시해줘"**, **"push"** 라고 하면 즉시 커밋 & 푸시
2. 기능 추가/수정이 **완전히 완료**된 시점에 자동 커밋
3. 버그 수정 완료 후 자동 커밋

### 커밋 메시지 형식
```
<작업 내용 한국어 요약>

https://claude.ai/code/session_01VGGTVUhjFXqYEAtLC9PHxF
```

### 브랜치 전략
- 일반 작업: `main` 직접 푸시
- 대규모 변경: 별도 브랜치 생성 후 main 병합

## 주의사항
- `App.jsx`가 64KB로 크므로 수정 전 반드시 전체 파일 읽기
- GitHub Actions 빌드 실패 시 즉시 원인 파악 후 재시도
- `package-lock.json` 없음 — `cache: npm` 옵션 사용 금지
