const $=id=>document.getElementById(id);
const pageNames=["Naslovna strana","Godišnji pregled","Mesečni planer","Mesečni planer","Nedeljni planer","Nedeljni planer","Nedeljni planer","Nedeljni planer","Habit tracker","Notes"];
const fonts=["Cormorant Garamond","DM Sans","Playfair Display","Montserrat","Libre Baskerville","Manrope","Inter","Lora","Raleway"];
const brandProfiles=Array.from({length:20},(_,i)=>({id:i+1,name:"Brend "+(i+1),data:{name:"",description:"",color:"#8EA386",tone:"Elegantno",heading:"Cormorant Garamond",body:"DM Sans"}}));
const palettes=[
{name:"Luxury Black & Gold",desc:"elegantno · premium · editorial",colors:["#171717","#C8A66A","#F6F1E8","#5E503F","#FFFDF8"]},
{name:"Sage Premium",desc:"mirno · moderno · prirodno",colors:["#8EA386","#F6F1E8","#26332B","#C8A66A","#FFFDF8"]},
{name:"Azure Editorial",desc:"čisto · sofisticirano · poslovno",colors:["#3D78A8","#F6F1E8","#17222B","#C8A66A","#FFFDF8"]},
{name:"Minimal Beige",desc:"minimalno · neutralno · mekano",colors:["#D8C7B0","#F6F1E8","#3A352F","#B7A38A","#FFFDF8"]},
{name:"Soft Rose",desc:"feminino · nežno · premium",colors:["#D9A6A6","#F8EFED","#4A3537","#C8A66A","#FFFDF8"]},
{name:"Lavender Studio",desc:"kreativno · elegantno · moderno",colors:["#B79ACB","#F5F0F8","#3E3346","#C8A66A","#FFFDF8"]},
{name:"Emerald Wealth",desc:"bogato · stabilno · luksuzno",colors:["#356B58","#F2F0E8","#15251F","#C8A66A","#FFFDF8"]},
{name:"Monochrome",desc:"čisto · snažno · bezvremensko",colors:["#171717","#F5F5F5","#777","#BDBDBD","#FFF"]}];
const styles=[
{name:"Luksuzni",desc:"crno, zlatno, elegantno",palette:0,heading:"Cormorant Garamond",body:"DM Sans",radius:8,shadow:"0 22px 55px rgba(0,0,0,.16)"},
{name:"Minimalistički",desc:"čist, prozračan, neutralan",palette:3,heading:"Playfair Display",body:"Inter",radius:4,shadow:"0 12px 30px rgba(0,0,0,.08)"},
{name:"Editorial",desc:"magazinski, sofisticiran",palette:0,heading:"Libre Baskerville",body:"Manrope",radius:2,shadow:"0 18px 40px rgba(0,0,0,.12)"},
{name:"Ženstveni",desc:"nežan, moderan, premium",palette:4,heading:"Lora",body:"DM Sans",radius:12,shadow:"0 18px 45px rgba(0,0,0,.10)"},
{name:"Wellness",desc:"prirodan, smiren, topao",palette:1,heading:"Cormorant Garamond",body:"DM Sans",radius:14,shadow:"0 18px 42px rgba(0,0,0,.10)"},
{name:"Poslovni",desc:"precizan, moderan, pouzdan",palette:2,heading:"Montserrat",body:"Inter",radius:6,shadow:"0 14px 32px rgba(0,0,0,.10)"},
{name:"Kreativni",desc:"izražajan, savremen, drugačiji",palette:5,heading:"Raleway",body:"Manrope",radius:16,shadow:"0 20px 50px rgba(0,0,0,.14)"},
{name:"Wealth",desc:"bogato, stabilno, sofisticirano",palette:6,heading:"Playfair Display",body:"DM Sans",radius:10,shadow:"0 22px 55px rgba(0,0,0,.16)"}];
const state={
name:"Moj Premium Planner",format:"A5",pages:10,active:1,headingFont:"Cormorant Garamond",bodyFont:"DM Sans",
color:"#8EA386",opacity:100,gradientStart:"#171717",gradientEnd:"#C8A66A",gradientAngle:135,savedColors:[],palette:"sage",style:"wellness",
brandProfile:1,selectedElement:null,previewMode:false,history:[],historyIndex:-1,
elements:{}
};
function uid(){return"el_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,7)}
function normalizeHex(v){v=(v||"").trim();if(!v.startsWith("#"))v="#"+v;return /^#[0-9a-fA-F]{6}$/.test(v)?v.toUpperCase():null}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function pageKey(){return String(state.active)}
function ensurePage(page=state.active){
 const k=String(page);
 if(!state.elements[k])state.elements[k]=[
  {id:uid(),type:"text",text:page===1?state.name:(pageNames[page-1]||"Nova stranica"),x:11,y:20,w:78,h:14,font:state.headingFont,fontSize:30,color:page===1?"#E7D2A7":"#171717",align:"center",rotate:0,opacity:100,locked:false},
  {id:uid(),type:"text",text:page===1?"Premium digitalni proizvod — spreman za dalju AI izradu i uređivanje.":"Ova stranica je deo strukture projekta. Klikni element i menjaj ga.",x:14,y:38,w:72,h:18,font:state.bodyFont,fontSize:10,color:page===1?"#E7D2A7":"#555555",align:"center",rotate:0,opacity:75,locked:false}
 ];
}
function snapshot(){return JSON.stringify({elements:state.elements,pages:state.pages,active:state.active})}
function pushHistory(){
 const s=snapshot(); if(state.history[state.historyIndex]===s)return;
 state.history=state.history.slice(0,state.historyIndex+1);state.history.push(s);if(state.history.length>40)state.history.shift();state.historyIndex=state.history.length-1;
}
function restoreSnapshot(s){
 const x=JSON.parse(s);state.elements=x.elements;state.pages=x.pages;state.active=x.active;state.selectedElement=null;render();
}
function undo(){if(state.historyIndex>0){state.historyIndex--;restoreSnapshot(state.history[state.historyIndex])}}
function redo(){if(state.historyIndex<state.history.length-1){state.historyIndex++;restoreSnapshot(state.history[state.historyIndex])}}
function applyPalette(index){
 const p=palettes[index]; if(!p)return;
 document.documentElement.style.setProperty("--ivory",p.colors[2]||"#F6F1E8");document.documentElement.style.setProperty("--paper",p.colors[4]||"#FFFDF8");
 document.documentElement.style.setProperty("--ink",p.colors[0]);document.documentElement.style.setProperty("--gold",p.colors[1]||"#C8A66A");
 document.documentElement.style.setProperty("--sage",p.colors[0]);state.palette=p.name;
 state.color=p.colors[0];if($("colorPicker"))$("colorPicker").value=p.colors[0];if($("hexInput"))$("hexInput").value=p.colors[0];
 updateColorInfo();render();
}
function applyStyle(index){
 const s=styles[index];if(!s)return;state.style=s.name;state.headingFont=s.heading;state.bodyFont=s.body;
 document.documentElement.style.setProperty("--radius",s.radius+"px");document.documentElement.style.setProperty("--preview-shadow",s.shadow);
 applyPalette(s.palette);$("headingFont").value=s.heading;$("bodyFont").value=s.body;render();
}
function updateColor(v){
 const x=normalizeHex(v);if(!x)return;state.color=x;$("colorPicker").value=x;$("hexInput").value=x;updateColorInfo();
}
function updateColorInfo(){
 const h=state.color.replace("#",""),r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
 const mx=Math.max(r,g,b)/255,mn=Math.min(r,g,b)/255,l=(mx+mn)/2,d=mx-mn;let s=0,hh=0;if(d){s=d/(1-Math.abs(2*l-1));if(mx===r)hh=60*(((g-b)/255/d)%6);else if(mx===g)hh=60*((b-r)/255/d+2);else hh=60*((r-g)/255/d+4);if(hh<0)hh+=360}
 $("rgbValue").textContent="RGB "+r+", "+g+", "+b;$("hslValue").textContent="HSL "+Math.round(hh)+"°, "+Math.round(s*100)+"%, "+Math.round(l*100)+"%";
}
function render(){
 state.name=$("projectName").value;state.format=$("format").value;state.pages=Math.max(1,Math.min(30,Number($("pageCount").value)||10));
 if(state.active>state.pages)state.active=state.pages;ensurePage();
 $("stageTitle").textContent=state.name;
 const strip=$("pagesStrip"),list=$("pageList");strip.innerHTML="";list.innerHTML="";
 for(let i=1;i<=state.pages;i++){
  const name=pageNames[i-1]||"Strana "+i;
  const t=document.createElement("div");t.className="thumb"+(i===state.active?" active":"");t.innerHTML="<div>"+i+"</div><span>"+esc(name)+"</span>";t.onclick=()=>{state.active=i;state.selectedElement=null;ensurePage();render()};strip.appendChild(t);
  const item=document.createElement("div");item.className="page-item"+(i===state.active?" active":"");item.innerHTML='<span class="page-no">'+String(i).padStart(2,"0")+'</span><span>'+esc(name)+'</span>';item.onclick=t.onclick;list.appendChild(item)
 }
 $("fontPreview").querySelector("strong").style.fontFamily='"'+state.headingFont+'"';$("fontPreview").querySelector("span").style.fontFamily='"'+state.bodyFont+'"';
 renderPreview();renderElementInspector();
}
function renderPreview(){
 const p=$("preview");p.className="preview"+(state.active===1?" cover":"")+(state.previewMode?" preview-mode":"");p.innerHTML="";
 ensurePage();
 const pageBg=state.active===1?"linear-gradient(145deg,#121212,#28251f)":"var(--paper)";p.style.background=pageBg;p.style.setProperty("--body-font",'"'+state.bodyFont+'"');
 state.elements[pageKey()].forEach(el=>{
  const d=document.createElement("div");d.className="design-element "+el.type+"-element"+(el.id===state.selectedElement?" selected":"")+(el.locked?" locked":"");
  d.dataset.id=el.id;d.style.left=el.x+"%";d.style.top=el.y+"%";d.style.width=el.w+"%";d.style.height=el.h+"%";d.style.opacity=(el.opacity??100)/100;d.style.transform="rotate("+(el.rotate||0)+"deg)";d.style.fontFamily='"'+(el.font||state.bodyFont)+'"';d.style.fontSize=(el.fontSize||12)+"px";d.style.color=el.color||"#171717";d.style.textAlign=el.align||"left";
  if(el.type==="text"||el.type==="link")d.textContent=el.text||"Tekst";
  else if(el.type==="image"){const img=document.createElement("img");img.src=el.src;img.alt=el.alt||"";img.style.borderRadius=(el.radius||0)+"px";img.style.boxShadow=el.shadow?"0 10px 25px rgba(0,0,0,.16)":"none";d.appendChild(img)}
  else if(el.type==="mockup"){const img=document.createElement("img");img.src=el.src||mockupSvg(el.mockup||"book");img.style.objectFit="contain";img.style.padding="8%";d.appendChild(img)}
  else if(el.type==="shape"){d.style.background=el.color||"#C8A66A";d.style.borderRadius=(el.radius||12)+"px"}
  else if(el.type==="icon"){d.textContent=el.text||"✦"}
  else if(el.type==="divider")d.innerHTML="";
  else if(el.type==="video")d.innerHTML="▶ Video<br><small>"+esc(el.url||"Dodaj video URL")+"</small>";
  else if(el.type==="table")d.innerHTML="▦ Tabela<br><small>3 × 4</small>";
  else if(el.type==="chart")d.innerHTML="◒ Grafikon<br><small>Podaci za vizuelizaciju</small>";
  if(!state.previewMode&&!el.locked){const h=document.createElement("span");h.className="resize-handle";d.appendChild(h)}
  d.addEventListener("pointerdown",e=>startDrag(e,el));d.addEventListener("click",e=>{e.stopPropagation();state.selectedElement=el.id;render()});p.appendChild(d);
 });
 p.onclick=()=>{state.selectedElement=null;renderElementInspector()}
}
function startDrag(e,el){
 if(state.previewMode||el.locked)return;
 e.preventDefault();e.stopPropagation();pushHistory();
 const p=$("preview"),rect=p.getBoundingClientRect(),sx=e.clientX,sy=e.clientY,ox=el.x,oy=el.y;
 const move=ev=>{el.x=Math.max(0,Math.min(100-el.w,ox+(ev.clientX-sx)/rect.width*100));el.y=Math.max(0,Math.min(100-el.h,oy+(ev.clientY-sy)/rect.height*100));renderPreview();renderElementInspector()};
 const up=()=>{document.removeEventListener("pointermove",move);document.removeEventListener("pointerup",up);};
 document.addEventListener("pointermove",move);document.addEventListener("pointerup",up);
 state.selectedElement=el.id;renderElementInspector();
}
function selected(){return state.elements[pageKey()]?.find(x=>x.id===state.selectedElement)}
function renderElementInspector(){
 const box=$("elementInspector"),el=selected();if(!el){box.hidden=true;return}box.hidden=false;
 $("elementTypeLabel").textContent=({text:"TEKST",image:"SLIKA",mockup:"MOCKUP",shape:"OBLIK",icon:"IKONICA",link:"POVEZIVANJE",video:"VIDEO",table:"TABELA",chart:"GRAFIKON",divider:"LINIJA"})[el.type]||el.type.toUpperCase();
 $("elementContent").value=el.text||el.url||"";$("elementSize").value=el.fontSize||12;$("elementRotate").value=el.rotate||0;$("elementX").value=Math.round(el.x);$("elementY").value=Math.round(el.y);$("elementColor").value=normalizeHex(el.color||"#171717")||"#171717";
 const fs=$("elementFont");fs.innerHTML=fonts.map(x=>"<option>"+x+"</option>").join("");fs.value=el.font||state.bodyFont;
 document.querySelectorAll("[data-align]").forEach(b=>b.classList.toggle("active",b.dataset.align===(el.align||"left")));
}
function insertElement(type,extra={}){
 ensurePage();pushHistory();
 const el={id:uid(),type,x:12,y:18,w:76,h:20,opacity:100,rotate:0,locked:false,...extra};state.elements[pageKey()].push(el);state.selectedElement=el.id;render();closeInsertPanel();addMessage("Element je dodat na aktivnu stranu.");
}
function mockupSvg(kind){
 const labels={book:"BOOK MOCKUP",tablet:"TABLET",phone:"PHONE",laptop:"LAPTOP",planner:"PLANNER"};
 const label=labels[kind]||"MOCKUP";return"data:image/svg+xml;charset=UTF-8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="100%" height="100%" fill="#f6f1e8"/><rect x="45" y="45" width="510" height="710" rx="24" fill="#171717"/><rect x="75" y="75" width="450" height="650" rx="10" fill="#8ea386"/><text x="300" y="410" text-anchor="middle" font-family="Georgia" font-size="42" fill="#fff">'+label+'</text></svg>')}
function insertBy(kind){
 if(kind==="upload"){$("imageUpload").click();return}
 if(kind==="url"){const url=prompt("Nalepi URL slike:");if(url)insertElement("image",{src:url,alt:"Ubačena slika",w:76,h:42,radius:10,shadow:true});return}
 if(kind==="ai"){const q=prompt("Opiši kakvu sliku želiš:");if(q)insertElement("image",{src:mockupSvg("planner"),alt:q,w:76,h:42,radius:12,shadow:true,aiPrompt:q});return}
 if(kind==="mockup"){insertElement("mockup",{mockup:"book",src:mockupSvg("book"),w:58,h:48});return}
 if(kind==="shape"){insertElement("shape",{text:"",w:76,h:18,color:state.color,radius:12});return}
 if(kind==="icon"){insertElement("icon",{text:"✦",w:16,h:12,fontSize:34,color:state.color});return}
 if(kind==="link"){const url=prompt("Unesi URL za povezivanje:");if(url)insertElement("link",{text:"Otvori povezani sadržaj",url,w:65,h:9,font:state.bodyFont,fontSize:11,color:"#3D78A8",align:"center"});return}
 if(kind==="video"){const url=prompt("Unesi video URL:");if(url)insertElement("video",{url,w:76,h:24});return}
 if(kind==="table"){insertElement("table",{w:76,h:25});return}
 if(kind==="chart"){insertElement("chart",{w:76,h:28});return}
 if(kind==="text"){insertElement("text",{text:"Novi tekst",w:76,h:15,font:state.bodyFont,fontSize:14,color:"#171717",align:"left"});return}
 if(kind==="divider"){insertElement("divider",{w:70,h:2,color:state.color});}
}
function closeInsertPanel(){$("insertPanel").hidden=true}
function addPage(){
 pushHistory();state.pages++;state.active=state.pages;ensurePage();$("pageCount").value=state.pages;render();addMessage("Nova strana je dodata.")
}
function duplicatePage(){
 pushHistory();const src=state.elements[pageKey()]||[];state.pages++;state.active=state.pages;state.elements[pageKey()]=JSON.parse(JSON.stringify(src)).map(x=>({...x,id:uid()}));$("pageCount").value=state.pages;render();addMessage("Strana je duplirana.")
}
function deleteElement(){if(!selected())return;pushHistory();state.elements[pageKey()]=state.elements[pageKey()].filter(x=>x.id!==state.selectedElement);state.selectedElement=null;render()}
function saveProject(){
 localStorage.setItem("marijanaDesignStudioProject",JSON.stringify({...state,history:[],historyIndex:-1}));addMessage("Projekat je sačuvan lokalno u ovom pregledaču.");
}
function loadProject(){
 try{const raw=localStorage.getItem("marijanaDesignStudioProject");if(!raw)return;const x=JSON.parse(raw);Object.assign(state,x);state.history=[];state.historyIndex=-1;$("projectName").value=state.name;$("format").value=state.format;$("pageCount").value=state.pages}catch(e){}
}
function addMessage(text,type="ai"){const m=document.createElement("div");m.className="msg "+type;m.textContent=text;$("messages").appendChild(m);$("messages").scrollTop=99999}
function parseDesignCommand(value){
 const v=value.toLowerCase();
 const pageMatch=v.match(/(?:stran(?:a|i)|page)\\s*(\\d+)/i);
 if(pageMatch){const n=Math.max(1,Math.min(state.pages,Number(pageMatch[1])));state.active=n}
 if(/(?:dodaj|ubaci).*(?:slik|fotograf)/.test(v)){insertElement("image",{src:mockupSvg("planner"),alt:value,w:70,h:40,radius:10,shadow:true,aiPrompt:value});return "Dodala sam vizuelni blok na aktivnu stranu. Možeš ga pomerati i menjati u Element panelu."}
 if(/(?:mockup|makap)/.test(v)){const kind=/telefon|phone/.test(v)?"phone":/tablet/.test(v)?"tablet":/laptop/.test(v)?"laptop":/planner/.test(v)?"planner":"book";insertElement("mockup",{mockup:kind,src:mockupSvg(kind),w:55,h:45});return "Dodala sam "+kind+" mockup na aktivnu stranu."}
 if(/(?:dodaj|ubaci).*(?:tekst|naslov)/.test(v)){insertElement("text",{text:value.replace(/.*?(?:tekst|naslov)[:\\s]*/i,"")||"Novi tekst",w:76,h:15,font:state.bodyFont,fontSize:14,color:"#171717",align:"left"});return "Dodala sam tekstualni element."}
 if(/(?:nov|dodaj).*(?:stran|page)/.test(v)){addPage();return "Dodala sam novu stranu."}
 if(/(?:dupliraj|kopiraj).*(?:stran)/.test(v)){duplicatePage();return "Duplirala sam aktivnu stranu."}
 if(/(?:obriši|obrisi).*(?:element|slik|tekst)/.test(v)){deleteElement();return "Obrisala sam izabrani element."}
 if(/(?:undo|poništi|ponisti)/.test(v)){undo();return "Vratila sam prethodnu izmenu."}
 if(/(?:redo|ponovi)/.test(v)){redo();return "Ponovila sam poslednju izmenu."}
 if(/(?:sage|zelena|zelenu)/.test(v)){updateColor("#8EA386");return "Primeniла sam Sage Green boju."}
 if(/(?:zlat|gold)/.test(v)){updateColor("#C8A66A");return "Primeniла sam champagne gold boju."}
 if(/(?:crn|crnu|black)/.test(v)){updateColor("#171717");return "Primeniла sam crnu boju."}
 return null;
}
async function send(){
 const value=$("prompt").value.trim();if(!value)return;
 addMessage(value,"user");$("prompt").value="";
 const direct=parseDesignCommand(value);if(direct){addMessage(direct);return}
 addMessage("AI dizajner radi…");
 try{
  const response=await fetch("/api/design-agent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:value,project:{name:state.name,format:state.format,pages:state.pages,active:state.active,style:state.style,headingFont:state.headingFont,bodyFont:state.bodyFont,color:state.color}})});
  const data=await response.json();if(!response.ok)throw new Error(data.error||"AI servis nije dostupan.");
  const raw=String(data.content||"").trim();let result=null;try{result=JSON.parse(raw)}catch(e){const m=raw.match(/\{[\\s\\S]*\}/);if(m)try{result=JSON.parse(m[0])}catch(e2){}}
  if(result?.actions?.length) applyAIActions(result.actions);
  addMessage(result?.message||raw||"AI nije vratio odgovor.");
 }catch(e){addMessage("AI backend još nije povezan u ovom okruženju. Kada se aplikacija postavi na Vercel i doda OPENAI_API_KEY, razgovor će raditi direktno.");}
}
function applyAIActions(actions){
 pushHistory();
 for(const a of actions||[]){
  if(a.type==="select_page"){state.active=Math.max(1,Math.min(state.pages,Number(a.page)||1));ensurePage()}
  else if(a.type==="add_page"){addPage()}
  else if(a.type==="duplicate_page"){duplicatePage()}
  else if(a.type==="delete_selected"){deleteElement()}
  else if(a.type==="change_color"){updateColor(a.color)}
  else if(a.type==="change_fonts"){if(a.headingFont)state.headingFont=a.headingFont;if(a.bodyFont)state.bodyFont=a.bodyFont}
  else if(a.type==="add_element"){
   const e=a.element||{};const el={id:uid(),type:e.type||"text",text:e.text||"",url:e.url||"",mockup:e.mockup||"book",src:e.src||"",aiPrompt:e.aiPrompt||"",x:Number(e.x??12),y:Number(e.y??18),w:Number(e.w??70),h:Number(e.h??20),font:e.font||state.bodyFont,fontSize:Number(e.fontSize??14),color:e.color||state.color,align:e.align||"left",rotate:0,opacity:100,locked:false};
   if(el.type==="mockup"&&!el.src)el.src=mockupSvg(el.mockup);
   state.elements[pageKey()].push(el);state.selectedElement=el.id;
  }
 }
 render();
}
function initInsert(){
 const open=()=>{$("insertPanel").hidden=false};$("insertButton").onclick=open;$("insertButtonSide").onclick=open;$("closeInsert").onclick=closeInsertPanel;
 document.querySelectorAll("[data-insert]").forEach(b=>b.onclick=()=>insertBy(b.dataset.insert));
 document.querySelectorAll("[data-mockup]").forEach(b=>b.onclick=()=>insertElement("mockup",{mockup:b.dataset.mockup,src:mockupSvg(b.dataset.mockup),w:b.dataset.mockup==="phone"?34:58,h:48}));
 $("imageUpload").onchange=e=>{Array.from(e.target.files||[]).forEach(file=>{const reader=new FileReader();reader.onload=ev=>insertElement("image",{src:ev.target.result,alt:file.name,w:76,h:42,radius:10,shadow:true});reader.readAsDataURL(file)});e.target.value=""};
}
function initElementInspector(){
 $("closeElementInspector").onclick=()=>{state.selectedElement=null;render()};
 $("elementContent").oninput=e=>{const el=selected();if(!el)return;el.text=e.target.value;if(el.type==="link")el.url=e.target.value;renderPreview()};
 $("elementSize").oninput=e=>{const el=selected();if(el){el.fontSize=Number(e.target.value);renderPreview()}};
 $("elementRotate").oninput=e=>{const el=selected();if(el){el.rotate=Number(e.target.value);renderPreview()}};
 $("elementX").oninput=e=>{const el=selected();if(el){el.x=Number(e.target.value);renderPreview()}};
 $("elementY").oninput=e=>{const el=selected();if(el){el.y=Number(e.target.value);renderPreview()}};
 $("elementColor").oninput=e=>{const el=selected();if(el){el.color=e.target.value;renderPreview()}};
 $("elementFont").onchange=e=>{const el=selected();if(el){el.font=e.target.value;renderPreview()}};
 document.querySelectorAll("[data-align]").forEach(b=>b.onclick=()=>{const el=selected();if(el){el.align=b.dataset.align;renderElementInspector();renderPreview()}});
 $("duplicateElement").onclick=()=>{const el=selected();if(!el)return;pushHistory();const copy={...el,id:uid(),x:Math.min(80,el.x+3),y:Math.min(80,el.y+3)};state.elements[pageKey()].push(copy);state.selectedElement=copy.id;render()};
 $("deleteElement").onclick=deleteElement;
 $("moveElementFront").onclick=()=>{const el=selected();if(!el)return;pushHistory();const a=state.elements[pageKey()],i=a.findIndex(x=>x.id===el.id);a.splice(i,1);a.push(el);render()};
 $("moveElementBack").onclick=()=>{const el=selected();if(!el)return;pushHistory();const a=state.elements[pageKey()],i=a.findIndex(x=>x.id===el.id);a.splice(i,1);a.unshift(el);render()};
 $("lockElement").onclick=()=>{const el=selected();if(!el)return;el.locked=!el.locked;$("lockElement").textContent=el.locked?"Otključaj":"Zaključaj";renderPreview()};
}
function initColors(){
 $("colorPicker").oninput=e=>updateColor(e.target.value);$("hexInput").onchange=e=>{const x=normalizeHex(e.target.value);if(x)updateColor(x);else e.target.value=state.color};
 $("opacity").oninput=e=>{state.opacity=Number(e.target.value);$("opacityValue").textContent=state.opacity+"%";renderPreview()};
 $("copyHex").onclick=()=>navigator.clipboard?.writeText(state.color);$("gradientStart").oninput=e=>{state.gradientStart=e.target.value;updateGradient()};
 $("gradientEnd").oninput=e=>{state.gradientEnd=e.target.value;updateGradient()};$("gradientAngle").oninput=e=>{state.gradientAngle=Number(e.target.value);updateGradient()};
 $("copyGradient").onclick=()=>navigator.clipboard?.writeText("linear-gradient("+state.gradientAngle+"deg, "+state.gradientStart+", "+state.gradientEnd+")");
 document.querySelectorAll("[data-color]").forEach(b=>{b.style.setProperty("--preset",b.dataset.color);b.onclick=()=>{updateColor(b.dataset.color);saveColor()}});
 updateGradient();updateColorInfo();
}
function updateGradient(){$("gradientPreview").style.background="linear-gradient("+state.gradientAngle+"deg,"+state.gradientStart+","+state.gradientEnd+")"}
function saveColor(){if(!state.savedColors.includes(state.color))state.savedColors.unshift(state.color);state.savedColors=state.savedColors.slice(0,12);renderSavedColors()}
function renderSavedColors(){$("savedColors").innerHTML=state.savedColors.map(c=>'<i class="saved-color" title="'+c+'" style="background:'+c+'" data-saved="'+c+'"></i>').join("");document.querySelectorAll("[data-saved]").forEach(x=>x.onclick=()=>updateColor(x.dataset.saved))}
function initLibraries(){
 const pg=$("paletteGrid");pg.innerHTML=palettes.map((p,i)=>'<button class="palette-card" data-palette="'+i+'"><span><b class="palette-name">'+p.name+'</b><small class="palette-desc">'+p.desc+'</small></span><span class="palette-dots">'+p.colors.map(c=>'<i style="background:'+c+'"></i>').join("")+"</span></button>").join("");
 document.querySelectorAll("[data-palette]").forEach(b=>b.onclick=()=>applyPalette(Number(b.dataset.palette)));
 const sg=$("styleGrid");sg.innerHTML=styles.map((s,i)=>'<button class="style-card" data-style="'+i+'"><span class="style-icon" style="background:'+palettes[s.palette].colors[0]+';color:'+palettes[s.palette].colors[2]+'">Aa</span><span><b class="style-name">'+s.name+'</b><small class="style-desc">'+s.desc+"</small></span></button>").join("");
 document.querySelectorAll("[data-style]").forEach(b=>b.onclick=()=>applyStyle(Number(b.dataset.style)));
}
function initBrand(){
 const sel=$("brandProfile");sel.innerHTML=brandProfiles.map(p=>'<option value="'+p.id+'">'+p.name+"</option>").join("");
 function load(){const p=brandProfiles[Number(sel.value)-1];$("brandName").value=p.data.name;$("brandDescription").value=p.data.description;$("brandColor").value=p.data.color;$("brandHex").value=p.data.color;$("brandTone").value=p.data.tone;$("brandHeading").value=p.data.heading;$("brandBody").value=p.data.body}
 sel.onchange=load;$("brandButton").onclick=()=>{$("brandPanel").hidden=false};$("closeBrand").onclick=()=>{$("brandPanel").hidden=true};
 $("brandColor").oninput=e=>$("brandHex").value=e.target.value.toUpperCase();$("brandHex").onchange=e=>{const x=normalizeHex(e.target.value);if(x){$("brandHex").value=x;$("brandColor").value=x}};
 $("saveBrand").onclick=()=>{const p=brandProfiles[Number(sel.value)-1];p.data={name:$("brandName").value,description:$("brandDescription").value,color:$("brandColor").value,tone:$("brandTone").value,heading:$("brandHeading").value,body:$("brandBody").value};localStorage.setItem("marijanaBrandProfiles",JSON.stringify(brandProfiles));$("saveBrand").textContent="Sačuvano ✓";setTimeout(()=>$("saveBrand").textContent="Sačuvaj brend",1000)};
 $("applyBrand").onclick=()=>{const p=brandProfiles[Number(sel.value)-1];state.headingFont=p.data.heading;state.bodyFont=p.data.body;updateColor(p.data.color);$("headingFont").value=p.data.heading;$("bodyFont").value=p.data.body;render();$("brandPanel").hidden=true};load()
}
function initBrandStorage(){try{const x=JSON.parse(localStorage.getItem("marijanaBrandProfiles"));if(Array.isArray(x))x.forEach((p,i)=>{if(brandProfiles[i])brandProfiles[i]=p})}catch(e){}}
function init(){
 loadProject();initBrandStorage();initInsert();initElementInspector();initColors();initLibraries();initBrand();
 $("send").onclick=send;$("prompt").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}});
 document.querySelectorAll("[data-prompt]").forEach(b=>b.onclick=()=>{$("prompt").value=b.dataset.prompt;send()});
 $("projectName").oninput=render;$("format").onchange=render;$("pageCount").oninput=render;$("headingFont").onchange=e=>{state.headingFont=e.target.value;render()};$("bodyFont").onchange=e=>{state.bodyFont=e.target.value;render()};
 $("newProject").onclick=()=>{pushHistory();state.name="Novi projekat";state.pages=10;state.active=1;state.elements={};$("projectName").value=state.name;$("pageCount").value=10;ensurePage();render();addMessage("Novi projekat je spreman. Opiši šta želiš da napravimo.")};
 $("save").onclick=saveProject;$("undoBtn").onclick=undo;$("redoBtn").onclick=redo;$("addPage").onclick=addPage;$("duplicatePage").onclick=duplicatePage;
 $("previewMode").onclick=()=>{state.previewMode=!state.previewMode;$("previewMode").textContent=state.previewMode?"Uredi":"Pregled";render()};
 const exportBtn=document.createElement("button");exportBtn.className="ghost-btn";exportBtn.textContent="Izvezi";exportBtn.onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=(state.name||"projekat")+".json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};$("save").parentElement.appendChild(exportBtn);
 ensurePage();pushHistory();render();renderSavedColors();
}
init();
