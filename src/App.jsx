import { useState, useEffect, useRef, useCallback } from "react";

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Noto+Serif+KR:wght@300;400;600&family=DM+Mono:wght@300;400&display=swap";
fontLink.rel = "stylesheet";
if (!document.querySelector(`link[href="${fontLink.href}"]`)) document.head.appendChild(fontLink);

const CSS = `
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
@keyframes bookFloat { 0%,100%{transform:rotateY(-20deg) rotateX(5deg) translateY(0)} 50%{transform:rotateY(-20deg) rotateX(5deg) translateY(-8px)} }
@keyframes expandIn { from{opacity:0;transform:translateY(-12px) scaleY(0.97)} to{opacity:1;transform:translateY(0) scaleY(1)} }
.book-idle { animation: bookFloat 4s ease-in-out infinite; }
.book-hover { transform: rotateY(0deg) rotateX(0deg) scale(1.04) !important; animation:none !important; }
.book-open  { transform: rotateY(0deg) rotateX(0deg) !important; animation:none !important; }
.swiper-track { display:flex; gap:3rem; padding:2rem 6vw; overflow-x:auto; scrollbar-width:none; scroll-snap-type:x mandatory; cursor:grab; }
.swiper-track:active { cursor:grabbing; }
.swiper-track::-webkit-scrollbar { display:none; }
.nav-a:hover { color:#c9a84c !important; }
.join-btn:hover { background:#c9a84c !important; color:#0f0e0c !important; }
.swipe-btn:hover { background:#c9a84c !important; color:#0f0e0c !important; border-color:#c9a84c !important; }
.cta-btn:hover { background:#e8c96a !important; transform:translateY(-2px); }
.open-btn:hover { background:#c9a84c !important; color:#0f0e0c !important; }
.info-card:hover { border-color:rgba(201,168,76,0.35) !important; transform:translateY(-3px); }
.feat-item:hover { border-color:rgba(201,168,76,0.25) !important; background:rgba(201,168,76,0.04) !important; transform:translateY(-4px); }
.panel-anim { animation:expandIn 0.4s cubic-bezier(0.23,1,0.32,1); }
.h1{opacity:0;animation:fadeUp 0.8s 0.3s forwards}
.h2{opacity:0;animation:fadeUp 0.8s 0.5s forwards}
.h3{opacity:0;animation:fadeUp 0.8s 0.7s forwards}
.h4{opacity:0;animation:fadeUp 0.8s 0.9s forwards}
.scroll-bounce { animation:bounce 2s infinite; }
.reveal { opacity:0; transform:translateY(20px); transition:opacity 0.7s,transform 0.7s; }
.reveal.on { opacity:1; transform:translateY(0); }
.nav-a,.join-btn,.swipe-btn,.cta-btn,.open-btn,.info-card,.feat-item { transition:all 0.3s; }
`;

