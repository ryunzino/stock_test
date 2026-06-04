import { useState, useEffect, useRef } from "react";
import { createChart, ColorType } from "lightweight-charts";
import { TV_SYMBOL } from './data/symbols';
import { TYPE, FIELDS } from './data/fields';
import { ANALYSIS } from './data/analysis';

const now = new Date();
const CURRENT_DATE = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}`;
const TOTAL_ANALYZED = [...new Set(
  Object.values(FIELDS).flatMap(f => f.sectors.flatMap(s => s.stocks.map(st => st.ticker)))
)].length;

const VERDICT_GROUPS = (() => {
  const seen = new Set();
  const groups = [
    {color:"#00ff88",colors:["#00ff88","#00cc66"],bg:"#001a0a",border:"#004020",label:"매수",emoji:"🟢",stocks:[]},
    {color:"#ffd700",colors:["#ffd700"],bg:"#1a1500",border:"#403500",label:"중립 / 관찰",emoji:"🟡",stocks:[]},
    {color:"#a855f7",colors:["#a855f7"],bg:"#0d0014",border:"#3b0060",label:"고위험 베팅",emoji:"🟣",stocks:[]},
    {color:"#ff4444",colors:["#ff4444"],bg:"#1a0000",border:"#400000",label:"주의 / 위험",emoji:"🔴",stocks:[]},
  ];
  Object.values(FIELDS).forEach(field => {
    field.sectors.forEach(sector => {
      sector.stocks.forEach(stock => {
        if (seen.has(stock.ticker)) return;
        seen.add(stock.ticker);
        const a = ANALYSIS[stock.ticker];
        if (!a) return;
        const g = groups.find(g => g.colors.includes(a.verdictColor)) || groups[1];
        g.stocks.push({...stock, verdict:a.verdict, horizon:a.horizon, fieldLabel:field.label, fieldEmoji:field.emoji, verdictColor:a.verdictColor});
      });
    });
  });
  return groups;
})();

const COMPARE_COLORS = ["#4a9eff","#ff6b6b","#ffd700","#a855f7","#00ff88"];

function MetricGrid({ items, color }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginTop:'8px' }}>
      {items.map(([label, value]) => (
        <div key={label} style={{ background:'rgba(255,255,255,0.04)', padding:'8px 10px', borderRadius:'6px' }}>
          <div style={{ fontSize:'10px', color:'#555', marginBottom:'3px' }}>{label}</div>
          <div style={{ fontSize:'12px', color: color || '#ccc', fontWeight:600 }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

function InfoSection({ title, content, color, icon }) {
  return (
    <div style={{ marginTop:'10px' }}>
      <div style={{ fontSize:'10px', color: color || '#aaa', fontWeight:600, marginBottom:'5px', letterSpacing:'1px', textTransform:'uppercase' }}>
        {icon && <span style={{ marginRight:'5px' }}>{icon}</span>}{title}
      </div>
      {Array.isArray(content)
        ? <ul style={{ margin:0, paddingLeft:'14px' }}>{content.map((c,i) => <li key={i} style={{ fontSize:'11px', color:'#777', marginBottom:'3px', lineHeight:'1.5' }}>{c}</li>)}</ul>
        : <div style={{ fontSize:'11px', color:'#777', lineHeight:'1.6' }}>{content}</div>
      }
    </div>
  );
}

function TradingViewChart({ ticker, height=300 }) {
  const ref = useRef(null);
  const symbol = TV_SYMBOL[ticker] || ("NASDAQ:" + ticker);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    s.async = true;
    s.innerHTML = JSON.stringify({ symbol, interval:"D", timezone:"Asia/Seoul", theme:"dark", style:"1", locale:"kr", backgroundColor:"#0a0a0f", width:"100%", height, hide_top_toolbar:false, save_image:false });
    ref.current.appendChild(s);
    return () => { if (ref.current) ref.current.innerHTML = ""; };
  }, [ticker]);
  return <div style={{ border:"1px solid #1e1e2e", borderRadius:"8px", overflow:"hidden" }}><div ref={ref} style={{ height }} /></div>;
}

function NewsPanel({ ticker, name }) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || "";
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(null);
  const [error, setError] = useState(false);
  const fetchNews = () => {
    setLoading(true); setNews([]); setFetched(ticker); setError(false);
    fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{
        "Content-Type":"application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model:"claude-sonnet-4-6", max_tokens:1000,
        tools:[{type:"web_search_20250305",name:"web_search"}],
        messages:[{role:"user",content:"Search for the latest 4 news articles about " + name + " (ticker: " + ticker + ") stock from the past 2 weeks. Return ONLY a JSON array, no markdown, no preamble. Each item: {\"title\":\"...\",\"summary\":\"한국어로 1문장 요약\",\"date\":\"YYYY-MM-DD\",\"sentiment\":\"positive|neutral|negative\"}"}],
      }),
    }).then(r=>r.json()).then(data=>{
      const text = (data.content||[]).map(c=>c.text||"").join("")||"[]";
      const clean = text.replace(/```json|```/g,"").trim();
      const s=clean.indexOf("["),e=clean.lastIndexOf("]");
      if(s!==-1&&e!==-1) setNews(JSON.parse(clean.slice(s,e+1)));
      else setError(true);
    }).catch(()=>setError(true)).finally(()=>setLoading(false));
  };
  useEffect(() => {
    if (!apiKey || fetched === ticker) return;
    fetchNews();
  },[ticker]);
  if (!apiKey) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 20px",gap:"12px",textAlign:"center"}}>
      <div style={{fontSize:"32px"}}>🔧</div>
      <div style={{fontSize:"13px",color:"#aaa",fontWeight:"600"}}>뉴스 기능 준비 중</div>
      <div style={{fontSize:"11px",color:"#444",lineHeight:"1.8"}}>
        Claude AI 뉴스 검색 기능은<br/>현재 설정 중입니다.<br/>곧 제공될 예정이에요.
      </div>
      <div style={{marginTop:"8px",padding:"6px 14px",background:"#1a1a2e",border:"1px solid #2a2a4a",borderRadius:"6px",fontSize:"10px",color:"#4a9eff"}}>
        Coming Soon
      </div>
    </div>
  );
  const sc={positive:"#00ff88",neutral:"#888",negative:"#ff4444"};
  return (
    <div>
      {loading && <div style={{padding:"12px",background:"#0e0e16",borderRadius:"6px",fontSize:"11px",color:"#555"}}>Claude가 뉴스 검색 중...</div>}
      {!loading&&error&&(
        <div style={{padding:"12px",background:"#0e0e16",borderRadius:"6px",fontSize:"11px",color:"#444",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>뉴스를 불러오지 못했어요.</span>
          <button onClick={fetchNews} style={{background:"#1a1a2e",border:"1px solid #333",color:"#4a9eff",cursor:"pointer",borderRadius:"4px",padding:"4px 10px",fontSize:"10px",fontFamily:"inherit"}}>다시 시도</button>
        </div>
      )}
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
      {a.valuation && (
        <div style={{background:"#0a0a1a",border:"1px solid #1e1e3a",borderRadius:"8px",padding:"12px 14px",marginBottom:"10px"}}>
          <div style={{fontSize:"9px",color:"#a78bfa",letterSpacing:"2px",textTransform:"uppercase",fontWeight:700}}>📊 밸류에이션</div>
          <MetricGrid items={[["P/E",a.valuation.pe],["P/S",a.valuation.ps],["PEG",a.valuation.peg],["EV/EBITDA",a.valuation.evEbitda]]} color="#c4b5fd" />
          {a.valuation.comment && <div style={{fontSize:"10px",color:"#7c6fcd",marginTop:"8px",fontStyle:"italic"}}>{a.valuation.comment}</div>}
        </div>
      )}
      {a.financial && (
        <div style={{background:"#0a1a0a",border:"1px solid #1e3a1e",borderRadius:"8px",padding:"12px 14px",marginBottom:"10px"}}>
          <div style={{fontSize:"9px",color:"#34d399",letterSpacing:"2px",textTransform:"uppercase",fontWeight:700}}>💰 재무건전성</div>
          <MetricGrid items={[["부채비율",a.financial.debtRatio],["영업이익률",a.financial.operatingMargin],["EPS",a.financial.eps],["FCF",a.financial.fcf]]} color="#6ee7b7" />
        </div>
      )}
      {a.growth && (
        <div style={{background:"#0a1510",border:"1px solid #1e3a2a",borderRadius:"8px",padding:"12px 14px",marginBottom:"10px"}}>
          <div style={{fontSize:"9px",color:"#10b981",letterSpacing:"2px",textTransform:"uppercase",fontWeight:700}}>📈 성장지표</div>
          <MetricGrid items={[["매출 YoY",a.growth.revenueYoy],["EPS 성장",a.growth.epsGrowth]]} color="#34d399" />
          {a.growth.guidance && <InfoSection title="가이던스" content={a.growth.guidance} color="#10b981" />}
        </div>
      )}
      {a.competitors && (
        <div style={{background:"#100a0a",border:"1px solid #3a1e1e",borderRadius:"8px",padding:"12px 14px",marginBottom:"10px"}}>
          <div style={{fontSize:"9px",color:"#f87171",letterSpacing:"2px",textTransform:"uppercase",fontWeight:700,marginBottom:"6px"}}>⚔️ 경쟁사 분석</div>
          <div style={{fontSize:"11px",color:"#888",lineHeight:"1.6"}}>{a.competitors}</div>
        </div>
      )}
      {a.catalysts && (
        <div style={{background:"#0a0f1a",border:"1px solid #1e2a3a",borderRadius:"8px",padding:"12px 14px",marginBottom:"10px"}}>
          <div style={{fontSize:"9px",color:"#60a5fa",letterSpacing:"2px",textTransform:"uppercase",fontWeight:700,marginBottom:"6px"}}>🚀 촉매 이벤트</div>
          <ul style={{margin:0,paddingLeft:"14px"}}>
            {a.catalysts.map((c,i)=><li key={i} style={{fontSize:"11px",color:"#7ab3f7",marginBottom:"4px",lineHeight:"1.5"}}>{c}</li>)}
          </ul>
        </div>
      )}
      {a.entryStrategy && (
        <div style={{background:"#0f0a1a",border:"1px solid #2a1e3a",borderRadius:"8px",padding:"12px 14px",marginBottom:"10px"}}>
          <div style={{fontSize:"9px",color:"#f59e0b",letterSpacing:"2px",textTransform:"uppercase",fontWeight:700,marginBottom:"6px"}}>🎯 진입 전략</div>
          <div style={{fontSize:"11px",color:"#fbbf24",lineHeight:"1.6"}}>{a.entryStrategy}</div>
        </div>
      )}
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
  useEffect(() => { setTab("analysis"); }, [stock.ticker]);
  const t = TYPE[stock.type];
  return (
    <div style={{position:"fixed",top:0,right:0,width:"min(520px,100vw)",height:"100dvh",background:"#0c0c14",borderLeft:"1px solid #1e1e2e",zIndex:100,display:"flex",flexDirection:"column",boxShadow:"-8px 0 32px rgba(0,0,0,0.6)"}}>
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

function StockCard({ s, group, selectedStock, onSelectStock }) {
  return (
    <div
      onClick={()=>onSelectStock(s)}
      style={{
        padding:"8px 10px",borderRadius:"6px",cursor:"pointer",
        background:"rgba(255,255,255,0.03)",border:`1px solid ${group.border}`,
        borderLeft:`3px solid ${group.color}`,transition:"filter 0.15s",
        outline:selectedStock?.ticker===s.ticker?"2px solid #4a9eff":"none",
        outlineOffset:"1px",
      }}
      onMouseEnter={e=>e.currentTarget.style.filter="brightness(1.5)"}
      onMouseLeave={e=>e.currentTarget.style.filter="brightness(1)"}
    >
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2px"}}>
        <span style={{fontSize:"12px",fontWeight:"700",color:"#fff"}}>{s.ticker}</span>
        <span style={{fontSize:"8px",color:"#555"}}>{s.fieldEmoji} {s.fieldLabel}</span>
      </div>
      <div style={{fontSize:"10px",color:"#777",marginBottom:"2px"}}>{s.name}</div>
      <div style={{fontSize:"9px",color:group.color,opacity:0.8}}>{s.verdict} · {s.horizon}</div>
    </div>
  );
}

function SubLabel({ label, count, color }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:"6px",margin:"10px 0 5px"}}>
      <span style={{fontSize:"9px",color,letterSpacing:"1px",textTransform:"uppercase",fontWeight:700}}>{label}</span>
      <span style={{fontSize:"9px",color,background:`${color}22`,padding:"1px 6px",borderRadius:"8px"}}>{count}</span>
      <div style={{flex:1,height:"1px",background:color,opacity:0.15}}/>
    </div>
  );
}

function CompareChart({ stocks }) {
  const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_KEY || "";
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [status, setStatus] = useState(!apiKey ? "no-key" : "loading");

  const toAVSym = (ticker) => {
    const tv = TV_SYMBOL[ticker];
    if (!tv) return ticker;
    const [ex, sym] = tv.split(":");
    if (ex === "KRX") return sym + ".KS";
    if (ex === "TSE") return sym + ".T";
    if (ex === "HKEX") return sym + ".HK";
    return sym.replace(".", "-");
  };

  useEffect(() => {
    if (!apiKey || !containerRef.current) return;
    let cancelled = false;
    setStatus("loading");
    if (chartRef.current) { chartRef.current.remove(); chartRef.current = null; }

    const fetchStock = (ticker) =>
      fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${toAVSym(ticker)}&apikey=${apiKey}`)
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(json => {
          const weekly = json["Weekly Adjusted Time Series"];
          if (!weekly) throw new Error("no data");
          return Object.entries(weekly)
            .map(([date, v]) => ({
              time: Math.floor(new Date(date).getTime() / 1000),
              value: parseFloat(v["5. adjusted close"])
            }))
            .filter(d => !isNaN(d.value))
            .sort((a, b) => a.time - b.time)
            .slice(-52);
        });

    Promise.all(stocks.map(s => fetchStock(s.ticker)))
      .then(allData => {
        if (cancelled || !containerRef.current) return;

        const chart = createChart(containerRef.current, {
          width: containerRef.current.clientWidth,
          height: 500,
          layout: { background: { type: ColorType.Solid, color: "#0a0a0f" }, textColor: "#888" },
          grid: { vertLines: { color: "#151520" }, horzLines: { color: "#151520" } },
          rightPriceScale: { borderColor: "#1a1a2a" },
          timeScale: { borderColor: "#1a1a2a", timeVisible: false },
        });
        chartRef.current = chart;

        allData.forEach((data, i) => {
          const base = data[0]?.value || 1;
          const series = chart.addLineSeries({
            color: COMPARE_COLORS[i], lineWidth: 2, title: stocks[i].ticker,
            priceFormat: { type: "custom", formatter: p => p.toFixed(1) + "%", minMove: 0.01 },
          });
          series.setData(data.map(d => ({ time: d.time, value: +((d.value / base - 1) * 100).toFixed(2) })));
        });

        chart.timeScale().fitContent();
        const ro = new ResizeObserver(() => {
          chartRef.current?.applyOptions({ width: containerRef.current?.clientWidth || 600 });
        });
        ro.observe(containerRef.current);
        containerRef.current._ro = ro;
        setStatus("ready");
      })
      .catch(() => { if (!cancelled) setStatus("error"); });

    return () => {
      cancelled = true;
      containerRef.current?._ro?.disconnect();
      if (chartRef.current) { chartRef.current.remove(); chartRef.current = null; }
    };
  }, [stocks.map(s => s.ticker).join(","), apiKey]);

  if (status === "no-key") return (
    <div style={{border:"1px solid #1e1e2e",borderRadius:"8px",background:"#0d0d14",padding:"40px 24px",textAlign:"center"}}>
      <div style={{fontSize:32,marginBottom:14}}>🔑</div>
      <div style={{fontSize:14,color:"#ffd700",fontWeight:700,marginBottom:10}}>Alpha Vantage API 키 설정 필요</div>
      <div style={{fontSize:11,color:"#666",lineHeight:2,marginBottom:20}}>
        오버레이 차트는 무료 주가 API 키가 필요합니다.<br/>
        아래 순서로 1분 안에 설정할 수 있습니다.
      </div>
      {[
        ["1", "alphavantage.co 에서 무료 API 키 발급", "#4a9eff"],
        ["2", "GitHub 저장소 → Settings → Secrets → Actions", "#ffd700"],
        ["3", "VITE_ALPHA_VANTAGE_KEY = 발급받은 키 추가", "#00ff88"],
        ["4", "GitHub Actions 재실행 → 배포 완료", "#a855f7"],
      ].map(([n, txt, c]) => (
        <div key={n} style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px",textAlign:"left"}}>
          <span style={{width:20,height:20,borderRadius:"50%",background:c,color:"#000",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{n}</span>
          <span style={{fontSize:11,color:"#777"}}>{txt}</span>
        </div>
      ))}
      <div style={{marginTop:16,fontSize:10,color:"#333"}}>무료 25회/일 · 5회/분 제한 · 신용카드 불필요</div>
    </div>
  );

  return (
    <div style={{border:"1px solid #1e1e2e",borderRadius:"8px",overflow:"hidden",background:"#0a0a0f",position:"relative",minHeight:500}}>
      {status === "loading" && (
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10}}>
          <div style={{fontSize:28}} className="pulse">📊</div>
          <div style={{fontSize:11,color:"#555"}}>Alpha Vantage에서 주가 데이터 불러오는 중...</div>
        </div>
      )}
      {status === "error" && (
        <div style={{height:500,display:"flex",alignItems:"center",justifyContent:"center",color:"#ff6666",fontSize:11}}>
          ⚠ 로드 실패 — API 키 확인 또는 일일 25회 한도 초과
        </div>
      )}
      <div ref={containerRef} style={{height:500,visibility:status==="ready"?"visible":"hidden"}} />
    </div>
  );
}

