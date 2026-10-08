const $=id=>document.getElementById(id);
const DEV_MODE=true;
const PLANS={
  free:{name:"FREE",price:"0 €",period:"zauvek",pages:5,ai:10,brands:3,aiImages:0,pdf:false,customSize:false,team:1,description:"Za istraživanje i prve digitalne proizvode.",cta:"Počni besplatno"},
  pro:{name:"CREATOR PRO",price:"12,90 €",period:"mesečno",pages:50,ai:100,brands:20,aiImages:20,pdf:true,customSize:true,team:1,description:"Glavni plan za kreatore i digitalne proizvode.",cta:"Izaberi Pro",popular:true},
  proplus:{name:"PRO+ AI",price:"24,90 €",period:"mesečno",pages:100,ai:300,brands:50,aiImages:60,pdf:true,customSize:true,team:1,description:"Za ozbiljnu AI produkciju i kompletne proizvode.",cta:"Izaberi Pro+"
  },
  business:{name:"BUSINESS",price:"49 €",period:"mesečno",pages:200,ai:1000,brands:100,aiImages:150,pdf:true,customSize:true,team:5,description:"Za male biznise, edukatore i timove.",cta:"Izaberi Business"},
  agency:{name:"STUDIO / AGENCY",price:"99 €",period:"mesečno",pages:999,ai:3000,brands:999,aiImages:500,pdf:true,customSize:true,team:20,description:"Za agencije i profesionalnu produkciju.",cta:"Izaberi Agency"}
};
const FEATURE_COPY={
  pages:"stranica po projektu",ai:"AI akcija mesečno",brands:"Brand profila",aiImages:"AI slika mesečno"
};