const BOOKS = [
  { id:0, title:"불꽃의 해석", author:"김소영", genre:"문학소설", rating:4.8, ratingCount:"2,341",
    c1:"#3b2a1a", c2:"#8b4513", ac:"#e8a255", tc:"#f5e6c8", emoji:"🔥",
    lines:["불꽃의","해석"], sub:"KIM SO-YOUNG", sc:"#6b3410",
    desc:"현대인의 고독과 연대를 불꽃이라는 상징으로 그려낸 2025년 최고의 국내 소설. 만연체의 문장과 치밀한 구조가 독자를 사로잡는다.",
    quote:"어떤 불꽃은 타오르기 위해 먼저 꺼져야 한다. 그것이 인간이라는 연료의 본질이다.",
    features:[
      {icon:"✦",type:"feature",label:"수상 이력",title:"2025 한국문학상 수상",body:"올해 가장 주목받는 국내 문학상을 수상하며 비평가와 독자 모두에게 찬사를 받았습니다."},
      {icon:"◈",type:"feature",label:"독자 통계",title:"완독률 89%",body:"FOLIO 클럽 역대 최고 완독률. 한 번 펴면 내려놓기 어렵다는 독자 후기가 압도적입니다."},
      {icon:"◉",type:"info",label:"페이지",title:"384쪽 · 초판 품절",body:"출판 3주 만에 초판 품절, 현재 6쇄 발행 중. 이달 클럽 박스에 사인본 포함 예정."},
    ],
    reviews:[
      {rv:"JY",name:"정윤서",s:5,text:"오랜만에 밑줄을 10곳 이상 그은 소설입니다. 문장 하나하나가 살아있어요."},
      {rv:"MK",name:"민경호",s:5,text:"불꽃의 메타포가 소설 전체를 관통하는 방식이 너무 아름다웠습니다."},
    ]},
  { id:1, title:"다음 생을 위한 메모", author:"박하린", genre:"에세이", rating:4.6, ratingCount:"1,882",
    c1:"#1a2535", c2:"#2c4a6e", ac:"#7eb8d4", tc:"#dceef7", emoji:"🌙",
    lines:["다음 생을","위한 메모"], sub:"PARK HA-RIN", sc:"#1d3a5c",
    desc:"죽음을 앞둔 작가가 다음 생에 자신에게 남기는 109개의 메모. 상실과 희망을 동시에 담은 위로의 에세이.",
    quote:"살아있다는 것은 아직 모든 것이 가능하다는 뜻이다. 심지어 새로 시작하는 것조차.",
    features:[
      {icon:"✦",type:"feature",label:"베스트셀러",title:"12주 연속 1위",body:"종합 베스트셀러 12주 연속 1위. 선물용으로도 가장 많이 구매되는 책입니다."},
      {icon:"◈",type:"feature",label:"클럽 픽",title:"이달의 에디터 추천",body:"FOLIO 에디터 팀이 만장일치로 선정한 이달의 에디터 픽."},
      {icon:"◉",type:"info",label:"특별판",title:"한정 핸드레터링 표지",body:"이달 클럽 박스에는 작가 친필 핸드레터링 한정판이 포함됩니다."},
    ],
    reviews:[
      {rv:"SH",name:"송해원",s:5,text:"읽는 내내 울었습니다. 위로라는 게 이런 것이구나 싶었어요."},
      {rv:"LJ",name:"이지은",s:4,text:"죽음을 이토록 아름답게 이야기하다니. 삶을 다시 보게 만드는 책."},
    ]},
  { id:2, title:"알고리즘 인류", author:"Thomas Raven", genre:"논픽션", rating:4.5, ratingCount:"3,100",
    c1:"#0d1f0d", c2:"#1a3d1a", ac:"#4caf50", tc:"#c8f0c8", emoji:"⬡",
    lines:["알고리즘","인류"], sub:"THOMAS RAVEN", sc:"#133313",
    desc:"AI가 인간의 의사결정을 지배하기 시작한 세상, 우리는 어떻게 살아야 하는가. 기술철학자 토마스 레이번의 역작.",
    quote:"알고리즘은 과거의 패턴을 학습한다. 그러나 미래는 항상 새로운 실수를 만들어낸다.",
    features:[
      {icon:"✦",type:"feature",label:"번역",title:"36개국 동시 출간",body:"전세계 36개국에 동시 출간되며 각국에서 AI 윤리 논의를 촉발시킨 문제작입니다."},
      {icon:"◈",type:"feature",label:"추천",title:"빌 게이츠 2026 올해의 책",body:"빌 게이츠의 공식 블로그에서 올해 반드시 읽어야 할 책으로 선정되었습니다."},
      {icon:"◉",type:"info",label:"토론회",title:"저자 온라인 강연 예정",body:"3월 15일 FOLIO 클럽 멤버 대상 저자 초청 온라인 강연이 예정되어 있습니다."},
    ],
    reviews:[
      {rv:"KH",name:"권현준",s:5,text:"AI를 이렇게 인문학적으로 풀어낸 책은 처음입니다. 경이로웠어요."},
      {rv:"CY",name:"최예린",s:4,text:"무겁지만 반드시 읽어야 하는 책. 우리 모두에게 해당되는 이야기입니다."},
    ]},
  { id:3, title:"마지막 정원사", author:"이나영", genre:"SF소설", rating:4.7, ratingCount:"1,560",
    c1:"#2a1a35", c2:"#4a2a6e", ac:"#b87dd4", tc:"#e8d4f5", emoji:"🌿",
    lines:["마지막","정원사"], sub:"LEE NA-YOUNG", sc:"#3d1a5c",
    desc:"지구 최후의 식물이 자라는 정원을 지키는 노인의 이야기. 환경과 기억, 생명을 주제로 한 2025 SF 대상 수상작.",
    quote:"씨앗 하나가 세상을 기억한다. 우리가 모두 잊어버린 후에도.",
    features:[
      {icon:"✦",type:"feature",label:"수상",title:"2025 SF 대상 대상",body:"한국SF작가협회 2025년 대상 수상. 생태SF의 새로운 지평을 열었다는 평가를 받고 있습니다."},
      {icon:"◈",type:"feature",label:"드라마화",title:"OTT 드라마 제작 확정",body:"국내 주요 OTT 플랫폼에서 드라마 제작이 확정되어 더욱 주목받고 있습니다."},
      {icon:"◉",type:"info",label:"분량",title:"520쪽 · 완결",body:"방대한 세계관을 촘촘히 구축한 단권 완결작. 읽는 내내 빠져나올 수 없다는 후기가 지배적."},
    ],
    reviews:[
      {rv:"AN",name:"안나영",s:5,text:"SF인데 이렇게 서정적일 수 있다니. 마지막 장을 닫고 한참을 멍하니 있었습니다."},
      {rv:"PJ",name:"박지수",s:5,text:"기후 위기를 이야기하는 방식이 정공법이 아닌데 오히려 더 강렬하게 와 닿았어요."},
    ]},
  { id:4, title:"어제의 경제학", author:"서민우", genre:"경제/경영", rating:4.3, ratingCount:"2,780",
    c1:"#1c1508", c2:"#3d2e10", ac:"#d4aa44", tc:"#f0e4c0", emoji:"📊",
    lines:["어제의","경제학"], sub:"SEO MIN-WOO", sc:"#2e2008",
    desc:"근대 경제학이 어떻게 현재를 만들었는지 추적하는 역작. 복잡한 이론을 흥미로운 역사 이야기로 풀어낸 교양서.",
    quote:"경제학은 숫자의 학문이 아니다. 인간 욕망의 고고학이다.",
    features:[
      {icon:"✦",type:"feature",label:"대중성",title:"경제 입문서 1위 6개월",body:"전문 지식 없이도 읽을 수 있는 경제 교양서로 6개월 연속 해당 분야 1위를 기록 중입니다."},
      {icon:"◈",type:"feature",label:"강의",title:"유튜브 강의 100만 뷰",body:"저자의 유튜브 저서 소개 강의가 출간 한달 만에 100만 뷰를 돌파했습니다."},
      {icon:"◉",type:"info",label:"분량",title:"408쪽 · 도표 82개 수록",body:"이해를 돕는 도표와 인포그래픽이 82개 수록되어 어려운 개념도 쉽게 이해할 수 있습니다."},
    ],
    reviews:[
      {rv:"WS",name:"위승호",s:4,text:"경제학에 이렇게 스토리텔링이 가능했군요. 재밌어서 이틀 만에 다 읽었습니다."},
      {rv:"HM",name:"한미래",s:5,text:"학교에서 이 책으로 배웠으면 경제학을 사랑했을 것 같아요."},
    ]},
];