function CompareGrid({ stocks }) {
  const chartH = stocks.length <= 2 ? 400 : 300;
  const cols = stocks.length === 1 ? "1fr" : "1fr 1fr";
  return (
    <div style={{display:"grid", gridTemplateColumns:cols, gap:"10px"}}>
      {stocks.map((s, i) => (
        <div key={s.ticker}>
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px",padding:"5px 10px",background:`${COMPARE_COLORS[i]}14`,border:`1px solid ${COMPARE_COLORS[i]}44`,borderRadius:"6px"}}>
            <span style={{width:"10px",height:"10px",borderRadius:"50%",background:COMPARE_COLORS[i],flexShrink:0,display:"inline-block"}} />
            <span style={{fontSize:"12px",fontWeight:700,color:COMPARE_COLORS[i]}}>{s.ticker}</span>
            <span style={{fontSize:"10px",color:"#555"}}>{s.name}</span>
          </div>
          <TradingViewChart ticker={s.ticker} height={chartH} />
        </div>
      ))}
    </div>
  );
}

function CompareView() {
  const [compareList, setCompareList] = useState([]);
  const [expandedTabs, setExpandedTabs] = useState(new Set(["physicalAI"]));
  const [expandedSectors, setExpandedSectors] = useState(new Set([]));
  const [overlayMode, setOverlayMode] = useState(true);

  const toggleTab = (id) => setExpandedTabs(prev => { const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  const toggleSector = (id) => setExpandedSectors(prev => { const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  const toggleStock = (stock) => setCompareList(prev => {
    if (prev.find(s=>s.ticker===stock.ticker)) return prev.filter(s=>s.ticker!==stock.ticker);
    if (prev.length >= 5) return prev;
    return [...prev, stock];
  });
  const colorOf = (ticker) => { const i=compareList.findIndex(s=>s.ticker===ticker); return i>=0?COMPARE_COLORS[i]:null; };
  const isSelected = (ticker) => compareList.some(s=>s.ticker===ticker);

  return (
    <div style={{display:"flex",gap:"16px",alignItems:"flex-start"}}>
      {/* 왼쪽: 종목 선택 트리 */}
      <div style={{width:"210px",flexShrink:0}}>
        <div style={{background:"#0d0d14",border:"1px solid #1a1a2e",borderRadius:"8px",padding:"10px",marginBottom:"10px"}}>
          <div style={{fontSize:"9px",color:"#4a9eff",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px",fontWeight:700}}>
            선택된 종목 ({compareList.length}/5)
          </div>
          {compareList.length===0
            ? <div style={{fontSize:"10px",color:"#333",textAlign:"center",padding:"8px 0"}}>좌측에서 종목을 선택하세요</div>
            : <div style={{display:"flex",flexDirection:"column",gap:"4px"}}>
                {compareList.map((s,i)=>(
                  <div key={s.ticker} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:`${COMPARE_COLORS[i]}11`,border:`1px solid ${COMPARE_COLORS[i]}44`,borderRadius:"5px",padding:"5px 8px"}}>
                    <div>
                      <span style={{fontSize:"11px",fontWeight:700,color:COMPARE_COLORS[i]}}>{s.ticker}</span>
                      <span style={{fontSize:"9px",color:"#555",marginLeft:"5px"}}>{s.name}</span>
                    </div>
                    <button onClick={()=>toggleStock(s)} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:"12px",lineHeight:1,padding:"0 2px"}}>✕</button>
                  </div>
                ))}
              </div>
          }
        </div>
        <div style={{overflowY:"auto",maxHeight:"calc(100dvh - 360px)",display:"flex",flexDirection:"column",gap:"3px"}}>
          {Object.values(FIELDS).map(field=>(
            <div key={field.id}>
              <div onClick={()=>toggleTab(field.id)}
                style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",background:"#12121a",border:"1px solid #1e1e2e",borderRadius:"6px",cursor:"pointer",userSelect:"none"}}>
                <span style={{fontSize:"11px",fontWeight:700,color:"#aaa"}}>{field.emoji} {field.label}</span>
                <span style={{fontSize:"9px",color:"#444"}}>{expandedTabs.has(field.id)?"▼":"▶"}</span>
              </div>
              {expandedTabs.has(field.id)&&(
                <div style={{marginLeft:"8px",marginTop:"2px",display:"flex",flexDirection:"column",gap:"2px"}}>
                  {field.sectors.map(sector=>(
                    <div key={sector.id}>
                      <div onClick={()=>toggleSector(sector.id)}
                        style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 8px",background:"#0e0e16",border:"1px solid #1a1a2a",borderRadius:"5px",cursor:"pointer",userSelect:"none"}}>
                        <span style={{fontSize:"10px",color:"#666"}}>{sector.emoji} {sector.name}</span>
                        <span style={{display:"flex",gap:"4px",alignItems:"center"}}>
                          <span style={{fontSize:"9px",color:"#333",background:"#1a1a1a",borderRadius:"3px",padding:"1px 4px"}}>{sector.stocks.length}</span>
                          <span style={{fontSize:"9px",color:"#333"}}>{expandedSectors.has(sector.id)?"▼":"▶"}</span>
                        </span>
                      </div>
                      {expandedSectors.has(sector.id)&&(
                        <div style={{marginLeft:"6px",marginTop:"2px",display:"flex",flexDirection:"column",gap:"2px"}}>
                          {sector.stocks.map(stock=>{
                            const sel=isSelected(stock.ticker);
                            const col=colorOf(stock.ticker);
                            const t=TYPE[stock.type];
                            const disabled=!sel&&compareList.length>=5;
                            return (
                              <div key={stock.ticker+sector.id} onClick={()=>!disabled&&toggleStock(stock)}
                                style={{display:"flex",alignItems:"center",gap:"6px",padding:"5px 8px",borderRadius:"5px",
                                  cursor:disabled?"not-allowed":"pointer",userSelect:"none",
                                  background:sel?`${col}11`:"rgba(255,255,255,0.02)",
                                  border:`1px solid ${sel?col+"55":"#151520"}`,
                                  opacity:disabled?0.3:1,transition:"all 0.15s"}}
                                onMouseEnter={e=>{if(!disabled)e.currentTarget.style.filter="brightness(1.4)"}}
                                onMouseLeave={e=>e.currentTarget.style.filter="brightness(1)"}>
                                <span style={{fontSize:"11px",color:sel?col:"#333",fontWeight:700,width:"12px",flexShrink:0}}>{sel?"✓":"○"}</span>
                                <span style={{fontSize:"11px",fontWeight:700,color:sel?col:"#777",flex:1}}>{stock.ticker}</span>
                                <span className="tag" style={{background:t.bg,color:t.text,fontSize:"8px",flexShrink:0}}>{t.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* 오른쪽: 비교 차트 */}
      <div style={{flex:1,minWidth:0}}>
        {compareList.length === 0 ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"440px",background:"#0d0d14",border:"1px dashed #1e1e2e",borderRadius:"10px",gap:"12px"}}>
            <div style={{fontSize:"36px"}}>📊</div>
            <div style={{fontSize:"13px",color:"#555",fontWeight:600}}>종목을 선택하세요</div>
            <div style={{fontSize:"10px",color:"#333"}}>최대 5개 · 탭/섹터별로 찾아 선택</div>
          </div>
        ) : (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                {compareList.map((s,i)=>(
                  <div key={s.ticker} style={{padding:"3px 10px",background:`${COMPARE_COLORS[i]}22`,border:`1px solid ${COMPARE_COLORS[i]}55`,borderRadius:"20px",fontSize:"11px",fontWeight:700,color:COMPARE_COLORS[i]}}>
                    {s.ticker}
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:"4px",flexShrink:0}}>
                <button onClick={()=>setOverlayMode(true)}
                  style={{padding:"4px 12px",border:"1px solid",borderRadius:"5px",fontSize:"10px",fontWeight:700,cursor:"pointer",
                    background:overlayMode?"#1a1a2e":"transparent",
                    color:overlayMode?"#4a9eff":"#444",
                    borderColor:overlayMode?"#4a9eff":"#333"}}>
                  오버레이
                </button>
                <button onClick={()=>setOverlayMode(false)}
                  style={{padding:"4px 12px",border:"1px solid",borderRadius:"5px",fontSize:"10px",fontWeight:700,cursor:"pointer",
                    background:!overlayMode?"#1a1a2e":"transparent",
                    color:!overlayMode?"#4a9eff":"#444",
                    borderColor:!overlayMode?"#4a9eff":"#333"}}>
                  개별
                </button>
              </div>
            </div>
            {overlayMode
              ? <CompareChart key={compareList.map(s=>s.ticker).join(",")} stocks={compareList} />
              : <CompareGrid stocks={compareList} />
            }
          </>
        )}
      </div>
    </div>
  );
}

function SummaryView({ onSelectStock, selectedStock }) {
  return (
    <div>
      <div style={{fontSize:"11px",color:"#444",marginBottom:"18px"}}>
        전체 <span style={{color:"#00ff88"}}>{TOTAL_ANALYZED}종목</span> 투자 평가별 분류 — 종목 클릭 시 상세 분석
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"14px"}}>
        {VERDICT_GROUPS.map(group=>{
          const isGreen = group.color === "#00ff88";
          const strongStocks  = isGreen ? group.stocks.filter(s=>s.verdictColor==="#00ff88"&&s.verdict.includes("강력")) : [];
          const longBuyStocks = isGreen ? group.stocks.filter(s=>s.verdictColor==="#00ff88"&&!s.verdict.includes("강력")) : [];
          const buyStocks     = isGreen ? group.stocks.filter(s=>s.verdictColor==="#00cc66") : group.stocks;
          return (
            <div key={group.color} style={{background:group.bg,border:`1px solid ${group.border}`,borderTop:`3px solid ${group.color}`,borderRadius:"10px",padding:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                <div style={{fontSize:"10px",color:group.color,letterSpacing:"2px",textTransform:"uppercase",fontWeight:700}}>
                  {group.emoji} {group.label}
                </div>
                <span style={{fontSize:"10px",color:group.color,background:`${group.color}22`,padding:"2px 8px",borderRadius:"10px",fontWeight:700}}>
                  {group.stocks.length}
                </span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"4px"}}>
                {isGreen ? (
                  <>
                    <SubLabel label="⭐ 강력 매수" count={strongStocks.length} color="#00ff88" />
                    {strongStocks.map(s=><StockCard key={s.ticker} s={s} group={group} selectedStock={selectedStock} onSelectStock={onSelectStock}/>)}
                    <SubLabel label="▲ 장기 매수" count={longBuyStocks.length} color="#00ff88" />
                    {longBuyStocks.map(s=><StockCard key={s.ticker} s={s} group={group} selectedStock={selectedStock} onSelectStock={onSelectStock}/>)}
                    <SubLabel label="▸ 매수" count={buyStocks.length} color="#00cc66" />
                    {buyStocks.map(s=><StockCard key={s.ticker} s={s} group={{...group,color:"#00cc66",border:"#003a20"}} selectedStock={selectedStock} onSelectStock={onSelectStock}/>)}
                  </>
                ) : (
                  buyStocks.map(s=><StockCard key={s.ticker} s={s} group={group} selectedStock={selectedStock} onSelectStock={onSelectStock}/>)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function InvestmentDashboard() {
  const [activeField, setActiveField] = useState("physicalAI");
  const [activeSectorId, setActiveSectorId] = useState("chip");
  const [selectedStock, setSelectedStock] = useState(null);
  const isSpecialView = activeField === "summary" || activeField === "compare";
  const field = isSpecialView ? null : FIELDS[activeField];
  const activeSector = isSpecialView ? null : (field.sectors.find(s=>s.id===activeSectorId)||field.sectors[0]);
  const handleFieldChange = (fid) => {
    if (fid === "summary" || fid === "compare") { setActiveField(fid); setSelectedStock(null); return; }
    setActiveField(fid); setActiveSectorId(FIELDS[fid].sectors[0].id); setSelectedStock(null);
  };
  return (
    <div style={{fontFamily:"'IBM Plex Mono','Courier New',monospace",background:"#0a0a0f",minHeight:"100vh",color:"#e0e0e0",padding:"24px",boxSizing:"border-box",zoom:1.25}}>
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
          <span style={{fontSize:"10px",color:"#555"}}>{CURRENT_DATE}</span>
        </div>
        <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:"26px",fontWeight:"700",color:"#fff",letterSpacing:"-0.5px"}}>AI 투자 대시보드</h1>
        <p style={{fontSize:"11px",color:"#555",marginTop:"4px"}}>종목 클릭 → 🔍 투자 분석 · 📈 차트 · 📰 뉴스 &nbsp;|&nbsp; <span style={{color:"#00ff88"}}>전체 {TOTAL_ANALYZED}종목 분석 완료</span></p>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid #1a1a1a",marginBottom:"20px",background:"#0d0d14",borderRadius:"8px 8px 0 0",padding:"0 4px",overflowX:"auto"}}>
        {Object.values(FIELDS).map(f=>(
          <button key={f.id} className={"field-tab"+(activeField===f.id?" active":"")} onClick={()=>handleFieldChange(f.id)}>{f.emoji} {f.label}</button>
        ))}
        <button className={"field-tab"+(activeField==="summary"?" active":"")} onClick={()=>handleFieldChange("summary")} style={{marginLeft:"auto",color:activeField==="summary"?"#fff":"#4a9eff",borderBottomColor:activeField==="summary"?"#4a9eff":"transparent"}}>📊 요약</button>
        <button className={"field-tab"+(activeField==="compare"?" active":"")} onClick={()=>handleFieldChange("compare")} style={{color:activeField==="compare"?"#fff":"#ffd700",borderBottomColor:activeField==="compare"?"#ffd700":"transparent"}}>📈 비교</button>
      </div>
      {!isSpecialView && (
        <>
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
                    <span style={{display:"flex",alignItems:"center",gap:"5px"}}>
                      {s.isFieldBottleneck&&<span style={{fontSize:"9px",color:"#ff4444"}}>●</span>}
                      <span style={{fontSize:"9px",color:"#444",background:"#1a1a1a",borderRadius:"3px",padding:"1px 5px"}}>{s.stocks.length}</span>
                    </span>
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
        </>
      )}
      {activeField === "summary" && <SummaryView onSelectStock={setSelectedStock} selectedStock={selectedStock} />}
      {activeField === "compare" && <CompareView />}
      <div style={{marginTop:"28px",borderTop:"1px solid #111",paddingTop:"14px",fontSize:"9px",color:"#2a2a2a",lineHeight:"1.8"}}>
        ※ 본 자료는 투자 참고용이며 투자 권유가 아닙니다. 종목 선택 전 반드시 개별 리서치를 병행하세요.
      </div>
    </div>
  );
}
