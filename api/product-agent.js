import { generateText } from "./_ai-provider.js";

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  try{
    const {section="",instruction="",context="",product={}}=req.body||{};
    const prompt=[
      "Ti si AI Product Architect za Marijana AI Design Studio.",
      "Radi isključivo na osnovu korisničkog materijala. Ne izmišljaj činjenice, iskustvo, rezultate, testimoniale ili karakteristike.",
      "Korisnik radi po sistemu Master Workbook-a: CONTENT FIRST → DESIGN SECOND.",
      "Odgovaraj na srpskom jeziku. Budi konkretan i početnički jasan.",
      "FAZA: "+section,
      "INSTRUKCIJA: "+instruction,
      "PODACI O PROIZVODU: "+JSON.stringify(product),
      "POSTOJEĆI RAD: "+context,
      "Ako nešto nedostaje, napiši [DOPUNITI]."
    ].join("\n\n");
    const result=await generateText({input:prompt,openaiModel:process.env.OPENAI_MODEL||"gpt-6-luna"});
    return res.status(200).json({result:result.text,provider:result.provider});
  }catch(e){
    const message=e.message||"Greška";
    const status=message.includes("nije podešen")?503:500;
    return res.status(status).json({error:message});
  }
}