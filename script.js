const DATA_URL = "projects.json";
let projects = [];
let showreelUrl = "";
const categories = [
  "Talking Head — Long Form",
  "Shorts",
  "AI Creations",
  "Gaming",
  "Motion Design — No Face",
  "Animation & Motion",
  "Gaming Shorts"
];
function youtubeId(url){
  try{
    const u=new URL(url);
    if(u.hostname.includes("drive.google.com")){
      const match=u.pathname.match(/\/file\/d\/([^/]+)/);
      return match ? "drive:"+match[1] : "";
    }
    if(u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if(u.pathname.includes("/shorts/")) return u.pathname.split("/shorts/")[1].split("/")[0];
    return u.searchParams.get("v") || "";
  }catch(e){return "";}
}
function thumb(id){
  return id.startsWith("drive:")
    ? `https://drive.google.com/thumbnail?id=${id.slice(6)}&sz=w1000`
    : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
function renderProjects(){
  const root=document.getElementById("project-sections");
  root.innerHTML="";
  const library=document.createElement("section");
  library.className="work-library section-shell reveal";
  library.id="work";
  library.innerHTML='<div class="section-heading"><div><p class="eyebrow">PORTFOLIO / SELECTED WORK</p><h2>MY <span class="outline-word">PROJECTS</span><span class="red-dot">.</span></h2></div><span class="section-count">ALL VIDEOS / ONE PAGE</span></div>';
  categories.forEach((category,sectionIndex)=>{
    const items=projects.filter(p=>p.category===category);
    if(!items.length)return;
    const group=document.createElement("div");
    group.className="work-category";
    const heading=document.createElement("div");
    heading.className="work-category-heading";
    heading.innerHTML='<div><p class="eyebrow">CATEGORY / '+String(sectionIndex+1).padStart(2,"0")+'</p><h3>'+category+'<span class="red-dot">.</span></h3></div><span class="section-count">'+String(items.length).padStart(2,"0")+' VIDEOS</span>';
    const grid=document.createElement("div");
    grid.className="project-grid";
    items.forEach((p,i)=>{
      const id=youtubeId(p.url);
      const card=document.createElement("button");
      card.className="project-card "+(p.type==="portrait"?"portrait":"");
      card.setAttribute("aria-label","Play "+p.title);
      card.innerHTML='<div class="thumb-wrap"><img loading="lazy" src="'+thumb(id)+'" alt="'+p.title+' thumbnail"><span class="thumb-play"><span>▶</span></span></div><div class="card-meta"><div><div class="card-title">'+p.title+'</div><div class="card-type">'+category+'</div></div><span class="card-index">'+String(i+1).padStart(2,"0")+'</span></div>';
      card.addEventListener("click",()=>openPlayer(p.url,p.type));
      grid.appendChild(card);
    });
    group.appendChild(heading);
    group.appendChild(grid);
    library.appendChild(group);
  });
  root.appendChild(library);
  observeReveals();
}
const modal=document.getElementById("video-modal"), frame=document.getElementById("modal-frame");
function openPlayer(url,type="landscape"){
  const id=url==="SHOWREEL"?youtubeId(showreelUrl):youtubeId(url);
  if(!id)return;
  frame.className=`modal-frame ${type==="portrait"?"portrait":""}`;
  const playerUrl=id.startsWith("drive:")
    ? `https://drive.google.com/file/d/${id.slice(6)}/preview`
    : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  frame.innerHTML=`<iframe src="${playerUrl}" title="DesignYst video player" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
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


// Interactive smoke field: visible vapor is pushed into a swirling wake by the pointer.
(() => {
  const canvas = document.getElementById("smoke-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w=0,h=0,dpr=1,puffs=[],last=0;
  const pointer={x:-2000,y:-2000,active:false};
  const rand=(a,b)=>a+Math.random()*(b-a);
  function puff(edge=false){
    let x=rand(0,w),y=rand(0,h);
    if(edge){const side=Math.floor(Math.random()*4);if(side===0)x=-100;if(side===1)x=w+100;if(side===2)y=-100;if(side===3)y=h+100;}
    const base=rand(.11,.23);
    return {x,y,r:rand(48,155),vx:rand(-.3,.3),vy:rand(-.25,.2),a:base,base,phase:rand(0,6.28),dark:Math.random()<.34};
  }
  function resize(){
    const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    puffs=Array.from({length:Math.min(180,Math.max(110,Math.round(w*h/7600)))},()=>puff());
  }
  function draw(t){
    const dt=Math.min(2,(t-last)/16.67||1);last=t;ctx.clearRect(0,0,w,h);
    for(const p of puffs){
      if(!reduced){p.phase+=.012*dt;p.x+=(p.vx+Math.sin(p.phase)*.34)*dt;p.y+=(p.vy+Math.cos(p.phase*.7)*.2)*dt;}
      let clear=false;
      if(pointer.active){
        const dx=p.x-pointer.x,dy=p.y-pointer.y,d=Math.hypot(dx,dy)||1,range=300;
        if(d<range){
          clear=d<118;
          const fall=1-d/range,force=fall*fall*4.4,swirl=fall*3;
          p.vx+=(dx/d*force-dy/d*swirl)*.15*dt;
          p.vy+=(dy/d*force+dx/d*swirl)*.15*dt;
          p.a=Math.max(.005,p.a-.022*fall*dt);
        }else p.a+=(p.base-p.a)*.014*dt;
      }else p.a+=(p.base-p.a)*.009*dt;
      p.vx*=.982;p.vy*=.982;p.x+=p.vx*dt;p.y+=p.vy*dt;
      if(p.x<-p.r*2||p.x>w+p.r*2||p.y<-p.r*2||p.y>h+p.r*2)Object.assign(p,puff(true));
      if(clear)continue;
      const r=p.r*(1+Math.sin(p.phase)*.08),g=ctx.createRadialGradient(p.x,p.y,r*.03,p.x,p.y,r);
      if(p.dark){g.addColorStop(0,`rgba(28,5,15,${p.a*1.25})`);g.addColorStop(.45,`rgba(83,17,38,${p.a*.8})`);g.addColorStop(.8,`rgba(135,37,61,${p.a*.25})`);}
      else{g.addColorStop(0,`rgba(255,222,229,${p.a})`);g.addColorStop(.4,`rgba(220,151,168,${p.a*.75})`);g.addColorStop(.76,`rgba(145,77,96,${p.a*.3})`);}
      g.addColorStop(1,"rgba(80,20,38,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();
    }
    if(!reduced)requestAnimationFrame(draw);
  }
  const area=canvas.closest(".hero-smoke")||canvas;
  area.addEventListener("pointermove",e=>{const r=canvas.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;pointer.active=true;},{passive:true});
  area.addEventListener("pointerleave",()=>{pointer.active=false;pointer.x=pointer.y=-2000;});
  window.addEventListener("resize",resize,{passive:true});resize();requestAnimationFrame(draw);
})();