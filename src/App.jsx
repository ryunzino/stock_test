import { useState, useEffect, useRef } from "react";

const TYPE = {
  bottleneck: { label: "바틀넥", bg: "#ff4444", text: "#fff", rowBg: "#140000", rowBorder: "#440000", rowAccent: "#ff4444", nameColor: "#ff8888" },
  share:      { label: "점유율", bg: "#4a9eff", text: "#fff", rowBg: "#00091a", rowBorder: "#003060", rowAccent: "#4a9eff", nameColor: "#7ab8ff" },
  emerging:   { label: "유망주", bg: "#a855f7", text: "#fff", rowBg: "#0d0014", rowBorder: "#3b0060", rowAccent: "#a855f7", nameColor: "#c084fc" },
};

const TV_SYMBOL = {
  "NVDA":"NASDAQ:NVDA","000660":"KRX:000660","QCOM":"NASDAQ:QCOM","TER":"NASDAQ:TER",
  "ABB":"NYSE:ABB","PATH":"NYSE:PATH","TSLA":"NASDAQ:TSLA","000270":"KRX:000270",
  "UBTECH":"HKEX:9888","SERV":"NASDAQ:SERV","MOG.A":"NYSE:MOG.A","ISRG":"NASDAQ:ISRG",
  "OUST":"NASDAQ:OUST","6954":"TSE:6954","AMZN":"NASDAQ:AMZN","PRCT":"NASDAQ:PRCT",
  "AVGO":"NASDAQ:AVGO","AMD":"NASDAQ:AMD","MU":"NASDAQ:MU","ANET":"NYSE:ANET",
  "LITE":"NASDAQ:LITE","POET":"NASDAQ:POET","CEG":"NASDAQ:CEG","VST":"NYSE:VST",
  "ETN":"NYSE:ETN","EME":"NYSE:EME","PWR":"NYSE:PWR","VRT":"NYSE:VRT",
  "MOD":"NYSE:MOD","NVT":"NYSE:NVT","CLS":"NYSE:CLS","EQIX":"NASDAQ:EQIX",
  "DLR":"NYSE:DLR","APLD":"NASDAQ:APLD",
};

