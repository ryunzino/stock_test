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
