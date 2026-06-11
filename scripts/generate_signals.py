#!/usr/bin/env python3
"""
analysis.js + fields.js + stockdata.json 을 파싱해
stock_auto가 읽을 public/signals.json 생성.

strength 계산 (0.05~0.95):
  기본점수 (verdictColor)
  × type 계수  (bottleneck 1.0 / share 0.85 / emerging 0.70)
  + 재무 보정  (PEG, 성장률, 부채, 영업마진, EPS)
  + 모멘텀 보정 (최근 12주 수익률 분위)
"""
import json
import os
import re
import sys
from collections import Counter
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# verdictColor → (action, 기본점수)
COLOR_MAP = {
    "#00ff88": ("BUY",         0.85),
    "#4a9eff": ("BUY",         0.65),
    "#ffaa00": ("HOLD",        0.40),
    "#a855f7": ("SPECULATIVE", 0.20),
    "#ff4444": ("AVOID",       0.05),
}

# type → 곱셈 계수
TYPE_COEFF = {
    "bottleneck": 1.00,
    "share":      0.85,
    "emerging":   0.70,
}

KRX_MARKET = {
    "005930": "KOSPI",
    "000660": "KOSPI",
    "000270": "KOSPI",
    "006400": "KOSPI",
    "373220": "KOSPI",
    "247540": "KOSDAQ",
    "003670": "KOSPI",
    "066970": "KOSDAQ",
}


# ── 재무 파싱 헬퍼 ────────────────────────────────────────

def _avg_numbers(text):
    """텍스트에서 부호 포함 숫자 추출 후 평균. 없으면 None."""
    nums = re.findall(r'[+-]?\d+(?:\.\d+)?', text)
    if not nums:
        return None
    return sum(float(n) for n in nums) / len(nums)


def _parse_peg(block):
    m = re.search(r'peg:\s*"([^"]+)"', block)
    if not m:
        return None
    val = m.group(1).strip()
    if val.upper() in ('N/A', '-', ''):
        return None
    nums = re.findall(r'\d+(?:\.\d+)?', val)
    return float(nums[0]) if nums else None


def _parse_revenue_yoy(block):
    m = re.search(r'revenueYoy:\s*"([^"]+)"', block)
    return _avg_numbers(m.group(1)) if m else None


def _parse_debt_high(block):
    m = re.search(r'debtRatio:\s*"([^"]+)"', block)
    return bool(m) and "높음" in m.group(1)


def _parse_operating_margin(block):
    m = re.search(r'operatingMargin:\s*"([^"]+)"', block)
    return _avg_numbers(m.group(1)) if m else None


def _parse_eps_negative(block):
    m = re.search(r'eps:\s*"([^"]+)"', block)
    if not m:
        return False
    val = m.group(1)
    if "적자" in val:
        return True
    if re.search(r'-[\$₩]?\d', val):   # -$0.5, -₩1,000 형태
        return True
    nums = re.findall(r'[+-]?\d+(?:\.\d+)?', val)
    return bool(nums) and float(nums[0]) < 0


# ── 메인 파싱 함수 ────────────────────────────────────────

def parse_analysis(path):
    """analysis.js → ticker: {verdictColor, verdict, 재무지표} 딕셔너리."""
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
        if not (verdict_m and color_m):
            continue

        result[ticker] = {
            "verdict":         verdict_m.group(1),
            "verdictColor":    color_m.group(1).lower(),
            "peg":             _parse_peg(block),
            "revenueYoy":      _parse_revenue_yoy(block),
            "debtHigh":        _parse_debt_high(block),
            "operatingMargin": _parse_operating_margin(block),
            "epsNegative":     _parse_eps_negative(block),
        }

    return result


def parse_fields(path):
    """fields.js → ticker: {exchange, type} 딕셔너리."""
    text = open(path, encoding="utf-8").read()

    ticker_re   = re.compile(r'ticker:"([^"]+)"')
    exchange_re = re.compile(r'exchange:"([^"]+)"')
    type_re     = re.compile(r'type:"([^"]+)"')

    result = {}
    for m in ticker_re.finditer(text):
        ticker = m.group(1)
        if ticker in result:   # 복수 탭 중복 등장 — 첫 번째만 사용
            continue
        block = text[m.start(): m.start() + 400]
        ex_m = exchange_re.search(block)
        ty_m = type_re.search(block)
        if ex_m and ty_m:
            result[ticker] = {"exchange": ex_m.group(1), "type": ty_m.group(1)}

    return result


