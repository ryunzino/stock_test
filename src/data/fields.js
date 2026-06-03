export const TYPE = {
  bottleneck: { label: "바틀넥", bg: "#ff4444", text: "#fff", rowBg: "#140000", rowBorder: "#440000", rowAccent: "#ff4444", nameColor: "#ff8888" },
  share:      { label: "점유율", bg: "#4a9eff", text: "#fff", rowBg: "#00091a", rowBorder: "#003060", rowAccent: "#4a9eff", nameColor: "#7ab8ff" },
  emerging:   { label: "유망주", bg: "#a855f7", text: "#fff", rowBg: "#0d0014", rowBorder: "#3b0060", rowAccent: "#a855f7", nameColor: "#c084fc" },
};

export const FIELDS = {
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
          {ticker:"PRCT",name:"PROCEPT BioRobotics",exchange:"NASDAQ",role:"AquaBeam 수술 로봇, 전립선 시술 특화",note:"목표가 $41.45 (+55%), 내부자 순매수 지속",type:"emerging"},
        ]},
    ],
  },
  aiInfra: {
    id:"aiInfra",label:"AI 인프라",emoji:"🏗️",
    fieldBottleneck:{sector:"전력 / 에너지",reason:"데이터센터 전력 수요 2030년까지 2배 폭증, 전력망 확충 속도 미달. GPU·냉각·네트워크 모두 전기 없이는 작동 불가 — 전력이 전체 AI 인프라의 물리적 상한선"},
    sectors:[
      {id:"power",name:"전력 / 에너지",emoji:"🔋",isFieldBottleneck:true,bottleneck:"전력망 부족 — GPU 있어도 전기가 없다",bottleneckDetail:"2026년 데이터센터 전력 수요가 그리드 확충 속도 초과. 원전 없이는 새 데이터센터 가동 불가",
        stocks:[
          {ticker:"CEG",name:"Constellation Energy",exchange:"NASDAQ",role:"원자력 발전, 빅테크에 24/7 청정전력 공급",note:"EPS 20%+ 성장, 내재가치 $481 vs 현재가 $294",type:"bottleneck"},
          {ticker:"VST",name:"Vistra",exchange:"NYSE",role:"원전+가스 복합, 텍사스 데이터센터 전력",note:"EPS +76.8% YoY, 목표가 $231 (+48%)",type:"share"},
          {ticker:"ETN",name:"Eaton",exchange:"NYSE",role:"전력 분배·관리 장비, 그리드→칩 전체 커버",note:"데이터센터+EV+재생에너지 3중 수혜",type:"share"},
          {ticker:"EME",name:"EMCOR Group",exchange:"NYSE",role:"데이터센터 전기·기계·냉각 시공",note:"수주잔고 $13.25억 사상 최고, ROE 35.9%",type:"share"},
          {ticker:"PWR",name:"Quanta Services",exchange:"NYSE",role:"전력선·고압송전·데이터센터 전기 인프라",note:"백로그 $440억 역대 최고, EPS +16.9%",type:"emerging"},
          {ticker:"CCJ",name:"Cameco",exchange:"NYSE",role:"글로벌 1위 우라늄 채굴사, 핵연료 공급망 직접 장악",note:"캐나다 최고품위 광산 보유, 장기 계약 비중 확대 중",type:"bottleneck"},
          {ticker:"OKLO",name:"Oklo",exchange:"NYSE",role:"차세대 SMR 스타트업, AI 데이터센터 전용 마이크로 원자로",note:"샘 알트만 회장, DOE 인허가 진행 중, 2027 상업 운전 목표",type:"emerging"},
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
      {id:"optical",name:"광통신 / 실리콘 포토닉스",emoji:"🔦",isFieldBottleneck:false,bottleneck:"800G→1.6T 전환 — 물리적 데이터 이동의 병목",bottleneckDetail:"GPU 클러스터 규모가 커질수록 칩 간 데이터 이동량이 폭증. 구리 케이블 대역폭 한계 → 광트랜시버로만 해결 가능",
        stocks:[
          {ticker:"COHR",name:"Coherent Corp",exchange:"NYSE",role:"광트랜시버 글로벌 1~2위, 레이저→트랜시버 수직통합",note:"800G 풀 양산, 1.6T 2027 전환 수혜",type:"bottleneck"},
          {ticker:"LITE",name:"Lumentum",exchange:"NASDAQ",role:"레이저·광트랜시버, NVDA 실리콘 포토닉스 파트너",note:"+76.7% YoY, 3D 센싱+DC 광네트워크 이중 수혜",type:"share"},
          {ticker:"POET",name:"POET Technologies",exchange:"NASDAQ",role:"광학 인터포저 원천기술 — 칩간 데이터 병목 해소",note:"원천 기술 보유 초기 기업, 고위험 텐배거 후보",type:"emerging"},
        ]},
      {id:"networking",name:"네트워킹 / 스위칭",emoji:"🔗",isFieldBottleneck:false,bottleneck:"GPU 간 대역폭 — 스위치가 클러스터 성능 결정",bottleneckDetail:"AI 학습 클러스터에서 GPU는 데이터를 기다리는 시간이 연산 시간보다 길다. 스위칭 대역폭이 전체 클러스터 효율의 핵심",
        stocks:[
          {ticker:"ANET",name:"Arista Networks",exchange:"NYSE",role:"AI 데이터센터 이더넷 스위칭 압도적 1위",note:"Q1 +35% YoY, 2026 AI 목표 $32.5억 상향",type:"bottleneck"},
          {ticker:"MRVL",name:"Marvell Technology",exchange:"NASDAQ",role:"네트워크 ASIC + DPU, AWS·구글 파트너",note:"FY27 AI 매출 $30억+ 목표, 커스텀 ASIC 성장",type:"share"},
          {ticker:"AVGO",name:"Broadcom",exchange:"NASDAQ",role:"이더넷 AI 패브릭 칩 + 커스텀 ASIC 양대산맥",note:"구글·메타 ASIC 독점, VMware 반복수익 추가",type:"share"},
        ]},
      {id:"memory",name:"메모리 / HBM",emoji:"💾",isFieldBottleneck:false,bottleneck:"HBM 공급 — AI GPU 성능의 물리적 상한",bottleneckDetail:"AI GPU는 HBM 없이 작동 불가. CoWoS 패키징 처리량이 제한되어 공급이 수요를 못 따라감",
        stocks:[
          {ticker:"000660",name:"SK하이닉스",exchange:"KRX",role:"HBM 글로벌 1위, NVDA 독점 공급",note:"영업이익률 72% 역대 최고, 2026 출하량 완전 매진",type:"bottleneck"},
          {ticker:"MU",name:"Micron",exchange:"NASDAQ",role:"HBM3E 양산, 미국 유일 메모리 제조사",note:"CHIPS Act 수혜, UBS 목표가 $696",type:"emerging"},
          {ticker:"005930",name:"삼성전자",exchange:"KRX",role:"HBM3E 양산 재진입, DRAM·NAND 글로벌 1위",note:"HBM 기술 격차 좁히는 중, 파운드리 2나노 GAA 양산 목표",type:"share"},
        ]},
      {id:"compute",name:"AI 칩 / 컴퓨트",emoji:"🧠",isFieldBottleneck:false,bottleneck:"차세대 아키텍처 — Blackwell Ultra·Rubin 전환",bottleneckDetail:"AI 모델 복잡도 기하급수 증가. GPU 아키텍처 전환 주기마다 수요 폭발 — 최상위 레이어지만 하위 인프라 없이는 작동 불가",
        stocks:[
          {ticker:"NVDA",name:"NVIDIA",exchange:"NASDAQ",role:"AI GPU 압도적 1위, Blackwell 풀 양산",note:"AI GPU 85~92% 점유, PEG 0.7 이하 저평가",type:"bottleneck"},
          {ticker:"AMD",name:"AMD",exchange:"NASDAQ",role:"MI300X GPU, NVDA 대안 수요 흡수",note:"x86+GPU 이중 포트폴리오, 상대적 저평가",type:"share"},
        ]},
    ],
  },
  space: {
    id:"space",label:"우주 테마",emoji:"🚀",
    fieldBottleneck:{sector:"발사체 / 로켓",reason:"SpaceX가 글로벌 발사 시장 60%+ 독점. 위성통신·지구관측·우주탐사 모두 발사 비용이 핵심 병목 — 발사 능력 없이는 우주 산업 전체가 불가능. 상장된 경쟁자는 사실상 RKLB 단 하나"},
    sectors:[
      {id:"launch",name:"발사체 / 로켓",emoji:"🚀",isFieldBottleneck:true,bottleneck:"발사 공급 부족 — SpaceX 독점 구조",bottleneckDetail:"SpaceX Falcon 9이 글로벌 발사 시장 60%+ 독점. 위성 발사 대기열 수년치. 상장된 순수 발사체 기업은 RKLB가 유일",
        stocks:[
          {ticker:"RKLB",name:"Rocket Lab",exchange:"NASDAQ",role:"SpaceX 유일한 상장 경쟁자, Neutron 중형 로켓 개발 중",note:"소형 위성 발사 점유율 2위, 위성 부품 수직통합",type:"bottleneck"},
        ]},
      {id:"satcomm",name:"위성 통신 / 인터넷",emoji:"📡",isFieldBottleneck:false,bottleneck:"위성 직접 연결 기술 — 스마트폰 직접 연결이 게임체인저",bottleneckDetail:"기존 통신 인프라 없이 위성으로 스마트폰 직접 연결. 전 세계 미커버리지 50억 명 시장 개방 가능",
        stocks:[
          {ticker:"ASTS",name:"AST SpaceMobile",exchange:"NASDAQ",role:"스마트폰 직접 위성 5G 연결 — 세계 최초",note:"AT&T·Verizon·Vodafone 파트너, BlueBird 위성 배치 중",type:"bottleneck"},
          {ticker:"GSAT",name:"Globalstar",exchange:"NASDAQ",role:"Apple iPhone 위성 SOS·문자 독점 파트너",note:"Apple 대규모 투자 수령, iPhone 14+ 위성 기능 인프라",type:"share"},
          {ticker:"VSAT",name:"ViaSat",exchange:"NASDAQ",role:"항공·해상·군사용 위성 인터넷 전문",note:"인플라이트 Wi-Fi 점유율, ViaSat-3 용량 확대",type:"share"},
        ]},
      {id:"earthobs",name:"지구 관측 / 위성 데이터",emoji:"🛰️",isFieldBottleneck:false,bottleneck:"데이터 취득 주기 — 실시간 지구 모니터링이 병목",bottleneckDetail:"AI 시대 지구 관측 데이터 수요 폭증. 위성 수가 많을수록 재방문 주기가 짧아져 실시간성 확보 — 위성 수가 곧 데이터 품질",
        stocks:[
          {ticker:"PL",name:"Planet Labs",exchange:"NYSE",role:"위성 200개+ 매일 지구 전체 스캔, 데이터 API 제공",note:"농업·환경·방산·금융 다양한 수요처, NASA 계약",type:"share"},
          {ticker:"BKSY",name:"BlackSky",exchange:"NYSE",role:"실시간 위성 이미지 + AI 분석, 방산·정보기관 특화",note:"재방문 시간 업계 최단, 미국 정부 계약 중심",type:"emerging"},
          {ticker:"SPIR",name:"Spire Global",exchange:"NYSE",role:"소형 위성 날씨·선박·항공 데이터 SaaS",note:"NOAA 기상 계약, GPS 신호 대기 굴절 독보적 데이터",type:"emerging"},
        ]},
      {id:"spacedefense",name:"방산 + 우주 인프라",emoji:"🛡️",isFieldBottleneck:false,bottleneck:"위성 지상국 + 극초음속 방어",bottleneckDetail:"우주 인프라를 지상에서 제어하는 지상국 솔루션과 위성·극초음속 무기 방어 시스템이 방산+우주 교차 병목",
        stocks:[
          {ticker:"KTOS",name:"Kratos Defense",exchange:"NASDAQ",role:"소모성 드론 + 위성 지상국 + 극초음속 방어 3중 포트폴리오",note:"트럼프 방산 예산 + 우주 인프라 이중 수혜",type:"share"},
          {ticker:"BWXT",name:"BWX Technologies",exchange:"NYSE",role:"해군 핵잠수함 원자로 독점 + NASA 우주 핵 추진 개발",note:"우주 원자력(NTP) 선도, 규제 장벽 경쟁 진입 불가",type:"emerging"},
        ]},
    ],
  },
  trumpTheme: {
    id:"trumpTheme",label:"트럼프 테마",emoji:"🇺🇸",
    fieldBottleneck:{sector:"방산 / 에너지",reason:"트럼프 정책의 두 핵심 축 — 방산 예산 확대(NATO 2% 압박, 중동·우크라이나 수요)와 화석연료 규제 완화('drill, baby, drill')가 테마 전체의 구조적 동력"},
    sectors:[
      {id:"defense",name:"방산 / 안보",emoji:"🛡️",isFieldBottleneck:true,bottleneck:"F-35·미사일·레이더 공급 부족",bottleneckDetail:"트럼프 방산 예산 증가 + NATO 회원국 2% 국방비 압박. 최첨단 무기 생산능력이 수요를 못 따라가는 구조",
        stocks:[
          {ticker:"LMT",name:"Lockheed Martin",exchange:"NYSE",role:"F-35 전투기·THAAD·미사일 방어 글로벌 1위",note:"방산 매출 $680억, F-35 생산 가속 예정",type:"bottleneck"},
          {ticker:"RTX",name:"RTX (Raytheon)",exchange:"NYSE",role:"PATRIOT 미사일·레이더·제트엔진 종합",note:"우크라이나·중동 수요 + NATO 확대 직접 수혜",type:"share"},
          {ticker:"NOC",name:"Northrop Grumman",exchange:"NYSE",role:"B-21 스텔스 폭격기·우주 방산 전문",note:"차세대 핵 억지력 GBSD·B-21 독점 수주",type:"share"},
          {ticker:"GD",name:"General Dynamics",exchange:"NYSE",role:"지상 전투차량·핵잠수함·IT 방산",note:"버지니아급 핵잠수함 수주 급증, 안정 배당",type:"emerging"},
        ]},
      {id:"energy",name:"에너지 / 화석연료",emoji:"⛽",isFieldBottleneck:true,bottleneck:"LNG 수출 터미널 — 인허가 해제가 핵심",bottleneckDetail:"바이든 시절 동결된 LNG 수출 터미널 허가를 트럼프가 전면 해제. 미국 LNG = 유럽·아시아 에너지 안보의 대안",
        stocks:[
          {ticker:"XOM",name:"ExxonMobil",exchange:"NYSE",role:"미국 최대 석유 메이저, LNG·심해유전 선두",note:"Pioneer 인수로 Permian 최대 운영자, 배당 42년 연속 증가",type:"bottleneck"},
          {ticker:"CVX",name:"Chevron",exchange:"NYSE",role:"미국 2위 석유 메이저, 퍼미안·카자흐스탄",note:"Hess 인수 완료, 자사주 $750억 매입 프로그램",type:"share"},
          {ticker:"OXY",name:"Occidental Petroleum",exchange:"NYSE",role:"버핏 보유 28%+, 탄소 포집 기술 선도",note:"탄소 포집(DAC) 정부 보조금 + 셰일 이중 수혜",type:"share"},
          {ticker:"COP",name:"ConocoPhillips",exchange:"NYSE",role:"미국 최대 독립계 E&P, 저원가 구조",note:"Marathon Oil 인수로 규모 확대, 배당+자사주",type:"emerging"},
          {ticker:"LNG",name:"Cheniere Energy",exchange:"NYSE",role:"미국 최대 LNG 수출사, 트럼프 인허가 해제 직접 수혜 1위",note:"Sabine Pass + Corpus Christi 양대 터미널 독점, 유럽·아시아 20년 장기 계약",type:"bottleneck"},
        ]},
      {id:"finance",name:"금융 규제완화",emoji:"🏦",isFieldBottleneck:false,bottleneck:"자본 규제 완화 — Basel III 후퇴가 핵심",bottleneckDetail:"트럼프 행정부의 Basel III Endgame 규제 철폐로 대형 은행 자본 요건 완화. 자기자본 여유분이 배당·자사주 매입으로 전환",
        stocks:[
          {ticker:"GS",name:"Goldman Sachs",exchange:"NYSE",role:"투자은행 1위, 규제완화·M&A 부활 최대 수혜",note:"트럼프 행정부 인사 다수 출신, IPO·M&A 수수료 급증",type:"bottleneck"},
          {ticker:"JPM",name:"JPMorgan Chase",exchange:"NYSE",role:"미국 최대 은행, 금리+규제완화 이중 수혜",note:"순이익 $500억+ 사상 최고, Dimon CEO 강력 리더십",type:"share"},
          {ticker:"BAC",name:"Bank of America",exchange:"NYSE",role:"미국 2위 은행, 장기금리 민감도 높음",note:"금리 유지 시 NIM 개선 + 자사주 매입 확대",type:"share"},
          {ticker:"WFC",name:"Wells Fargo",exchange:"NYSE",role:"자산한도 해제 임박 — 규제완화 최대 촉매",note:"연준 자산한도 $1.95조 해제 시 대출 폭발 성장",type:"emerging"},
        ]},
      {id:"infra",name:"인프라 / 관세수혜",emoji:"🏭",isFieldBottleneck:false,bottleneck:"미국산 우선주의 — 관세장벽이 핵심 보호막",bottleneckDetail:"트럼프 관세로 외산 철강·중장비 가격 급등. 미국 내 생산업체들이 자동으로 경쟁력 확보",
        stocks:[
          {ticker:"CAT",name:"Caterpillar",exchange:"NYSE",role:"인프라 투자 최대 수혜 중장비 세계 1위",note:"백로그 역대 최고, 데이터센터·광업·인프라 3중 수혜",type:"bottleneck"},
          {ticker:"NUE",name:"Nucor",exchange:"NYSE",role:"미국 최대 철강사, 관세 직접 수혜",note:"25% 철강 관세로 수입산 대비 가격 경쟁력 급등",type:"share"},
          {ticker:"DE",name:"Deere & Company",exchange:"NYSE",role:"농기계·건설장비 세계 1위, 미국산 보호",note:"농업 보조금 확대 + 관세 보호 이중 수혜",type:"share"},
          {ticker:"X",name:"US Steel",exchange:"NYSE",role:"관세 수혜 + 일본제철 인수 무산 후 독자 성장",note:"트럼프 인수 불허 후 미국 독자 노선 재평가",type:"emerging"},
        ]},
      {id:"crypto",name:"크립토 / 디지털자산",emoji:"₿",isFieldBottleneck:false,bottleneck:"비트코인 전략비축 — 정부 수요가 가격 하한선",bottleneckDetail:"트럼프 비트코인 전략비축 행정명령. 미국 정부가 BTC 매도 금지 + 추가 매입 시사. 공급 고정에 정부 수요 추가",
        stocks:[
          {ticker:"COIN",name:"Coinbase",exchange:"NASDAQ",role:"미국 최대 가상화폐 거래소, 친크립토 규제 최대 수혜",note:"SEC 소송 취하 + 규제 명확성 → 기관 자금 유입 가속",type:"bottleneck"},
          {ticker:"MSTR",name:"Strategy (MicroStrategy)",exchange:"NASDAQ",role:"기업 최대 비트코인 보유사 (BTC 20만개+)",note:"BTC 레버리지 ETF 역할, 비트코인 가격 2~3배 추종",type:"share"},
          {ticker:"CLSK",name:"CleanSpark",exchange:"NASDAQ",role:"미국 최대 비트코인 채굴사, 친환경 전력",note:"해시레이트 급성장, 반감기 후 채굴단가 개선 기대",type:"emerging"},
        ]},
      {id:"border",name:"국경 안보 / 이민통제",emoji:"🚧",isFieldBottleneck:false,bottleneck:"이민 구금 시설 — 수용 공간이 병목",bottleneckDetail:"대규모 추방 정책으로 이민 구금 수용 인원 급증. 민간 구금 시설 없이는 집행 불가 — 정부가 최대 고객",
        stocks:[
          {ticker:"GEO",name:"GEO Group",exchange:"NYSE",role:"사설 교도소·이민 구금 시설 1위",note:"트럼프 취임 후 주가 3배+, 이민 구금 계약 급증",type:"bottleneck"},
          {ticker:"CXW",name:"CoreCivic",exchange:"NYSE",role:"사설 교도소·이민 구금 2위",note:"ICE 계약 확대, 수용 인원 사상 최고 수준",type:"share"},
          {ticker:"AXON",name:"Axon Enterprise",exchange:"NASDAQ",role:"테이저·경찰 카메라·소프트웨어 독점",note:"경찰 예산 확대 수혜, AI 증거 플랫폼 고성장",type:"emerging"},
        ]},
    ],
  },
};