const S = n => "★".repeat(Math.floor(n)) + (n % 1 >= 0.5 ? "½" : "");
const G = "#c9a84c";
const CREAM = "#f5f0e8";
const INK = "#0f0e0c";

function Cover({ b, w=200, h=280 }) {
  const id = `bk${b.id}`;
  return (
    <svg width={w} height={h} xmlns="http://www.w3.org/2000/svg" style={{display:"block"}}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={b.c1}/><stop offset="100%" stopColor={b.c2}/>
        </linearGradient>
        <filter id={`n${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feBlend in="SourceGraphic" mode="overlay" result="bl"/>
          <feComposite in="bl" in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>
      <rect width={w} height={h} fill={`url(#g${id})`}/>
      <rect width={w} height={h} fill={`url(#g${id})`} filter={`url(#n${id})`} opacity="0.4"/>
      <line x1="16" y1="20" x2="184" y2="20" stroke={b.ac} strokeWidth="0.5" opacity="0.3"/>
      <line x1="16" y1="260" x2="184" y2="260" stroke={b.ac} strokeWidth="0.5" opacity="0.3"/>
      <line x1="16" y1="20" x2="16" y2="260" stroke={b.ac} strokeWidth="0.5" opacity="0.15"/>
      <circle cx="100" cy="90" r="50" fill={b.ac} opacity="0.07"/>
      <text x="100" y="98" textAnchor="middle" fontSize="36" fill={b.ac} opacity="0.5" fontFamily="serif">{b.emoji}</text>
      {b.lines.map((l,i)=>(
        <text key={i} x="20" y={155+i*32} fontSize="22" fontWeight="900"
          fontFamily="'Noto Serif KR',serif" fill={b.tc}>{l}</text>
      ))}
      <text x="20" y="246" fontSize="8" fontFamily="monospace" letterSpacing="2" fill={b.ac} opacity="0.7">{b.sub}</text>
      <rect x="16" y="265" width="168" height="1" fill={b.ac} opacity="0.2"/>
    </svg>
  );
}

function Book3D({ b, isOpen, onClick }) {
  const [hov, setHov] = useState(false);
  const cls = isOpen ? "book-open" : hov ? "book-hover" : "book-idle";
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{width:200,margin:"0 auto",perspective:900,cursor:"pointer"}}>
      <div className={cls} style={{
        width:200,height:280,position:"relative",transformStyle:"preserve-3d",
        transform:"rotateY(-20deg) rotateX(5deg)",
        transition:"transform 0.6s cubic-bezier(0.23,1,0.32,1)",
      }}>
        <div style={{position:"absolute",width:200,height:280,transform:"translateZ(20px)",
          borderRadius:"2px 6px 6px 2px",overflow:"hidden",backfaceVisibility:"hidden",
          boxShadow:"6px 6px 20px rgba(0,0,0,0.5)"}}>
          <Cover b={b}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,rgba(255,255,255,0.08) 0%,transparent 60%)",pointerEvents:"none"}}/>
        </div>
        <div style={{position:"absolute",width:200,height:280,transform:"translateZ(-20px) rotateY(180deg)",
          borderRadius:"6px 2px 2px 6px",background:b.sc,backfaceVisibility:"hidden"}}/>
        <div style={{position:"absolute",width:40,height:280,left:-20,
          transform:"rotateY(-90deg) translateZ(0)",transformOrigin:"right center",
          backfaceVisibility:"hidden",background:b.sc}}>
          <svg width="40" height="280">
            <rect width="40" height="280" fill={b.sc}/>
            <text x="20" y="240" textAnchor="middle" fontSize="9" fontFamily="monospace"
              fill={b.ac} opacity="0.8" transform="rotate(-90,20,140)" letterSpacing="1.5">
              {b.title.toUpperCase()}
            </text>
          </svg>
        </div>
        {["top","bottom"].map(side=>(
          <div key={side} style={{
            position:"absolute",width:200,height:40,
            [side]:0,
            transform:side==="top"?"rotateX(90deg) translateZ(0)":"rotateX(-90deg) translateZ(0)",
            transformOrigin:side==="top"?"center top":"center bottom",
            background:"repeating-linear-gradient(90deg,#e8e0d0,#d5ccb8 2px,#e8e0d0 3px)",
            opacity:0.9,backfaceVisibility:"hidden",
          }}/>
        ))}
      </div>
    </div>
  );
}

