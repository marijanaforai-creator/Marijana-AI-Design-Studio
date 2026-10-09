export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Metod nije dozvoljen."});
  if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:"OPENAI_API_KEY nije podešen na serveru."});
  try{
    const body=req.body||{};
    const project=body.project||{};
    const userMessage=String(body.message||"").trim();
    if(!userMessage) return res.status(400).json({error:"Poruka je prazna."});
    const system=`Ti si AI Design Agent unutar Marijana AI Design Studio.
Korisnik piše na srpskom. Odgovaraj na srpskom.
Tvoj posao je da razumeš zahtev za digitalni proizvod i vratiš JSON koji frontend može da izvrši.
Nikada ne vraćaj markdown. Samo validan JSON.
Format:
{"message":"kratka poruka korisniku","actions":[{"type":"add_element","page":1,"element":{"type":"text|image|mockup|shape|icon|link|video|table|chart|divider","text":"","url":"","mockup":"book|planner|phone|tablet|laptop","x":10,"y":20,"w":70,"h":30,"fontSize":14,"font":"DM Sans","color":"#171717","align":"left"}}]}
Dozvoljene akcije: add_element, add_page, duplicate_page, delete_selected, select_page, change_color, change_fonts. Za add_page možeš dodati polje "name". Za add_element obavezno navedi "page" broj strane.
Ako korisnik traži više koraka, vrati akcije u tačnom redosledu izvršavanja. Ako prvo treba napraviti novu stranu, prvo vrati add_page, zatim add_element akcije sa "page" postavljenim na broj te nove strane. Ne pretpostavljaj da je aktivna strana ciljna strana. Ako korisnik navede naziv nove strane, stavi ga u add_page.name. Ako korisnik traži sliku koju AI treba da generiše, napravi image element sa aiPrompt poljem umesto izmišljanja URL-a.
Ako zahtev nije akcija editora, vrati actions kao [] i odgovori korisno.
Trenutni projekat:
${JSON.stringify({name:project.name,format:project.format,pages:project.pages,active:project.active,style:project.style,headingFont:project.headingFont,bodyFont:project.bodyFont,color:project.color})}`;
    const r2=await fetch("https://api.openai.com/v1/responses",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.OPENAI_API_KEY},
      body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-6-luna",instructions:system,input:userMessage})
    });
    const data=await r2.json();
    if(!r2.ok) return res.status(r2.status).json({error:data?.error?.message||"AI zahtev nije uspeo."});
    return res.status(200).json({content:data.output_text||"",response_id:data.id});
  }catch(e){return res.status(500).json({error:e.message||"Greška servera."});}
}