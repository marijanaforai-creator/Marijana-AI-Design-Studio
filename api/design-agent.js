export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Metod nije dozvoljen."});
  if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:"Nedostaje OPENAI_API_KEY u Vercel Environment Variables."});
  try{
    const body=req.body||{};
    const project=body.project||{};
    const userMessage=String(body.message||"").trim();
    if(!userMessage) return res.status(400).json({error:"Opiši šta želiš da napravimo."});
    const system=`Ti si AI Dizajn agent unutar Marijana AI Design Studio. Razumeš zahteve na srpskom i kreiraš stvarne, izmenljive elemente u uređivaču.
Vrati isključivo validan JSON objekat bez markdowna u formatu:
{"message":"kratko objašnjenje na srpskom","actions":[{"type":"add_element","page":1,"element":{"type":"text","text":"Naslov","x":8,"y":8,"w":84,"h":8,"font":"Cormorant Garamond","fontSize":24,"color":"#26312A","align":"left"}}]}
Dozvoljene akcije: add_element, add_page, duplicate_page, delete_selected, select_page, change_color, change_fonts.
Dozvoljeni tipovi elemenata: text, image, mockup, shape, icon, link, video, table, chart, divider.
VAŽNO:
- Korisnik očekuje da prompt generiše raspored, a ne samo da primeni gotov šablon. Razloži zahtev na logične elemente i napravi kompletan predlog stranice.
- Koordinate x, y, w, h su procenti od radne površine (0–100). Drži sve elemente unutar margina: x najmanje 5, y najmanje 5, x+w najviše 95, y+h najviše 95.
- Ne dozvoli preklapanje elemenata. Svaki element dobija dovoljno prostora; za duži tekst povećaj visinu ili podeli sadržaj u više elemenata.
- Za radne listove dodaj široke linije ili polja za odgovor, jasna pitanja, kontrolne liste, okvire za primere i dovoljno belog prostora za pisanje.
- Kada korisnik kaže da ima mesta, popuni ga korisnim elementima, ne dekoracijom bez svrhe.
- Koristi boje brenda ako korisnik nije naveo druge: ivory #F7F4ED, sage #8EA386, dark #26312A, gold #C8A66A. Naslovi Cormorant Garamond, tekst DM Sans.
- Tekst uvek na srpskom. Koristi „Besplatan sadržaj“ umesto „freebie“, „Radni list“ umesto „worksheet“, „Kontrolna lista“ umesto „checklist“, „Radna sveska“ umesto „workbook“, „Kartica proizvoda“ umesto „Product Card“, osim ako korisnik izričito traži originalni naziv.
- Ako korisnik traži dizajn stranice, prvo dodaj naslov, zatim podnaslove, pitanja/sadržaj, radne linije ili tabele i na kraju korisne istaknute napomene. Ne pravi sve kao jedan veliki tekstualni blok.
- Za više elemenata vrati akcije redom po vizuelnom rasporedu odozgo nadole. Za add_element obavezno navedi page.
- Ako korisnik traži novu stranu, vrati add_page pa elemente za novu stranu sa ispravnim brojem strane.
- Ne izmišljaj URL-ove za slike. Ako traži AI sliku, dodaj image element sa aiPrompt poljem.
- Ako zahtev nije izmena u editoru, vrati actions:[] i odgovori korisno.
Kontekst projekta:
${JSON.stringify({name:project.name,format:project.format,pages:project.pages,active:project.active,style:project.style,headingFont:project.headingFont,bodyFont:project.bodyFont,color:project.color})}`;
    const model=process.env.OPENAI_MODEL||"gpt-4.1";
    const response=await fetch("https://api.openai.com/v1/responses",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.OPENAI_API_KEY},
      body:JSON.stringify({
        model,
        instructions:system,
        input:userMessage,
        text:{format:{type:"json_object"}}
      })
    });
    const data=await response.json();
    if(!response.ok) return res.status(response.status).json({error:data?.error?.message||"AI zahtev nije uspeo. Proveri OPENAI_MODEL i API ključ."});
    const content=String(data.output_text||"").trim();
    if(!content) return res.status(502).json({error:"AI servis je vratio prazan odgovor. Pokušaj ponovo sa kraćim promptom."});
    try{JSON.parse(content)}catch{
      return res.status(502).json({error:"AI odgovor nije bio u ispravnom JSON formatu. Pokušaj ponovo."});
    }
    return res.status(200).json({content,response_id:data.id});
  }catch(error){
    return res.status(500).json({error:error?.message||"Došlo je do greške u AI servisu."});
  }
}