function InfoCard({ icon, type, label, title, body }) {
  const bg = type==="feature"?"rgba(201,168,76,0.12)":type==="review"?"rgba(181,69,27,0.12)":"rgba(92,122,94,0.12)";
  return (
    <div className="info-card" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(201,168,76,0.1)",borderRadius:6,padding:"1.4rem"}}>
      <div style={{width:34,height:34,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",marginBottom:"0.9rem",background:bg}}>{icon}</div>
      <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.58rem",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(245,240,232,0.3)",marginBottom:"0.4rem",display:"block"}}>{label}</span>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontWeight:700,color:CREAM,marginBottom:"0.5rem",lineHeight:1.4}}>{title}</div>
      <div style={{fontSize:"0.8rem",lineHeight:1.7,color:"rgba(245,240,232,0.5)"}}>{body}</div>
    </div>
  );
}

function ReviewCard({ rv, name, s, text }) {
  return (
    <div className="info-card" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(201,168,76,0.1)",borderRadius:6,padding:"1.4rem"}}>
      <div style={{width:34,height:34,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",marginBottom:"0.9rem",background:"rgba(181,69,27,0.12)"}}>💬</div>
      <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.58rem",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(245,240,232,0.3)",marginBottom:"0.4rem",display:"block"}}>독자 리뷰</span>
      <div style={{fontSize:"0.8rem",lineHeight:1.7,color:"rgba(245,240,232,0.5)",marginBottom:"0.9rem"}}>{text}</div>
      <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
        <div style={{width:26,height:26,borderRadius:"50%",background:G,fontSize:"0.6rem",display:"flex",alignItems:"center",justifyContent:"center",color:INK,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{rv}</div>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.62rem",color:"rgba(245,240,232,0.4)"}}>{name} · {"★".repeat(s)}</span>
      </div>
    </div>
  );
}

function Panel({ b, onClose }) {
  return (
    <div className="panel-anim" style={{background:"#161410",border:"1px solid rgba(201,168,76,0.15)",borderRadius:8,margin:"1.5rem 2rem",overflow:"hidden"}}>
      <div style={{padding:"2rem"}}>
        <div style={{display:"flex",gap:"2rem",alignItems:"flex-start",marginBottom:"2rem",paddingBottom:"1.5rem",borderBottom:"1px solid rgba(201,168,76,0.1)",flexWrap:"wrap"}}>
          <div style={{width:120,height:168,flexShrink:0,borderRadius:3,overflow:"hidden",boxShadow:"0 8px 30px rgba(0,0,0,0.5)"}}>
            <div style={{transform:"scale(0.6)",transformOrigin:"top left",width:200,height:280}}><Cover b={b}/></div>
          </div>
          <div style={{flex:1,minWidth:180}}>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.58rem",letterSpacing:"0.2em",textTransform:"uppercase",color:G,marginBottom:"0.6rem",display:"block"}}>{b.genre}</span>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.6rem",fontWeight:700,color:CREAM,lineHeight:1.2,marginBottom:"0.3rem"}}>{b.title}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.65rem",color:"rgba(245,240,232,0.4)",marginBottom:"0.8rem"}}>by {b.author}</div>
            <div style={{display:"flex",alignItems:"center",gap:"0.8rem"}}>
              <span style={{color:G}}>{S(b.rating)}</span>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",fontWeight:700,color:CREAM}}>{b.rating}</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.6rem",color:"rgba(245,240,232,0.3)"}}>({b.ratingCount}개 평가)</span>
            </div>
            <p style={{marginTop:"0.8rem",fontSize:"0.82rem",lineHeight:1.7,color:"rgba(245,240,232,0.55)",maxWidth:480}}>{b.desc}</p>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(245,240,232,0.3)",fontSize:"1.4rem",cursor:"pointer",padding:"0.2rem",lineHeight:1,transition:"color 0.3s"}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"1.2rem"}}>
          <div style={{background:"linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.02))",border:"1px solid rgba(201,168,76,0.2)",borderRadius:6,padding:"1.5rem",gridColumn:"span 2"}}>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:"3.5rem",lineHeight:0.5,color:G,opacity:0.3,display:"block",marginBottom:"0.7rem"}}>"</span>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontStyle:"italic",color:"rgba(245,240,232,0.8)",lineHeight:1.7}}>{b.quote}</div>
          </div>
          {b.features.map((f,i)=><InfoCard key={i} {...f}/>)}
          {b.reviews.map((r,i)=><ReviewCard key={i} {...r}/>)}
        </div>
      </div>
    </div>
  );
}