const ANALYSIS = {
  "000660": {
    verdict: "장기 강력 매수", verdictColor: "#00ff88", horizon: "3~7년",
    moat: "HBM 기술 리더십 + 삼성 대비 18개월 선행",
    thesis: "Q1 2026 매출 52.6조원(+198% YoY), 영업이익률 72% — NVIDIA마저 넘어선 반도체 역대 최고 마진. 2026년 전체 출하량 매진 확정. 골드만삭스, 올해 DRAM 공급부족을 15년래 최악으로 상향. 12개월 목표가 270~300만원. 시가총액 $1조 돌파.",
    bull: ["HBM 점유율 50%+, 삼성 대비 18개월 기술 선행","2026 전체 DRAM·HBM·NAND 출하량 완전 매진","영업이익률 72% — 반도체 역사상 최고 기록","순현금 35조원, EUV 장비 $80억 투자로 기술 리드 확대"],
    bear: ["삼성 HBM4 4Q26 양산 시 점유율 희석 가능","메모리 업황 사이클 — 2027~2028 공급 과잉 리스크","中 반도체 굴기·수출통제 지정학 리스크","P/E 22배로 상승, 고점 논란"],
    current: "₩2,330,000 (2026.06 기준, 연초比 +250%)",
    target: "₩2,700,000~3,000,000 (국내 증권사 12개월 컨센서스)",
  },
  "NVDA": {
    verdict: "장기 매수 (분할 매수 권장)", verdictColor: "#00ff88", horizon: "5~10년",
    moat: "CUDA 소프트웨어 생태계 + AI GPU 85~92% 점유율",
    thesis: "FY2026 데이터센터 매출 $1,937억. 시가총액 $5조 돌파. Blackwell 풀 양산 중. PEG 0.7 이하 성장 대비 저평가. 75명 애널리스트 전원 매수. 소버린 AI(각국 정부 AI 투자)가 FY26 $300억+ 신규 수요원. CUDA 플랫폼으로 하드웨어→소프트웨어 임대료 구조 전환 중.",
    bull: ["AI GPU 시장 85~92% 점유, CUDA 생태계 전환 비용 극히 높음","순이익률 50%+, 영업이익률 70% 소프트웨어 수준","소버린 AI $300억+ 신규 수요원 확보","PEG 0.7 — 성장 대비 저평가 구간"],
    bear: ["상위 2개사 매출 36% 집중 리스크","AMD·구글 TPU·AWS Trainium 커스텀 칩 경쟁 심화","Rubin 아키텍처 지연 가능성","$5조 시총 — 절대 규모상 추가 배수 확장 제한적"],
    current: "$219 (2026.06 기준)",
    target: "$270~300 (애널리스트 컨센서스 $274)",
  },
  "QCOM": {
    verdict: "중립 (AI 전환 성공 여부 주목)", verdictColor: "#ffd700", horizon: "2~5년",
    moat: "모바일 SoC 특허 + 엣지 AI 칩 설계 역량",
    thesis: "스마트폰 의존 탈피를 위해 PC·자동차·로봇 온디바이스 AI로 피벗 중. 로봇 현장 추론용 SoC는 유일한 대형주 선택지. 다만 애플 자체 칩 전환으로 매출 감소 리스크 현실화. 현재 P/E 약 15배 상대적 저평가.",
    bull: ["엣지 AI 온디바이스 추론 유일한 대형 SoC","P/E 15배 AI 섹터 내 상대적 저평가","PC·자동차·IoT로 다변화 진행 중","배당 지급 + 자사주 매입 병행"],
    bear: ["애플 자체 칩 전환으로 매출 감소 진행 중","스마트폰 시장 성숙 핵심 사업 성장 한계","Arm·MediaTek 경쟁 심화","로봇·자동차 수익화까지 3~5년 이상 소요"],
    current: "$133 (2026.06 기준)",
    target: "$160~180 (애널리스트 컨센서스)",
  },
  "TER": {
    verdict: "장기 유망 소형주 (진입 기회)", verdictColor: "#a855f7", horizon: "3~7년",
    moat: "반도체 테스트 장비 1위 + Universal Robots(협동로봇 1위) 이중 보유",
    thesis: "AI 칩이 나올 때마다 테스트 장비가 먼저 팔리는 구조. Q1 2026 매출 +87% YoY, AI 관련 매출 70%. Universal Robots는 협동로봇 글로벌 점유율 1위. Physical AI + AI 인프라 양쪽 수혜를 받는 유일한 종목.",
    bull: ["AI 칩 출시 = 테스트 장비 선수요 구조적 선행지표","Universal Robots 협동로봇 글로벌 1위","Q1 2026 매출 +87% YoY 고성장 확인","대형 수혜주 대비 상대적 저평가, 관심도 낮음"],
    bear: ["반도체 업황 사이클에 민감","UR 협동로봇 성장 둔화 우려","대형 고객사 2~3곳 집중 리스크","AI 전용 테스트 업체 경쟁 심화 가능성"],
    current: "직접 확인 권장",
    target: "애널리스트 커버리지 확인 권장",
  },
  "ABB": {
    verdict: "장기 매수 (안정형)", verdictColor: "#00ff88", horizon: "5~10년",
    moat: "산업 자동화 100년 인프라 + NVIDIA Isaac Sim 파트너",
    thesis: "산업용 로봇·전력·자동화 수직통합 글로벌 2위. NVIDIA Omniverse 파트너로 시뮬레이션 정확도 99% 달성. 이미 현금흐름 검증된 성숙 기업이면서 AI 로봇 전환 수혜 동시 수혜. 단, SoftBank에 로봇 사업부 매각 중 전략 재편 주의.",
    bull: ["100년 인프라 제조 현장 최대 설치 기반","NVIDIA Isaac Sim 공식 파트너, sim-to-real 99%","안정적 현금흐름 + 배당 지급","전력·자동화·로봇 수직통합으로 AI 전환 수혜"],
    bear: ["로봇 사업부 SoftBank 매각 진행 중 성장 동력 분리 우려","성숙 기업 특성상 고성장 기대 제한","글로벌 제조업 경기 침체 시 동반 부진","중국 경쟁사 가격 경쟁 심화"],
    current: "직접 확인 권장 (NYSE:ABB)",
    target: "애널리스트 컨센서스 확인 권장",
  },
  "PATH": {
    verdict: "관찰 대기 (피벗 성공 여부 확인 필요)", verdictColor: "#ffd700", horizon: "2~5년",
    moat: "엔터프라이즈 RPA 설치 기반 10,000+ 고객",
    thesis: "RPA(로봇 프로세스 자동화) 1위에서 Physical AI 오케스트레이션 소프트웨어로 피벗 시도 중. 엔터프라이즈 시장 깊숙이 설치된 기반이 강점. 현재 주가 역사적 저점 구간.",
    bull: ["엔터프라이즈 10,000+ 설치 기반 전환 비용 높음","AI 에이전트 플랫폼으로 피벗 전략 진행 중","역사적 저점 구간 장기 진입 기회 가능성","SAP·Oracle과 통합으로 엔터프라이즈 고착화"],
    bear: ["AI 에이전트가 RPA 자체를 대체할 수 있는 구조적 위협","성장 둔화 주가 고점 대비 대폭 하락","ServiceNow·Microsoft Power Automate 경쟁 심화","수익성 개선 속도 느림"],
    current: "직접 확인 권장 (NYSE:PATH)",
    target: "피벗 성공 시 상당한 재평가 기대",
  },
  "TSLA": {
    verdict: "고위험 고수익 (핵심 사업 부진 vs. 미래 베팅)", verdictColor: "#ffd700", horizon: "5~10년",
    moat: "FSD 데이터 + Optimus 로봇 + 도조 AI 슈퍼컴퓨터",
    thesis: "2026은 투자의 해 — CapEx $250억+(전년比 3배). Optimus Gen3 양산 시작, Robotaxi 오스틴·달라스·휴스턴 운영 중. 골드만삭스 로보택시 시장 2035년 $4,150억 추산. 그러나 EV 핵심 사업은 BYD·샤오미 경쟁으로 2025년 매출 감소.",
    bull: ["Optimus 휴머노이드 대량양산 선두 주자","Robotaxi 오스틴 등 실제 상업 서비스 운영 중","FSD 실사용 데이터 누적 AI 자율주행 최대 데이터셋","도조 슈퍼컴퓨터 자체 AI 칩 내재화"],
    bear: ["핵심 EV 사업 BYD·샤오미에 점유율 잠식","2025 차량 납품 -16% YoY, 매출 감소","Optimus·Robotaxi 수익화까지 3~5년 이상 소요","일론 머스크 정치 리스크, 브랜드 훼손"],
    current: "$374 (2026.06 기준)",
    target: "$475 (Benchmark 목표가), 변동성 매우 높음",
  },
  "000270": {
    verdict: "장기 매수 (Boston Dynamics 가치 주목)", verdictColor: "#00ff88", horizon: "5~10년",
    moat: "Boston Dynamics 보유 + 글로벌 제조 기반",
    thesis: "현대차는 Boston Dynamics(세계 최고 로봇 기술)를 보유한 완성차. Atlas 로봇 2028년부터 조지아 메타플랜트 연 3만대 생산 예정. PBR 0.4~0.5배 역사적 저평가. Boston Dynamics IPO 시 가치 재평가 기대.",
    bull: ["Boston Dynamics 세계 최고 수준 로봇 기술 보유","PBR 0.4~0.5배 역사적 저평가 구간","Atlas 2028년 양산 계획 조지아 메타플랜트 배치","현대차+기아+BD 복합 포트폴리오"],
    bear: ["기존 EV 전환 비용 부담 중국 경쟁 심화","로봇 사업 수익화까지 2~3년 이상 소요","국내 주식 시장 디스카운트 환율 리스크","지배구조 이슈, 오너 리스크"],
    current: "직접 확인 권장 (KRX:000270)",
    target: "Boston Dynamics 가치 반영 시 상당한 재평가 여지",
  },
  "UBTECH": {
    verdict: "고위험 관찰 (중국 규제 리스크 주의)", verdictColor: "#ffd700", horizon: "3~7년",
    moat: "중국 상장 순수 휴머노이드 희소성",
    thesis: "HKEX 상장 순수 휴머노이드 로봇 기업으로 희소성 존재. 중국 휴머노이드 시장 점유율 빠르게 확장 중. 단 중국 정부 규제·미중 갈등·홍콩 시장 유동성이 복합 리스크.",
    bull: ["상장 순수 휴머노이드 기업 희소성","중국 내 정부 보조금·정책 지원","중국 제조업 자동화 거대 수요 타깃","기술력 빠르게 향상 중"],
    bear: ["중국 규제·미중 갈등 지정학 리스크 상시 존재","홍콩 시장 유동성·접근성 제약","수익성 검증 전 성장 초기 단계","NVIDIA 수출 통제로 칩 조달 불확실성"],
    current: "직접 확인 권장 (HKEX:9888)",
    target: "높은 불확실성, 개별 리서치 필수",
  },
  "SERV": {
    verdict: "고위험 소형주 (매출 급성장, 흑자화 요원)", verdictColor: "#a855f7", horizon: "3~5년",
    moat: "자율배송+병원 로봇 통합 플랫폼",
    thesis: "Q1 2026 매출 $300만(+578% YoY). Diligent Robotics(병원 로봇) 인수로 사업 다각화. 44개 도시 2,000대 운영. 2026 가이던스 $2,600만. 단 영업손실 $1.6억~1.7억 예상 흑자화까지 수년 소요.",
    bull: ["Q1 매출 +578% YoY 폭발 성장","Diligent 인수로 병원+배달 이중 플랫폼","NVIDIA Jetson 기반 기술 생태계 연결","Oppenheimer Outperform 목표가 $20"],
    bear: ["영업손실 $1.6억~1.7억 예상 수년간 적자 지속","시총 $7.2억 소형주 유동성·변동성 위험","경쟁사 많음 (Starship, Nuro 등)","흑자화 시점 불확실"],
    current: "$8.92 (2026.05 기준)",
    target: "$15~26 (애널리스트 레인지), $20 Oppenheimer",
  },
  "MOG.A": {
    verdict: "방산+로봇 복합 수혜 (안정 성장형)", verdictColor: "#00ff88", horizon: "5~10년",
    moat: "정밀 액추에이터 소프트웨어로 대체 불가능한 물리 하드웨어",
    thesis: "방산·항공우주·의료 등 미션크리티컬 정밀 액추에이터 전문기업. Physical AI 확산으로 고성능 액추에이터 수요 구조적 증가. 방산 예산 증가 + 로봇 수요 이중 수혜. 상대적으로 덜 알려진 복합 수혜주.",
    bull: ["정밀 액추에이터 소프트웨어 대체 불가 물리 병목","방산 예산 확대 + 로봇 이중 수혜","미션크리티컬 특성상 고객 전환 비용 극도로 높음","안정적 현금흐름, 꾸준한 배당"],
    bear: ["방산 예산 삭감 시 수익 타격","성장 속도가 순수 AI 플레이 대비 느림","소형~중형주 유동성 제약","새로운 액추에이터 기술 등장 시 리스크"],
    current: "직접 확인 권장 (NYSE:MOG.A)",
    target: "방산+로봇 복합 성장 반영 시 재평가 기대",
  },
  "ISRG": {
    verdict: "장기 강력 매수 (고점比 -30% = 희귀 기회)", verdictColor: "#00ff88", horizon: "7~15년",
    moat: "수술 로봇 60% 점유 + 기기 설치 후 소모품 반복 수익",
    thesis: "Q1 2026 매출 $27.7억(+23% YoY). 전 세계 설치 기수 11,395대(+12% YoY). 2026 수술 건수 가이던스 +13.5~15.5% 상향. 수술의 대부분이 아직 로봇 미사용 — 장기 침투율 상승 여지 막대. 설치 후 소모품·서비스 반복 매출 75%. 월가 평균 목표가 $570 현재比 33% 업사이드.",
    bull: ["수술 로봇 시장 60% 독점 네트워크 효과 강함","수술 건수 성장 가이던스 상향 모멘텀 지속","설치 기반 75% 반복 매출 안정적 수익 구조","고점 대비 -30% 하락 합리적 진입 구간"],
    bear: ["P/E 51배 고평가 논란 상존","Stryker·J&J 등 대형 경쟁사 진입 가속","규제·의료보험 수가 리스크","단기 주가 변동성 높음"],
    current: "$430 (2026.06 기준, 고점比 -30%)",
    target: "$570 (월가 평균 목표가, +33% 업사이드)",
  },
  "OUST": {
    verdict: "고위험 소형주 (라이다 표준화 여부가 관건)", verdictColor: "#a855f7", horizon: "3~7년",
    moat: "라이다 + 스테레오 비전 통합 퍼셉션 스택",
    thesis: "Stereolabs 인수로 라이다+스테레오 카메라+AI 통합 퍼셉션 스택 구성. 매출 +49% YoY. 자율주행·로봇·드론·보안 등 광범위한 응용. 단 라이다 시장은 아직 표준화 전, 경쟁 극심.",
    bull: ["Stereolabs 인수로 완전한 센서 퍼셉션 스택","매출 +49% YoY 고성장","자율주행·로봇·드론·보안 다양한 응용","라이다 가격 하락 시장 확대 수혜"],
    bear: ["라이다 시장 표준 미확정 경쟁 극심 (Luminar, Velodyne 등)","카메라 전용 솔루션(Tesla 등)이 라이다를 대체할 가능성","소형주, 수익성 아직 불분명","단기 주가 변동성 매우 높음"],
    current: "직접 확인 권장 (NASDAQ:OUST)",
    target: "라이다 표준화 성공 시 큰 폭 상승 기대",
  },
  "6954": {
    verdict: "안정형 장기 매수 (일본 로봇 1위)", verdictColor: "#00ff88", horizon: "5~10년",
    moat: "산업용 로봇 글로벌 1위 설치 기반 + NC 컨트롤러 독점",
    thesis: "산업용 로봇 글로벌 점유율 1위, CNC 컨트롤러 시장도 1위. NVIDIA Omniverse 공식 파트너. 제조업 자동화 수요의 구조적 수혜자. 안정적 배당. 단 성장 속도는 순수 AI 플레이 대비 느림.",
    bull: ["산업용 로봇·CNC 글로벌 1위 교체 불가 설치 기반","NVIDIA Omniverse 파트너 AI 로봇 전환 수혜","제조업 자동화 구조적 수요 증가","안정적 배당 일본 우량 기업"],
    bear: ["성장 속도 느림 AI 순수 플레이 대비 밸류에이션 열위","중국 경쟁사(에스톤 등) 가격 경쟁","글로벌 제조업 경기에 민감","TSE 상장 환율 리스크"],
    current: "직접 확인 권장 (TSE:6954)",
    target: "안정 성장 + 배당 복합 수익 기대",
  },
  "AMZN": {
    verdict: "장기 핵심 보유 (AI+로봇+클라우드 복합)", verdictColor: "#00ff88", horizon: "5~10년",
    moat: "AWS 클라우드 1위 + 물류 로봇 최대 실사용 기반",
    thesis: "100만대+ 물류 로봇 운영, 전체 배송 75% 자동화. AWS는 클라우드 AI 인프라 1위(점유율 31%). 세계 최대 실사용 로봇 데이터 보유 Physical AI 모델 학습 최대 경쟁 우위. $255 현재가, 목표가 대부분 $300+.",
    bull: ["AWS AI 클라우드 점유율 1위 (31%)","물류 로봇 100만대+ 실사용 데이터 AI 학습 독점 자산","Zoox 자율주행 로보택시 개발 중","광고·구독·클라우드 다원화 수익 구조"],
    bear: ["반독점 규제 위험 (AWS, 마켓플레이스)","물류 비용 증가 구조 마진 압박 지속","Shopify·Walmart 경쟁 심화","성장 속도 이미 성숙 단계 진입"],
    current: "$255 (2026.06 기준)",
    target: "$300~330 (애널리스트 컨센서스)",
  },
  "PRCT": {
    verdict: "고위험 고성장 소형주 (의료 로봇 틈새 독점)", verdictColor: "#a855f7", horizon: "3~7년",
    moat: "AquaBeam 전립선 수술 로봇 틈새 시장 독점",
    thesis: "Q1 2026 매출 +20.1% YoY. AquaBeam 수술 가이드라인 상향. 내부자 순매수 $1,048만 vs 매도 $684만. 기관 보유 89.46%. 14명 애널리스트 컨센서스 목표가 $41.45(현재比 55% 업사이드).",
    bull: ["전립선 수술 로봇 틈새 시장 독점적 지위","내부자 순매수 지속 경영진 신뢰도 높음","기관 보유 89.46%, 기관 순유입 지속","목표가 $41.45 현재比 55% 업사이드"],
    bear: ["시총 $14.9억 소형주 유동성 위험","EPS 컨센서스 소폭 하회 분기 있음","J&J·Stryker 경쟁 진입 가능성","보험 급여 리스크 미국 의료정책 변화"],
    current: "직접 확인 권장 (NASDAQ:PRCT)",
    target: "$41.45 (14명 컨센서스, 55% 업사이드)",
  },
  "AVGO": {
    verdict: "장기 강력 매수", verdictColor: "#00ff88", horizon: "5~10년",
    moat: "커스텀 AI ASIC + VMware 소프트웨어 이중 해자",
    thesis: "구글·메타 전용 AI ASIC 설계+공급 독점. VMware 인수로 엔터프라이즈 소프트웨어 반복 수익 추가. AI 매출 +46% YoY. 배당 성장률 5년 13.3%. 시총 $1.65조. NVDA 대안·보완재로 포트폴리오 내 필수 보유 후보.",
    bull: ["구글·메타 커스텀 AI ASIC 독점 설계·공급","VMware 인수 엔터프라이즈 반복 수익 이중화","AI 네트워킹 칩(Jericho, Tomahawk) 시장 1위","배당 성장률 13.3% 5년 연속"],
    bear: ["구글·메타 2개사 집중 고객 변심 시 타격","시총 $1.65조 밸류에이션 높음","VMware 통합 실행 리스크","반도체 업황 사이클 노출"],
    current: "$422 (2026.06 기준)",
    target: "$442~500",
  },
  "AMD": {
    verdict: "장기 매수 (NVDA 대안 수요 수혜)", verdictColor: "#00ff88", horizon: "3~7년",
    moat: "x86 CPU 2위 + AI GPU MI300X 2위",
    thesis: "하이퍼스케일러들이 NVDA 공급 다변화를 원해 AMD MI300X 수요 구조적 증가. CPU+GPU 이중 포트폴리오. 클라우드 AI 추론 시장에서 가격 경쟁력 보유.",
    bull: ["NVDA 대안 수요 하이퍼스케일러 공급 다변화 전략","CPU+GPU 이중 포트폴리오 데이터센터 풀스택 공급","MI300X AI 추론 가격 경쟁력","클라우드 AI 시장 2위 구조적 성장"],
    bear: ["NVDA CUDA 생태계 대비 소프트웨어 생태계 열위","데이터센터 업황 사이클 노출","인텔 Gaudi3와 경쟁 심화","시장 점유율 확대 속도 예상 대비 느릴 가능성"],
    current: "직접 확인 권장 (NASDAQ:AMD)",
    target: "애널리스트 컨센서스 확인 권장",
  },
  "MU": {
    verdict: "장기 유망 소형~중형주 (HBM 후발 수혜)", verdictColor: "#a855f7", horizon: "3~7년",
    moat: "미국 유일 메모리 제조사 + HBM3E 양산",
    thesis: "HBM3E 양산 성공, 미국 유일 메모리 제조사로 CHIPS Act 보조금 수혜. UBS 목표가 3배 상향 $696. Micron은 SK하이닉스의 미국 내 대안으로 기관 선호 증가.",
    bull: ["미국 유일 메모리 제조사 CHIPS Act 보조금","HBM3E 양산 성공 AI 수요 본격 수혜","공급부족 사이클에서 가격 결정력 강화","UBS 목표가 $696 강력 매수 레이팅"],
    bear: ["SK하이닉스 대비 HBM 기술 6~12개월 지연","메모리 업황 사이클 2027~2028 공급 과잉 우려","중국 수출 통제 리스크","삼성·SK하이닉스 증설로 가격 하락 가능성"],
    current: "$481 (2026.06 기준)",
    target: "$696 (UBS 목표가)",
  },
  "ANET": {
    verdict: "장기 매수 (단기 고평가 주의)", verdictColor: "#ffd700", horizon: "3~7년",
    moat: "AI 데이터센터 이더넷 스위칭 표준 + 전환 비용 극도로 높음",
    thesis: "Q1 2026 매출 $27.1억(+35% YoY), 순이익률 38%. 2026년 AI 네트워킹 매출 목표 $32.5억으로 상향. 시스코를 추월한 네트워킹 1위. GPU가 어떤 회사 거든 연결하는 스위치는 ANET.",
    bull: ["AI 클러스터 이더넷 스위칭 사실상 표준","Q1 2026 +35% YoY 순이익률 38% 소프트웨어 수준","2026 AI 네트워킹 목표 $32.5억 상향","고객 전환 비용 높아 고착화 강함"],
    bear: ["MS·Meta 2개사 매출 집중 ~40%","P/E ~50배 고평가 성장 미달 시 급락","마진 소폭 압축 (40.7%→38.3%)","공급망 이슈로 단기 가이던스 하회 가능성"],
    current: "$147 (2026.06, 고점比 -18%)",
    target: "$148~187 (DCF~컨센서스)",
  },
  "LITE": {
    verdict: "장기 유망 소형주 (광네트워크 전환 수혜)", verdictColor: "#a855f7", horizon: "3~7년",
    moat: "광트랜시버·실리콘 포토닉스 AI 데이터센터 광통신 핵심",
    thesis: "NVIDIA 실리콘 포토닉스 파트너. 매출 +76.7% YoY. AI 데이터센터 내 광 네트워크 전환(구리→광) 수혜. 장거리 고속 데이터 전송에 필수.",
    bull: ["NVDA 실리콘 포토닉스 공식 파트너","매출 +76.7% YoY 폭발 성장","구리→광 네트워크 전환 구조적 수혜","AI 데이터센터 필수 부품 대체재 제한적"],
    bear: ["광학 부품 시장 경쟁 심화 (II-VI, Coherent 등)","일부 고객 집중 리스크","반도체 업황 사이클 노출","소형주 유동성 위험"],
    current: "직접 확인 권장 (NASDAQ:LITE)",
    target: "애널리스트 컨센서스 확인 권장",
  },
  "POET": {
    verdict: "초고위험 소형주 (기술 검증 전)", verdictColor: "#a855f7", horizon: "5~10년",
    moat: "광학 인터포저 원천 기술 특허 보유",
    thesis: "광학 인터포저로 칩간 데이터 이동 병목 해소. AI 데이터센터 내 광자 통합 회로 잠재적 게임체인저. 단 수익 거의 없는 초기 기술 기업. 기술 상용화 성공 시 대폭 상승, 실패 시 원금 손실 가능.",
    bull: ["광학 인터포저 원천 기술 병목 해소 잠재적 혁신","AI 데이터센터 성장과 함께 수요 확대 가능성","특허 포트폴리오 보유","기술 상용화 성공 시 텐배거 잠재력"],
    bear: ["현재 매출 거의 없는 초기 기술 기업","기술 상용화 시기 불확실","대형 경쟁사(Intel IFS, TSMC) 동일 기술 개발 가능","소형주 극도로 높은 변동성 원금 손실 가능"],
    current: "직접 확인 권장 (NASDAQ:POET)",
    target: "기술 검증 시 대폭 상승 가능 고위험 포지션",
  },
  "CEG": {
    verdict: "장기 강력 매수", verdictColor: "#00ff88", horizon: "5~10년",
    moat: "복제 불가 원전 자산 (허가 수십 년 소요)",
    thesis: "AI 데이터센터 전력 수요는 2030년까지 2배 폭증. 원전은 신규 허가·건설에 수십 년 필요 — 사실상 복제 불가. CEG는 미국 최대 원전 운영사로 빅테크와 20년 장기 PPA 계약 체결 중. EPS 2026~2029년 20%+ 성장 가이던스. 자사주 매입 $50억 인가.",
    bull: ["원전 부지·허가 독점 경쟁자 진입 불가","빅테크 20년 PPA로 수익 고착화","2026~2029 EPS 20%+ 성장 가이던스","Calpine 인수로 가스+원전 복합 포트폴리오"],
    bear: ["밸류에이션 높음 P/E 고평가 구간","규제 리스크 (원전 정책 변화 가능성)","단기 cash-flow 변동성","기술적 포지션 현재 이동평균 하단"],
    current: "$294 (2026.06 기준)",
    target: "$366~481 (컨센서스~내재가치)",
  },
  "VST": {
    verdict: "장기 매수 (AI 전력 직접 수혜)", verdictColor: "#00ff88", horizon: "3~7년",
    moat: "텍사스 전력 시장 독점적 포지션 + 원전+가스 복합",
    thesis: "텍사스 AI 데이터센터 전력 최대 공급자. 원전+가스 복합으로 24/7 안정 전력 공급 가능. 애널리스트 목표가 $231.75로 현재比 48% 업사이드. EPS 성장 +76.8% YoY.",
    bull: ["텍사스 AI 데이터센터 전력 최대 공급자","EPS +76.8% YoY 폭발 성장","애널리스트 목표가 $231.75 현재比 +48%","원전+가스 복합 24/7 안정 전력 공급"],
    bear: ["텍사스 단일 시장 집중 리스크","기상이변(한파·폭염) 시 공급 차질 이력","전력 규제·요금 정책 변화","CEG 대비 원전 비중 낮음"],
    current: "$156 (2026.06 기준)",
    target: "$231 (애널리스트 평균 목표가, +48%)",
  },
  "ETN": {
    verdict: "장기 안정 매수 (전력 인프라 필수재)", verdictColor: "#00ff88", horizon: "5~10년",
    moat: "전력 분배 장비 + 데이터센터 전기 솔루션 수직통합",
    thesis: "그리드부터 칩까지 전력 관리 전체 스택 커버. Boyd Thermal 인수로 냉각까지 수직통합. 데이터센터·전기차·재생에너지 3중 수혜. 안정적 성장 배당 성장 이력.",
    bull: ["전력 인프라 필수재 경기 방어적 특성","그리드→서버 전체 전력 관리 수직통합","데이터센터+EV+재생에너지 3중 수혜","안정적 배당 성장 이력"],
    bear: ["고평가 구간 진입 가능성","성장 속도 AI 순수 플레이 대비 느림","금리 상승 시 인프라 주 밸류에이션 압박","경쟁사 (Schneider Electric 등) 추격"],
    current: "직접 확인 권장 (NYSE:ETN)",
    target: "안정 성장 + 배당 복합 수익 기대",
  },
  "EME": {
    verdict: "중기 매수 (데이터센터 건설 최대 수혜)", verdictColor: "#00ff88", horizon: "3~5년",
    moat: "데이터센터·병원·제조시설 전기기계 시공 1위",
    thesis: "AI 데이터센터 건설 붐의 직접 수혜 시공사. 수주잔고 RPO $13.25억 사상 최고. 2026 EPS $27.41(+8.6% YoY). 52주 수익률 +85%. ROE 35.9%.",
    bull: ["AI 데이터센터 건설 최대 수혜 시공사","수주잔고 $13.25억 사상 최고 가시성 높음","ROE 35.9% 업종 최고 수준 효율","배당+자사주 매입 병행"],
    bear: ["건설 업황 사이클 노출","인력 수급 이슈 숙련 전기 기술자 부족","데이터센터 투자 감소 시 수주 급감","9% 목표가 업사이드 이미 상당히 반영"],
    current: "$849 (2026.06 기준, 52주 +85%)",
    target: "$925 (애널리스트 목표가, +9%)",
  },
  "PWR": {
    verdict: "장기 유망 중형주 (전력망 인프라 투자)", verdictColor: "#a855f7", horizon: "3~7년",
    moat: "전력선·고압송전·데이터센터 전기 인프라 시공 종합",
    thesis: "백로그 $440억 역대 최고. 2026 EPS +16.9% YoY. Dynamic Systems 인수로 기계·배관 확장. 전력망 현대화·데이터센터·재생에너지 3중 수혜.",
    bull: ["백로그 $440억 역대 최고 수년치 일감 확보","전력망+데이터센터+재생에너지 3중 수혜","Dynamic Systems 인수로 사업 확장","2026 EPS +16.9%, 2027 +17.3% 고성장"],
    bear: ["EME 대비 높은 P/E 밸류에이션","규제 인허가·환경 심사 지연 리스크","금리 민감 인프라 주","인력 부족 이슈"],
    current: "직접 확인 권장 (NYSE:PWR)",
    target: "EPS +16.9% 성장 반영 시 재평가 기대",
  },
  "VRT": {
    verdict: "장기 강력 매수 (냉각 인프라 독보적 1위)", verdictColor: "#00ff88", horizon: "5~10년",
    moat: "전력+냉각 통합 인프라 + NVIDIA 공동개발 파트너",
    thesis: "AI GPU 랙 100kW+ 시대에 VRT 없이는 데이터센터 운영 불가. NVIDIA 공동개발 파트너. 주문 잔고 +252%. 2026 매출 목표 $135억. 2027년까지 백로그 확보 완료.",
    bull: ["NVIDIA 공동개발 파트너 사실상 표준","주문 잔고 +252%, 2027년까지 백로그","AI DC 100kW+ 랙 = VRT 없이는 운영 불가","전력+냉각 이중 매출 구조"],
    bear: ["높은 밸류에이션 진입 부담","Dell·HP 등 대형 IT 업체 자체 냉각 개발 가능성","데이터센터 투자 사이클 꺾이면 급락","부채 수준 모니터링 필요"],
    current: "직접 확인 권장 (NYSE:VRT)",
    target: "AI 인프라 슈퍼사이클 핵심 수혜 지속",
  },
  "MOD": {
    verdict: "중기 매수 (액체냉각 전환 직접 수혜)", verdictColor: "#00ff88", horizon: "3~5년",
    moat: "데이터센터 열교환기 5년 백로그 확보",
    thesis: "Q3 2026 매출 +31% YoY. 데이터센터 사업부 5년치 백로그 확보. 향후 2년 50~70% 성장 목표. 공기냉각→액체냉각 전환의 직접 수혜. VRT 대비 덜 알려져 상대적 저평가 가능성.",
    bull: ["데이터센터 사업부 5년 백로그 수익 가시성 높음","향후 2년 50~70% 성장 목표","액체냉각 전환 구조적 수혜","VRT 대비 덜 알려진 저평가 수혜주"],
    bear: ["VRT·NVT 등 경쟁 심화","데이터센터 사업 이외 부문(자동차 등) 성장 둔화","글로벌 제조업 경기에 일부 노출","마진 압박 임시 설비 확장 비용"],
    current: "직접 확인 권장 (NYSE:MOD)",
    target: "50~70% 성장 목표 반영 시 재평가 기대",
  },
  "NVT": {
    verdict: "중기 매수 (액체냉각 전환 수혜)", verdictColor: "#00ff88", horizon: "3~5년",
    moat: "데이터센터 액체냉각 분배 + 고밀도 PDU 전문",
    thesis: "유기적 주문 +65%. AI 팩토리 부상으로 고밀도 전력 분배 수요 급증. VRT·MOD와 함께 액체냉각 전환 3인방. 안정적 배당 지급. 상대적으로 덜 알려진 수혜주.",
    bull: ["유기적 주문 +65% 강한 수요 모멘텀","AI 팩토리 고밀도 PDU 수요 구조적 증가","안정적 배당 + 성장 복합","VRT 대비 낮은 밸류에이션"],
    bear: ["VRT·Eaton 등 대형 경쟁사에 규모 열위","데이터센터 투자 사이클 의존","성장 속도 VRT 대비 느림","중간 규모 기업 M&A 리스크"],
    current: "직접 확인 권장 (NYSE:NVT)",
    target: "애널리스트 컨센서스 확인 권장",
  },
  "CLS": {
    verdict: "장기 유망 중형주 (AI 랙 조립 최대 수혜)", verdictColor: "#a855f7", horizon: "3~7년",
    moat: "하이퍼스케일러 AI 랙 시스템 통합 + 구글 TPU 파트너",
    thesis: "Q1 2026 매출 +53% YoY. 2026 가이던스 매출 $190억(+53%), EPS $10.15(+68%). 구글 TPU 랙 조립 파트너. AI 클러스터 800G·1.6T 이더넷 전환 최대 수혜. 가장 깨끗한 AI 인프라 픽앤샤블로 평가.",
    bull: ["Q1 2026 +53% YoY, 2026 EPS +68% 고성장","구글 TPU 랙 조립 파트너 하이퍼스케일러 밀착","800G/1.6T 이더넷 전환 최대 수혜","운영 레버리지 확대 마진 개선 지속"],
    bear: ["구글 집중 고객 다변화 필요","AI 인프라 지출 감소 시 직격탄","계약 제조사 특성상 마진 제한적","경쟁사(Foxconn, Jabil) 진입 가능성"],
    current: "직접 확인 권장 (NYSE:CLS)",
    target: "EPS +68% 성장 반영 시 재평가 기대",
  },
  "EQIX": {
    verdict: "장기 매수 (10년+ 보유 전략)", verdictColor: "#00ff88", horizon: "7~15년",
    moat: "70개국 입지 + 상호연결 네트워크 효과 물리적 복제 불가",
    thesis: "전력 연결된 도심 데이터센터 부지는 물리적으로 복제 불가. AI 기업·클라우드·통신사 모두 EQIX 내에서 상호연결. Q1 2026 순이익 $4.15억, 2026 가이던스 상향. 90일 주가 +34.7%. REIT 배당 의무.",
    bull: ["70개국 260+ 시설 진입장벽 수십 년","상호연결 네트워크 효과 고객 몰릴수록 가치 상승","REIT 배당 의무 배당+성장 동시 수혜","AI·클라우드·엣지 컴퓨팅 모두 수혜"],
    bear: ["CapEx 급증 ($8~10B Build Bolder) 단기 AFFO 압박","부채비율 1.20 금리 리스크","단기 수익성 지표 부진 가능성","성장 둔화 시 프리미엄 밸류에이션 디레이팅"],
    current: "$1,087 (2026.06, 90일 +34.7%)",
    target: "$1,050~1,110 (Mizuho~내재가치)",
  },
  "DLR": {
    verdict: "장기 매수 (하이퍼스케일 DC 안정형)", verdictColor: "#00ff88", horizon: "5~10년",
    moat: "하이퍼스케일 전용 대형 데이터센터 REIT + 장기 임대",
    thesis: "AI 워크로드 확장에 따라 하이퍼스케일 전용 대형 DC 수요 급증. 장기 임대 계약 구조로 안정적 수익. REIT 배당 의무. EQIX와 함께 DC REIT 양대 산맥.",
    bull: ["하이퍼스케일 AI 수요 직접 수혜","장기 임대 계약 안정적 수익 구조","REIT 배당 의무","글로벌 주요 메트로 데이터센터 포트폴리오"],
    bear: ["EQIX 대비 상호연결 네트워크 효과 약함","CapEx 확대 필요 부채 부담","금리 상승 시 REIT 밸류에이션 압박","하이퍼스케일러 자체 건설 증가 시 수요 감소"],
    current: "직접 확인 권장 (NYSE:DLR)",
    target: "애널리스트 컨센서스 확인 권장",
  },
  "APLD": {
    verdict: "고위험 소형주 (AI 전용 DC 신흥 운영사)", verdictColor: "#a855f7", horizon: "3~7년",
    moat: "AI 특화 하이퍼스케일 데이터센터 운영 전문",
    thesis: "AI 전용 데이터센터 신흥 운영사. 기존 REIT 대비 AI 특화 포지셔닝. 고성장 소형주이나 수익성 검증 전 단계. 부지 확보와 전력 연결이 핵심 경쟁력.",
    bull: ["AI 전용 데이터센터 특화 포지셔닝","기존 대형 REIT 대비 빠른 성장 속도","전력 연결 부지 확보가 핵심 자산","AI 수요 폭증 시 직접 수혜"],
    bear: ["소형주 수익성 검증 전 단계","EQIX·DLR 대형 경쟁사 대비 열위","전력 확보·인허가 지연 리스크","부채 조달 비용 높음"],
    current: "직접 확인 권장 (NASDAQ:APLD)",
    target: "AI 수요 지속 시 고성장 기대 고위험",
  },
};

