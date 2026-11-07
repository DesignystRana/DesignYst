const DATA_URL = "projects.json";
let projects = [];
let showreelUrl = "";
const categories = [
  "Videos",
  "Shorts",
  "Design",
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
    ? `https://drive.google.com/thumbnail?id=${id.slice(6)}&sz=w400`
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
    group.className="work-category"+(category==="Shorts"?" shorts-category":category==="Design"?" design-category":"");
    const heading=document.createElement("div");
    heading.className="work-category-heading";
    heading.innerHTML='<div><p class="eyebrow">CATEGORY / '+String(sectionIndex+1).padStart(2,"0")+'</p><h3>'+category+'<span class="red-dot">.</span></h3></div><span class="section-count">'+String(items.length).padStart(2,"0")+(category==="Design"?" DESIGNS":" VIDEOS")+'</span>';
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


// Lightweight static hero: disable the canvas animation to avoid browser freezes.
(() => {
  const canvas = document.getElementById("smoke-canvas");
  if (canvas) canvas.style.display = "none";
})();
