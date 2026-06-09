#!/usr/bin/env python3
"""
analysis.js + fields.js를 파싱해 stock_auto가 읽을 public/signals.json 생성.

verdictColor → action/strength 매핑:
  #00ff88 (초록)  → BUY         strength 0.9
  #4a9eff (파랑)  → BUY         strength 0.7
  #ffaa00 (주황)  → HOLD        strength 0.5
  #a855f7 (보라)  → SPECULATIVE strength 0.3
  #ff4444 (빨강)  → AVOID       strength 0.1
"""
import json
import os
import re
import sys
from collections import Counter
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

COLOR_MAP = {
    "#00ff88": ("BUY",         0.9),
    "#4a9eff": ("BUY",         0.7),
    "#ffaa00": ("HOLD",        0.5),
    "#a855f7": ("SPECULATIVE", 0.3),
    "#ff4444": ("AVOID",       0.1),
}

# KRX 세부 시장 구분 (KOSPI / KOSDAQ)
KRX_MARKET = {
    "005930": "KOSPI",   # 삼성전자
    "000660": "KOSPI",   # SK하이닉스
    "000270": "KOSPI",   # 기아
    "006400": "KOSPI",   # 삼성SDI
    "373220": "KOSPI",   # LG에너지솔루션
    "247540": "KOSDAQ",  # 에코프로비엠
    "003670": "KOSPI",   # 포스코퓨처엠
    "066970": "KOSDAQ",  # L&F
}


def parse_analysis(path: str) -> dict:
    """analysis.js에서 ticker → {verdictColor, verdict} 추출."""
    text = open(path, encoding="utf-8").read()

    ticker_re  = re.compile(r'"([A-Z0-9.]+)":\s*\{')
    verdict_re = re.compile(r'verdict:\s*"([^"]+)"')
    color_re   = re.compile(r'verdictColor:\s*"(#[0-9a-fA-F]+)"')

    positions = [(m.group(1), m.start()) for m in ticker_re.finditer(text)]
    result = {}

    for i, (ticker, start) in enumerate(positions):
        end   = positions[i + 1][1] if i + 1 < len(positions) else len(text)
        block = text[start:end]

        verdict_m = verdict_re.search(block)
        color_m   = color_re.search(block)

        if verdict_m and color_m:
            result[ticker] = {
                "verdict":      verdict_m.group(1),
                "verdictColor": color_m.group(1).lower(),
            }

    return result


def parse_fields(path: str) -> dict:
    """fields.js에서 ticker → {exchange, type} 추출."""
    text = open(path, encoding="utf-8").read()

    ticker_re   = re.compile(r'ticker:"([^"]+)"')
    exchange_re = re.compile(r'exchange:"([^"]+)"')
    type_re     = re.compile(r'type:"([^"]+)"')

    result = {}
    for m in ticker_re.finditer(text):
        ticker = m.group(1)
        if ticker in result:   # 중복 탭 등장 종목 — 첫 번째만 사용
            continue
        # 해당 종목 항목 블록 (~400자)
        block = text[m.start(): m.start() + 400]
        exchange_m = exchange_re.search(block)
        type_m     = type_re.search(block)
        if exchange_m and type_m:
            result[ticker] = {
                "exchange": exchange_m.group(1),
                "type":     type_m.group(1),
            }

    return result


def resolve_market(exchange: str, ticker: str) -> str:
    if exchange == "KRX":
        return KRX_MARKET.get(ticker, "KOSPI")
    return exchange


def build_signals(analysis: dict, fields: dict) -> list:
    signals = []

    for ticker, meta in fields.items():
        a = analysis.get(ticker)
        if not a:
            continue

        action, strength = COLOR_MAP.get(a["verdictColor"], ("HOLD", 0.5))
        market = resolve_market(meta["exchange"], ticker)

        signals.append({
            "symbol":   ticker,
            "market":   market,
            "action":   action,
            "strength": strength,
            "reason":   a["verdict"],
        })

    # strength 내림차순 정렬 (BUY 0.9 먼저)
    signals.sort(key=lambda x: -x["strength"])
    return signals


def main():
    analysis_path = os.path.join(ROOT, "src", "data", "analysis.js")
    fields_path   = os.path.join(ROOT, "src", "data", "fields.js")
    output_path   = os.path.join(ROOT, "public", "signals.json")

    for p in (analysis_path, fields_path):
        if not os.path.exists(p):
            print(f"ERROR: 파일 없음 — {p}", file=sys.stderr)
            sys.exit(1)

    print("Parsing analysis.js ...")
    analysis = parse_analysis(analysis_path)
    print(f"  → {len(analysis)}개 티커 분석 데이터 확인")

    print("Parsing fields.js ...")
    fields = parse_fields(fields_path)
    print(f"  → {len(fields)}개 티커 종목 메타데이터 확인")

    signals = build_signals(analysis, fields)
    print(f"  → {len(signals)}개 신호 생성")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    output = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "signals": signals,
    }
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Saved → {output_path}")

    counts = Counter(s["action"] for s in signals)
    for action in ("BUY", "HOLD", "SPECULATIVE", "AVOID"):
        print(f"  {action:<12}: {counts.get(action, 0)}개")


if __name__ == "__main__":
    main()