const FIELDS = {
  physicalAI: {
    id:"physicalAI",label:"Physical AI",emoji:"🤖",
    fieldBottleneck:{sector:"AI 칩 + 시뮬레이션",reason:"로봇 훈련 데이터 생성 비용이 극단적으로 높아, 합성 데이터를 만드는 시뮬레이션과 이를 구동하는 AI 칩이 전체 분야의 핵심 병목"},
    sectors:[
      {id:"chip",name:"AI 칩 / 컴퓨트",emoji:"⚡",isFieldBottleneck:true,bottleneck:"HBM 메모리 & 첨단 패키징 부족",bottleneckDetail:"AI GPU 설계 능력은 충분하지만, CoWoS 패키징 처리량과 HBM 공급이 실제 출하를 막는 구간",
        stocks:[
          {ticker:"000660",name:"SK하이닉스",exchange:"KRX",role:"HBM 글로벌 1위, 병목 구간 직접 장악",note:"Q1 영업이익률 72%, 2026 출하량 완전 매진",type:"bottleneck"},
          {ticker:"NVDA",name:"NVIDIA",exchange:"NASDAQ",role:"AI GPU + 로봇 플랫폼 압도적 1위",note:"AI GPU 85~92% 점유, PEG 0.7 이하",type:"share"},
          {ticker:"QCOM",name:"Qualcomm",exchange:"NASDAQ",role:"엣지 AI SoC, 로봇 온디바이스 추론",note:"P/E 15배 상대적 저평가, 사업 다변화 중",type:"share"},
          {ticker:"TER",name:"Teradyne",exchange:"NASDAQ",role:"AI 칩 테스트 장비 1위 + Universal Robots 보유",note:"Q1 2026 매출 +87% YoY, AI 관련 70%",type:"emerging"},
        ]},
      {id:"sim",name:"시뮬레이션 / 소프트웨어",emoji:"🔬",isFieldBottleneck:true,bottleneck:"Sim-to-Real Gap",bottleneckDetail:"가상 환경 훈련 로봇이 실제 환경에서 다르게 행동하는 문제. NVIDIA-ABB 99% 상관관계 달성",
        stocks:[
          {ticker:"NVDA",name:"NVIDIA",exchange:"NASDAQ",role:"Omniverse / Isaac Sim — 사실상 업계 표준",note:"ABB·FANUC·KUKA·Yaskawa 전부 채택",type:"bottleneck"},
          {ticker:"ABB",name:"ABB",exchange:"NYSE",role:"RobotStudio HyperReality, 가상/물리 동일 펌웨어",note:"시뮬 정확도 99%, SoftBank 로봇 사업 매각 중",type:"share"},
          {ticker:"PATH",name:"UiPath",exchange:"NYSE",role:"RPA → Physical AI 오케스트레이션 피벗 중",note:"역사적 저점, 피벗 성공 여부 관찰 필요",type:"emerging"},
        ]},
      {id:"robot",name:"로봇 플랫폼",emoji:"🦿",isFieldBottleneck:false,bottleneck:"배터리 수명 + 단가",bottleneckDetail:"단가 $50K~250K → $30K~150K 하락 중. 대량 양산 진입이 핵심 관문",
        stocks:[
          {ticker:"TSLA",name:"Tesla",exchange:"NASDAQ",role:"Optimus Gen3 양산 시작, Robotaxi 상업 운영",note:"CapEx $250억+, EV 사업 부진 vs. 로봇 미래 베팅",type:"bottleneck"},
          {ticker:"000270",name:"현대차",exchange:"KRX",role:"Boston Dynamics 보유 (Atlas), 2028 양산 계획",note:"PBR 0.4~0.5배 저평가, BD IPO 옵션",type:"share"},
          {ticker:"UBTECH",name:"UBTECH",exchange:"HKEX",role:"상장 순수 휴머노이드 기업, 중국 시장",note:"중국 규제·지정학 리스크 주의",type:"share"},
          {ticker:"SERV",name:"Serve Robotics",exchange:"NASDAQ",role:"자율배송+병원 로봇, 44개 도시 2,000대",note:"매출 +578% YoY, 적자 지속 소형주",type:"emerging"},
        ]},
      {id:"sensor",name:"센서 / 액추에이터",emoji:"🦾",isFieldBottleneck:false,bottleneck:"힘 제어 & 출력 밀도",bottleneckDetail:"플랫폼·소프트웨어가 대체하기 어려운 하드웨어 구간",
        stocks:[
          {ticker:"MOG.A",name:"Moog",exchange:"NYSE",role:"방산·항공우주 고성능 액추에이터 전문",note:"방산 예산 증가+로봇 이중 수혜, 안정 배당",type:"bottleneck"},
          {ticker:"ISRG",name:"Intuitive Surgical",exchange:"NASDAQ",role:"수술 로봇 da Vinci, 시장 60% 점유",note:"고점比 -30%, 목표가 $570 (+33% 업사이드)",type:"share"},
          {ticker:"OUST",name:"Ouster",exchange:"NASDAQ",role:"라이다+AI 비전 통합 퍼셉션 스택",note:"매출 +49% YoY, 라이다 시장 표준화 관건",type:"emerging"},
        ]},
      {id:"vertical",name:"응용 버티컬",emoji:"🏭",isFieldBottleneck:false,bottleneck:"통합·유지보수 생태계 미성숙",bottleneckDetail:"로봇보다 설치·유지보수·부품 공급망 서비스 레이어가 확산의 걸림돌",
        stocks:[
          {ticker:"6954",name:"FANUC",exchange:"TSE",role:"산업용 로봇 글로벌 1위, NVIDIA 파트너",note:"CNC+로봇 복합 1위, 안정 배당 일본 우량주",type:"bottleneck"},
          {ticker:"AMZN",name:"Amazon",exchange:"NASDAQ",role:"100만대+ 물류 로봇, 전체 배송 75% 자동화",note:"AWS+로봇+배송 복합 수혜, 목표가 $300+",type:"share"},
          {ticker:"ABB",name:"ABB",exchange:"NYSE",role:"산업 자동화 종합, 로봇+전력+자동화 수직통합",note:"글로벌 공장 자동화 Top3, 안정 배당",type:"share"},
          {ticker:"PRCT",name:"PROCEPT BioRobotics",exchange:"NASDAQ",role:"AquaBeam 수술 로봇, 전립선 시술 특화",note:"목표가 $41.45 (+55%), 내부자 순매수 지속",type:"emerging"},
        ]},
    ],
  },
  aiInfra: {
    id:"aiInfra",label:"AI 인프라",emoji:"🏗️",
    fieldBottleneck:{sector:"전력 / 에너지",reason:"데이터센터 전력 수요 2030년까지 2배 폭증, 전력망 확충 속도 미달. GPU·냉각·네트워크 모두 전기 없이는 작동 불가 — 전력이 전체 AI 인프라의 물리적 상한선"},
    sectors:[
      {id:"compute",name:"AI 칩 / 컴퓨트",emoji:"⚡",isFieldBottleneck:false,bottleneck:"HBM · 첨단 패키징 공급 부족",bottleneckDetail:"GPU 설계 능력은 충분하지만 CoWoS 패키징 처리량과 HBM 가용성이 출하를 막는 구간",
        stocks:[
          {ticker:"NVDA",name:"NVIDIA",exchange:"NASDAQ",role:"AI GPU 압도적 1위, Blackwell 풀 양산",note:"AI GPU 85~92% 점유, PEG 0.7 이하 저평가",type:"bottleneck"},
          {ticker:"000660",name:"SK하이닉스",exchange:"KRX",role:"HBM 글로벌 1위 공급사",note:"영업이익률 72% 역대 최고, 목표가 300만원",type:"bottleneck"},
          {ticker:"AVGO",name:"Broadcom",exchange:"NASDAQ",role:"커스텀 AI ASIC + 네트워킹 칩",note:"구글·메타 ASIC 독점, VMware 반복수익 추가",type:"share"},
          {ticker:"AMD",name:"AMD",exchange:"NASDAQ",role:"MI300X GPU, NVDA 대안 수요 흡수",note:"x86+GPU 이중 포트폴리오, 상대적 저평가",type:"share"},
          {ticker:"MU",name:"Micron",exchange:"NASDAQ",role:"HBM3E 양산, 미국 유일 메모리 제조사",note:"CHIPS Act 수혜, UBS 목표가 $696",type:"emerging"},
        ]},
      {id:"networking",name:"네트워킹",emoji:"🔗",isFieldBottleneck:false,bottleneck:"GPU간 대역폭 — 네트워크가 진짜 병목",bottleneckDetail:"AI 학습 클러스터에서 GPU는 데이터를 기다리는 시간이 연산 시간보다 길다",
        stocks:[
          {ticker:"ANET",name:"Arista Networks",exchange:"NYSE",role:"AI 데이터센터 이더넷 스위칭 1위",note:"Q1 +35% YoY, 2026 AI 목표 $32.5억 상향",type:"bottleneck"},
          {ticker:"AVGO",name:"Broadcom",exchange:"NASDAQ",role:"이더넷 AI 패브릭 칩, NVDA 파트너",note:"네트워킹+ASIC 이중 수혜",type:"share"},
          {ticker:"LITE",name:"Lumentum",exchange:"NASDAQ",role:"광트랜시버·레이저, 고속 광네트워크",note:"NVDA 실리콘 포토닉스 파트너, +76.7% YoY",type:"share"},
          {ticker:"POET",name:"POET Technologies",exchange:"NASDAQ",role:"광학 인터포저로 칩간 데이터 이동 병목 해소",note:"원천 기술 보유 초기 기업, 고위험 텐배거 후보",type:"emerging"},
        ]},
      {id:"power",name:"전력 / 에너지",emoji:"🔋",isFieldBottleneck:true,bottleneck:"전력망 부족 — GPU 있어도 전기가 없다",bottleneckDetail:"2026년 데이터센터 전력 수요가 그리드 확충 속도 초과. 원전 없이는 새 데이터센터 가동 불가",
        stocks:[
          {ticker:"CEG",name:"Constellation Energy",exchange:"NASDAQ",role:"원자력 발전, 빅테크에 24/7 청정전력 공급",note:"EPS 20%+ 성장, 내재가치 $481 vs 현재가 $294",type:"bottleneck"},
          {ticker:"VST",name:"Vistra",exchange:"NYSE",role:"원전+가스 복합, 텍사스 데이터센터 전력",note:"EPS +76.8% YoY, 목표가 $231 (+48%)",type:"share"},
          {ticker:"ETN",name:"Eaton",exchange:"NYSE",role:"전력 분배·관리 장비, 그리드→칩 전체 커버",note:"데이터센터+EV+재생에너지 3중 수혜",type:"share"},
          {ticker:"EME",name:"EMCOR Group",exchange:"NYSE",role:"데이터센터 전기·기계·냉각 시공",note:"수주잔고 $13.25억 사상 최고, ROE 35.9%",type:"share"},
          {ticker:"PWR",name:"Quanta Services",exchange:"NYSE",role:"전력선·고압송전·데이터센터 전기 인프라",note:"백로그 $440억 역대 최고, EPS +16.9%",type:"emerging"},
        ]},
      {id:"cooling",name:"냉각 / 열관리",emoji:"❄️",isFieldBottleneck:false,bottleneck:"100kW+ 랙 밀도 — 공랭 한계 돌파",bottleneckDetail:"일반 서버랙 5~15kW인데 AI GPU 랙은 100kW+. 액체 냉각 전환이 데이터센터 운영의 전제조건",
        stocks:[
          {ticker:"VRT",name:"Vertiv",exchange:"NYSE",role:"전력+냉각 통합 인프라, NVIDIA 공동개발 파트너",note:"주문잔고 +252%, 2026 매출 $135억 목표",type:"bottleneck"},
          {ticker:"MOD",name:"Modine Manufacturing",exchange:"NYSE",role:"액체냉각 열교환기, 5년 백로그",note:"DC 매출 +31% QoQ, 향후 2년 50~70% 성장 목표",type:"share"},
          {ticker:"NVT",name:"nVent Electric",exchange:"NYSE",role:"액체냉각 분배·고밀도 PDU 전문",note:"유기적 주문 +65%, 안정 배당",type:"share"},
          {ticker:"CLS",name:"Celestica",exchange:"NYSE",role:"하이퍼스케일러 AI 랙 시스템 통합·조립",note:"Q1 +53% YoY, 구글 TPU 랙 파트너",type:"emerging"},
        ]},
      {id:"reit",name:"데이터센터 REIT",emoji:"🏢",isFieldBottleneck:false,bottleneck:"부지·허가·전력 확보 — 입지가 희소자원",bottleneckDetail:"전력 연결된 부지 확보, 인허가가 신규 데이터센터 확장의 핵심 걸림돌",
        stocks:[
          {ticker:"EQIX",name:"Equinix",exchange:"NASDAQ",role:"글로벌 최대 DC REIT, 70개국 260+시설",note:"내재가치 $1,110 vs 현재가 $1,087, 배당+성장",type:"bottleneck"},
          {ticker:"DLR",name:"Digital Realty",exchange:"NYSE",role:"하이퍼스케일 특화 대형 DC REIT",note:"AI 워크로드 확장 직접 수혜, 장기 임대",type:"share"},
          {ticker:"APLD",name:"Applied Digital",exchange:"NASDAQ",role:"AI 특화 하이퍼스케일 DC 신흥 운영사",note:"AI 전용 DC 고성장 소형주, 수익성 검증 전",type:"emerging"},
        ]},
    ],
  },
};

