#!/usr/bin/env python3
import yfinance as yf
import json
import os
import sys

TV_SYMBOLS = {
    "LMT":"NYSE:LMT","RTX":"NYSE:RTX","NOC":"NYSE:NOC","GD":"NYSE:GD",
    "XOM":"NYSE:XOM","CVX":"NYSE:CVX","OXY":"NYSE:OXY","COP":"NYSE:COP",
    "GS":"NYSE:GS","JPM":"NYSE:JPM","BAC":"NYSE:BAC","WFC":"NYSE:WFC",
    "CAT":"NYSE:CAT","NUE":"NYSE:NUE","DE":"NYSE:DE","X":"NYSE:X",
    "COIN":"NASDAQ:COIN","MSTR":"NASDAQ:MSTR","CLSK":"NASDAQ:CLSK",
    "GEO":"NYSE:GEO","CXW":"NYSE:CXW","AXON":"NASDAQ:AXON",
    "NVDA":"NASDAQ:NVDA","000660":"KRX:000660","QCOM":"NASDAQ:QCOM","TER":"NASDAQ:TER",
    "ABB":"NYSE:ABB","PATH":"NYSE:PATH","TSLA":"NASDAQ:TSLA","000270":"KRX:000270",
    "UBTECH":"HKEX:9888","SERV":"NASDAQ:SERV","MOG.A":"NYSE:MOG.A","ISRG":"NASDAQ:ISRG",
    "OUST":"NASDAQ:OUST","6954":"TSE:6954","AMZN":"NASDAQ:AMZN","PRCT":"NASDAQ:PRCT",
    "AVGO":"NASDAQ:AVGO","AMD":"NASDAQ:AMD","ANET":"NYSE:ANET",
    "LITE":"NASDAQ:LITE","POET":"NASDAQ:POET","COHR":"NYSE:COHR","MRVL":"NASDAQ:MRVL",
    "RKLB":"NASDAQ:RKLB","ASTS":"NASDAQ:ASTS","GSAT":"NASDAQ:GSAT","VSAT":"NASDAQ:VSAT",
    "PL":"NYSE:PL","BKSY":"NYSE:BKSY","SPIR":"NYSE:SPIR","KTOS":"NASDAQ:KTOS","BWXT":"NYSE:BWXT",
    "CEG":"NASDAQ:CEG","VST":"NYSE:VST",
    "ETN":"NYSE:ETN","EME":"NYSE:EME","PWR":"NYSE:PWR","VRT":"NYSE:VRT",
    "MOD":"NYSE:MOD","NVT":"NYSE:NVT","CLS":"NYSE:CLS","EQIX":"NASDAQ:EQIX",
    "DLR":"NYSE:DLR","APLD":"NASDAQ:APLD",
    "GPCR":"NASDAQ:GPCR","ALT":"NASDAQ:ALT","RMD":"NYSE:RMD",
    "AZN":"NASDAQ:AZN","HIMS":"NYSE:HIMS",
    "MU":"NASDAQ:MU","ONTO":"NYSE:ONTO",
    "MSFT":"NASDAQ:MSFT","ANSS":"NASDAQ:ANSS","ADSK":"NASDAQ:ADSK",
    "HON":"NASDAQ:HON",
    "TDY":"NYSE:TDY","KEYS":"NYSE:KEYS","MVIS":"NASDAQ:MVIS",
    "TNDM":"NASDAQ:TNDM",
    "NEE":"NYSE:NEE","NRG":"NYSE:NRG",
    "APH":"NYSE:APH","JCI":"NYSE:JCI","SMCI":"NASDAQ:SMCI",
    "IRM":"NYSE:IRM","AMT":"NYSE:AMT",
    "VIAV":"NASDAQ:VIAV","AAOI":"NASDAQ:AAOI",
    "CSCO":"NASDAQ:CSCO","INFN":"NASDAQ:INFN",
    "WDC":"NASDAQ:WDC","STX":"NASDAQ:STX",
    "TSM":"NYSE:TSM","INTC":"NASDAQ:INTC","AEHR":"NASDAQ:AEHR",
    "BA":"NYSE:BA","MNTS":"NASDAQ:MNTS",
    "HII":"NYSE:HII",
    "MARA":"NASDAQ:MARA","RIOT":"NASDAQ:RIOT","HUT":"NASDAQ:HUT",
    "CACI":"NYSE:CACI",
    "EOG":"NYSE:EOG","AR":"NASDAQ:AR",
    "MS":"NYSE:MS","SCHW":"NYSE:SCHW",
    "CLF":"NYSE:CLF","STLD":"NASDAQ:STLD",
    "RGEN":"NASDAQ:RGEN","BIO":"NYSE:BIO","FLGT":"NASDAQ:FLGT",
    "GEHC":"NASDAQ:GEHC","VEEV":"NYSE:VEEV","NVCR":"NASDAQ:NVCR","ACCD":"NASDAQ:ACCD",
    "EDIT":"NASDAQ:EDIT","FATE":"NASDAQ:FATE","VERV":"NASDAQ:VERV",
    "PFE":"NYSE:PFE","SNY":"NASDAQ:SNY",
    "MDT":"NYSE:MDT","PHG":"NYSE:PHG","IRTC":"NASDAQ:IRTC",
    "CVS":"NYSE:CVS","WBA":"NASDAQ:WBA","TDOC":"NYSE:TDOC",
    "CCJ":"NYSE:CCJ","OKLO":"NYSE:OKLO","005930":"KRX:005930",
    "LNG":"NYSE:LNG",
    "RXRX":"NASDAQ:RXRX","SDGR":"NASDAQ:SDGR","ABSI":"NASDAQ:ABSI",
    "ILMN":"NASDAQ:ILMN","PACB":"NASDAQ:PACB","TXG":"NASDAQ:TXG",
    "LLY":"NYSE:LLY","NVO":"NYSE:NVO","VKTX":"NASDAQ:VKTX",
    "TEM":"NASDAQ:TEM","GH":"NASDAQ:GH","EXAS":"NASDAQ:EXAS",
    "CRSP":"NASDAQ:CRSP","BEAM":"NASDAQ:BEAM","NTLA":"NASDAQ:NTLA",
    "GOOGL":"NASDAQ:GOOGL","CRWV":"NASDAQ:CRWV","HPE":"NYSE:HPE",
    "VIVO":"NASDAQ:VIVO",
}

