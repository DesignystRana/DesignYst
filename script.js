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