function TradingViewChart({ ticker }) {
  const ref = useRef(null);
  const symbol = TV_SYMBOL[ticker] || ("NASDAQ:" + ticker);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    s.async = true;
    s.innerHTML = JSON.stringify({ symbol, interval:"D", timezone:"Asia/Seoul", theme:"dark", style:"1", locale:"kr", backgroundColor:"#0a0a0f", width:"100%", height:300, hide_top_toolbar:false, save_image:false });
    ref.current.appendChild(s);
  }, [ticker]);
  return <div style={{ border:"1px solid #1e1e2e", borderRadius:"8px", overflow:"hidden" }}><div ref={ref} style={{ height:300 }} /></div>;
}

function NewsPanel({ ticker, name }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(null);
  useEffect(() => {
    if (fetched === ticker) return;
    setLoading(true); setNews([]); setFetched(ticker);
    fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        model:"claude-sonnet-4-20250514", max_tokens:1000,
        tools:[{type:"web_search_20250305",name:"web_search"}],
        messages:[{role:"user",content:"Search for the latest 4 news articles about " + name + " (ticker: " + ticker + ") stock from the past 2 weeks. Return ONLY a JSON array, no markdown, no preamble. Each item: {\"title\":\"...\",\"summary\":\"한국어로 1문장 요약\",\"date\":\"YYYY-MM-DD\",\"sentiment\":\"positive|neutral|negative\"}"}],
      }),
    }).then(r=>r.json()).then(data=>{
      const text = (data.content||[]).map(c=>c.text||"").join("")||"[]";
      const clean = text.replace(/```json|```/g,"").trim();
      const s=clean.indexOf("["),e=clean.lastIndexOf("]");
      if(s!==-1&&e!==-1) setNews(JSON.parse(clean.slice(s,e+1)));
    }).catch(()=>setNews([])).finally(()=>setLoading(false));
  },[ticker]);
  const sc={positive:"#00ff88",neutral:"#888",negative:"#ff4444"};
  return (
    <div>
      {loading && <div style={{padding:"12px",background:"#0e0e16",borderRadius:"6px",fontSize:"11px",color:"#555"}}>Claude가 뉴스 검색 중...</div>}
      {!loading&&news.length===0&&fetched===ticker&&<div style={{padding:"12px",background:"#0e0e16",borderRadius:"6px",fontSize:"11px",color:"#444"}}>뉴스를 불러오지 못했어요.</div>}
      {news.map((n,i)=>(
        <div key={i} style={{padding:"10px 14px",background:"#0e0e16",border:"1px solid #1e1e2e",borderLeft:"3px solid "+(sc[n.sentiment]||"#555"),borderRadius:"6px",marginBottom:"6px"}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:"8px",marginBottom:"4px"}}>
            <div style={{fontSize:"11px",color:"#ccc",fontWeight:"600",lineHeight:"1.4",flex:1}}>{n.title}</div>
            <span style={{fontSize:"9px",color:sc[n.sentiment]||"#888",whiteSpace:"nowrap"}}>{n.sentiment==="positive"?"▲ 긍정":n.sentiment==="negative"?"▼ 부정":"— 중립"}</span>
          </div>
          <div style={{fontSize:"10px",color:"#666",lineHeight:"1.5"}}>{n.summary}</div>
          <div style={{fontSize:"9px",color:"#333",marginTop:"4px"}}>{n.date}</div>
        </div>
      ))}
    </div>
  );
}