def tv_to_yahoo(tv_sym):
    if ':' not in tv_sym:
        return tv_sym
    exchange, sym = tv_sym.split(':', 1)
    if exchange == 'KRX':
        return sym + '.KS'
    if exchange == 'TSE':
        return sym + '.T'
    if exchange == 'HKEX':
        return sym + '.HK'
    return sym.replace('.', '-')

yahoo_map = {ticker: tv_to_yahoo(tv_sym) for ticker, tv_sym in TV_SYMBOLS.items()}
yahoo_syms = list(set(yahoo_map.values()))

print(f"Downloading {len(yahoo_syms)} symbols from Yahoo Finance...")
try:
    hist = yf.download(yahoo_syms, period="1y", interval="1wk",
                       progress=False, auto_adjust=True, threads=True)
except Exception as e:
    print(f"Download error: {e}", file=sys.stderr)
    sys.exit(1)

closes = hist["Close"] if len(yahoo_syms) > 1 else hist[["Close"]].rename(columns={"Close": yahoo_syms[0]})

data = {}
for ticker, yahoo_sym in yahoo_map.items():
    if yahoo_sym not in closes.columns:
        print(f"  skip {ticker} ({yahoo_sym}): not in result")
        continue
    series = closes[yahoo_sym].dropna()
    if len(series) == 0:
        continue
    data[ticker] = [
        {"time": int(t.timestamp()), "value": round(float(v), 4)}
        for t, v in series.items()
    ]

print(f"Fetched {len(data)}/{len(yahoo_map)} tickers OK")

os.makedirs("public", exist_ok=True)
with open("public/stockdata.json", "w") as f:
    json.dump(data, f, separators=(',', ':'))
print("Saved public/stockdata.json")