const pageNames=["Naslovna strana","Godišnji pregled","Mesečni planer","Mesečni planer","Nedeljni planer","Nedeljni planer","Nedeljni planer","Nedeljni planer","Praćenje navika","Beleške"];
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
{name:"Elegantni",desc:"nežan, moderan, premium",palette:4,heading:"Lora",body:"DM Sans",radius:12,shadow:"0 18px 45px rgba(0,0,0,.10)"},
{name:"Wellness",desc:"prirodan, smiren, topao",palette:1,heading:"Cormorant Garamond",body:"DM Sans",radius:14,shadow:"0 18px 42px rgba(0,0,0,.10)"},
{name:"Poslovni",desc:"precizan, moderan, pouzdan",palette:2,heading:"Montserrat",body:"Inter",radius:6,shadow:"0 14px 32px rgba(0,0,0,.10)"},
{name:"Kreativni",desc:"izražajan, savremen, drugačiji",palette:5,heading:"Raleway",body:"Manrope",radius:16,shadow:"0 20px 50px rgba(0,0,0,.14)"},
{name:"Wealth",desc:"bogato, stabilno, sofisticirano",palette:6,heading:"Playfair Display",body:"DM Sans",radius:10,shadow:"0 22px 55px rgba(0,0,0,.16)"}];
const TEMPLATES={
 planner:{name:"Premium planer",desc:"10 strana · A5 · planer za preduzetnike i preduzetnice",pages:10,names:["Naslovna strana","Godišnji pregled","Mesečni planer","Mesečni planer","Nedeljni planer","Nedeljni planer","Nedeljni planer","Nedeljni planer","Praćenje navika","Beleške"],style:"Dobrobit"},
 workbook:{name:"Radna sveska",desc:"8 strana · vođena radna sveska",pages:8,names:["Naslovna","Kako koristiti radnu svesku","Ciljevi","Vežba 1","Vežba 2","Akcioni plan","Praćenje napretka","Beleške"],style:"Minimalistički"},
 ebook:{name:"E-knjiga",desc:"12 strana · urednička struktura",pages:12,names:["Naslovna","Sadržaj","Uvod","Poglavlje 1","Poglavlje 2","Poglavlje 3","Poglavlje 4","Poglavlje 5","Zaključak","Akcioni koraci","Resursi","Beleške"],style:"Urednički"},
 master80:{name:"Moj prvi digitalni proizvod — Master Workbook",desc:"80 radnih strana + 4 završne strane",pages:84,names:[
"Naslovna — Moj prvi digitalni proizvod","Sadržaj","Segment 1 — Od ideje do Product Card-a","Idea Validation Worksheet + Moj prvi Product Card","Finalna provera ideje","Segment 2 — Kreiranje digitalnog proizvoda","AI radni proces i kreiranje strukture","Od sadržaja do stranica","Page-by-page production workflow","Sistem kontrole kvaliteta","Finalna kontrola digitalnog proizvoda","Master Content Document","Od jednog proizvoda do više sadržaja","Content repurposing i Content → Freebie → Proizvod","Segment 3 — Besplatan sadržaj","10 vrsta besplatnog sadržaja","AI generator besplatnog sadržaja","Filter za besplatan sadržaj","Blueprint besplatnog sadržaja","AI prompt — Kreiraj sadržaj besplatnog sadržaja","AI prompt — Kreiraj jednu stranicu","Kompletan primer — Od ideje do besplatnog sadržaja","Kompletan primer — Kako izgleda sadržaj","AI prompt — Kreiraj praktične delove","Naslov i obećanje besplatnog sadržaja","Finalizacija besplatnog sadržaja","Završna poruka i nastavak Master Workbook-a","Dopuna Master Workbook-a — Besplatan sadržaj → Email lista","Segment 4 — Email lista i email marketing","Segment 5 — Prodajni sistem","Moj prvi Sales Page","Problem → Želja → Rešenje → Rezultat","Segment 5 — Završna mapa","Pre-launch checklist + potvrda kupovine","Terminološko ujednačavanje","Segment 6 — Lansiranje i prva prodaja","Pre-launch — priprema pre prodaje","Launch email sekvenca + lansiranje ponude","Prva prodaja + analiza prvog lansiranja","Šta ako nema prodaja? + Product Ladder","Repurposing + ponovljiv sistem lansiranja","Finalna checklist-a — Segment 6","Segment 7 — Od prve prodaje do skalabilnog sistema","Cross-sell, upsell, paket + KPI dashboard + CEO pregled","Sistem za proizvodnju sadržaja i proizvoda + 30-dnevni plan","Mapa kompletnog digitalnog sistema","Master checklist i narednih 90 dana","Završna Master formula","Radna stranica 1 — Product Card","Radna stranica 2 — Product Blueprint","Radna stranica 3 — Content Map","Radna stranica 4 — Kontrola kvaliteta","Radna stranica 5 — Master Content","Radna stranica 6 — Ideja za besplatan sadržaj","Radna stranica 7 — Filter za besplatan sadržaj","Radna stranica 8 — Blueprint besplatnog sadržaja","Radna stranica 9 — Opt-in stranica","Radna stranica 10 — Email funnel","Radna stranica 11 — Welcome email","Radna stranica 12 — Delivery email","Radna stranica 13 — Value email","Radna stranica 14 — Email sekvenca","Radna stranica 15 — Newsletter","Radna stranica 16 — Subject line","Radna stranica 17 — CTA","Radna stranica 18 — Ponuda","Radna stranica 19 — Cena i vrednost","Radna stranica 20 — Problem → Želja → Rešenje","Radna stranica 21 — Social proof","Radna stranica 22 — FAQ","Radna stranica 23 — Checkout","Radna stranica 24 — Sales Page","Radna stranica 25 — Plan lansiranja","Radna stranica 26 — Sadržaj za lansiranje","Radna stranica 27 — Emaili za lansiranje","Radna stranica 28 — Prva prodaja i isporuka","Radna stranica 29 — Analiza lansiranja","Radna stranica 30 — Product Ladder","Radna stranica 31 — KPI Dashboard","Radna stranica 32 — 90-dnevni Master plan","Završne beleške","Autorska prava i korišćenje","Resursi i linkovi","Hvala · Sledeći korak"
],style:"Minimalistički"},
 journal:{name:"Dnevnik",desc:"12 strana · refleksija i beleške",pages:12,names:["Naslovna","Kako se osećam","Jutarnja refleksija","Dnevni zapis","Dnevni zapis","Dnevni zapis","Dnevni zapis","Nedeljna refleksija","Zahvalnost","Lekcije","Plan za sutra","Beleške"],style:"Elegantni"},
 social:{name:"Paket za društvene mreže",desc:"10 strana · sadržaj za društvene mreže",pages:10,names:["Naslovna","Stubovi sadržaja","30 ideja","Kratki video zapisi","Karusel","Priče","Udice","Biblioteka poziva na akciju","Prostor za ključne oznake","Beleške"],style:"Kreativni"}
};
function wbText(text,x,y,w,h,fontSize=11,color="#171717",align="left",extra={}){
 return {id:uid(),type:"text",text,x,y,w,h,font:extra.font||state.bodyFont,fontSize,color,align,rotate:0,opacity:extra.opacity??100,locked:false,...extra};
}
function wbLine(x,y,w=60,color="#D8D0C2"){
 return {id:uid(),type:"divider",text:"",x,y,w,h:1.2,font:state.bodyFont,fontSize:1,color,align:"left",rotate:0,opacity:100,locked:false};
}
function wbBox(text,x,y,w,h,fill="#F4EFE6",color="#4C463E",fontSize=9,extra={}){
 return {id:uid(),type:"shape",text:text||"",x,y,w,h,font:state.bodyFont,fontSize,color,align:"left",rotate:0,opacity:100,locked:false,radius:10,fill,...extra};
}
function wbCheck(label,x,y,w=56){
 const els=[wbText("☐ "+label,x,y,w,5.5,9,"#292621","left")];
 return els;
}
function wbField(els,label,y,wide=true){
 els.push(wbText(label,9,y,wide?59:48,5.5,9.5,"#3A352F","left",{font:"DM Sans"}));
 els.push(wbLine(9,y+5.5,wide?59:48));
}
function wbExample(els,text){
 els.push(wbBox("",71,29,20,58,"#F7F2E9","#171717",9,{radius:10,opacity:100}));
 els.push(wbText("PRIMER",73,32,16,5,8,"#8EA386","left",{font:"DM Sans"}));
 els.push(wbText(text,73,39,16,42,8.5,"#4C463E","left",{font:"DM Sans"}));
}
const WORKBOOK_SHEETS=[
 {title:"RADNA STRANICA 1 — PRODUCT CARD",intro:"Popuni nakon definisanja problema i ciljne publike.",fields:["Naziv proizvoda","Kome je namenjen","Glavni problem","Glavno rešenje","Format","Šta kupac dobija","Glavni rezultat","Zašto je koristan"],example:"Primer: PDF radna sveska za početnike koji žele da od jedne ideje naprave prvi digitalni proizvod."},
 {title:"RADNA STRANICA 2 — PRODUCT BLUEPRINT",intro:"Mapa proizvoda pre pisanja sadržaja.",fields:["Cilj proizvoda","Moduli","Lekcije","Praktični delovi","Primeri","Završni rezultat"],example:"Primer: 3 modula → 7 lekcija → 4 radne strane → jedan konkretan završni rezultat."},
 {title:"RADNA STRANICA 3 — CONTENT MAP",intro:"Pretvori blueprint u konkretan sadržaj.",fields:["Celina 1","Celina 2","Celina 3","Praktični deo","Provera","Sledeći korak"],example:"Primer: Celina 1 objašnjava problem, Celina 2 daje proces, a praktični deo vodi do primene."},
 {title:"RADNA STRANICA 4 — KONTROLA KVALITETA",intro:"Proveri proizvod kao početnik koji ga prvi put koristi.",fields:["Šta je jasno?","Gde postoji konfuzija?","Gde se pojavljuje pitanje „Šta sada?“","Šta treba pojednostaviti?","Šta treba dopuniti?"],example:"Primer: Ako korisnik ne zna šta da uradi nakon lekcije, dodaj jedan jasan akcioni korak."},
 {title:"RADNA STRANICA 5 — MASTER CONTENT",intro:"Jedan izvor istine za kompletan proizvod.",fields:["Naslov","Uvod","Glavne lekcije","Radne sveske","Checkliste","Promptovi","Akcioni zadaci","Završetak"],example:"Primer: sve finalne verzije teksta, promptova i zadataka drži na jednom mestu pre dizajna."},
 {title:"RADNA STRANICA 6 — IDEJA ZA BESPLATAN SADRŽAJ",intro:"Mali problem + brzo rešenje + jasan sledeći korak.",fields:["Za koga je besplatan sadržaj?","Mali problem","Mali rezultat","Format","Povezani glavni proizvod","Sledeći korak"],example:"Primer: mini checklist-a koja rešava jedan mali problem i vodi ka glavnom proizvodu."},
 {title:"RADNA STRANICA 7 — FILTER ZA BESPLATAN SADRŽAJ",intro:"Oceni ideju pre izrade.",fields:["Jasan","Koristan","Jednostavan","Povezan sa proizvodom","Brzo primenljiv","Rezultat","Ukupna ocena"],example:"Primer: ocenjuj svaku stavku od 1 do 5 i zadrži ideju koja ima jasan rezultat."},
 {title:"RADNA STRANICA 8 — BLUEPRINT BESPLATNOG SADRŽAJA",intro:"Plan pre pisanja.",fields:["Naslov","Uvod","Celina 1","Celina 2","Praktični deo","Rezultat","Sledeći korak"],example:"Primer: naslov → kratko objašnjenje → dve korisne celine → vežba → rezultat → CTA."},
 {title:"RADNA STRANICA 9 — OPT-IN STRANICA",intro:"Struktura stranice koja vodi do prijave.",fields:["Naslov","Podnaslov","Problem","Šta osoba dobija","Rezultat","CTA","Napomena o isporuci"],example:"Primer CTA: „Preuzmi radnu svesku i napravi prvi korak danas.“"},
 {title:"RADNA STRANICA 10 — EMAIL FUNNEL",intro:"Poveži besplatan sadržaj i prodajni sistem.",fields:["Ulazni sadržaj","Besplatan sadržaj","Opt-in","Welcome","Value email","Offer email","Glavni proizvod"],example:"Primer: sadržaj → besplatan resurs → prijava → vrednost → ponuda → glavni proizvod."},
 {title:"RADNA STRANICA 11 — WELCOME EMAIL",intro:"Prvi kontakt nakon prijave.",fields:["Subject line","Pozdrav","Hvala","Isporuka","Prvi mali korak","Sledeći korak"],example:"Primer: prvo isporuči obećano, zatim dodaj jedan mali koristan korak."},
 {title:"RADNA STRANICA 12 — DELIVERY EMAIL",intro:"Ispravno isporuči obećano.",fields:["Šta osoba dobija","Link","Instrukcije","Prvi korak","Kontakt za podršku"],example:"Primer: jasno napiši šta je poslato, gde se nalazi i šta korisnik radi prvo."},
 {title:"RADNA STRANICA 13 — VALUE EMAIL",intro:"Jedna ideja → jedna korisna lekcija → jedan mali korak.",fields:["Hook","Problem","Uvid","Rešenje","Primer","Mali zadatak","CTA"],example:"Primer: jedna konkretna lekcija + jedan mali zadatak koji se može završiti odmah."},
 {title:"RADNA STRANICA 14 — EMAIL SEKVENCA",intro:"Planiraj 5 povezanih emailova.",fields:["Email 1 — Najava","Email 2 — Problem","Email 3 — Vrednost/Rešenje","Email 4 — Ponuda","Email 5 — Podsetnik"],example:"Primer: svaki email ima svoju svrhu i prirodno vodi ka sledećem koraku."},
 {title:"RADNA STRANICA 15 — NEWSLETTER",intro:"Redovna komunikacija sa jasnom svrhom.",fields:["Tema","Hook","Jedna ideja","Primer","Mali korak","CTA"],example:"Primer: newsletter ne mora da prodaje; može da donese jednu korisnu ideju i mali rezultat."},
 {title:"RADNA STRANICA 16 — SUBJECT LINE",intro:"Napiši više verzija bez clickbait-a.",fields:["Benefit","Problem","Pitanje","Broj","Greška","Quick Win","Direktna poruka"],example:"Primer: napiši 5–7 verzija iste poruke, pa izaberi onu koja je najjasnija."},
 {title:"RADNA STRANICA 17 — CTA",intro:"Jasan sledeći korak.",fields:["Glavna akcija","Glavni CTA","CTA nakon sadržaja","CTA kod ponude","Finalni CTA"],example:"Primer: jedna poruka, jedna radnja — „Preuzmi“, „Kupi“, „Prijavi se“ ili „Saznaj više“."},
 {title:"RADNA STRANICA 18 — PONUDA",intro:"Pretvori proizvod u jasnu ponudu.",fields:["Kome","Problem","Proizvod","Rezultat","Glavni elementi","Cena","CTA"],example:"Primer: osoba + problem + konkretno rešenje + rezultat + cena + jasan sledeći korak."},
 {title:"RADNA STRANICA 19 — CENA I VREDNOST",intro:"Odredi cenu na osnovu vrednosti ponude.",fields:["Problem","Korisnost","Dubina","Obim","Pozicioniranje","Redovna cena","Uvodna cena ako postoji"],example:"Primer: ne posmatraj samo broj strana; posmatraj problem koji proizvod pomaže da se reši."},
 {title:"RADNA STRANICA 20 — PROBLEM → ŽELJA → REŠENJE",intro:"Osnova prodajne komunikacije.",fields:["Gde je osoba sada?","Šta želi?","Kako proizvod pomaže?","Koji rezultat podržava?","Kratka prodajna poruka"],example:"Primer: „Trenutno imaš ideju, ali nemaš strukturu → želiš gotov proizvod → workbook vodi kroz proces.“"},
 {title:"RADNA STRANICA 21 — SOCIAL PROOF",intro:"Plan dokaza i iskustava bez izmišljanja.",fields:["Šta trenutno imam","Šta mogu da pokažem bez testimoniala","Kako tražim feedback","Koje dozvole su potrebne","Koji rezultat je stvaran i proverljiv"],example:"Primer: pokaži stvaran proces, sadržaj, demo ili proverljiv rezultat — ne izmišljaj testimonial."},
 {title:"RADNA STRANICA 22 — FAQ",intro:"Pitanja koja osoba postavlja pre kupovine.",fields:["Za koga je","Šta dobijam","Format","Pristup","Tehnički zahtevi","Nakon kupovine"],example:"Primer: odgovori na pitanja koja bi kupac postavio pre nego što klikne na kupovinu."},
 {title:"RADNA STRANICA 23 — CHECKOUT",intro:"Testiraj poslednji korak pre kupovine.",fields:["Proizvod","Cena","Plaćanje","Potvrda","Isporuka","Prvi korak","Sledeća poruka"],example:"Primer: testiraj ceo put kao kupac — od klika do potvrde i prve isporuke."},
 {title:"RADNA STRANICA 24 — SALES PAGE",intro:"Od ponude do gotove prodajne stranice.",fields:["Hook","Naslov","Podnaslov","Problem","Želja","Rešenje","Offer Stack","Koristi","Cena","FAQ","CTA"],example:"Primer strukture: Hook → problem → želja → rešenje → šta dobijaš → cena → FAQ → CTA."},
 {title:"RADNA STRANICA 25 — PLAN LANSIRANJA",intro:"Organizuj pripremu i dane prodaje.",fields:["Početak","Dan 1","Dan 2","Dan 3","Dan 4","Dan 5","Dan 6","Dan 7","Završetak"],example:"Primer: za svaki dan odredi jednu glavnu poruku, jedan sadržaj i jedan CTA."},
 {title:"RADNA STRANICA 26 — SADRŽAJ ZA LANSIRANJE",intro:"Jedna tema → više funkcionalnih sadržaja.",fields:["Problem sadržaj","Edukativni sadržaj","Demonstracija","Priča/Povezivanje","Prodajni sadržaj","Glavni CTA"],example:"Primer: ista glavna tema može imati edukativni, demonstracioni i prodajni ugao."},
 {title:"RADNA STRANICA 27 — EMAILI ZA LANSIRANJE",intro:"Pripremi svih 5 emailova.",fields:["Email 1 — Najava","Email 2 — Problem","Email 3 — Vrednost","Email 4 — Ponuda","Email 5 — Podsetnik"],example:"Primer: unapred definiši cilj svakog emaila i trenutak slanja."},
 {title:"RADNA STRANICA 28 — PRVA PRODAJA I ISPORUKA",intro:"Isplaniraj customer journey nakon kupovine.",fields:["Potvrda","Isporuka","Onboarding","Prvi korak","Feedback","Sledeći proizvod"],example:"Primer: kupac ne treba da se pita šta sada — potvrda, pristup, prvi korak i podrška treba da budu jasni."},
 {title:"RADNA STRANICA 29 — ANALIZA LANSIRANJA",intro:"Pronađi usko grlo.",fields:["Reach","Klikovi","Opt-in","Sales Page","Checkout","Kupovine","Prihod","Feedback"],example:"Primer: ako ima pregleda, ali nema klikova, problem nije isti kao kada ima klikova, ali nema kupovina."},
 {title:"RADNA STRANICA 30 — PRODUCT LADDER",intro:"Poveži postojeće proizvode u logičan put.",fields:["Besplatan sadržaj","Ulazni proizvod","Glavni proizvod","Paket","Veći sistem","Sledeći problem"],example:"Primer: besplatan sadržaj → mali proizvod → glavni proizvod → paket → veći sistem."},
 {title:"RADNA STRANICA 31 — KPI DASHBOARD",intro:"Jednom nedeljno meri najvažnije brojeve.",fields:["Reach","Klikovi","Novi email kontakti","Sales Page posete","Checkout posete","Prodaje","Prihod","Open rate","Click rate"],example:"Primer: beleži iste metrike iz nedelje u nedelju da bi videla trend, ne samo pojedinačan broj."},
 {title:"RADNA STRANICA 32 — 90-DNEVNI MASTER PLAN",intro:"Prevedi sistem u konkretne prioritete.",fields:["Dani 1–30 — temelji","Dani 31–60 — optimizacija","Dani 61–90 — proširenje","Glavni cilj","Najvažnija metrika","Sledeći proizvod"],example:"Primer: prvo postavi temelje, zatim meri i optimizuj, pa tek onda širi ono što radi."}
];
function masterWorkbookElements(name){
 const out={};
 const introPages=[
  ["Naslovna — Moj prvi digitalni proizvod","Od ideje do prvog proizvoda","Master Workbook · praktičan sistem za planiranje, izradu, lansiranje i rast"],
  ["Sadržaj","8 celina + 32 radne stranice","Koristi ovu radnu svesku kao glavni radni prostor za razvoj proizvoda."],
  ["Segment 1 — Od ideje do Product Card-a","Ideja → problem → ciljna grupa → proizvod","Cilj: početnu ideju pretvoriti u jasnu i konkretnu osnovu proizvoda."],
  ["Idea Validation Worksheet + Moj prvi Product Card","Proveri ideju pre izrade","Problem · osoba · rezultat · format · vrednost"],
  ["Finalna provera ideje","Jasna · korisna · izvodljiva · namenjena konkretnoj osobi","Ako nešto nije jasno, vrati se korak nazad pre nego što nastaviš."],
  ["Segment 2 — Kreiranje digitalnog proizvoda","Struktura → sadržaj → praktična primena → stranice","Jedna stranica treba da ima jednu jasnu svrhu."],
  ["AI radni proces i kreiranje strukture","IDEJA → STRUKTURA → SADRŽAJ → PROVERA → DIZAJN","Sadržaj prvo. Dizajn drugo."],
  ["Od sadržaja do stranica","PLAN → SADRŽAJ → PROVERA → STRANICA → FINALNA PROVERA","Ako je stranica pretrpana, podeli je."],
  ["Page-by-page production workflow","Jedna stranica → jedna svrha → jedan korak napred","Odredi svrhu, tip stranice, naslov, sadržaj, praktičnu primenu i status."],
  ["Sistem kontrole kvaliteta","JASAN → LOGIČAN → KORISTAN → PRIMENLJIV","Proveri cilj, strukturu, ponavljanje, prelaze i korisničko iskustvo."],
  ["Finalna kontrola digitalnog proizvoda","Prođi proizvod kao početnik","Proveri jasnoću, logiku, korisnost, format, linkove i završni rezultat."],
  ["Master Content Document","Jedan izvor istine","Sve finalne verzije teksta, lekcija, radnih strana, checklista i promptova drži na jednom mestu."],
  ["Od jednog proizvoda do više sadržaja","Jedan proizvod = content source","PDF → besplatan sadržaj → blog → newsletter → carousel → Reel → Story → checklist-a → mini worksheet."],
  ["Content repurposing i Content → Freebie → Proizvod","Jedna poruka, više formata","Ne kopiraj isti tekst; prilagodi osnovnu poruku formatu i platformi."],
  ["Segment 3 — Besplatan sadržaj","Mali problem → brzo rešenje → sledeći korak","Besplatan sadržaj treba da bude koristan i povezan sa glavnim proizvodom."],
  ["10 vrsta besplatnog sadržaja","Checklist-a · mini vodič · worksheet · template · prompt pack · tracker","Izaberi format koji najbrže vodi do malog rezultata."],
  ["AI generator besplatnog sadržaja","Problem → mali rezultat → format → sledeći korak","AI koristi kao pomoć u strukturi, ne kao zamenu za tvoje znanje."],
  ["Filter za besplatan sadržaj","Jasan · koristan · jednostavan · povezan · brzo primenljiv","Pre izrade proveri da li ideja zaista daje vrednost."],
  ["Blueprint besplatnog sadržaja","Naslov → uvod → celine → praktični deo → rezultat → sledeći korak","Prvo napravi mapu, zatim piši."],
  ["AI prompt — Kreiraj sadržaj besplatnog sadržaja","CONTENT FIRST → DESIGN SECOND","Prvo definiši sadržaj i praktičnu vrednost, pa tek onda izgled."],
  ["AI prompt — Kreiraj jednu stranicu","Jedna stranica → jedna svrha","Stranica može biti uvod, objašnjenje, koraci, primer, worksheet, checklist-a ili zadatak."],
  ["Kompletan primer — Od ideje do besplatnog sadržaja","Ideja → filter → blueprint → page map → finalizacija","Ovde posmatraj logiku procesa, ne samo konačan dizajn."],
  ["Kompletan primer — Kako izgleda sadržaj","Primer sadržaja za praktične stranice","Dobar primer pokazuje kako se objašnjenje pretvara u konkretan zadatak."],
  ["AI prompt — Kreiraj praktične delove","Vežbe · pitanja · checklist-e · akcioni koraci","Praktični deo treba da vodi korisnika ka konkretnom rezultatu."],
  ["Naslov i obećanje besplatnog sadržaja","Jasan naslov + realno obećanje","Ne obećavaj više nego što sadržaj zaista isporučuje."],
  ["Finalizacija besplatnog sadržaja","Proveri PDF kao korisnik","Proveri redosled, čitljivost, praktične delove, linkove i završni CTA."],
  ["Završna poruka i nastavak Master Workbook-a","Od besplatnog sadržaja ka sistemu","Sledeći korak je povezivanje sa email listom i prodajnim sistemom."],
  ["Dopuna Master Workbook-a — Besplatan sadržaj → Email lista","Besplatan sadržaj → prijava → email komunikacija","Ovde počinje sistem koji povezuje sadržaj sa odnosom sa publikom."],
  ["Segment 4 — Email lista i email marketing","Welcome · delivery · value · sekvenca · newsletter","Jedna ideja → jedna korisna lekcija → jedan mali korak."],
  ["Segment 5 — Prodajni sistem","Ponuda → Sales Page → Checkout → kupovina","Jasna prodajna komunikacija vodi osobu kroz odluku."],
  ["Moj prvi Sales Page","Hook → problem → želja → rešenje → ponuda → cena → CTA","Prodajna stranica treba da odgovori na najvažnija pitanja pre kupovine."],
  ["Problem → Želja → Rešenje → Rezultat","Osnova prodajne poruke","Prikaži gde je osoba sada, šta želi i kako proizvod podržava željeni rezultat."],
  ["Segment 5 — Završna mapa","Besplatan sadržaj → email → ponuda → checkout","Proveri da li svaki korak ima jasan sledeći korak."],
  ["Pre-launch checklist + potvrda kupovine","Priprema pre prodaje + iskustvo nakon kupovine","Ne završava se sistem na dugmetu Kupi."],
  ["Terminološko ujednačavanje","BESPLATAN SADRŽAJ · LANSIRANJE · RADNA SVESKA · VAŽNO","Koristi dosledne srpske termine kroz ceo proizvod."],
  ["Segment 6 — Lansiranje i prva prodaja","Pre-launch → launch → prva prodaja → analiza","Pokreni, izmeri, nauči i poboljšaj."],
  ["Pre-launch — priprema pre prodaje","Ponuda · sadržaj · emaili · checkout · isporuka","Pre lansiranja proveri da je ceo put spreman."],
  ["Launch email sekvenca + lansiranje ponude","Najava → problem → vrednost → ponuda → podsetnik","Svaki email ima svoju ulogu."],
  ["Prva prodaja + analiza prvog lansiranja","Prodaja nije kraj procesa","Zabeleži šta se desilo i šta treba poboljšati."],
  ["Šta ako nema prodaja? + Product Ladder","Pronađi usko grlo, ne paniči","Analiziraj reach, klikove, opt-in, sales page, checkout i ponudu."],
  ["Repurposing + ponovljiv sistem lansiranja","Jedan sistem koji možeš ponavljati","Posle prvog ciklusa sačuvaj ono što radi."],
  ["Finalna checklist-a — Segment 6","Pre lansiranja · tokom lansiranja · posle lansiranja","Označi šta je završeno i šta treba optimizovati."],
  ["Segment 7 — Od prve prodaje do skalabilnog sistema","Cross-sell · upsell · paket · KPI · CEO pregled","Sada proizvod postaje deo šireg sistema."],
  ["Cross-sell, upsell, paket + KPI dashboard + CEO pregled","Poveži proizvode i prati brojeve","Ne meri samo prihod; prati ceo put korisnika."],
  ["Sistem za proizvodnju sadržaja i proizvoda + 30-dnevni plan","Planiraj proizvodnju umesto improvizacije","Jedan sistem treba da olakša sledeći proizvod."],
  ["Mapa kompletnog digitalnog sistema","IDEJA → PROIZVOD → BESPLATAN SADRŽAJ → EMAIL → PRODAJA → ISPORUKA → FEEDBACK → OPTIMIZACIJA","Ovo je tvoj operativni sistem."],
  ["Master checklist i narednih 90 dana","Šta radiš sada, šta kasnije","Pretvori sistem u konkretne prioritete."],
  ["Završna Master formula","NAPRAVI → POKRENI → IZMERI → NAUČI → POBOLJŠAJ → PONOVI","Tvoj biznis nije jedan proizvod. Tvoj biznis je sistem."]
 ];

 function addFooter(els,i,label="Master Workbook"){
  els.push(wbText(label+" · "+String(i).padStart(2,"0"),8,96,84,3.5,7,"#A79D8D","left",{font:"DM Sans"}));
 }
 function sectionCover(els,i,title,intro,body){
  els.push(wbText("CELINA",9,7,20,5,8,"#8EA386","left",{font:"DM Sans"}));
  els.push(wbText(title,9,15,82,15,23,"#171717","left",{font:state.headingFont}));
  els.push(wbText(intro,9,32,78,8,11,"#5E574E","left"));
  els.push(wbBox("",9,44,82,30,"#F4EFE6","#D8D0C2",9,{radius:14}));
  els.push(wbText(body,13,50,74,17,10,"#3D3832","left"));
  els.push(wbText("VAŽNO",13,69,20,5,8,"#8EA386","left",{font:"DM Sans"}));
  els.push(wbLine(28,73,57));
 }
 function processPage(els,steps,note){
  const gap=3,cw=(84-gap*(steps.length-1))/steps.length;
  steps.forEach((step,i)=>{
   const x=8+i*(cw+gap);
   els.push(wbBox(String(i+1).padStart(2,"0")+"\n"+step,x,30,cw,25,"#F4EFE6","#3D3832",8,{radius:10}));
   if(i<steps.length-1)els.push(wbText("→",x+cw,39,3,5,9,"#8EA386","center",{font:"DM Sans"}));
  });
  els.push(wbBox("VAŽNO · "+note,8,63,84,14,"#F8F3EA","#4C463E",8.5,{radius:9}));
 }
 function examplePage(els,example,questions){
  els.push(wbBox("PRIMER",8,29,28,7,"#8EA386","#FFFDF8",8,{radius:7}));
  els.push(wbBox(example,8,38,84,22,"#F4EFE6","#3D3832",9,{radius:10}));
  els.push(wbText("TVOJA VERZIJA",8,65,38,5,8.5,"#8EA386","left",{font:"DM Sans"}));
  questions.forEach((q,i)=>wbField(els,q,73+i*7.2,true));
 }
 function notesPage(els){
  els.push(wbText("TVOJE BELEŠKE",8,30,40,6,9,"#8EA386","left",{font:"DM Sans"}));
  for(let i=0;i<8;i++)els.push(wbLine(8,39+i*7.2,84));
  els.push(wbBox("SLEDEĆI KORAK",8,84,28,6,"#8EA386","#FFFDF8",7.5,{radius:7}));
  els.push(wbLine(40,90,52));
 }

 const segmentPages={3,6,15,29,30,36,43};
 const processMap={
  7:["IDEJA","STRUKTURA","SADRŽAJ","PROVERA","DIZAJN"],
  8:["PLAN","SADRŽAJ","PROVERA","STRANICA","FINALNA PROVERA"],
  13:["PROIZVOD","BESPLATAN SADRŽAJ","EMAIL","SADRŽAJ","PRODAJA"],
  18:["FILTER","BLUEPRINT","SADRŽAJ","PRAKSA","REZULTAT"],
  19:["NASLOV","UVOD","CELINE","PRAKSA","CTA"],
  28:["BESPLATAN SADRŽAJ","PRIJAVA","EMAIL LISTA","VREDNOST","SLEDEĆI KORAK"],
  31:["PONUDA","SALES PAGE","CHECKOUT","KUPOVINA"],
  33:["PROBLEM","ŽELJA","REŠENJE","REZULTAT"],
  34:["BESPLATAN SADRŽAJ","EMAIL","PONUDA","CHECKOUT"],
  36:["PRE-LAUNCH","LANSIRANJE","PRVA PRODAJA","ANALIZA"],
  37:["PONUDA","SADRŽAJ","EMAILI","CHECKOUT","ISPORUKA"],
  38:["NAJAVA","PROBLEM","VREDNOST","PONUDA","PODSETNIK"],
  39:["PRODAJA","BROJEVI","FEEDBACK","LEKCIJA","IZMENA"],
  41:["SADRŽAJ","RECIKLIRANJE","LANSIRANJE","ANALIZA","PONAVLJANJE"],
  43:["PRVA PRODAJA","SISTEM","KPI","OPTIMIZACIJA"],
  46:["IDEJA","PROIZVOD","SADRŽAJ","PRODAJA","ISPORUKA","OPTIMIZACIJA"],
  48:["NAPRAVI","POKRENI","IZMERI","NAUČI","POBOLJŠAJ","PONOVI"]
 };

 for(let i=1;i<=48;i++){
  const d=introPages[i-1]||["Strana "+i,"Radni prostor","Dodaj, prilagodi i proveri sadržaj ove strane."];
  const els=[];
  if(i===1){
   els.push(wbBox("",7,7,86,83,"#2B2925","#E7D2A7",10,{radius:18}));
   els.push(wbText("MASTER WORKBOOK",13,15,74,6,9,"#C8A66A","center",{font:"DM Sans"}));
   els.push(wbText(d[0].replace(" — ","\n"),13,27,74,24,28,"#E7D2A7","center",{font:state.headingFont}));
   els.push(wbLine(25,56,50,"#C8A66A"));
   els.push(wbText(d[1],15,61,70,8,12,"#F4EFE6","center"));
   els.push(wbText(d[2],15,72,70,9,9,"#CFC7B9","center"));
   els.push(wbText("IDEJA  ·  PROIZVOD  ·  BESPLATAN SADRŽAJ  ·  EMAIL  ·  PRODAJA  ·  LANSIRANJE  ·  RAST",13,83,74,5,7.2,"#C8A66A","center",{font:"DM Sans"}));
  }else if(i===2){
   els.push(wbText(d[0],8,8,84,9,20,"#171717","left",{font:state.headingFont}));
   els.push(wbText(d[1],8,19,84,6,9.5,"#8EA386","left"));
   const sections=["01 · IDEJA","02 · PROIZVOD","03 · BESPLATAN SADRŽAJ","04 · EMAIL SISTEM","05 · PRODAJNI SISTEM","06 · LANSIRANJE","07 · ANALIZA I RAST","08 · MASTER PLAN"];
   sections.forEach((s,j)=>{
    const col=j%2,row=Math.floor(j/2),x=8+col*43,y=30+row*14;
    els.push(wbBox(s,x,y,39,10,"#F4EFE6","#3D3832",8.5,{radius:8}));
    els.push(wbText("→",x+32,y+3,5,4,8,"#8EA386","center",{font:"DM Sans"}));
   });
   els.push(wbBox("32 RADNE STRANICE\nza konkretan rad kroz sistem",8,74,84,14,"#F8F3EA","#3D3832",9,{radius:9}));
  }else if(segmentPages.has(i)){
   sectionCover(els,i,d[0],d[1],d[2]);
   els.push(wbText("SLEDEĆE",9,79,18,5,8,"#8EA386","left",{font:"DM Sans"}));
   els.push(wbText("Razumi celinu → popuni radne strane → proveri → pređi na sledeći korak.",28,79,63,7,8.5,"#4C463E","left"));
   els.push(wbLine(9,89,82));
  }else if(processMap[i]){
   els.push(wbText(d[0],8,8,84,9,17,"#171717","left",{font:state.headingFont}));
   els.push(wbText(d[1],8,19,84,7,9.5,"#8EA386","left"));
   processPage(els,processMap[i],d[2]);
   els.push(wbText("TVOJA BELEŠKA",8,80,30,5,8.5,"#8EA386","left",{font:"DM Sans"}));
   els.push(wbLine(8,89,84));
  }else if([4,5,9,10,11,12,14,17,20,21,22,23,24,25,26,27,32,35,40,42,44,45,47].includes(i)){
   els.push(wbText(d[0],8,8,84,10,17,"#171717","left",{font:state.headingFont}));
   els.push(wbText(d[1],8,19,84,7,9.5,"#8EA386","left"));
   els.push(wbBox(d[2],8,29,55,22,"#F4EFE6","#3D3832",9,{radius:10}));
   els.push(wbBox("VAŽNO",67,29,25,7,"#8EA386","#FFFDF8",8,{radius:7}));
   els.push(wbText(i===14?"Koristan besplatan sadržaj treba da vodi ka malom rezultatu.":i===20?"Prvo definiši sadržaj i praktičnu vrednost, pa tek onda izgled.":"Jedna stranica treba da ima jasnu svrhu i sledeći korak.",67,39,25,24,8,"#4C463E","left"));
   els.push(wbText("PRIMER / PRIMENA",8,58,35,5,8.5,"#8EA386","left",{font:"DM Sans"}));
   els.push(wbBox("Ovde ostavi prostor za konkretan primer iz svog proizvoda.",8,66,84,12,"#F8F3EA","#5E574E",8.5,{radius:9}));
   els.push(wbText("BELEŠKE",8,82,25,5,8.5,"#8EA386","left",{font:"DM Sans"}));
   els.push(wbLine(8,90,84));
  }else{
   els.push(wbText(d[0],8,8,84,10,17,"#171717","left",{font:state.headingFont}));
   els.push(wbText(d[1],8,19,84,7,9.5,"#8EA386","left"));
   examplePage(els,"Primer izvorne strukture: "+d[2],["Kako ovo izgleda u mom proizvodu?","Šta treba da uradim sada?"]);
   notesPage(els);
  }
  addFooter(els,i);
  out[String(i)]=els;
 }

 const endPages=[
  {title:"ZAVRŠNE BELEŠKE",intro:"Prostor da zapišeš ono što želiš da sačuvaš nakon rada kroz Master Workbook.",fields:["Najvažnija odluka","Šta sam završila","Šta želim da poboljšam","Sledeći konkretan korak"]},
  {title:"AUTORSKA PRAVA I KORIŠĆENJE",intro:"© 2026 Marijana Forai · Digital Soul. Sva prava zadržana.",fields:["Autor / vlasnik","Godina izdanja","Verzija dokumenta","Kontakt za pitanja"]},
  {title:"RESURSI I LINKOVI",intro:"Dodaj svoje zvanične linkove na jednom mestu.",fields:["Web sajt","Prodavnica / proizvodi","Instagram","Email","Ostali resursi"]},
  {title:"HVALA · SLEDEĆI KORAK",intro:"Ovaj workbook je napravljen da se koristi, dopunjava i ponavlja.",fields:["Šta sada radim","Koji proizvod razvijam","Kada proveravam napredak"]}
 ];
 endPages.forEach((s,j)=>{
  const p=81+j,els=[wbText(s.title,10,12,80,10,22,"#171717","center",{font:state.headingFont}),wbText(s.intro,12,25,76,9,10,"#5A544C","center")];
  if(p===82){
   els.push(wbBox("© 2026 Marijana Forai · Digital Soul\nSadržaj ovog materijala je namenjen ličnoj upotrebi kupca i nije dozvoljeno neovlašćeno kopiranje, preprodavanje, distribuiranje ili javno objavljivanje celog ili delova materijala bez dozvole vlasnika autorskih prava.",12,38,76,30,"#F4EFE6","#3A352F",9,{radius:12}));
   els.push(wbText("Za pravne/licencne uslove prilagodi ovu stranicu svojoj konkretnoj prodajnoj ponudi.",14,72,72,10,8,"#8A8175","center"));
  }else{
   s.fields.forEach((f,j)=>wbField(els,f,39+j*10,true));
  }
  els.push(wbText("Digital Soul · Master Workbook",10,94,80,4,7,"#A79D8D","center",{font:"DM Sans"}));
  out[String(p)]=els;
 });
 return out;
}
function templateElements(key,pages,name){
 const t=TEMPLATES[key]||TEMPLATES.planner;
 if(key==="master80") return masterWorkbookElements(name);
 const out={};
 for(let i=1;i<=pages;i++){
  const title=t.names[i-1]||("Strana "+i);
  out[String(i)]=[
   {id:uid(),type:"text",text:i===1?name:title,x:11,y:i===1?20:12,w:78,h:15,font:state.headingFont,fontSize:i===1?30:24,color:i===1?"#E7D2A7":"#171717",align:"center",rotate:0,opacity:100,locked:false},
   {id:uid(),type:"text",text:i===1?"Opiši · Dizajniraj · Ostvari":"Dodaj sadržaj ove strane kroz AI razgovor ili elemente.",x:14,y:i===1?42:30,w:72,h:18,font:state.bodyFont,fontSize:10,color:i===1?"#E7D2A7":"#555555",align:"center",rotate:0,opacity:75,locked:false}
  ];
 }
 return out;
}
function applyTemplate(key){
 const t=TEMPLATES[key];if(!t)return;
 pushHistory();state.pages=t.pages;state.pageNames=[...t.names];state.active=1;state.elements=templateElements(key,t.pages,state.name);
 $("pageCount").value=t.pages;
 if(t.style){const i=styles.findIndex(x=>x.name===t.style);if(i>=0)applyStyle(i)}
 render();addMessage("Šablon „"+t.name+"“ je primenjen. Sada ga možemo prilagoditi kroz AI.");
 saveProject(true);
}
const state={
name:"Moj Premium Planner",format:"A5",pages:10,active:1,width:559,height:794,printWidthMm:148,printHeightMm:210,customUnit:"mm",projectId:"p_"+Date.now(),pageNames:[...pageNames],assets:[],headingFont:"Cormorant Garamond",bodyFont:"DM Sans",
color:"#8EA386",opacity:100,gradientStart:"#171717",gradientEnd:"#C8A66A",gradientAngle:135,savedColors:[],palette:"sage",style:"wellness",
brandProfile:1,plan:"pro",aiUsed:0,selectedElement:null,previewMode:false,history:[],historyIndex:-1,
elements:{}
};
function currentPlan(){return PLANS[state.plan]||PLANS.pro}
function hasAccess(key){
  if(DEV_MODE)return true;
  const p=currentPlan();
  if(key==="pages")return state.pages<p.pages;
  if(key==="ai")return state.aiUsed<p.ai;
  if(key==="pdf"||key==="customSize"||key==="aiImages")return !!p[key];
  if(key==="brand")return p.brands>0;
  return true;
}
function limitMessage(feature,planName="CREATOR PRO"){
  const labels={pages:"više stranica",ai:"više AI akcija",pdf:"PDF export",customSize:"prilagođene dimenzije",aiImages:"AI slike",brand:"više Brand profila"};
  addMessage("Ova mogućnost je deo "+planName+" plana: "+(labels[feature]||feature)+". Otvori „Planovi“ da vidiš opcije.");
}
function renderPricing(){
  const grid=$("pricingGrid"); if(!grid)return;
  grid.innerHTML=Object.entries(PLANS).map(([key,p])=>'<article class="pricing-card '+(p.popular?"featured":"")+'">'+(p.popular?'<span class="pricing-popular">NAJPOPULARNIJI</span>':"")+
    '<div class="pricing-name">'+p.name+'</div><div class="pricing-price">'+p.price+' <small>/ '+p.period+'</small></div><p>'+p.description+'</p>'+
    '<ul><li>Do '+p.pages+' '+FEATURE_COPY.pages+'</li><li>'+p.ai+' '+FEATURE_COPY.ai+'</li><li>'+p.brands+' '+FEATURE_COPY.brands+'</li><li>'+p.aiImages+' '+FEATURE_COPY.aiImages+'</li><li class="'+(p.pdf?"yes":"no")+'">'+(p.pdf?"✓ PDF export":"— PDF export")+'</li><li class="'+(p.customSize?"yes":"no")+'">'+(p.customSize?"✓ Custom size":"— Custom size")+'</li><li>Team: '+p.team+'</li></ul>'+
    '<button class="pricing-cta '+(p.popular?"primary":"")+'" data-plan="'+key+'">'+p.cta+'</button></article>').join("");
  grid.querySelectorAll("[data-plan]").forEach(b=>b.onclick=()=>selectPlan(b.dataset.plan));
}
function selectPlan(key){
  state.plan=key; localStorage.setItem("marijanaDesignStudioPlan",key);
  if(DEV_MODE)addMessage("Development režim: "+PLANS[key].name+" je prikazan kao aktivan, ali su sve funkcije i dalje otključane.");
  else addMessage("Plan je izabran. Payment checkout povezujemo u sledećoj fazi.");
  updateAccessStatus(); $("pricingPanel").hidden=true;
}
function updateAccessStatus(){
  const el=$("accessStatus"); if(!el)return;
  el.textContent=DEV_MODE?"DEV · FULL ACCESS":(PLANS[state.plan]?.name||"FREE");
}
function initPricing(){
  try{const saved=localStorage.getItem("marijanaDesignStudioPlan");if(saved&&PLANS[saved])state.plan=saved}catch(e){}
  $("pricingButton").onclick=()=>{$("pricingPanel").hidden=false;renderPricing()};
  $("closePricing").onclick=()=>$("pricingPanel").hidden=true;
  $("pricingPanel").addEventListener("click",e=>{if(e.target.id==="pricingPanel")$("pricingPanel").hidden=true});
  updateAccessStatus(); renderPricing();
}

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
function snapshot(){return JSON.stringify({elements:state.elements,pages:state.pages,active:state.active,pageNames:state.pageNames,width:state.width,height:state.height,name:state.name,format:state.format,headingFont:state.headingFont,bodyFont:state.bodyFont,color:state.color,style:state.style,palette:state.palette})}
function pushHistory(){
 const s=snapshot(); if(state.history[state.historyIndex]===s)return;
 state.history=state.history.slice(0,state.historyIndex+1);state.history.push(s);if(state.history.length>40)state.history.shift();state.historyIndex=state.history.length-1;
}
function restoreSnapshot(s){
 const x=JSON.parse(s);state.elements=x.elements||{};state.pages=x.pages||1;state.active=x.active||1;state.pageNames=x.pageNames||state.pageNames;state.width=x.width||state.width;state.height=x.height||state.height;state.name=x.name||state.name;state.format=x.format||state.format;state.headingFont=x.headingFont||state.headingFont;state.bodyFont=x.bodyFont||state.bodyFont;state.color=x.color||state.color;state.style=x.style||state.style;state.palette=x.palette||state.palette;state.selectedElement=null;$("projectName").value=state.name;$("format").value=state.format;$("pageCount").value=state.pages;render();
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
const PRINT_SIZES={
 "A4":{px:[794,1123],mm:[210,297]},
 "A5":{px:[559,794],mm:[148,210]},
 "A6":{px:[397,559],mm:[105,148]},
 "B5":{px:[665,945],mm:[176,250]},
 "US Letter":{px:[816,1056],mm:[215.9,279.4]},
 "Half Letter":{px:[528,816],mm:[139.7,215.9]},
 "6 × 9 in":{px:[576,864],mm:[152.4,228.6]},
 "7 × 10 in":{px:[672,960],mm:[177.8,254]},
 "8 × 10 in":{px:[768,960],mm:[203.2,254]},
 "8 × 8 in":{px:[768,768],mm:[203.2,203.2]},
 "Instagram 1080 × 1350":{px:[1080,1350],mm:[285.75,356.25]}
};
function formatDimensions(format){
 const s=PRINT_SIZES[format];return s?s.px:[state.width||794,state.height||1123];
}
function unitToMm(value,unit){
 const n=Number(value)||0;return unit==="cm"?n*10:unit==="in"?n*25.4:n;
}
function mmToPx(mm){return Math.round(mm*96/25.4)}
function updateCanvasDimensions(){
 if(state.format!=="Prilagođeno"){
  const s=PRINT_SIZES[state.format]||PRINT_SIZES.A4;
  state.width=s.px[0];state.height=s.px[1];state.printWidthMm=s.mm[0];state.printHeightMm=s.mm[1];
 }
 const p=$("preview");if(p){p.style.aspectRatio=state.width+"/"+state.height;p.style.height="auto";p.style.width="min(420px,65%)"}
 const fields=$("customSizeFields");if(fields)fields.hidden=state.format!=="Prilagođeno";
 if($("customWidth")){
  const unit=state.customUnit||"mm";$("customUnit").value=unit;
  const factor=unit==="cm"?10:unit==="in"?25.4:1;
  $("customWidth").value=state.format==="Prilagođeno"?Number((state.printWidthMm/factor).toFixed(2)):state.printWidthMm/factor;
  $("customHeight").value=state.format==="Prilagođeno"?Number((state.printHeightMm/factor).toFixed(2)):state.printHeightMm/factor;
 }
}
function exportJSON(){
 const blob=new Blob([JSON.stringify({...state,history:[],historyIndex:-1},null,2)],{type:"application/json"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=(state.name||"projekat")+".json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function exportPDF(){
 saveProject(true);
 const w=window.open("","_blank");if(!w){addMessage("Pregledač je blokirao prozor za PDF. Dozvoli pop-up za ovaj sajt.");return}
 const oldActive=state.active;
 const pages=[];
 for(let i=1;i<=state.pages;i++){state.active=i;render();pages.push('<section class="print-page">'+$("preview").outerHTML+'</section>')}
 state.active=oldActive;render();
 const widthMm=state.printWidthMm||PRINT_SIZES[state.format]?.mm?.[0]||210;
 const heightMm=state.printHeightMm||PRINT_SIZES[state.format]?.mm?.[1]||297;
 w.document.write("<html><head><title>"+esc(state.name)+"</title><style>"+
 "@page{size:"+widthMm+"mm "+heightMm+"mm;margin:0}"+
 "html,body{margin:0;padding:0;background:#fff}"+
 ".print-page{width:"+widthMm+"mm;height:"+heightMm+"mm;page-break-after:always;break-after:page;overflow:hidden;position:relative}"+
 ".print-page:last-child{page-break-after:auto;break-after:auto}"+
 ".print-page .preview{width:100%!important;height:100%!important;max-width:none!important;aspect-ratio:auto!important;box-shadow:none!important;margin:0!important}"+
 "</style></head><body>"+pages.join("")+"</body></html>");
 w.document.close();setTimeout(()=>w.print(),500);
}
function exportSVG(){
 const p=$("preview"),bg=state.active===1?"#171717":"#F6F1E8";
 let els="";
 (state.elements[pageKey()]||[]).forEach(el=>{if(el.type==="text"||el.type==="link"){els+='<text x="'+(el.x/100*state.width)+'" y="'+((el.y+el.fontSize/100*1.2)/100*state.height)+'" font-family="'+esc(el.font||state.bodyFont)+'" font-size="'+el.fontSize+'" fill="'+(el.color||"#171717")+'" text-anchor="'+(el.align==="center"?"middle":el.align==="right"?"end":"start")+'">'+esc(el.text||"")+"</text>"}});
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+state.width+'" height="'+state.height+'" viewBox="0 0 '+state.width+" "+state.height+'"><rect width="100%" height="100%" fill="'+bg+'"/>'+els+"</svg>";
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"}));a.download=(state.name||"strana")+"-strana-"+state.active+".svg";a.click();
}
function render(){
 state.name=$("projectName").value;state.format=$("format").value;state.pages=Math.max(1,Math.min(200,Number($("pageCount").value)||10));updateCanvasDimensions();
 if(state.active>state.pages)state.active=state.pages;ensurePage();
 $("stageTitle").textContent=state.name;
 const strip=$("pagesStrip"),list=$("pageList");strip.innerHTML="";list.innerHTML="";
 for(let i=1;i<=state.pages;i++){
  const name=(state.pageNames&&state.pageNames[i-1])||"Strana "+i;
  const t=document.createElement("div");t.className="thumb"+(i===state.active?" active":"");t.innerHTML="<div>"+i+"</div><span>"+esc(name)+"</span>";t.onclick=()=>{state.active=i;state.selectedElement=null;ensurePage();render()};strip.appendChild(t);
  const item=document.createElement("div");item.className="page-item"+(i===state.active?" active":"");item.innerHTML='<span class="page-no">'+String(i).padStart(2,"0")+'</span><span class="page-title">'+esc(name)+'</span><span class="page-move"><button data-page-up="'+i+'">↑</button><button data-page-down="'+i+'">↓</button></span>';item.onclick=t.onclick;item.querySelectorAll("[data-page-up],[data-page-down]").forEach(b=>b.onclick=ev=>{ev.stopPropagation();movePage(Number(b.dataset.pageUp||b.dataset.pageDown),b.dataset.pageUp?"up":"down")});list.appendChild(item)
 }
 $("fontPreview").querySelector("strong").style.fontFamily='"'+state.headingFont+'"';$("fontPreview").querySelector("span").style.fontFamily='"'+state.bodyFont+'"';
 renderPreview();renderElementInspector();renderLayers();renderAssetLibrary();
}
function renderPreview(){
 const p=$("preview");p.className="preview"+(state.active===1?" cover":"")+(state.previewMode?" preview-mode":"");p.innerHTML="";
 ensurePage();
 const pageBg=state.active===1?"linear-gradient(145deg,#121212,#28251f)":"var(--paper)";p.style.background=pageBg;p.style.setProperty("--body-font",'"'+state.bodyFont+'"');
 state.elements[pageKey()].forEach(el=>{
  const d=document.createElement("div");d.className="design-element "+el.type+"-element"+(el.id===state.selectedElement?" selected":"")+(el.locked?" locked":"");
  d.dataset.id=el.id;d.style.left=el.x+"%";d.style.top=el.y+"%";d.style.width=el.w+"%";d.style.height=el.h+"%";d.style.opacity=(el.opacity??100)/100;d.style.transform="rotate("+(el.rotate||0)+"deg)";d.style.fontFamily='"'+(el.font||state.bodyFont)+'"';d.style.fontSize=(el.fontSize||12)+"px";d.style.color=el.color||"#171717";d.style.textAlign=el.align||"left";
  if(el.type==="text"||el.type==="link")d.textContent=el.text||"Tekst";
  else if(el.type==="image"){const img=document.createElement("img");img.src=el.src;img.alt=el.alt||"";img.style.borderRadius=(el.radius||0)+"px";img.style.boxShadow=el.shadow?"0 10px 25px rgba(0,0,0,.16)":"none";img.style.filter="blur("+(el.blur||0)+"px) brightness("+(el.brightness??100)+"%) contrast("+(el.contrast??100)+"%) saturate("+(el.saturation??100)+"%)";d.appendChild(img)}
  else if(el.type==="mockup"){const img=document.createElement("img");img.src=el.src||mockupSvg(el.mockup||"book");img.style.objectFit="contain";img.style.padding="8%";d.appendChild(img)}
  else if(el.type==="shape"){d.style.background=el.color||"#C8A66A";d.style.borderRadius=(el.radius||12)+"px"}
  else if(el.type==="icon"){d.textContent=el.text||"✦"}
  else if(el.type==="divider")d.innerHTML="";
  else if(el.type==="video")d.innerHTML="▶ Video<br><small>"+esc(el.url||"Dodaj video URL")+"</small>";
  else if(el.type==="table")d.innerHTML="▦ Tabela<br><small>3 × 4</small>";
  else if(el.type==="chart")d.innerHTML="◒ Grafikon<br><small>Podaci za vizuelizaciju</small>";
  if(!state.previewMode&&!el.locked){const h=document.createElement("span");h.className="resize-handle";h.addEventListener("pointerdown",ev=>startResize(ev,el));d.appendChild(h)}
  d.addEventListener("pointerdown",e=>{if(e.target.classList.contains("resize-handle"))return;startDrag(e,el)});d.addEventListener("click",e=>{e.stopPropagation();state.selectedElement=el.id;render()});p.appendChild(d);
 });
 p.onclick=()=>{state.selectedElement=null;renderElementInspector();renderStudioEffects()}
}
function startResize(e,el){
 if(state.previewMode||el.locked)return;
 e.preventDefault();e.stopPropagation();pushHistory();
 const p=$("preview"),rect=p.getBoundingClientRect(),sx=e.clientX,sy=e.clientY,ow=el.w,oh=el.h;
 const move=ev=>{el.w=Math.max(5,Math.min(100-el.x,ow+(ev.clientX-sx)/rect.width*100));el.h=Math.max(5,Math.min(100-el.y,oh+(ev.clientY-sy)/rect.height*100));renderPreview();renderElementInspector();renderLayers()};
 const up=()=>{document.removeEventListener("pointermove",move);document.removeEventListener("pointerup",up);};
 document.addEventListener("pointermove",move);document.addEventListener("pointerup",up);state.selectedElement=el.id;renderElementInspector();
}
function renderLayers(){
 const box=$("layersPanel");if(!box)return;const els=state.elements[pageKey()]||[];
 box.innerHTML=els.length?els.slice().reverse().map((el,idx)=>'<button class="layer-row '+(el.id===state.selectedElement?"active":"")+'" data-layer="'+el.id+'"><span>'+({text:"T",image:"▧",mockup:"▣",shape:"◼",icon:"✦",link:"↗",video:"▶",table:"▦",chart:"◒",divider:"—"}[el.type]||"•")+'</span><strong>'+esc(el.text||el.type)+"</strong><small>"+(el.locked?"🔒":"")+"</small></button>").join(""):'<div class="empty-library">Nema elemenata na ovoj strani.</div>';
 box.querySelectorAll("[data-layer]").forEach(b=>b.onclick=()=>{state.selectedElement=b.dataset.layer;render()});
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
function renderStudioEffects(){
 const hint=$("effectsNoSelection"),box=$("effectsControls"),el=selected();
 if(!hint||!box)return;
 hint.hidden=!!el;box.hidden=!el;if(!el)return;
 const vals={studioBlur:el.blur||0,studioBrightness:el.brightness??100,studioContrast:el.contrast??100,studioSaturation:el.saturation??100,studioOpacity:el.opacity??100,studioRadius:el.radius||0};
 Object.entries(vals).forEach(([id,v])=>{if($(id))$(id).value=v});
 if($("studioBlurValue"))$("studioBlurValue").textContent=(el.blur||0)+"px";
 if($("studioBrightnessValue"))$("studioBrightnessValue").textContent=(el.brightness??100)+"%";
 if($("studioContrastValue"))$("studioContrastValue").textContent=(el.contrast??100)+"%";
 if($("studioSaturationValue"))$("studioSaturationValue").textContent=(el.saturation??100)+"%";
 if($("studioOpacityValue"))$("studioOpacityValue").textContent=(el.opacity??100)+"%";
 if($("studioRadiusValue"))$("studioRadiusValue").textContent=(el.radius||0)+"px";
 if($("studioAnimation"))$("studioAnimation").value=el.animation||"none";
 if($("studioShadow"))$("studioShadow").checked=!!el.shadow;
}
function initStudioEffects(){
 if($("toggleStudioEffects")&&$("studioEffectsDetails"))$("toggleStudioEffects").onclick=()=>{
  const details=$("studioEffectsDetails"),open=!details.hidden;details.hidden=open;
  $("toggleStudioEffects").innerHTML=open?'Prikaži više <span>⌄</span>':'Prikaži manje <span>⌃</span>';
 };

 const bindings=[["studioBlur","blur","studioBlurValue",v=>v+"px"],["studioBrightness","brightness","studioBrightnessValue",v=>v+"%"],["studioContrast","contrast","studioContrastValue",v=>v+"%"],["studioSaturation","saturation","studioSaturationValue",v=>v+"%"],["studioOpacity","opacity","studioOpacityValue",v=>v+"%"],["studioRadius","radius","studioRadiusValue",v=>v+"px"]];
 bindings.forEach(([id,key,label,fmt])=>{if($(id))$(id).oninput=e=>{const el=selected();if(!el)return;el[key]=Number(e.target.value);if($(label))$(label).textContent=fmt(el[key]);renderPreview();renderElementInspector()}});
 if($("studioAnimation"))$("studioAnimation").onchange=e=>{const el=selected();if(el){el.animation=e.target.value;renderPreview();renderElementInspector()}};
 if($("studioShadow"))$("studioShadow").onchange=e=>{const el=selected();if(el){el.shadow=e.target.checked;renderPreview();renderElementInspector()}};
 renderStudioEffects();
}
function renderElementInspector(){
 const box=$("elementInspector"),el=selected();if(!el){box.hidden=true;renderStudioEffects();return}box.hidden=false;
 $("elementTypeLabel").textContent=({text:"TEKST",image:"SLIKA",mockup:"MOCKUP",shape:"OBLIK",icon:"IKONICA",link:"POVEZIVANJE",video:"VIDEO",table:"TABELA",chart:"GRAFIKON",divider:"LINIJA"})[el.type]||el.type.toUpperCase();
 $("elementContent").value=el.text||el.url||"";$("elementSize").value=el.fontSize||12;$("elementRotate").value=el.rotate||0;$("elementX").value=Math.round(el.x);$("elementY").value=Math.round(el.y);$("elementColor").value=normalizeHex(el.color||"#171717")||"#171717";
 const controls={effectBlur:el.blur||0,effectBrightness:el.brightness??100,effectContrast:el.contrast??100,effectSaturation:el.saturation??100,effectRadius:el.radius||0,elementOpacity:el.opacity??100};
 Object.entries(controls).forEach(([id,val])=>{if($(id))$(id).value=val});
 if($("blurValue"))$("blurValue").textContent=(el.blur||0)+"px";if($("brightnessValue"))$("brightnessValue").textContent=(el.brightness??100)+"%";if($("contrastValue"))$("contrastValue").textContent=(el.contrast??100)+"%";if($("saturationValue"))$("saturationValue").textContent=(el.saturation??100)+"%";if($("radiusValue"))$("radiusValue").textContent=(el.radius||0)+"px";if($("elementOpacityValue"))$("elementOpacityValue").textContent=(el.opacity??100)+"%";if($("elementAnimation"))$("elementAnimation").value=el.animation||"none";if($("elementShadow"))$("elementShadow").checked=!!el.shadow;
 const fs=$("elementFont");fs.innerHTML=fonts.map(x=>"<option>"+x+"</option>").join("");fs.value=el.font||state.bodyFont;
 document.querySelectorAll("[data-align]").forEach(b=>b.classList.toggle("active",b.dataset.align===(el.align||"left"))); renderStudioEffects();
}
function insertElement(type,extra={}){
 ensurePage();pushHistory();
 const el={id:uid(),type,x:12,y:18,w:76,h:20,opacity:100,rotate:0,locked:false,blur:0,brightness:100,contrast:100,saturation:100,radius:0,shadow:false,animation:"none",...extra};state.elements[pageKey()].push(el);state.selectedElement=el.id;render();closeInsertPanel();addMessage("Element je dodat na aktivnu stranu.");
}
function mockupSvg(kind){
 const labels={book:"KNJIGA",tablet:"TABLET",phone:"TELEFON",laptop:"LAPTOP",planner:"PLANER"};
 const label=labels[kind]||"MOCKUP";return"data:image/svg+xml;charset=UTF-8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="100%" height="100%" fill="#f6f1e8"/><rect x="45" y="45" width="510" height="710" rx="24" fill="#171717"/><rect x="75" y="75" width="450" height="650" rx="10" fill="#8ea386"/><text x="300" y="410" text-anchor="middle" font-family="Georgia" font-size="42" fill="#fff">'+label+'</text></svg>')}
function insertBy(kind){
 if(kind==="upload"){$("imageUpload").click();return}
 if(kind==="url"){const url=prompt("Nalepi URL slike:");if(url)insertElement("image",{src:url,alt:"Ubačena slika",w:76,h:42,radius:10,shadow:true});return}
 if(kind==="ai"){if(!hasAccess("aiImages")){limitMessage("aiImages","PRO+ AI");return} const q=prompt("Opiši kakvu sliku želiš:");if(q)insertElement("image",{src:mockupSvg("planner"),alt:q,w:76,h:42,radius:12,shadow:true,aiPrompt:q});return}
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
function movePage(n,direction){
 const target=direction==="up"?n-1:n+1;if(target<1||target>state.pages)return;
 pushHistory();const a=state.elements[String(n)]||[];state.elements[String(n)]=state.elements[String(target)]||[];state.elements[String(target)]=a;
 const names=state.pageNames||[];const tmp=names[n-1];names[n-1]=names[target-1]||("Strana "+target);names[target-1]=tmp||("Strana "+n);
 state.active=target;render();
}
function addPage(recordHistory=true,name){
 if(!hasAccess("pages")){limitMessage("pages");return false}
 if(recordHistory)pushHistory();state.pages++;state.pageNames=state.pageNames||[];state.pageNames[state.pages-1]=name||("Strana "+state.pages);state.active=state.pages;ensurePage();$("pageCount").value=state.pages;render();if(recordHistory)addMessage("Nova strana je dodata.");return true
}
function duplicatePage(recordHistory=true){
 if(!hasAccess("pages")){limitMessage("pages");return false}
 if(recordHistory)pushHistory();const src=state.elements[pageKey()]||[];state.pages++;state.pageNames=state.pageNames||[];state.pageNames[state.pages-1]=(state.pageNames[state.active-1]||"Strana "+state.active)+" — kopija";state.active=state.pages;state.elements[pageKey()]=JSON.parse(JSON.stringify(src)).map(x=>({...x,id:uid()}));$("pageCount").value=state.pages;render();if(recordHistory)addMessage("Strana je duplirana.");return true
}
function deleteElement(recordHistory=true){if(!selected())return false;if(recordHistory)pushHistory();state.elements[pageKey()]=state.elements[pageKey()].filter(x=>x.id!==state.selectedElement);state.selectedElement=null;render();return true}
function saveProject(silent=false){
 const clean={...state,history:[],historyIndex:-1,updatedAt:new Date().toISOString()};
 localStorage.setItem("marijanaDesignStudioProject",JSON.stringify(clean));
 try{const all=JSON.parse(localStorage.getItem("marijanaDesignStudioProjects")||"{}");all[state.projectId]={...clean};localStorage.setItem("marijanaDesignStudioProjects",JSON.stringify(all))}catch(e){}
 if(!silent)addMessage("Projekat je sačuvan lokalno u ovom pregledaču.");
}
function loadProject(){
 try{const raw=localStorage.getItem("marijanaDesignStudioProject");if(!raw)return;const x=JSON.parse(raw);Object.assign(state,x);state.history=[];state.historyIndex=-1;$("projectName").value=state.name;$("format").value=state.format;$("pageCount").value=state.pages}catch(e){}
}
function addMessage(text,type="ai"){const m=document.createElement("div");m.className="msg "+type;m.textContent=text;$("messages").appendChild(m);$("messages").scrollTop=99999}
function parseDesignCommand(value){
 const v=value.toLowerCase();
 const pageMatch=v.match(/(?:stran(?:a|i)|page)\\s*(\\d+)/i);
 if(pageMatch){const n=Math.max(1,Math.min(state.pages,Number(pageMatch[1])));state.active=n}
 if(/(?:premium planner|napravi planner)/.test(v)){applyTemplate("planner");return "Napravila sam početnu strukturu Premium planera."}
 if(/(?:napravi workbook|workbook)/.test(v)){applyTemplate("workbook");return "Napravila sam početnu strukturu radne sveske."}
 if(/(?:napravi ebook|ebook)/.test(v)){applyTemplate("ebook");return "Napravila sam početnu strukturu e-knjige."}
 if(/(?:napravi journal|journal)/.test(v)){applyTemplate("journal");return "Napravila sam početnu strukturu dnevnika."}
 if(/(?:social media|društven.*mrež)/.test(v)){applyTemplate("social");return "Napravila sam početnu strukturu paketa za društvene mreže."}
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
 if(!hasAccess("ai")){limitMessage("ai","CREATOR PRO");return}
 if(!DEV_MODE){state.aiUsed++;localStorage.setItem("marijanaDesignStudioAIUsed",String(state.aiUsed))}
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
 const before=snapshot();
 pushHistory();
 for(const a of actions||[]){
  if(a.type==="select_page"){state.active=Math.max(1,Math.min(state.pages,Number(a.page)||1));ensurePage()}
  else if(a.type==="add_page"){addPage(false,a.name)}
  else if(a.type==="duplicate_page"){duplicatePage(false)}
  else if(a.type==="delete_selected"){deleteElement(false)}
  else if(a.type==="change_color"){updateColor(a.color)}
  else if(a.type==="change_fonts"){if(a.headingFont)state.headingFont=a.headingFont;if(a.bodyFont)state.bodyFont=a.bodyFont}
  else if(a.type==="add_element"){
   const e=a.element||{};const el={id:uid(),type:e.type||"text",text:e.text||"",url:e.url||"",mockup:e.mockup||"book",src:e.src||"",aiPrompt:e.aiPrompt||"",x:Number(e.x??12),y:Number(e.y??18),w:Number(e.w??70),h:Number(e.h??20),font:e.font||state.bodyFont,fontSize:Number(e.fontSize??14),color:e.color||state.color,align:e.align||"left",rotate:Number(e.rotate??0),opacity:Number(e.opacity??100),locked:!!e.locked,blur:Number(e.blur??0),brightness:Number(e.brightness??100),contrast:Number(e.contrast??100),saturation:Number(e.saturation??100),radius:Number(e.radius??0),shadow:!!e.shadow,animation:e.animation||"none"};
   if(el.type==="mockup"&&!el.src)el.src=mockupSvg(el.mockup);
   const targetPage=Math.max(1,Math.min(state.pages,Number(a.page)||state.active));ensurePage(targetPage);state.elements[String(targetPage)].push(el);state.selectedElement=targetPage===state.active?el.id:null;
  }
 }
 if(snapshot()!==before)pushHistory();
 render();
}
function renderAssetLibrary(){
 const box=$("assetLibrary");if(!box)return;
 const assets=state.assets||[];
 box.innerHTML=assets.length?assets.map(a=>'<button class="asset-thumb" data-asset="'+a.id+'"><img src="'+a.src+'" alt=""><small>'+esc(a.name||"Slika")+'</small></button>').join(""):'<div class="empty-library">Uploadovane slike će se pojaviti ovde.</div>';
 box.querySelectorAll("[data-asset]").forEach(b=>b.onclick=()=>{const a=assets.find(x=>x.id===b.dataset.asset);if(a)insertElement("image",{src:a.src,alt:a.name,w:76,h:42,radius:10,shadow:true})});
}
function initInsert(){
 const open=()=>{$("insertPanel").hidden=false};$("insertButton").onclick=open;$("insertButtonSide").onclick=open;$("closeInsert").onclick=closeInsertPanel;
 document.querySelectorAll("[data-insert]").forEach(b=>b.onclick=()=>insertBy(b.dataset.insert));
 document.querySelectorAll("[data-mockup]").forEach(b=>b.onclick=()=>insertElement("mockup",{mockup:b.dataset.mockup,src:mockupSvg(b.dataset.mockup),w:b.dataset.mockup==="phone"?34:58,h:48}));
 $("imageUpload").onchange=e=>{Array.from(e.target.files||[]).forEach(file=>{const reader=new FileReader();reader.onload=ev=>{state.assets=state.assets||[];state.assets.unshift({id:uid(),name:file.name,src:ev.target.result});state.assets=state.assets.slice(0,30);insertElement("image",{src:ev.target.result,alt:file.name,w:76,h:42,radius:10,shadow:true});saveProject(true);renderAssetLibrary()};reader.readAsDataURL(file)});e.target.value=""};
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
 const effectBindings=[["effectBlur","blur","blurValue",v=>v+"px"],["effectBrightness","brightness","brightnessValue",v=>v+"%"],["effectContrast","contrast","contrastValue",v=>v+"%"],["effectSaturation","saturation","saturationValue",v=>v+"%"],["effectRadius","radius","radiusValue",v=>v+"px"],["elementOpacity","opacity","elementOpacityValue",v=>v+"%"]];
 effectBindings.forEach(([id,key,label,fmt])=>{if($(id))$(id).oninput=e=>{const el=selected();if(!el)return;el[key]=Number(e.target.value);if($(label))$(label).textContent=fmt(el[key]);renderPreview()}});
 if($("elementAnimation"))$("elementAnimation").onchange=e=>{const el=selected();if(el){el.animation=e.target.value;renderPreview()}};
 if($("elementShadow"))$("elementShadow").onchange=e=>{const el=selected();if(el){el.shadow=e.target.checked;renderPreview()}};
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
 sel.onchange=load;$("brandButton").onclick=()=>{$("brandPanel").hidden=false;$("brandButton").setAttribute("aria-expanded","true")};
 $("closeBrand").onclick=()=>{$("brandPanel").hidden=true;$("brandButton").setAttribute("aria-expanded","false")};
 if($("toggleBrandMore"))$("toggleBrandMore").onclick=()=>{const box=$("brandMore"),btn=$("toggleBrandMore"),open=box.classList.toggle("open");btn.innerHTML=open?'Prikaži manje <span>⌃</span>':'Prikaži više <span>⌄</span>'};
 $("brandColor").oninput=e=>$("brandHex").value=e.target.value.toUpperCase();$("brandHex").onchange=e=>{const x=normalizeHex(e.target.value);if(x){$("brandHex").value=x;$("brandColor").value=x}};
 $("saveBrand").onclick=()=>{const p=brandProfiles[Number(sel.value)-1];p.data={name:$("brandName").value,description:$("brandDescription").value,color:$("brandColor").value,tone:$("brandTone").value,heading:$("brandHeading").value,body:$("brandBody").value};localStorage.setItem("marijanaBrandProfiles",JSON.stringify(brandProfiles));$("saveBrand").textContent="Sačuvano ✓";setTimeout(()=>$("saveBrand").textContent="Sačuvaj brend",1000)};
 $("applyBrand").onclick=()=>{const p=brandProfiles[Number(sel.value)-1];state.headingFont=p.data.heading;state.bodyFont=p.data.body;updateColor(p.data.color);$("headingFont").value=p.data.heading;$("bodyFont").value=p.data.body;render();$("brandPanel").hidden=true};load()
}
function initBrandStorage(){try{const x=JSON.parse(localStorage.getItem("marijanaBrandProfiles"));if(Array.isArray(x))x.forEach((p,i)=>{if(brandProfiles[i])brandProfiles[i]=p})}catch(e){}}
function renderTemplates(){
 const g=$("templateGrid");if(!g)return;
 g.innerHTML=Object.entries(TEMPLATES).map(([k,t])=>'<button class="template-card" data-template="'+k+'"><span class="template-icon">Aa</span><strong>'+t.name+'</strong><small>'+t.desc+'</small><b>Primeni →</b></button>').join("");
 g.querySelectorAll("[data-template]").forEach(b=>b.onclick=()=>{applyTemplate(b.dataset.template);$("templatesPanel").hidden=true});
}
function renderProjects(){
 const box=$("projectLibrary");if(!box)return;
 let all={};try{all=JSON.parse(localStorage.getItem("marijanaDesignStudioProjects")||"{}")}catch(e){}
 const items=Object.values(all).sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||"")));
 box.innerHTML=items.length?items.map(p=>'<div class="project-row"><div><strong>'+esc(p.name||"Bez naziva")+'</strong><small>'+esc(p.format||"A5")+' · '+(p.pages||1)+' strana</small></div><div><button data-open-project="'+p.projectId+'">Otvori</button><button data-delete-project="'+p.projectId+'" class="danger-lite">Obriši</button></div></div>').join(""):'<div class="empty-library">Još nema sačuvanih projekata.</div>';
 box.querySelectorAll("[data-open-project]").forEach(b=>b.onclick=()=>loadProjectById(b.dataset.openProject));
 box.querySelectorAll("[data-delete-project]").forEach(b=>b.onclick=()=>{deleteProject(b.dataset.deleteProject);renderProjects()});
}
function loadProjectById(id){
 let all={};try{all=JSON.parse(localStorage.getItem("marijanaDesignStudioProjects")||"{}")}catch(e){}
 const p=all[id];if(!p)return;
 Object.assign(state,p);state.history=[];state.historyIndex=-1;
 $("projectName").value=state.name;$("format").value=state.format;$("pageCount").value=state.pages;
 $("projectsPanel").hidden=true;render();addMessage("Projekat „"+state.name+"“ je otvoren.");
}
function deleteProject(id){
 let all={};try{all=JSON.parse(localStorage.getItem("marijanaDesignStudioProjects")||"{}")}catch(e){}
 delete all[id];localStorage.setItem("marijanaDesignStudioProjects",JSON.stringify(all));
}
function initToolPanels(){
 $("templatesButton").onclick=()=>{$("templatesPanel").hidden=false;renderTemplates()};
 $("closeTemplates").onclick=()=>{$("templatesPanel").hidden=true};
 $("projectsButton").onclick=()=>{$("projectsPanel").hidden=false;renderProjects()};
 $("closeProjects").onclick=()=>{$("projectsPanel").hidden=true};
 $("exportButton").onclick=()=>{$("exportPanel").hidden=false};
 $("closeExport").onclick=()=>{$("exportPanel").hidden=true};
 ["templatesPanel","projectsPanel","exportPanel"].forEach(id=>$(id).addEventListener("click",e=>{if(e.target.id===id)$(id).hidden=true}));
 $("exportJson").onclick=exportJSON;$("exportPdf").onclick=exportPDF;$("exportSvg").onclick=exportSVG;
 renderTemplates();
}
function initNewProjectModal(){
 const modal=$("newProjectModal"),openBtn=$("newProject"),closeBtn=$("closeNewProject"),cancelBtn=$("cancelNewProject"),createBtn=$("createNewProject");
 if(!modal||!openBtn)return;
 let startType="blank";
 const close=()=>{modal.hidden=true};
 openBtn.onclick=()=>{modal.hidden=false;$("newProjectName").focus()};
 closeBtn.onclick=close;cancelBtn.onclick=close;
 modal.addEventListener("click",e=>{if(e.target===modal)close()});
 document.querySelectorAll("[data-start]").forEach(btn=>btn.onclick=()=>{startType=btn.dataset.start;document.querySelectorAll("[data-start]").forEach(x=>x.classList.toggle("active",x===btn));});
 createBtn.onclick=()=>{
  try{
   const name=$("newProjectName").value.trim()||"Novi projekat";
   const format=$("newProjectFormat").value;
   const pages=startType==="master80"?84:Math.max(1,Math.min(200,Number($("newProjectPages").value)||10));
   const projectFormat=startType==="master80"?"A4":format;
   pushHistory();
   state.name=name;state.format=projectFormat;state.pages=pages;state.pageNames=Array.from({length:pages},(_,i)=>pageNames[i]||"Strana "+(i+1));state.active=1;state.projectId="p_"+Date.now();state.elements={};
   if(projectFormat==="Prilagođeno"){state.customUnit="mm";state.printWidthMm=148;state.printHeightMm=210;state.width=mmToPx(148);state.height=mmToPx(210);}
   $("projectName").value=name;$("format").value=projectFormat;$("pageCount").value=pages;ensurePage();
   if(startType==="planner")state.elements=templateElements("planner",pages,name);
   if(startType==="workbook")state.elements=templateElements("workbook",pages,name);
   if(startType==="ebook")state.elements=templateElements("ebook",pages,name);
   if(startType==="master80")state.elements=templateElements("master80",84,name);
   modal.hidden=true;render();saveProject(true);addMessage("Projekat „"+name+"“ je kreiran. Sada možemo da ga gradimo kroz AI razgovor.");
  }catch(err){
   console.error("Greška pri kreiranju projekta:",err);
   addMessage("Projekat nije kreiran. Osveži stranicu (Ctrl+F5) i pokušaj ponovo.","ai");
  }
 };
}
let clipboardElement=null;
function copySelectedElement(){const el=selected();if(!el)return;clipboardElement=JSON.parse(JSON.stringify(el));addMessage("Element je kopiran.")}
function pasteElement(){if(!clipboardElement)return;pushHistory();const copy={...clipboardElement,id:uid(),x:Math.min(88,(clipboardElement.x||10)+3),y:Math.min(88,(clipboardElement.y||10)+3)};ensurePage();state.elements[pageKey()].push(copy);state.selectedElement=copy.id;render()}
function hideContextMenu(){const m=$("contextMenu");if(m)m.hidden=true}
function showContextMenu(e,el){e.preventDefault();e.stopPropagation();state.selectedElement=el.id;render();const m=$("contextMenu");if(!m)return;m.hidden=false;m.style.left=Math.min(e.clientX,window.innerWidth-190)+"px";m.style.top=Math.min(e.clientY,window.innerHeight-150)+"px"}
function initContextMenu(){if($("contextMenu"))return;const style=document.createElement("style");style.textContent=".design-context-menu{position:fixed;z-index:9999;min-width:170px;padding:6px;background:#fffdf8;border:1px solid rgba(23,23,23,.12);border-radius:12px;box-shadow:0 14px 35px rgba(0,0,0,.16)}.design-context-menu button{display:block;width:100%;border:0;background:transparent;text-align:left;padding:9px 11px;border-radius:8px;cursor:pointer;font:500 13px DM Sans,Arial}.design-context-menu button:hover{background:#f3eee4}.design-context-menu button.danger{color:#a23b32}";document.head.appendChild(style);const m=document.createElement("div");m.id="contextMenu";m.className="design-context-menu";m.hidden=true;m.innerHTML="<button data-cm-copy>Kopiraj</button><button data-cm-paste>Nalepi</button><button data-cm-undo>Poništi</button><button data-cm-redo>Ponovi</button><button class=\"danger\" data-cm-delete>Obriši</button>";document.body.appendChild(m);m.querySelector("[data-cm-copy]").onclick=()=>{copySelectedElement();hideContextMenu()};m.querySelector("[data-cm-paste]").onclick=()=>{pasteElement();hideContextMenu()};m.querySelector("[data-cm-undo]").onclick=()=>{undo();hideContextMenu()};m.querySelector("[data-cm-redo]").onclick=()=>{redo();hideContextMenu()};m.querySelector("[data-cm-delete]").onclick=()=>{deleteElement();hideContextMenu()};document.addEventListener("click",hideContextMenu);window.addEventListener("resize",hideContextMenu)}
function initShortcuts(){
 initContextMenu();
 document.addEventListener("keydown",e=>{
  const tag=(e.target&&e.target.tagName||"").toLowerCase();
  const typing=tag==="input"||tag==="textarea"||tag==="select";
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="s"){e.preventDefault();saveProject();return}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"&&!typing){e.preventDefault();undo();return}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="y"&&!typing){e.preventDefault();redo();return}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="c"&&!typing&&selected()){e.preventDefault();copySelectedElement();return}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="v"&&!typing&&clipboardElement){e.preventDefault();pasteElement();return}
  if(e.key==="Delete"&&!typing&&selected()){e.preventDefault();deleteElement()}
  if(!typing&&selected()&&["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){e.preventDefault();const el=selected();pushHistory();const step=e.shiftKey?1:0.25;if(e.key==="ArrowUp")el.y=Math.max(0,el.y-step);if(e.key==="ArrowDown")el.y=Math.min(100-el.h,el.y+step);if(e.key==="ArrowLeft")el.x=Math.max(0,el.x-step);if(e.key==="ArrowRight")el.x=Math.min(100-el.w,el.x+step);renderPreview();renderElementInspector();renderLayers()}
  if(e.key==="Escape"){["templatesPanel","projectsPanel","exportPanel","pricingPanel","newProjectModal","insertPanel","brandPanel"].forEach(id=>{const el=$(id);if(el)el.hidden=true})}
 });
}
function init(){
 loadProject();initBrandStorage();initPricing();initInsert();initElementInspector();initStudioEffects();initColors();initLibraries();initBrand();initToolPanels();initNewProjectModal();initShortcuts();updateCanvasDimensions();
 $("send").onclick=send;$("prompt").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}});
 document.querySelectorAll("[data-prompt]").forEach(b=>b.onclick=()=>{$("prompt").value=b.dataset.prompt;send()});
 $("pageCount").addEventListener("change",()=>{const p=currentPlan();if(!DEV_MODE&&Number($("pageCount").value)>p.pages){$("pageCount").value=p.pages;state.pages=p.pages;limitMessage("pages");render()}});
 $("projectName").oninput=render;$("format").onchange=()=>{updateCanvasDimensions();render()};if($("customUnit"))$("customUnit").onchange=e=>{state.customUnit=e.target.value;updateCanvasDimensions();render()};if($("customWidth"))$("customWidth").oninput=e=>{state.printWidthMm=unitToMm(e.target.value,state.customUnit||"mm");state.width=mmToPx(state.printWidthMm);render()};if($("customHeight"))$("customHeight").oninput=e=>{state.printHeightMm=unitToMm(e.target.value,state.customUnit||"mm");state.height=mmToPx(state.printHeightMm);render()};$("pageCount").oninput=render;$("headingFont").onchange=e=>{state.headingFont=e.target.value;render()};$("bodyFont").onchange=e=>{state.bodyFont=e.target.value;render()};
 $("save").onclick=saveProject;$("undoBtn").onclick=undo;$("redoBtn").onclick=redo;$("addPage").onclick=addPage;$("duplicatePage").onclick=duplicatePage;
 $("previewMode").onclick=()=>{state.previewMode=!state.previewMode;$("previewMode").textContent=state.previewMode?"Uredi":"Pregled";render()};

 ensurePage();pushHistory();render();renderSavedColors();setInterval(()=>saveProject(true),5000);
}
init();
window.importProductFactory=function(payload){
  try{
    const p=payload||JSON.parse(localStorage.getItem("marijanaDesignStudioProductImport")||"{}");
    if(!p||!p.name)return false;
    state.name=p.name;
    const allowed=["A5","A4","A6","B5","US Letter","Half Letter","6 × 9 in","7 × 10 in","8 × 10 in","8 × 8 in","Instagram 1080 × 1350","Prilagođeno"];
    state.format=allowed.includes(p.format)?p.format:"A5";
    state.pages=Math.max(1,Math.min(200,Number(p.pages)||10));
    state.pageNames=Array.from({length:state.pages},(_,i)=>p.pageMap?.[i]?.title||"Strana "+(i+1));
    state.active=1;
    state.projectId="p_"+Date.now();
    state.elements={};
    for(let i=1;i<=state.pages;i++){
      const title=state.pageNames[i-1]||"Strana "+i;
      const body=i===1?"Sadržaj i struktura proizvoda pripremljeni kroz Product Factory.":"Dodaj finalni sadržaj ove strane kroz Master Content i AI Design Agent.";
      state.elements[String(i)]=[
        {id:uid(),type:"text",text:title,x:11,y:i===1?20:12,w:78,h:15,font:state.headingFont,fontSize:i===1?30:24,color:i===1?"#E7D2A7":"#171717",align:"center",rotate:0,opacity:100,locked:false},
        {id:uid(),type:"text",text:body,x:14,y:i===1?42:30,w:72,h:18,font:state.bodyFont,fontSize:10,color:i===1?"#E7D2A7":"#555555",align:"center",rotate:0,opacity:75,locked:false}
      ];
    }
    $("projectName").value=state.name;$("format").value=state.format;$("pageCount").value=state.pages;
    render();saveProject(true);addMessage("Product Factory je prebačen u Design Studio. Page Map je postavljen kao struktura stranica.");
    localStorage.removeItem("marijanaDesignStudioProductImport");
    return true;
  }catch(e){addMessage("Prebacivanje Product Factory projekta nije uspelo: "+e.message,"user");return false}
};

