const DATA_URL = "projects.json";
let projects = [];
let showreelUrl = "";
const categories = [
  "Animation & Motion",
  "Motion Design — No Face",
  "Talking Head — Long Form",
  "AI Creations",
  "Gaming",
  "Podcast Shorts",
  "Tech Shorts",
  "Real Estate Shorts",
  "Gaming Shorts"
];
function youtubeId(url){
  try{
    const u=new URL(url);
    if(u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if(u.pathname.includes("/shorts/")) return u.pathname.split("/shorts/")[1].split("/")[0];
    return u.searchParams.get("v") || "";
  }catch(e){return "";}
}
function thumb(id){
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
function renderProjects(){
  const root=document.getElementById("project-sections");
  root.innerHTML="";
  categories.forEach((category,sectionIndex)=>{
    const items=projects.filter(p=>p.category===category);
    if(!items.length)return;
    const section=document.createElement("section");
    section.className="project-section reveal";
    const shell=document.createElement("div");
    shell.className="section-shell";
    shell.innerHTML=`<div class="section-heading"><div><p class="eyebrow">SELECTED PROJECTS / ${String(sectionIndex+2).padStart(2,"0")}</p><h2>${category}<span class="red-dot">.</span></h2></div><span class="section-count">${String(items.length).padStart(2,"0")} PROJECT${items.length===1?"":"S"}</span></div>`;
    const grid=document.createElement("div");
    grid.className="project-grid";
    items.forEach((p,i)=>{
      const id=youtubeId(p.url);
      const card=document.createElement("button");
      card.className=`project-card ${p.type==="portrait"?"portrait":""}`;
      card.setAttribute("aria-label",`Play ${p.title}`);
      card.innerHTML=`<div class="thumb-wrap"><img loading="lazy" src="${thumb(id)}" alt="${p.title} thumbnail"><span class="thumb-play"><span>▶</span></span></div><div class="card-meta"><div><div class="card-title">${p.title}</div><div class="card-type">${category}</div></div><span class="card-index">${String(i+1).padStart(2,"0")}</span></div>`;
      card.addEventListener("click",()=>openPlayer(p.url,p.type));
      grid.appendChild(card);
    });
    shell.appendChild(grid);section.appendChild(shell);root.appendChild(section);
  });
  observeReveals();
}
const modal=document.getElementById("video-modal"), frame=document.getElementById("modal-frame");
function openPlayer(url,type="landscape"){
  const id=url==="SHOWREEL"?youtubeId(showreelUrl):youtubeId(url);
  if(!id)return;
  frame.className=`modal-frame ${type==="portrait"?"portrait":""}`;
  frame.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="DesignYst video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
}
function closePlayer(){
  modal.classList.remove("open");modal.setAttribute("aria-hidden","true");frame.innerHTML="";document.body.style.overflow="";
}
document.querySelectorAll('[data-play-url="SHOWREEL"]').forEach(el=>el.addEventListener("click",()=>openPlayer("SHOWREEL")));
document.getElementById("modal-close").addEventListener("click",closePlayer);
modal.addEventListener("click",e=>{if(e.target===modal)closePlayer()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closePlayer()});
function observeReveals(){
  const els=document.querySelectorAll(".reveal:not(.visible)");
  if(!("IntersectionObserver" in window)){els.forEach(e=>e.classList.add("visible"));return;}
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");io.unobserve(entry.target)}}),{threshold:.08});
  els.forEach(el=>io.observe(el));
}
fetch(DATA_URL).then(r=>r.json()).then(data=>{projects=data.projects;showreelUrl=data.showreel;renderProjects()}).catch(()=>{document.getElementById("project-sections").innerHTML='<p style="padding:40px;color:#aaa">Could not load projects.json. Make sure it is uploaded beside index.html.</p>'});
observeReveals();


// Interactive smoke field: drifting vapor is pushed into a swirl by the pointer.
(() => {
  const canvas = document.getElementById("smoke-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w = 0, h = 0, dpr = 1, puffs = [], last = 0;
  const pointer = { x: -1000, y: -1000, px: -1000, py: -1000, active: false };
  const rand = (a,b) => a + Math.random() * (b-a);
  function resize(){
    const r=canvas.getBoundingClientRect();
    w=r.width; h=r.height; dpr=Math.min(devicePixelRatio||1,1.5);
    canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.min(115,Math.max(65,Math.floor(w*h/11500)));
    puffs=Array.from({length:count},()=>({
      x:rand(-80,w+80), y:rand(-80,h+80), r:rand(35,115),
      vx:rand(-.24,.24), vy:rand(-.32,.12), a:rand(.035,.105),
      phase:rand(0,Math.PI*2), tint:Math.random()
    }));
  }
  function draw(t){
    const dt=Math.min(2,(t-last)/16.67||1); last=t;
    ctx.clearRect(0,0,w,h);
    for(const p of puffs){
      if(!reduceMotion){
        p.phase+=.008*dt;
        p.x+= (p.vx+Math.sin(p.phase)*.18)*dt;
        p.y+= (p.vy+Math.cos(p.phase*.7)*.12)*dt;
      }
      if(pointer.active){
        const dx=p.x-pointer.x, dy=p.y-pointer.y, dist=Math.hypot(dx,dy)||1;
        const radius=210;
        if(dist<radius){
          const force=(1-dist/radius)*1.65;
          const swirl=.85;
          p.vx+=(dx/dist*force - dy/dist*swirl)*.075*dt;
          p.vy+=(dy/dist*force + dx/dist*swirl)*.075*dt;
          p.a=Math.max(.012,p.a*.94);
        }else p.a=Math.min(p.tint?.105:.09,p.a+.00035*dt);
      } else p.a=Math.min(p.tint?.105:.09,p.a+.0002*dt);
      p.vx*=.986; p.vy*=.986;
      if(p.x<-p.r*2)p.x=w+p.r;
      if(p.x>w+p.r*2)p.x=-p.r;
      if(p.y<-p.r*2)p.y=h+p.r;
      if(p.y>h+p.r*2)p.y=-p.r;
      const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
      const dark=p.tint>.55;
      g.addColorStop(0,dark?`rgba(24,8,15,${p.a*1.65})`:`rgba(225,177,185,${p.a})`);
      g.addColorStop(.48,dark?`rgba(48,18,28,${p.a*.9})`:`rgba(155,103,115,${p.a*.75})`);
      g.addColorStop(1,"rgba(80,25,38,0)");
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    }
    if(!reduceMotion) requestAnimationFrame(draw);
  }
  const interactionArea = canvas.closest(".hero-smoke") || canvas;
  interactionArea.addEventListener("pointermove",e=>{
    const r=canvas.getBoundingClientRect();
    pointer.px=pointer.x;pointer.py=pointer.y;
    pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;pointer.active=true;
  },{passive:true});
  interactionArea.addEventListener("pointerleave",()=>{pointer.active=false;pointer.x=-1000;pointer.y=-1000;});
  window.addEventListener("resize",resize,{passive:true});
  resize();requestAnimationFrame(draw);
})();
