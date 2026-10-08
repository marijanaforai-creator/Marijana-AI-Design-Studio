export default async function handler(req,res){
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  try{
    const {section="",instruction="",context="",product={}}=req.body||{};
    if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:"OPENAI_API_KEY nije podešen na serveru."});
    const prompt=["Ti si AI Product Architect za Marijana AI Design Studio.","Radi isključivo na osnovu korisničkog materijala. Ne izmišljaj činjenice, iskustvo, rezultate, testimoniale ili karakteristike.","Korisnik radi po sistemu Master Workbook-a: CONTENT FIRST → DESIGN SECOND.","Odgovaraj na srpskom jeziku. Budi konkretan i početnički jasan.","FAZA: "+section,"INSTRUKCIJA: "+instruction,"PODACI O PROIZVODU: "+JSON.stringify(product),"POSTOJEĆI RAD: "+context,"Ako nešto nedostaje, napiši [DOPUNITI]."].join("\n\n");
    const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.OPENAI_API_KEY},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-6-luna",input:prompt})});
    const raw=await r.text();if(!r.ok)return res.status(r.status).json({error:"AI servis nije prihvatio zahtev."});
    const j=JSON.parse(raw);return res.status(200).json({result:j.output_text||""});
  }catch(e){return res.status(500).json({error:e.message||"Greška"});}
}