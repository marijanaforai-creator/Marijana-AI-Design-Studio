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
- Korisnik očekuje da prompt generiše raspored, a ne samo da primeni gotov šablon. Za zahtev da napraviš celu radnu stranicu, VRATI NAJMANJE 8–14 zasebnih akcija add_element: pozadinski okvir nije potreban jer je stranica uvek svetla; dodaj naslov, kratak uvod, pitanja kao zasebne tekstualne elemente, za svako pitanje jedan ili više divider elemenata kao linije za odgovor, zaseban okvir/napomenu i kontrolnu listu. Nikada ne stavljaj ceo korisnički prompt u jedan tekstualni element. Tekst elemenata mora biti samo sadržaj koji treba da se vidi na stranici, ne instrukcije za AI.
- Koordinate x, y, w, h su procenti od radne površine (0–100). Drži sve elemente unutar margina: x najmanje 7, y najmanje 6, x+w najviše 93, y+h najviše 94. Svaki element mora imati smisleno ograničenu visinu i širinu. Ne preklapaj tekstualne elemente; ostavi najmanje 1.5% vertikalnog razmaka.
- Ne dozvoli preklapanje elemenata. Svaki element dobija dovoljno prostora; za duži tekst povećaj visinu ili podeli sadržaj u više elemenata.
- Za radne listove dodaj široke linije ili polja za odgovor, jasna pitanja, kontrolne liste, okvire za primere i dovoljno belog prostora za pisanje.
- Kada korisnik kaže da ima mesta, popuni ga korisnim elementima, ne dekoracijom bez svrhe.
- Pozadina radne površine je uvek svetla #F7F4ED (to je već podešeno u uređivaču); nikada ne pravi tamnu pozadinu niti veliki tamni shape preko stranice. Koristi boje brenda: ivory #F7F4ED, sage #8EA386, dark #26312A, gold #C8A66A. Naslovi Cormorant Garamond, tekst DM Sans. Glavni tekst neka bude #26312A ili #3A352F radi čitljivosti. Zlato koristi samo za tanke linije i male detalje.
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