def load_momentum(stockdata_path, weeks=12):
    """stockdata.json → ticker: 최근 N주 수익률(%) 딕셔너리."""
    if not os.path.exists(stockdata_path):
        return {}

    with open(stockdata_path, encoding="utf-8") as f:
        data = json.load(f)

    result = {}
    for ticker, series in data.items():
        if len(series) < weeks + 1:
            continue
        s = sorted(series, key=lambda d: d["time"])
        base   = s[-(weeks + 1)]["value"]
        latest = s[-1]["value"]
        if base > 0:
            result[ticker] = (latest - base) / base * 100

    return result


def _momentum_adj(ticker, momentum_map):
    """상위 25% → +0.08 / 하위 25% → -0.08 / 나머지 → 0."""
    if not momentum_map or ticker not in momentum_map:
        return 0.0
    vals = sorted(momentum_map.values())
    n    = len(vals)
    p25  = vals[n // 4]
    p75  = vals[(3 * n) // 4]
    pct  = momentum_map[ticker]
    if pct >= p75:
        return 0.08
    if pct <= p25:
        return -0.08
    return 0.0


def compute_strength(a, field_type, mom_adj):
    """
    strength = clamp(기본점수 × type계수 + 재무보정 + 모멘텀보정, 0.05, 0.95)
    """
    _, base  = COLOR_MAP.get(a["verdictColor"], ("HOLD", 0.40))
    coeff    = TYPE_COEFF.get(field_type, 0.85)

    fin = 0.0
    # PEG < 1: 저평가 가점
    if a["peg"] is not None and a["peg"] < 1.0:
        fin += 0.05
    # 매출 성장률 30%↑: 고성장 가점
    if a["revenueYoy"] is not None and a["revenueYoy"] >= 30:
        fin += 0.05
    # 부채 높음: 감점
    if a["debtHigh"]:
        fin -= 0.05
    # 영업마진 20%↑: 수익성 가점
    if a["operatingMargin"] is not None and a["operatingMargin"] >= 20:
        fin += 0.03
    # 영업마진 음수: 감점
    elif a["operatingMargin"] is not None and a["operatingMargin"] < 0:
        fin -= 0.03
    # EPS 적자: 감점
    if a["epsNegative"]:
        fin -= 0.03

    raw = base * coeff + fin + mom_adj
    return round(min(max(raw, 0.05), 0.95), 3)


def resolve_market(exchange, ticker):
    if exchange == "KRX":
        return KRX_MARKET.get(ticker, "KOSPI")
    return exchange


def build_signals(analysis, fields, momentum_map):
    signals = []

    for ticker, meta in fields.items():
        a = analysis.get(ticker)
        if not a:
            continue

        action, _ = COLOR_MAP.get(a["verdictColor"], ("HOLD", 0.40))
        mom_adj   = _momentum_adj(ticker, momentum_map)
        strength  = compute_strength(a, meta["type"], mom_adj)
        market    = resolve_market(meta["exchange"], ticker)

        signals.append({
            "symbol":   ticker,
            "market":   market,
            "action":   action,
            "strength": strength,
            "reason":   a["verdict"],
        })

    signals.sort(key=lambda x: -x["strength"])
    return signals


def main():
    analysis_path  = os.path.join(ROOT, "src", "data", "analysis.js")
    fields_path    = os.path.join(ROOT, "src", "data", "fields.js")
    stockdata_path = os.path.join(ROOT, "public", "stockdata.json")
    output_path    = os.path.join(ROOT, "public", "signals.json")

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

    print("Loading momentum (stockdata.json) ...")
    momentum_map = load_momentum(stockdata_path)
    if momentum_map:
        print(f"  → {len(momentum_map)}개 티커 모멘텀 계산 완료")
    else:
        print("  → stockdata.json 없음 — 모멘텀 보정 미적용")

    signals = build_signals(analysis, fields, momentum_map)
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

    print("\n--- strength 상위 5개 ---")
    for s in signals[:5]:
        print(f"  {s['symbol']:<12} {s['action']:<12} {s['strength']:.3f}  {s['reason']}")


if __name__ == "__main__":
    main()
