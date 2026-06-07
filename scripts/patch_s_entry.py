#!/usr/bin/env python3
"""
S(SentinelOne) 엔트리가 analysis.js에 누락된 경우 자동 삽입.
analysis.js가 레포에 정상 반영되면 이 스크립트는 제거 가능.
"""

with open('src/data/analysis.js', 'r', encoding='utf-8') as f:
    content = f.read()

if '"S":{' in content:
    print('S entry already exists, skipping')
    exit(0)

s_entry = '  "S":{\n    verdict:"매수",verdictColor:"#4a9eff",horizon:"3~5년",\n    moat:"AI 네이티브 EDR 플랫폼 — 단일 에이전트로 엔드포인트·클라우드·아이덴티티 통합 방어",\n    thesis:"AI 기반 자율 위협 탐지(Singularity 플랫폼)로 엔드포인트 보안 시장 점유율을 빠르게 확장 중. CrowdStrike 대비 저렴한 가격 경쟁력과 장애 이슈 반사이익 수혜. 데이터 레이크(Data Lake) 기반 분석이 차별점.",\n    bull:["CrowdStrike 2024년 장애 이후 고객 이탈 수혜","AI 위협 탐지 정확도 경쟁에서 선두권 유지","Data Lake → AI/SIEM 통합으로 플랫폼 확장 가속"],\n    bear:["지속적인 적자 — 흑자 전환 시점 불확실","CrowdStrike·Microsoft Defender와 치열한 가격 경쟁","영업 효율성 개선 속도가 기대보다 느릴 수 있음"],\n    current:"$17~22",target:"$35~50 (3년)",\n    valuation:{per:"적자",pbr:"~5x",ev_ebitda:"적자"},\n    financial:{revenue:"$622M(FY2024)",margin:"비GAAP 운영 -10%",cash:"$1B+"},\n    growth:{revenueGrowth:"+33% YoY",guidanceRevenue:"$815M(FY2025E)",expansion:"클라우드·SIEM·아이덴티티"},\n    competitors:"CrowdStrike, Microsoft Defender, Palo Alto Cortex XDR",\n    catalysts:["CrowdStrike 대체 수요 지속","Singularity AI SIEM 대형 계약","흑자 전환 달성"],\n    entryStrategy:"고성장 사이버보안 2순위. 1~2% 비중. CrowdStrike 보완 포지션으로 편입.",\n  },\n  '

updated = content.replace('"CYBR":{', s_entry + '"CYBR":{', 1)

if '"S":{' not in updated:
    print('ERROR: Failed to insert S entry!')
    exit(1)

with open('src/data/analysis.js', 'w', encoding='utf-8') as f:
    f.write(updated)

print('S entry added to analysis.js successfully!')
