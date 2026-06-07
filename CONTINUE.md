# 세션 요약 — 2026-06-07

## 작업 환경
- 저장소: `ryunzino/stock_guide` (구 이름: `stock_test` → 이번 세션에서 변경)
- 브랜치: `main`
- 배포 URL: https://ryunzino.github.io/stock_guide/
- 로컬 경로: `/home/user/stock_test`

## 완료한 작업
- ⚛️ 양자 컴퓨팅 탭 추가 (IONQ, RGTI, QBTS, QUBT, IBM)
- 🔋 핵에너지 & AI 전력 탭 추가 (CEG, VST, NRG, CCJ, LEU, UEC, OKLO, ETN, VRT, GEV, PWR)
- 🌐 사이버보안 탭 추가 (CRWD, PANW, ZS, OKTA, S, FTNT, CYBR)
- 비교 차트 기능 대폭 개선:
  - 좌클릭 팬 (데이터 경계 클램핑)
  - 휠 줌 (커서 기준)
  - 우클릭 드래그 영역줌 (X+Y 동시)
  - 키보드 단축키 (←→+-F)
  - y=0 기준선 (흰 점선 2px)
  - 기간 프리셋 버튼 (1M/3M/6M/1Y/3Y/5Y/전체)
  - 커스텀 날짜 직접 입력 (YYYY-MM-DD, Enter/blur 적용)
  - 선택 기간 수익률 표시
- fetch_stocks.py: 1y → 5y, 0값 필터 추가
- analysis.js 키 형식 통일 (따옴표 형식)
- S(SentinelOne) analysis.js 누락 → 추가
- 프로젝트 이름 변경: stock_test → stock_guide (vite.config.js base 경로 포함)
- scripts/check_consistency.js 신규 생성 (4개 파일 티커 일관성 자동 검사)
- CLAUDE.md 전면 업데이트

## 현재 상태
- 로컬 최신 커밋: `58a0e06` (CONTINUE.md 포함)
- **푸시 부분 완료**: CLAUDE.md, check_consistency.js, CONTINUE.md는 MCP로 푸시 완료
- **푸시 미완료**: `src/data/analysis.js` (S 티커 추가분) — 파일 크기(261KB) 문제로 git push 및 MCP 모두 실패
- git 프록시 503 오류: `ryunzino/stock_test` URL로 git push 불가 (레포 이름 변경 후)

## 다음 할 일
1. **analysis.js S 티커 푸시**: GitHub에서 직접 S 티커 분석 데이터 추가 (파일 하단 CYBR 항목 직전에 삽입)
   - 추가할 내용은 로컬 `src/data/analysis.js` 파일 2466번째 줄 이후 참조
2. 일봉 전환 여부 결정 (현재 주봉 — 자동매매 연동 시 일봉이 유리)
3. `stock_auto` 별도 레포 세팅 (자동매매 엔진)

## 추가해야 할 S 티커 분석 데이터
```js
  "S":{
    verdict:"매수",verdictColor:"#4a9eff",horizon:"3~5년",
    moat:"AI 네이티브 EDR 플랫폼 — 단일 에이전트로 엔드포인트·클라우드·아이덴티티 통합 방어",
    thesis:"AI 기반 자율 위협 탐지(Singularity 플랫폼)로 엔드포인트 보안 시장 점유율을 빠르게 확장 중. CrowdStrike 대비 저렴한 가격 경쟁력과 장애 이슈 반사이익 수혜. 데이터 레이크(Data Lake) 기반 분석이 차별점.",
    bull:["CrowdStrike 2024년 장애 이후 고객 이탈 수혜","AI 위협 탐지 정확도 경쟁에서 선두권 유지","Data Lake → AI/SIEM 통합으로 플랫폼 확장 가속"],
    bear:["지속적인 적자 — 흑자 전환 시점 불확실","CrowdStrike·Microsoft Defender와 치열한 가격 경쟁","영업 효율성 개선 속도가 기대보다 느릴 수 있음"],
    current:"$17~22",target:"$35~50 (3년)",
    valuation:{per:"적자",pbr:"~5x",ev_ebitda:"적자"},
    financial:{revenue:"$622M(FY2024)",margin:"비GAAP 운영 -10%",cash:"$1B+"},
    growth:{revenueGrowth:"+33% YoY",guidanceRevenue:"$815M(FY2025E)",expansion:"클라우드·SIEM·아이덴티티"},
    competitors:"CrowdStrike, Microsoft Defender, Palo Alto Cortex XDR",
    catalysts:["CrowdStrike 대체 수요 지속","Singularity AI SIEM 대형 계약","흑자 전환 달성"],
    entryStrategy:"고성장 사이버보안 2순위. 1~2% 비중. CrowdStrike 보완 포지션으로 편입.",
  },
```
위 내용을 `src/data/analysis.js` 파일에서 `"CYBR":` 항목 바로 앞에 삽입

## 참고 사항
- 166개 티커 모두 4개 파일 간 일관성 확인됨 (`node scripts/check_consistency.js` → ✅)
- 종목 추가 시 반드시 4개 파일 + check_consistency.js 실행
- analysis.js 키는 반드시 따옴표 형식: `"TICKER": { ... }`
- vite.config.js base: '/stock_guide/' 절대 제거 금지
- stockdata.json은 로컬에 없음 (GitHub Actions 빌드 시 생성)
