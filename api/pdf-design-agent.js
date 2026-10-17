export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Metod nije dozvoljen."});
  if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:"Nedostaje OPENAI_API_KEY u Vercel Environment Variables."});
  try{
    const body=req.body||{};
    const prompt=String(body.prompt||"").trim();
    const page=Number(body.page)||1;
    const images=Array.isArray(body.images)?body.images.slice(0,3):[];
    if(!prompt)return res.status(400).json({error:"Napiši šta želiš da napraviš na osnovu PDF-a."});
    if(!images.length)return res.status(400).json({error:"Izaberi PDF i stranice za vizuelnu analizu."});
    if(images.some(x=>typeof x!=="string"||!/^data:image\/(png|jpeg|webp);base64,/.test(x)))return res.status(400).json({error:"Slika stranice nije u podržanom formatu."});
    const instructions=`Ti si PDF dizajn agent unutar Marijana AI Design Studio. Analiziraš referentne stranice PDF-a i praviš NOV dizajn u uređivim elementima, prema promptu korisnika.
Vrati isključivo validan JSON objekat: {"message":"kratko objašnjenje na srpskom","actions":[{"type":"add_element","page":${page},"element":{"type":"text","text":"Naslov","x":10,"y":8,"w":80,"h":8,"font":"Cormorant Garamond","fontSize":24,"color":"#26312A","align":"center"}}]}
Dozvoljene akcije: add_element, add_page, change_color, change_fonts. Dozvoljeni tipovi: text, image, mockup, shape, icon, link, video, table, chart, divider.
Prvo prouči izgled dostavljenih PDF stranica: paletu, kontrast, margine, hijerarhiju tipografije, raspored, okvire, linije, slike i gustinu sadržaja. Zatim primeni vizuelne principe, ali napravi sadržaj prema korisnikovom promptu; nemoj kopirati dugačak tekst iz PDF-a. Koristi najmanje 8 konkretnih akcija add_element kada je to prikladno. Svaki element mora biti zaseban i uređiv. Ne pretvaraj celu stranicu u jednu sliku. Naslov radne strane napiši kao JEDAN tekstualni element sa celim naslovom; nikada ne deli naslov na dva teksta koja zauzimaju isti prostor. Planiraj vertikalnu hijerarhiju sa jasnim razmacima: naslov y=7–15, uvod y=17–24, sadržaj/pitanja y=27–78, završni prostor y=80–91. Koristi razmak od najmanje 2 procentna poena između tekstualnih polja; za duže naslove smanji font ili povećaj visinu njihovog polja umesto preklapanja. Tekstualna polja ne smeju imati preseke, čak ni delimične.
Koordinate su procenti 0-100; drži elemente unutar margina x>=7,y>=6,x+w<=93,y+h<=94 i izbegavaj preklapanja. Koristi fontove Cormorant Garamond i DM Sans gde odgovara, boje i stil izvedi iz uzorka; ako korisnik navede boje/fontove, njih stavi na prvo mesto. Tekst na srpskom. Ako je potrebna slika, koristi image element sa aiPrompt poljem, ne izmišljaj URL-ove.
Dodaj akcije samo za stranu ${page}, osim ako korisnik izričito traži više strana. Ako korisnik traži samo analizu ili prompt, vrati actions:[] i odgovori korisno.`;
    const content=[{type:"input_text",text:"Output format: json. Return only a valid json object.\\nKorisnički zahtev: "+prompt+"\nCiljna strana u editoru: "+page+"\nAnaliziraj referentne PDF stranice i generiši uređive elemente."},...images.map((image_url,i)=>({type:"input_image",image_url,detail:"high"}))];
    const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.OPENAI_API_KEY},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-4.1",instructions,input:[{role:"user",content}],text:{format:{type:"json_object"}}})});
    const data=await response.json();
    if(!response.ok)return res.status(response.status).json({error:data?.error?    // Safety layout pass: keep generated text boxes from covering each other.
    if(Array.isArray(result.actions)){
      const placed=[];
      for(const action of result.actions){
        const e=action?.element;
        if(action?.type!=="add_element"||e?.type!=="text")continue;
        let x=Number(e.x??12), y=Number(e.y??18), w=Number(e.w??70), h=Number(e.h??20);
        x=Math.max(7,Math.min(93-w,x)); y=Math.max(6,Math.min(94-h,y));
        const overlaps=(a,b)=>a.x < b.x+b.w-1 && a.x+a.w > b.x+1 && a.y < b.y+b.h+1.5 && a.y+a.h+1.5 > b.y;
        let attempts=0;
        while(attempts++<placed.length+2){
          const colliding=placed.filter(p=>overlaps({x,y,w,h},p));
          if(!colliding.length)break;
          y=Math.max(...colliding.map(p=>p.y+p.h))+2;
          if(y+h>94){y=6; h=Math.max(4,Math.min(h,94-y)); e.fontSize=Math.max(10,Number(e.fontSize||14)-2);}
        }
        e.x=x;e.y=Number(y.toFixed(2));e.w=w;e.h=h;
        placed.push({x,y:e.y,w,h});
      }
    }
.message||"PDF dizajn analiza nije uspela."});
    const text=String(data.output_text||data.output?.flatMap(item=>Array.isArray(item.content)?item.content.filter(part=>part.type==="output_text"||part.type==="text").map(part=>part.text||""):[]).join("\n")||"").trim();
    if(!text)return res.status(502).json({error:"AI nije vratio rezultat dizajna."});
    let result;try{result=JSON.parse(text)}catch{return res.status(502).json({error:"AI odgovor nije u validnom JSON formatu."})}
    return res.status(200).json(result);
  }catch(error){return res.status(500).json({error:error?.message||"Greška pri analizi PDF-a."})}
}
