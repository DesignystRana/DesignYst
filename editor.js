(() => {
  const panel=document.getElementById("site-editor");
  const backdrop=document.getElementById("editor-backdrop");
  const launch=document.getElementById("editor-launch");
  const close=document.getElementById("editor-close");
  const toggle=document.getElementById("editor-toggle");
  const save=document.getElementById("editor-save");
  const exportBtn=document.getElementById("editor-export");
  const status=document.getElementById("editor-status");
  if(!panel||!launch)return;
  let editing=false;
  let savedDraft=null;
  const selector="h1,h2,h3,p,a,span,.card-title,.card-type,.section-count,.eyebrow,.smoke-hint,footer";
  function targets(){
    document.querySelectorAll(selector).forEach((el,i)=>{
      if(el.closest(".site-editor")||el.closest(".modal")||el.id==="editor-launch"||!el.textContent.trim())return;
      if(el.children.length&&!el.matches("h1,h2,h3,a"))return;
      if(!el.dataset.editorKey)el.dataset.editorKey=el.tagName.toLowerCase()+"-"+i;
      el.dataset.editorTarget="true";
      el.contentEditable=editing?"true":"false";
      el.spellcheck=editing;
      const value=savedDraft?.items?.[el.dataset.editorKey];
      if(typeof value==="string"&&el.innerHTML!==value)el.innerHTML=value;
    });
  }
  function open(){panel.classList.add("open");backdrop.classList.add("open");panel.setAttribute("aria-hidden","false");}
  function shut(){panel.classList.remove("open");backdrop.classList.remove("open");panel.setAttribute("aria-hidden","true");}
  function collect(){
    const items={};
    document.querySelectorAll("[data-editor-key]").forEach(el=>items[el.dataset.editorKey]=el.innerHTML);
    return {version:1,site:"DesignYst",items};
  }
  try{const raw=localStorage.getItem("designyst-text-draft");if(raw)savedDraft=JSON.parse(raw);}catch(e){}
  launch.addEventListener("click",open);
  close.addEventListener("click",shut);
  backdrop.addEventListener("click",shut);
  toggle.addEventListener("click",()=>{
    editing=!editing;
    document.body.classList.toggle("editor-active",editing);
    targets();
    toggle.textContent=editing?"STOP EDITING":"START EDITING";
    status.textContent=editing?"Edit mode is on. Click outlined text to change it.":"Editing is off.";
  });
  save.addEventListener("click",()=>{
    try{savedDraft=collect();localStorage.setItem("designyst-text-draft",JSON.stringify(savedDraft));status.textContent="Draft saved in this browser.";}
    catch(e){status.textContent="Could not save. Browser storage may be full.";}
  });
  exportBtn.addEventListener("click",()=>{
    const blob=new Blob([JSON.stringify(collect(),null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="designyst-text-changes.json";a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    status.textContent="Changes exported. Share the JSON file to publish them on the live site.";
  });
  targets();
  window.addEventListener("load",targets,{once:true});
})();