function BookCard({ b, isOpen, onToggle }) {
  return (
    <div style={{flex:"0 0 260px",scrollSnapAlign:"center"}}>
      <Book3D b={b} isOpen={isOpen} onClick={onToggle}/>
      <div style={{textAlign:"center",marginTop:"1.5rem",padding:"0 0.5rem"}}>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.58rem",letterSpacing:"0.2em",textTransform:"uppercase",color:G,background:"rgba(201,168,76,0.1)",padding:"0.2rem 0.6rem",borderRadius:20,display:"inline-block",marginBottom:"0.6rem"}}>{b.genre}</span>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,color:CREAM,marginBottom:"0.25rem",lineHeight:1.3}}>{b.title}</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.62rem",color:"rgba(245,240,232,0.4)"}}>{b.author}</div>
        <div style={{marginTop:"0.5rem",color:G,fontSize:"0.72rem"}}>{S(b.rating)} <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.62rem",color:"rgba(245,240,232,0.35)"}}>{b.rating}</span></div>
        <button className="open-btn" onClick={onToggle} style={{
          marginTop:"0.8rem",fontFamily:"'DM Mono',monospace",fontSize:"0.62rem",letterSpacing:"0.15em",
          textTransform:"uppercase",color:G,background:"none",
          border:"1px solid rgba(201,168,76,0.3)",padding:"0.45rem 1rem",
          borderRadius:2,cursor:"pointer",width:"100%",
        }}>{isOpen ? "닫기 ↑" : "자세히 보기 ↓"}</button>
      </div>
    </div>
  );
}