function AnalysisPanel({ ticker }) {
  const a = ANALYSIS[ticker];
  if (!a) return (
    <div style={{padding:"20px",background:"#0e0e16",borderRadius:"8px",textAlign:"center"}}>
      <div style={{fontSize:"24px",marginBottom:"8px"}}>📋</div>
      <div style={{fontSize:"12px",color:"#555"}}>분석 데이터 없음</div>
    </div>
  );
  return (
    <div>
      <div style={{background:"#0e0e16",border:"1px solid "+a.verdictColor+"33",borderLeft:"4px solid "+a.verdictColor,borderRadius:"8px",padding:"14px 16px",marginBottom:"12px"}}>
        <div style={{fontSize:"9px",color:"#555",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"4px"}}>장기투자 평가</div>
        <div style={{fontSize:"16px",fontWeight:"700",color:a.verdictColor,fontFamily:"'Space Grotesk',sans-serif",marginBottom:"6px"}}>{a.verdict}</div>
        <div style={{display:"flex",gap:"16px",flexWrap:"wrap"}}>
          <span style={{fontSize:"10px",color:"#555"}}>⏱ <span style={{color:"#aaa"}}>{a.horizon}</span></span>
          <span style={{fontSize:"10px",color:"#555"}}>🏰 <span style={{color:"#aaa"}}>{a.moat}</span></span>
        </div>
      </div>
      <div style={{background:"#060610",border:"1px solid #1a1a30",borderRadius:"8px",padding:"14px 16px",marginBottom:"12px"}}>
        <div style={{fontSize:"9px",color:"#4a9eff",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>투자 근거</div>
        <div style={{fontSize:"11px",color:"#888",lineHeight:"1.8"}}>{a.thesis}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
        <div style={{background:"#001a0a",border:"1px solid #004020",borderRadius:"8px",padding:"12px"}}>
          <div style={{fontSize:"9px",color:"#00ff88",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>🟢 강세 근거</div>
          {a.bull.map((b,i)=>(
            <div key={i} style={{fontSize:"10px",color:"#667",lineHeight:"1.6",marginBottom:"4px",paddingLeft:"10px",borderLeft:"2px solid #004020"}}>
              <span style={{color:"#00cc66"}}>+</span> {b}
            </div>
          ))}
        </div>
        <div style={{background:"#1a0000",border:"1px solid #400000",borderRadius:"8px",padding:"12px"}}>
          <div style={{fontSize:"9px",color:"#ff4444",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>🔴 리스크</div>
          {a.bear.map((b,i)=>(
            <div key={i} style={{fontSize:"10px",color:"#667",lineHeight:"1.6",marginBottom:"4px",paddingLeft:"10px",borderLeft:"2px solid #400000"}}>
              <span style={{color:"#cc3333"}}>-</span> {b}
            </div>
          ))}
        </div>
      </div>
      <div style={{background:"#0e0e16",border:"1px solid #1e1e2e",borderRadius:"8px",padding:"12px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"8px"}}>
          <div><div style={{fontSize:"9px",color:"#444",textTransform:"uppercase",marginBottom:"3px"}}>현재가</div><div style={{fontSize:"12px",color:"#ccc"}}>{a.current}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:"9px",color:"#444",textTransform:"uppercase",marginBottom:"3px"}}>목표가</div><div style={{fontSize:"12px",color:"#00ff88"}}>{a.target}</div></div>
        </div>
      </div>
      <div style={{marginTop:"10px",fontSize:"9px",color:"#2a2a2a",lineHeight:"1.6"}}>※ 분석 내용은 참고용이며 투자 권유가 아닙니다.</div>
    </div>
  );
}

function StockDetail({ stock, onClose }) {
  const [tab, setTab] = useState("analysis");
  const t = TYPE[stock.type];
  return (
    <div style={{position:"fixed",top:0,right:0,width:"min(520px,100vw)",height:"100vh",background:"#0c0c14",borderLeft:"1px solid #1e1e2e",zIndex:100,display:"flex",flexDirection:"column",boxShadow:"-8px 0 32px rgba(0,0,0,0.6)"}}>
      <div style={{padding:"16px 18px",borderBottom:"1px solid #1a1a2e",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <span style={{fontSize:"20px",fontWeight:"700",color:"#fff",fontFamily:"'Space Grotesk',sans-serif"}}>{stock.ticker}</span>
          <span style={{fontSize:"11px",color:"#666"}}>{stock.exchange}</span>
          <span className="tag" style={{background:t.bg,color:t.text,fontSize:"9px"}}>{t.label}</span>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:"18px"}}>✕</button>
      </div>
      <div style={{padding:"10px 18px",borderBottom:"1px solid #111",flexShrink:0}}>
        <div style={{fontSize:"13px",color:t.nameColor,fontWeight:"600",marginBottom:"2px"}}>{stock.name}</div>
        <div style={{fontSize:"10px",color:"#555",lineHeight:"1.5"}}>{stock.role}</div>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid #1a1a1a",flexShrink:0,background:"#0d0d14"}}>
        {[{id:"analysis",label:"🔍 투자 분석"},{id:"chart",label:"📈 차트"},{id:"news",label:"📰 뉴스"}].map(tb=>(
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{flex:1,padding:"10px",background:"transparent",border:"none",borderBottom:tab===tb.id?"2px solid #4a9eff":"2px solid transparent",color:tab===tb.id?"#fff":"#555",cursor:"pointer",fontSize:"11px",fontFamily:"'IBM Plex Mono',monospace"}}>
            {tb.label}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 18px"}}>
        {tab==="chart" && <TradingViewChart ticker={stock.ticker} />}
        {tab==="news" && <NewsPanel ticker={stock.ticker} name={stock.name} />}
        {tab==="analysis" && <AnalysisPanel ticker={stock.ticker} />}
      </div>
    </div>
  );
}

export default function InvestmentDashboard() {
  const [activeField, setActiveField] = useState("physicalAI");
  const [activeSectorId, setActiveSectorId] = useState("chip");
  const [selectedStock, setSelectedStock] = useState(null);
  const field = FIELDS[activeField];
  const activeSector = field.sectors.find(s=>s.id===activeSectorId)||field.sectors[0];
  const handleFieldChange = (fid) => { setActiveField(fid); setActiveSectorId(FIELDS[fid].sectors[0].id); setSelectedStock(null); };
  const totalAnalyzed = Object.keys(ANALYSIS).length;
  return (
    <div style={{fontFamily:"'IBM Plex Mono','Courier New',monospace",background:"#0a0a0f",minHeight:"100vh",color:"#e0e0e0",padding:"24px",boxSizing:"border-box"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#111}::-webkit-scrollbar-thumb{background:#333}
        .field-tab{padding:8px 20px;cursor:pointer;border:none;font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:700;transition:all 0.2s;background:transparent;color:#555;border-bottom:2px solid transparent;}
        .field-tab:hover{color:#aaa}.field-tab.active{color:#fff;border-bottom:2px solid #4a9eff}
        .sector-btn{background:#12121a;border:1px solid #222;color:#888;padding:9px 12px;cursor:pointer;border-radius:6px;font-family:'IBM Plex Mono',monospace;font-size:11px;transition:all 0.2s;text-align:left;width:100%;}
        .sector-btn:hover{border-color:#444;color:#ccc}.sector-btn.active{background:#1a1a2e;border-color:#4a9eff;color:#fff}.sector-btn.field-bn{border-left:3px solid #ff4444}
        .stock-row{display:grid;grid-template-columns:100px 1fr 1fr;gap:12px;align-items:center;padding:12px 16px;border-radius:8px;margin-bottom:7px;border-width:1px;border-style:solid;cursor:pointer;transition:filter 0.15s;}
        .stock-row:hover{filter:brightness(1.3)}.stock-row.selected{outline:2px solid #4a9eff;outline-offset:1px}
        .tag{display:inline-block;padding:2px 7px;border-radius:3px;font-size:10px;font-weight:700;letter-spacing:0.5px}
        .pulse{animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .type-label{font-size:9px;letter-spacing:2px;text-transform:uppercase;margin:14px 0 6px;display:flex;align-items:center;gap:8px;}
        .type-label::after{content:'';flex:1;height:1px;background:currentColor;opacity:0.15}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99}
      `}</style>
      {selectedStock && <div className="overlay" onClick={()=>setSelectedStock(null)} />}
      {selectedStock && <StockDetail stock={selectedStock} onClose={()=>setSelectedStock(null)} />}
      <div style={{marginBottom:"20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"6px"}}>
          <span style={{fontSize:"11px",color:"#4a9eff",letterSpacing:"3px",textTransform:"uppercase"}}>Investment Analysis</span>
          <span style={{width:"8px",height:"8px",borderRadius:"50%",background:"#00ff88",display:"inline-block"}} className="pulse" />
          <span style={{fontSize:"10px",color:"#555"}}>2026.06</span>
        </div>
        <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:"26px",fontWeight:"700",color:"#fff",letterSpacing:"-0.5px"}}>AI 투자 대시보드</h1>
        <p style={{fontSize:"11px",color:"#555",marginTop:"4px"}}>종목 클릭 → 🔍 투자 분석 · 📈 차트 · 📰 뉴스 &nbsp;|&nbsp; <span style={{color:"#00ff88"}}>전체 {totalAnalyzed}종목 분석 완료</span></p>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid #1a1a1a",marginBottom:"20px",background:"#0d0d14",borderRadius:"8px 8px 0 0",padding:"0 4px"}}>
        {Object.values(FIELDS).map(f=>(
          <button key={f.id} className={"field-tab"+(activeField===f.id?" active":"")} onClick={()=>handleFieldChange(f.id)}>{f.emoji} {f.label}</button>
        ))}
      </div>
      <div style={{background:"linear-gradient(90deg,#1a0000,#120010)",border:"1px solid #440000",borderLeft:"4px solid #ff4444",borderRadius:"8px",padding:"13px 18px",marginBottom:"18px"}}>
        <div style={{fontSize:"10px",color:"#ff4444",letterSpacing:"2px",textTransform:"uppercase",fontWeight:"700",marginBottom:"4px"}}>⚠ 분야 레벨 바틀넥</div>
        <div style={{fontSize:"13px",color:"#ff9999",fontWeight:"600",marginBottom:"4px"}}>{field.fieldBottleneck.sector}</div>
        <div style={{fontSize:"11px",color:"#777",lineHeight:"1.6"}}>{field.fieldBottleneck.reason}</div>
      </div>
      <div style={{display:"flex",gap:"20px",flexWrap:"wrap"}}>
        <div style={{display:"flex",flexDirection:"column",gap:"6px",width:"168px",flexShrink:0}}>
          <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"4px",textTransform:"uppercase"}}>섹터 선택</div>
          {field.sectors.map(s=>(
            <button key={s.id} className={"sector-btn"+(activeSector.id===s.id?" active":"")+(s.isFieldBottleneck?" field-bn":"")} onClick={()=>{setActiveSectorId(s.id);setSelectedStock(null);}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span>{s.emoji} {s.name}</span>
                {s.isFieldBottleneck&&<span style={{fontSize:"9px",color:"#ff4444"}}>●</span>}
              </div>
            </button>
          ))}
          <div style={{marginTop:"14px",display:"flex",flexDirection:"column",gap:"6px"}}>
            <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"2px"}}>종목 구분</div>
            {Object.entries(TYPE).map(([key,t])=>(
              <div key={key} style={{display:"flex",alignItems:"center",gap:"7px"}}>
                <span className="tag" style={{background:t.bg,color:t.text,fontSize:"9px",minWidth:"40px",textAlign:"center"}}>{t.label}</span>
                <span style={{fontSize:"9px",color:"#444"}}>{key==="bottleneck"?"병목 장악":key==="share"?"점유율 1~2위":"고성장 소형주"}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{flex:1,minWidth:"280px"}}>
          <div style={{background:"#0e0e16",border:"1px solid #1e1e2e",borderRadius:"10px",padding:"16px",marginBottom:"14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px"}}>
              <div>
                <div style={{fontSize:"11px",color:"#4a9eff",marginBottom:"4px"}}>{activeSector.emoji} SECTOR</div>
                <div style={{fontSize:"18px",fontWeight:"700",color:"#fff",fontFamily:"'Space Grotesk',sans-serif"}}>{activeSector.name}</div>
              </div>
              {activeSector.isFieldBottleneck&&<span className="tag" style={{background:"#ff4444",color:"#fff",fontSize:"9px"}}>분야 바틀넥</span>}
            </div>
            <div style={{background:"#060610",border:"1px solid #1a1a30",borderLeft:"3px solid #ffd700",borderRadius:"6px",padding:"12px"}}>
              <div style={{fontSize:"9px",color:"#ffd700",letterSpacing:"2px",marginBottom:"6px",textTransform:"uppercase"}}>섹터 바틀넥</div>
              <div style={{fontSize:"13px",color:"#ffd700",fontWeight:"600",marginBottom:"6px"}}>{activeSector.bottleneck}</div>
              <div style={{fontSize:"11px",color:"#666",lineHeight:"1.7"}}>{activeSector.bottleneckDetail}</div>
            </div>
          </div>
          <div style={{fontSize:"10px",color:"#444",marginBottom:"10px"}}>👆 종목 클릭 → 투자 분석 · 차트 · 뉴스</div>
          {["bottleneck","share","emerging"].map(typeKey=>{
            const t=TYPE[typeKey];
            const stocks=activeSector.stocks.filter(s=>s.type===typeKey);
            if(!stocks.length) return null;
            return (
              <div key={typeKey}>
                <div className="type-label" style={{color:t.bg}}>
                  <span className="tag" style={{background:t.bg,color:t.text,fontSize:"9px"}}>{t.label}</span>
                  <span style={{fontSize:"9px"}}>{typeKey==="bottleneck"?"병목 장악 종목":typeKey==="share"?"점유율 기반 종목":"미래 유망 소형주"}</span>
                </div>
                {stocks.map(s=>(
                  <div key={s.ticker+s.name} className={"stock-row"+(selectedStock&&selectedStock.ticker===s.ticker&&selectedStock.name===s.name?" selected":"")}
                    style={{background:t.rowBg,borderColor:selectedStock&&selectedStock.ticker===s.ticker&&selectedStock.name===s.name?"#4a9eff":t.rowBorder,borderLeftWidth:"3px",borderLeftColor:t.rowAccent}}
                    onClick={()=>setSelectedStock(s)}>
                    <div>
                      <div style={{fontSize:"14px",fontWeight:"700",color:"#fff"}}>{s.ticker}</div>
                      <div style={{fontSize:"9px",color:"#444",marginTop:"2px"}}>{s.exchange}</div>
                    </div>
                    <div>
                      <div style={{fontSize:"12px",color:t.nameColor,fontWeight:"600",marginBottom:"3px"}}>{s.name}</div>
                      <div style={{fontSize:"10px",color:"#555",lineHeight:"1.5"}}>{s.role}</div>
                    </div>
                    <div style={{fontSize:"10px",color:"#4a5568",lineHeight:"1.5"}}>{s.note}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{marginTop:"28px",borderTop:"1px solid #111",paddingTop:"14px",fontSize:"9px",color:"#2a2a2a",lineHeight:"1.8"}}>
        ※ 본 자료는 투자 참고용이며 투자 권유가 아닙니다. 종목 선택 전 반드시 개별 리서치를 병행하세요.
      </div>
    </div>
  );
}
