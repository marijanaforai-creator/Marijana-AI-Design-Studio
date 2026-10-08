(function(){
  const KEY="marijanaProductFactory";
  const data=JSON.parse(localStorage.getItem(KEY)||"null")||{meta:{naziv:"",format:"PDF vodič",ciljnaGrupa:"",problem:"",rezultat:""},cards:{},tasks:{},updatedAt:null};
  const sections=[
    {id:"ideja",n:"01",title:"IDEJA",sub:"Od problema do jasne ideje",cards:[
      ["product-card","Product Card",["Naziv proizvoda","Kome je namenjen","Glavni problem","Glavno rešenje","Format","Šta kupac dobija","Glavni rezultat","Zašto je koristan"]],
      ["validation","Validacija ideje",["Jasnoća problema 1–5","Ciljna grupa 1–5","Korisnost 1–5","Izvodljivost 1–5","Jasnoća rezultata 1–5","Šta treba doraditi"]],
      ["idea-filter","Finalni filter",["Šta rešavam?","Kome pomažem?","Koji rezultat dajem?","Zašto je ideja korisna?","Šta je nepotrebno ili nejasno?"]]
    ]},
    {id:"proizvod",n:"02",title:"PROIZVOD",sub:"Od Product Card-a do stvarnog proizvoda",cards:[
      ["blueprint","Product Blueprint",["Cilj proizvoda","Moduli","Lekcije","Praktični delovi","Primeri","Završni rezultat","Sledeći korak"]],
      ["content-map","Content Map",["Celina 1","Celina 2","Celina 3","Praktični deo","Provera","Sledeći korak","Status"]],
      ["master-content","Master Content",["Naslov","Uvod","Glavne lekcije","Radne sveske","Checkliste","Promptovi","Akcioni zadaci","Završetak"]],
      ["quality","Kontrola kvaliteta",["Šta je jasno?","Gde postoji konfuzija?","Gde se javlja „Šta sada?“","Šta treba pojednostaviti?","Šta treba dopuniti?","Šta je završeno?","Šta treba proveriti?"]]
    ]},
    {id:"besplatan-sadrzaj",n:"03",title:"BESPLATAN SADRŽAJ",sub:"Mali problem → brzo rešenje → sledeći korak",cards:[
      ["freebie-idea","Ideja za besplatan sadržaj",["Za koga je?","Mali problem","Mali rezultat","Format","Povezani glavni proizvod","Sledeći korak"]],
      ["freebie-filter","Filter",["Rešava konkretan problem","Jasno znam kome je namenjen","Brzo se primenjuje","Daje konkretan rezultat","Jednostavan je za izradu","Povezan je sa glavnim proizvodom"]],
      ["freebie-blueprint","Blueprint",["Radni naziv","Konačni naziv","Format","Ciljna grupa","Problem","Glavni rezultat","Glavni proizvod","Šta osoba treba da zna","Šta treba da uradi","Šta treba da ima na kraju"]],
      ["page-map","Page Map",["Stranica 1","Stranica 2","Stranica 3","Stranica 4","Stranica 5","Stranica 6","Stranica 7","Stranica 8","Stranica 9","Stranica 10","Ukupan broj stranica","Glavni praktični delovi"]],
      ["freebie-final","Finalizacija",["Naslov","Podnaslov","Glavno obećanje","Kome je namenjen","Šta osoba dobija","Sadržaj spreman","Dizajn spreman","PDF proveren","Linkovi provereni","SPREMAN ZA OBJAVLJIVANJE"]]
    ]},
    {id:"email",n:"04",title:"EMAIL SISTEM",sub:"Od prijave do odnosa i ponude",cards:[
      ["email-system","Kompletan email sistem",["Besplatan sadržaj","Email lista","Welcome email","Delivery email","Value email 1","Value email 2","Value email 3","Sales email","Automatizacija","Newsletter ritam"]],
      ["customer-journey","Customer Journey",["Sadržaj","CTA","Besplatan sadržaj","Opt-in","Email","Vrednost","Ponuda","Prodaja","Isporuka","Onboarding","Sledeći proizvod"]],
      ["metrics","Email metrike",["Novi kontakti","Open rate","Click rate","Conversion","Unsubscribe","Bounce","Šta menjam na osnovu podataka"]]
    ]},
    {id:"prodaja",n:"05",title:"PRODAJNI SISTEM",sub:"Od proizvoda do kupovine",cards:[
      ["offer","Ponuda",["Proizvod","Ciljna publika","Problem","Želja","Rešenje","Glavni rezultat","Offer Stack","Bonusi","Cena"]],
      ["sales-page","Sales Page",["Hook","Naslov","Podnaslov","Problem","Želja","Rešenje","Šta dobijaš","Koristi","Za koga","Za koga nije","Bonusi","Cena","FAQ","CTA"]],
      ["proof","Social Proof",["Šta trenutno imam","Šta mogu da pokažem bez testimoniala","Kako tražim feedback","Koje dozvole su potrebne","Koji rezultat je stvaran i proverljiv"]],
      ["checkout","Checkout",["Proizvod","Cena","Plaćanje","Potvrda","Isporuka","Prvi korak","Sledeća poruka"]]
    ]},
    {id:"lansiranje",n:"06",title:"LANSIRANJE",sub:"Priprema → pažnja → odluka → kupovina",cards:[
      ["prelaunch","Pre-lansiranje",["Ciljna publika definisana","Problem jasan","Proizvod jasan","Ponuda jasna","Sales Page spreman","Checkout spreman","Isporuka jasna","Sadržaj pripremljen","CTA jasan","Datum lansiranja"]],
      ["launch-plan","Plan lansiranja",["Početak","Dan 1","Dan 2","Dan 3","Dan 4","Dan 5","Dan 6","Dan 7","Završetak"]],
      ["launch-content","Sadržaj za lansiranje",["Problem sadržaj","Edukativni sadržaj","Demonstracija","Priča / povezivanje","Prodajni sadržaj","Glavni CTA"]],
      ["launch-emails","Emaili za lansiranje",["Email 1 — Najava","Email 2 — Problem","Email 3 — Vrednost","Email 4 — Ponuda","Email 5 — Podsetnik"]],
      ["delivery","Prva prodaja i isporuka",["Potvrda","Isporuka","Onboarding","Prvi korak","Feedback","Sledeći proizvod"]]
    ]},
    {id:"analiza",n:"07",title:"ANALIZA I RAST",sub:"Izmeri → promeni jednu stvar → ponovo izmeri",cards:[
      ["launch-analysis","Analiza lansiranja",["Reach","Klikovi","Opt-in","Sales Page","Checkout","Kupovine","Prihod","Feedback","Gde je usko grlo?"]],
      ["product-ladder","Product Ladder",["Besplatan sadržaj","Ulazni proizvod","Glavni proizvod","Paket","Veći sistem","Sledeći problem"]],
      ["kpi","KPI Dashboard",["Reach","Klikovi","Novi email kontakti","Sales Page posete","Checkout posete","Prodaje","Prihod","Open rate","Click rate"]],
      ["ceo-review","CEO Review",["Najveći rezultat","Najveća lekcija","Šta ponavljam","Šta menjam","Šta publika traži","Prioritet","3 akcije"]]
    ]},
    {id:"master-plan",n:"08",title:"MASTER PLAN",sub:"Pretvori sistem u 30/60/90 dana",cards:[
      ["30-day","30-dnevni plan",["Dani 1–7 — Proizvod","Dani 8–14 — Prodajni sistem","Dani 15–21 — Besplatan sadržaj + email","Dani 22–30 — Lansiranje + analiza","Dan 30 — CEO Review"]],
      ["90-day","90-dnevni master plan",["Dani 1–30 — Temelji","Dani 31–60 — Optimizacija","Dani 61–90 — Proširenje","Glavni cilj","Najvažnija metrika","Sledeći proizvod"]],
      ["scoreboard","Scoreboard",["Ideja","Proizvod","Besplatan sadržaj","Email lista","Email sekvenca","Prodajna stranica","Checkout","Lansiranje","Prve prodaje","Analiza","Sledeći korak"]]
    ]}
  ];
  const prompts={
    "product-card":"Na osnovu unetih informacija napravi jasan Product Card. Ne izmišljaj činjenice; nedostajuće označi [DOPUNITI].",
    blueprint:"Na osnovu Product Card-a napravi jednostavan Product Blueprint: cilj, moduli, lekcije, praktični delovi, primeri, završni rezultat i sledeći korak.",
    "content-map":"Na osnovu Blueprint-a napravi Content Map. Za svaku celinu navedi cilj, šta korisnik uči, šta radi, praktični deo, rezultat i status.",
    "master-content":"Organizuj postojeći sadržaj u Master Content Document bez menjanja osnovnih ideja. Nedostajuće označi [DOPUNITI].",
    quality:"Auditiraj proizvod kao potpuni početnik. Pronađi nejasnoće, rupe, ponavljanja i trenutke „Šta sada?“. Daj preporučene izmene.",
    "freebie-idea":"Predloži konkretan besplatan sadržaj koji rešava mali problem i prirodno vodi ka glavnom proizvodu.",
    "freebie-blueprint":"Napravi jednostavan Blueprint besplatnog sadržaja: uvod, 2–5 celina, praktični deo, rezultat, završna provera i sledeći korak.",
    "page-map":"Na osnovu sadržaja napravi Page Map. Jedna stranica ima jednu glavnu svrhu. Dodaj naslov, svrhu, tip i status.",
    "email-system":"Napravi jednostavan email sistem: Welcome, Delivery, 3–4 Value emaila, Sales email i osnovnu automatizaciju.",
    "sales-page":"Napravi strukturu prodajne stranice: Hook, naslov, podnaslov, problem, želja, rešenje, sadržaj, koristi, publika, bonusi, cena, FAQ i CTA.",
    "launch-plan":"Napravi realan 7-dnevni plan lansiranja od pripreme do završetka. Bez nerealnih obećanja.",
    "launch-content":"Napravi sadržaj za lansiranje: problem, edukacija, demonstracija, povezivanje, prodaja i glavni CTA.",
    "launch-emails":"Napiši nacrte 5 emailova za lansiranje: najava, problem, vrednost, ponuda, podsetnik.",
    "launch-analysis":"Analiziraj funnel i pronađi najverovatnije usko grlo na osnovu dostupnih brojeva. Ne izmišljaj podatke.",
    kpi:"Pretvori podatke u kratak CEO pregled: šta radi, šta ne radi, gde je najveći pad i koja je jedna prioritetna promena.",
    "30-day":"Pretvori ovaj sistem u konkretan 30-dnevni plan: proizvod, prodajni sistem, besplatan sadržaj, email, lansiranje i analiza.",
    "90-day":"Pretvori cilj u 90-dnevni plan: temelji, optimizacija i proširenje."
  };
  function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
  function save(){data.updatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(data));const x=document.querySelector("#pfSaveState");if(x)x.textContent="Sačuvano";}
  function fieldKey(card,label){return card+"::"+label}
  function get(card,label){return data.cards[fieldKey(card,label)]||""}
  function set(card,label,v){data.cards[fieldKey(card,label)]=v;save()}
  function allText(){return Object.entries(data.cards).map(([k,v])=>k+": "+v).filter(x=>x.split(": ").slice(1).join(": ").trim()).join("\\n");}
  function open(){document.getElementById("pfOverlay").hidden=false;renderNav();render()}
  function close(){document.getElementById("pfOverlay").hidden=true}
  function renderNav(){
    const nav=document.getElementById("pfNav");
    nav.innerHTML=sections.map((s,i)=>'<button class="pf-nav '+(i===0?"active":"")+'" data-sec="'+s.id+'"><b>'+s.n+'</b><span>'+s.title+'</span></button>').join("");
    nav.querySelectorAll(".pf-nav").forEach(b=>b.onclick=()=>{document.querySelectorAll(".pf-nav").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.sec)});
  }
  function render(secId){
    const id=secId||document.querySelector(".pf-nav.active")?.dataset.sec||"ideja";
    const s=sections.find(x=>x.id===id)||sections[0];
    const main=document.getElementById("pfMain");
    main.innerHTML='<div class="pf-section-head"><div><span class="pf-kicker">PRODUCT FACTORY · '+s.n+'</span><h2>'+s.title+'</h2><p>'+s.sub+'</p></div><div class="pf-section-actions"><button class="pf-ai-all" data-ai-section="'+s.id+'">✦ AI obradi ovu fazu</button></div></div><div class="pf-card-grid">'+s.cards.map(cardHtml).join("")+'</div>';
    main.querySelectorAll("textarea,input").forEach(el=>el.oninput=()=>set(el.dataset.card,el.dataset.label,el.value));
    main.querySelectorAll(".pf-ai").forEach(b=>b.onclick=()=>runAI(b.dataset.card,b.dataset.title));
    main.querySelectorAll(".pf-check").forEach(b=>b.onclick=()=>set(b.dataset.card,b.dataset.label,b.checked?"✓ Završeno":""));
    const aiAll=main.querySelector(".pf-ai-all");if(aiAll)aiAll.onclick=()=>runAISection(s);
  }
  function cardHtml(c){
    const [id,title,labels]=c;const done=labels.filter(l=>get(id,l)).length;
    return '<article class="pf-card"><div class="pf-card-head"><div><span>'+done+'/'+labels.length+'</span><h3>'+title+'</h3></div><button class="pf-ai" data-card="'+id+'" data-title="'+esc(title)+'">✦ AI</button></div>'+
      labels.map(label=>{
        const isCheck=/^(Jasno|Ciljna|Korisnost|Izvodljivost|Rešava|Brzo se|Daje konkretan|Jednostavan je|Povezan je|Sadržaj spreman|Dizajn spreman|PDF proveren|Linkovi provereni|SPREMAN|Ciljna publika definisana|Problem jasan|Proizvod jasan|Ponuda jasna|Sales Page spreman|Checkout spreman|Isporuka jasna|Sadržaj pripremljen|CTA jasan|Ideja|Proizvod|Besplatan sadržaj|Email lista|Email sekvenca|Prodajna stranica|Checkout|Lansiranje|Prve prodaje|Analiza|Sledeći korak)/i.test(label);
        if(isCheck)return '<label class="pf-check-row"><input class="pf-check" data-card="'+id+'" data-label="'+esc(label)+'" type="checkbox" '+(get(id,label)?"checked":"")+'><span>'+esc(label)+'</span></label>';
        return '<label class="pf-field">'+esc(label)+'<textarea data-card="'+id+'" data-label="'+esc(label)+'" placeholder="Upiši ili traži od AI da pripremi...">'+esc(get(id,label))+'</textarea></label>'
      }).join("")+
      '<div class="pf-card-foot"><span>'+Math.round(done/labels.length*100)+'%</span></div></article>';
  }
  async function runAI(card,title){
    const context=allText(),instruction=prompts[card]||("Pomozi korisniku da završi radnu celinu „"+title+"“.");
    const btn=document.querySelector('.pf-ai[data-card="'+card+'"]');if(btn){btn.disabled=true;btn.textContent="AI radi…"}
    try{
      const r=await fetch("/api/product-agent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({section:title,instruction,context,product:data.meta})});
      const j=await r.json();if(!r.ok)throw new Error(j.error||"AI greška");
      const text=j.result||j.message||"";save();
      const area=document.getElementById("pfAiResult");area.hidden=false;area.innerHTML="<strong>AI rezultat · "+esc(title)+"</strong><pre>"+esc(text)+"</pre><button id=\"pfUseAi\">Ubaci u prvo polje</button>";
      document.getElementById("pfUseAi").onclick=()=>{set(card,sections.flatMap(s=>s.cards).find(c=>c[0]===card)?.[2]?.[0]||"AI rezultat",text);render(document.querySelector(".pf-nav.active")?.dataset.sec)};
    }catch(e){const area=document.getElementById("pfAiResult");area.hidden=false;area.innerHTML="<strong>AI trenutno nije dostupan.</strong><p>"+esc(e.message)+"</p><small>Radne stranice i čuvanje lokalno i dalje rade.</small>"}
    if(btn){btn.disabled=false;btn.textContent="✦ AI"}
  }
  async function runAISection(s){for(const c of s.cards)await runAI(c[0],c[1])}
  function exportJSON(){save();const blob=new Blob([JSON.stringify({version:1,source:"Moj prvi digitalni proizvod — Master Workbook",product:data.meta,cards:data.cards},null,2)],{type:"application/json"});download(blob,(data.meta.naziv||"product-factory")+".json")}
  function download(blob,name){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  function buildImport(){
    const pages=[];for(let i=1;i<=10;i++){const v=get("page-map","Stranica "+i);if(v)pages.push({number:i,title:v,type:"custom"})}
    return {name:data.meta.naziv||"Moj digitalni proizvod",format:data.meta.format||"A5",pages:pages.length||10,pageMap:pages,content:data.cards,source:"Moj prvi digitalni proizvod — Master Workbook"};
  }
  function init(){
    const top=document.querySelector(".top-actions");if(!top)return;
    const b=document.createElement("button");b.id="productFactoryButton";b.className="ghost-btn";b.textContent="Product Factory";top.insertBefore(b,top.firstChild);b.onclick=open;
    const style=document.createElement("style");style.textContent=css;document.head.appendChild(style);
    const overlay=document.createElement("div");overlay.id="pfOverlay";overlay.hidden=true;overlay.innerHTML=
      '<div class="pf-shell"><header class="pf-top"><div><span class="pf-kicker">MARIJANA AI DESIGN STUDIO</span><h1>Product Factory</h1><p>PDF sistem pretvoren u interaktivni radni sistem.</p></div><div class="pf-top-actions"><span id="pfSaveState">Sačuvano</span><button id="pfExport" class="pf-btn">Izvezi JSON</button><button id="pfDesign" class="pf-btn gold">Napravi dizajn</button><button id="pfClose" class="pf-close">×</button></div></header>'+
      '<div class="pf-body"><aside id="pfNav"></aside><main id="pfMain"></main><aside class="pf-right"><div class="pf-summary"><span class="pf-kicker">PROJEKAT</span><label>Naziv proizvoda<input id="pfName" value="'+esc(data.meta.naziv)+'"></label><label>Format<select id="pfFormat"><option>PDF vodič</option><option>Radna sveska</option><option>E-book</option><option>Planner</option><option>Checklist-a</option><option>Template</option><option>Bundle</option></select></label><label>Ciljna grupa<textarea id="pfAudience">'+esc(data.meta.ciljnaGrupa)+'</textarea></label><label>Glavni problem<textarea id="pfProblem">'+esc(data.meta.problem)+'</textarea></label><label>Glavni rezultat<textarea id="pfResult">'+esc(data.meta.rezultat)+'</textarea></label></div><div id="pfAiResult" class="pf-ai-result" hidden></div><div class="pf-principle"><b>CONTENT FIRST → DESIGN SECOND</b><span>IDEJA → PROIZVOD → BESPLATAN SADRŽAJ → EMAIL → PRODAJA → LANSIRANJE → ANALIZA</span></div></aside></div></div>';
    document.body.appendChild(overlay);
    document.getElementById("pfClose").onclick=close;document.getElementById("pfExport").onclick=exportJSON;
    document.getElementById("pfDesign").onclick=()=>{const imp=buildImport();localStorage.setItem("marijanaDesignStudioProductImport",JSON.stringify(imp));close();document.getElementById("prompt").value="PREUZMI PRODUCT FACTORY PODATKE I NAPRAVI DIZAJN. Podaci: "+JSON.stringify(imp);document.getElementById("send").click()};
    [["pfName","naziv"],["pfFormat","format"],["pfAudience","ciljnaGrupa"],["pfProblem","problem"],["pfResult","rezultat"]].forEach(([id,k])=>document.getElementById(id).oninput=e=>{data.meta[k]=e.target.value;save()});
    renderNav();render();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else setTimeout(init,0);
  const css='#pfOverlay{position:fixed;inset:0;background:rgba(15,15,15,.72);backdrop-filter:blur(18px);z-index:9999;padding:18px}#pfOverlay[hidden]{display:none}.pf-shell{height:calc(100vh - 36px);background:#f6f1e8;border:1px solid rgba(200,166,106,.35);border-radius:22px;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,.35);color:#171717}.pf-top{height:92px;display:flex;justify-content:space-between;align-items:center;padding:18px 24px;border-bottom:1px solid #ddd4c5;background:#fffdf8}.pf-top h1{margin:2px 0 0;font:700 30px "Cormorant Garamond",serif}.pf-top p{margin:2px 0;color:#777}.pf-kicker{font:700 10px "DM Sans",sans-serif;letter-spacing:.16em;color:#8e7546}.pf-top-actions{display:flex;align-items:center;gap:8px}.pf-top-actions span{font-size:12px;color:#777}.pf-btn,.pf-close{border:1px solid #d5cbb9;background:#fff;padding:10px 14px;border-radius:10px;cursor:pointer}.pf-btn.gold{background:#171717;color:#f5dfb2;border-color:#171717}.pf-close{font-size:24px;padding:6px 12px}.pf-body{display:grid;grid-template-columns:190px minmax(0,1fr) 280px;height:calc(100% - 92px)}#pfNav{border-right:1px solid #ddd4c5;padding:14px;background:#f1eadf;overflow:auto}.pf-nav{width:100%;display:flex;align-items:center;gap:10px;border:0;background:transparent;padding:12px 10px;text-align:left;border-radius:10px;cursor:pointer;color:#444}.pf-nav b{font-size:10px;color:#9b8050}.pf-nav span{font-size:12px;font-weight:700}.pf-nav.active{background:#171717;color:#fff}.pf-nav.active b{color:#e5c77f}#pfMain{padding:24px;overflow:auto}.pf-section-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px}.pf-section-head h2{margin:3px 0;font:700 32px "Cormorant Garamond",serif}.pf-section-head p{margin:0;color:#777}.pf-card-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.pf-card{background:#fffdf8;border:1px solid #ddd4c5;border-radius:16px;padding:16px;box-shadow:0 8px 24px rgba(60,45,30,.05)}.pf-card-head{display:flex;justify-content:space-between;gap:10px;border-bottom:1px solid #eee6da;padding-bottom:10px;margin-bottom:12px}.pf-card-head h3{margin:2px 0;font-size:17px}.pf-card-head span{font-size:10px;color:#9b8050}.pf-ai{border:1px solid #c8a66a;background:#fff8e9;border-radius:8px;padding:7px 10px;cursor:pointer}.pf-field{display:block;font-size:11px;font-weight:700;color:#555;margin:9px 0}.pf-field textarea,.pf-summary input,.pf-summary textarea,.pf-summary select{display:block;width:100%;margin-top:5px;border:1px solid #d9d0c1;border-radius:8px;background:#fff;padding:8px;font:12px "DM Sans",sans-serif;box-sizing:border-box}.pf-field textarea{min-height:54px;resize:vertical}.pf-check-row{display:flex;gap:8px;align-items:center;font-size:12px;margin:9px 0}.pf-card-foot{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:10px;border-top:1px solid #eee6da;color:#8e7546;font-size:11px}.pf-right{border-left:1px solid #ddd4c5;background:#fbf7ef;padding:18px;overflow:auto}.pf-summary{background:#fffdf8;border:1px solid #ddd4c5;border-radius:14px;padding:14px}.pf-summary label{display:block;font-size:11px;font-weight:700;margin:12px 0}.pf-summary textarea{min-height:60px;resize:vertical}.pf-ai-result{margin-top:14px;background:#171717;color:#f6f1e8;border-radius:14px;padding:14px;font-size:12px}.pf-ai-result pre{white-space:pre-wrap;max-height:340px;overflow:auto;font:12px/1.5 "DM Sans",sans-serif}.pf-ai-result button{border:1px solid #c8a66a;background:#c8a66a;color:#171717;padding:8px 10px;border-radius:8px}.pf-principle{margin-top:14px;padding:14px;border:1px solid #d9d0c1;border-radius:14px;background:#f1eadf}.pf-principle b{display:block;font-size:11px;margin-bottom:7px}.pf-principle span{font-size:10px;line-height:1.6;color:#6d6255}@media(max-width:1050px){.pf-body{grid-template-columns:150px minmax(0,1fr)}.pf-right{display:none}.pf-card-grid{grid-template-columns:1fr}}@media(max-width:700px){#pfOverlay{padding:0}.pf-shell{height:100vh;border-radius:0}.pf-top{height:auto;gap:10px}.pf-top-actions span,.pf-top-actions .pf-btn{display:none}.pf-body{grid-template-columns:1fr}.pf-nav{display:none}.pf-card-grid{grid-template-columns:1fr}.pf-section-head{display:block}}';
})();