function useReveal(ref) {
  const [v, setV] = useState(false);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setV(true); },{threshold:0.1});
    obs.observe(el); return ()=>obs.disconnect();
  },[ref]);
  return v;
}

export default function FolioBookClub() {
  const [openId, setOpenId] = useState(-1);
  const [dot, setDot] = useState(0);
  const trackRef = useRef(null);
  const secRef = useRef(null);
  const featRef = useRef(null);
  const secVis = useReveal(secRef);
  const featVis = useReveal(featRef);
  const drag = useRef({on:false,x:0,sl:0});

  useEffect(()=>{
    const id = "folio-css";
    if(!document.getElementById(id)){
      const s = document.createElement("style");
      s.id = id; s.textContent = CSS; document.head.appendChild(s);
    }
  },[]);

  const onScroll = useCallback(()=>{
    const t = trackRef.current; if(!t) return;
    const cards = [...t.querySelectorAll("[data-bc]")];
    const cx = t.scrollLeft + t.clientWidth/2;
    let best=0, md=Infinity;
    cards.forEach((c,i)=>{ const d=Math.abs(c.offsetLeft+c.offsetWidth/2-cx); if(d<md){md=d;best=i;} });
    setDot(best);
  },[]);

  const scrollTo = (i)=>{
    const cards = [...trackRef.current?.querySelectorAll("[data-bc]")||[]];
    cards[i]?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});
    setDot(i);
  };

  return (
    <div style={{background:INK,color:CREAM,fontFamily:"'Noto Serif KR',serif",minHeight:"100vh"}}>
      <header style={{position:"sticky",top:0,zIndex:100,padding:"1.2rem 2.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",background:"linear-gradient(to bottom,rgba(15,14,12,0.97),rgba(15,14,12,0.8))"}}>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:900,letterSpacing:"0.3em",color:G}}>FOLIO<span style={{color:CREAM}}>.</span></span>
        <nav style={{display:"flex",gap:"1.8rem",alignItems:"center"}}>
          {["큐레이션","클럽","이벤트"].map(t=>(
            <a key={t} className="nav-a" href="#" style={{fontFamily:"'DM Mono',monospace",fontSize:"0.68rem",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(245,240,232,0.5)",textDecoration:"none"}}>{t}</a>
          ))}
          <a className="join-btn" href="#" style={{fontFamily:"'DM Mono',monospace",fontSize:"0.68rem",letterSpacing:"0.18em",textTransform:"uppercase",color:G,textDecoration:"none",border:`1px solid ${G}`,padding:"0.45rem 1.1rem",borderRadius:2}}>가입하기</a>
        </nav>
      </header>
      <section style={{minHeight:"90vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",perspective:1200}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 60% at 50% 40%,#1a1208 0%,#0f0e0c 70%)"}}/>
        <div style={{position:"absolute",inset:0,pointerEvents:"none",backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(201,168,76,0.04) 80px)"}}/>
        <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"0 2rem"}}>
          <p className="h1" style={{fontFamily:"'DM Mono',monospace",fontSize:"0.62rem",letterSpacing:"0.35em",textTransform:"uppercase",color:G,marginBottom:"1.4rem"}}>2026 · 이달의 추천 도서</p>
          <h1 className="h2" style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2.8rem,7vw,6.5rem)",fontWeight:900,lineHeight:1,color:CREAM,marginBottom:"1.4rem"}}>
            책 한 권이<br/><em style={{color:G,fontStyle:"italic"}}>세계를 바꾼다</em>
          </h1>
          <p className="h3" style={{fontSize:"0.95rem",color:"rgba(245,240,232,0.5)",fontWeight:300,lineHeight:1.8,maxWidth:380,margin:"0 auto 2.5rem"}}>
            지금 가장 많이 읽히는 책, 가장 깊은 대화가 오가는 독서 클럽.
          </p>
          <a className="h4 cta-btn" href="#books" style={{display:"inline-flex",alignItems:"center",gap:"0.7rem",fontFamily:"'DM Mono',monospace",fontSize:"0.72rem",letterSpacing:"0.15em",textTransform:"uppercase",color:INK,background:G,padding:"0.9rem 2.2rem",textDecoration:"none",borderRadius:2}}>
            책 둘러보기 <span>→</span>
          </a>
        </div>
        <div className="scroll-bounce" style={{position:"absolute",bottom:"2rem",left:"50%",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.4rem",fontFamily:"'DM Mono',monospace",fontSize:"0.58rem",letterSpacing:"0.2em",color:"rgba(245,240,232,0.25)"}}>
          <span>SCROLL</span>
          <div style={{width:1,height:36,background:`linear-gradient(to bottom,${G},transparent)`}}/>
        </div>
      </section>
      <section id="books" style={{padding:"5rem 0 6rem",position:"relative",overflow:"hidden"}}>
        <div ref={secRef} className={`reveal${secVis?" on":""}`} style={{textAlign:"center",marginBottom:"3.5rem",padding:"0 2rem"}}>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.62rem",letterSpacing:"0.3em",textTransform:"uppercase",color:G,marginBottom:"0.8rem",display:"block"}}>이번 달 화제작</span>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.8rem,4.5vw,3rem)",fontWeight:700,color:CREAM}}>
            지금 <em style={{fontStyle:"italic",color:"rgba(245,240,232,0.35)"}}>읽어야 할</em> 책들
          </h2>
        </div>
        <div style={{position:"relative",padding:"1.5rem 0 4rem"}}>
          <button className="swipe-btn" onClick={()=>trackRef.current?.scrollBy({left:-300,behavior:"smooth"})}
            style={{position:"absolute",top:"50%",left:"1rem",transform:"translateY(-60%)",width:48,height:48,border:"1px solid rgba(201,168,76,0.3)",background:"rgba(15,14,12,0.85)",backdropFilter:"blur(8px)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:G,fontSize:"1.2rem",cursor:"pointer",zIndex:10}}>‹</button>
          <div ref={trackRef} className="swiper-track" onScroll={onScroll}
            onMouseDown={e=>{drag.current={on:true,x:e.pageX-trackRef.current.offsetLeft,sl:trackRef.current.scrollLeft};}}
            onMouseMove={e=>{if(!drag.current.on)return;e.preventDefault();const x=e.pageX-trackRef.current.offsetLeft;trackRef.current.scrollLeft=drag.current.sl-(x-drag.current.x)*1.5;}}
            onMouseUp={()=>{drag.current.on=false;}} onMouseLeave={()=>{drag.current.on=false;}}>
            {BOOKS.map(b=>(
              <div key={b.id} data-bc>
                <BookCard b={b} isOpen={openId===b.id} onToggle={()=>setOpenId(p=>p===b.id?-1:b.id)}/>
              </div>
            ))}
          </div>
          <button className="swipe-btn" onClick={()=>trackRef.current?.scrollBy({left:300,behavior:"smooth"})}
            style={{position:"absolute",top:"50%",right:"1rem",transform:"translateY(-60%)",width:48,height:48,border:"1px solid rgba(201,168,76,0.3)",background:"rgba(15,14,12,0.85)",backdropFilter:"blur(8px)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:G,fontSize:"1.2rem",cursor:"pointer",zIndex:10}}>›</button>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:"0.5rem",marginTop:"1rem"}}>
          {BOOKS.map((_,i)=>(
            <div key={i} onClick={()=>scrollTo(i)} style={{width:dot===i?22:6,height:6,borderRadius:3,background:dot===i?G:"rgba(201,168,76,0.25)",transition:"all 0.3s",cursor:"pointer"}}/>
          ))}
        </div>
        {openId>=0 && <Panel b={BOOKS[openId]} onClose={()=>setOpenId(-1)}/>}
      </section>
      <section ref={featRef} className={`reveal${featVis?" on":""}`} style={{padding:"4.5rem 2.5rem",borderTop:"1px solid rgba(201,168,76,0.08)"}}>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.62rem",letterSpacing:"0.3em",textTransform:"uppercase",color:G,display:"block",textAlign:"center",marginBottom:"0.7rem"}}>왜 FOLIO인가</span>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.8rem,4.5vw,3rem)",fontWeight:700,color:CREAM,textAlign:"center",marginBottom:"2.5rem"}}>
          클럽의 <em style={{fontStyle:"italic",color:"rgba(245,240,232,0.35)"}}>특별함</em>
        </h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1.5rem",maxWidth:1000,margin:"0 auto"}}>
          {[
            {n:"01",name:"큐레이티드 선정",desc:"매달 전문 에디터와 AI가 협업해 엄선한 10권을 추천합니다."},
            {n:"02",name:"라이브 토론",desc:"매주 목요일 저녁, 저자와 독자가 함께하는 라이브 세션."},
            {n:"03",name:"독서 노트",desc:"하이라이트와 메모를 클럽 멤버와 공유하고 토론하세요."},
            {n:"04",name:"북 박스",desc:"실물 책과 큐레이션 굿즈를 매달 문 앞으로 배송합니다."},
          ].map(f=>(
            <div key={f.n} className="feat-item" style={{textAlign:"center",padding:"1.8rem 1.4rem",border:"1px solid rgba(201,168,76,0.08)",borderRadius:8}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"2.5rem",fontWeight:900,color:G,opacity:0.3,lineHeight:1,marginBottom:"0.4rem"}}>{f.n}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,color:CREAM,marginBottom:"0.5rem"}}>{f.name}</div>
              <div style={{fontSize:"0.78rem",color:"rgba(245,240,232,0.4)",lineHeight:1.7}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
      <footer style={{borderTop:"1px solid rgba(201,168,76,0.1)",padding:"2rem 2.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontWeight:900,color:G,letterSpacing:"0.3em"}}>FOLIO.</span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.58rem",letterSpacing:"0.15em",color:"rgba(245,240,232,0.2)",textTransform:"uppercase"}}>© 2026 Folio Book Club · 서울</span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.58rem",letterSpacing:"0.15em",color:"rgba(245,240,232,0.2)",textTransform:"uppercase"}}>독서가 일상이 되는 공간</span>
      </footer>
    </div>
  );
}