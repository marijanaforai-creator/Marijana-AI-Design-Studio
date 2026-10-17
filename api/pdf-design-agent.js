export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metod nije dozvoljen." });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Nedostaje OPENAI_API_KEY u Vercel Environment Variables." });
  }

  try {
    const body = req.body || {};
    const prompt = String(body.prompt || "").trim();
    const page = Math.max(1, Number(body.page) || 1);
    const images = Array.isArray(body.images) ? body.images.slice(0, 3) : [];

    if (!prompt) {
      return res.status(400).json({ error: "Napiši šta želiš da napraviš na osnovu PDF-a." });
    }
    if (!images.length) {
      return res.status(400).json({ error: "Izaberi PDF i strane za vizuelnu analizu." });
    }
    if (images.some((image) => typeof image !== "string" || !/^data:image\/(png|jpeg|webp);base64,/.test(image))) {
      return res.status(400).json({ error: "Slika strane nije u podržanom formatu." });
    }

    const instructions = `Ti si PDF dizajn agent unutar Marijana AI Design Studio. Analiziraš referentne strane PDF-a i praviš nov dizajn odvojivih, uređivih elemenata.
Vrati isključivo JSON objekat sa poljima "message" (kratko objašnjenje na srpskom) i "actions" (niz akcija).
Primer: {"message":"Dizajn je spreman.","actions":[{"type":"add_element","page":${page},"element":{"type":"text","text":"Naslov","x":10,"y":8,"w":80,"h":8,"font":"Cormorant Garamond","fontSize":24,"color":"#26312A","align":"center"}}]}
Dozvoljene akcije: add_element, add_page, change_color, change_fonts. Dozvoljeni tipovi elemenata: text, image, mockup, shape, icon, link, video, table, chart, divider.
Prouči vizuelni stil referentnih strana: paletu, kontrast, margine, hijerarhiju tipografije, raspored, okvire, linije i gustinu sadržaja. Primeni te vizuelne principe, ali napiši nov sadržaj prema zahtevu korisnika. Nemoj kopirati duge delove teksta iz PDF-a.
Kada praviš radnu svesku, naslov treba da bude JEDAN tekstualni element sa celim naslovom. Nikada ne deli naslov na dva teksta koji zauzimaju isto mesto. Između tekstualnih elemenata ostavi vidljiv prazan prostor i izbegavaj sva preklapanja. Ako je naslov dug, smanji font i/ili proširi njegovo polje.
Koristi okvirno ovu vertikalnu hijerarhiju: naslov y=7–16, uvod y=18–25, sadržaj/pitanja y=28–78, prostor za pisanje/završni blok y=80–91. Svaki element mora biti pojedinačno izmenljiv; ne pretvaraj celu stranu u jednu sliku. Koristi najmanje 8 konkretnih akcija add_element kada je prikladno.
Koordinate i dimenzije su procenti od 0 do 100. Drži elemente unutar x>=7, y>=6, x+w<=93, y+h<=94. Koristi Cormorant Garamond za izražajne naslove i DM Sans za čitljiv tekst gde odgovara. Izvedi boje i stil iz PDF uzorka; boje/fontove navedene od korisnika stavi na prvo mesto. Sav tekst na srpskom.
Ako je potrebna slika, napravi image element sa aiPrompt poljem i ne izmišljaj URL. Ciljne akcije napravi samo za stranu ${page}, osim ako korisnik izričito traži više strana.`;

    const userContent = [
      {
        type: "input_text",
        text: "Output format: json. Return only a valid JSON object.\nKorisnički zahtev: " + prompt + "\nCiljna strana u editoru: " + page + "\nAnaliziraj referentne PDF strane i generiši uređive elemente."
      },
      ...images.map((image_url) => ({ type: "input_image", image_url, detail: "high" }))
    ];

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1",
        instructions,
        input: [{ role: "user", content: userContent }],
        text: { format: { type: "json_object" } }
      })
    });

    const upstreamText = await upstream.text();
    let data;
    try {
      data = JSON.parse(upstreamText);
    } catch {
      console.error("PDF design agent: OpenAI response was not JSON", upstream.status, upstreamText.slice(0, 300));
      return res.status(502).json({
        error: "AI servis je vratio neispravan odgovor. Pokušaj ponovo; ako se ponovi, proverićemo podešavanje modela."
      });
    }

    if (!upstream.ok) {
      console.error("PDF design agent upstream error", upstream.status, data?.error?.message || "unknown");
      return res.status(upstream.status).json({
        error: data?.error?.message || "PDF dizajn analiza nije uspela."
      });
    }

    const outputText = String(
      data.output_text ||
      (Array.isArray(data.output) ? data.output.flatMap((item) =>
        Array.isArray(item.content)
          ? item.content.filter((part) => part.type === "output_text" || part.type === "text").map((part) => part.text || "")
          : []
      ).join("\n") : "")
    ).trim();

    if (!outputText) {
      console.error("PDF design agent: empty output text", JSON.stringify(data.output || []).slice(0, 500));
      return res.status(502).json({ error: "AI nije vratio rezultat dizajna. Pokušaj ponovo sa kraćim zahtevom." });
    }

    let result;
    try {
      result = JSON.parse(outputText);
    } catch {
      const first = outputText.indexOf("{");
      const last = outputText.lastIndexOf("}");
      if (first >= 0 && last > first) {
        try {
          result = JSON.parse(outputText.slice(first, last + 1));
        } catch {
          console.error("PDF design agent: output not valid JSON", outputText.slice(0, 300));
          return res.status(502).json({ error: "AI nije vratio ispravan JSON dizajna. Pokušaj ponovo." });
        }
      } else {
        console.error("PDF design agent: output not JSON", outputText.slice(0, 300));
        return res.status(502).json({ error: "AI nije vratio JSON dizajna. Pokušaj ponovo." });
      }
    }

    if (!result || !Array.isArray(result.actions)) {
      return res.status(502).json({ error: "AI odgovor nema listu elemenata za dizajn." });
    }

    // Final layout guard: account for both element-box height and actual text line height.
    // The canvas renders font sizes in CSS pixels, while element coordinates are percentages.
    const textActions = result.actions.filter((action) =>
      action?.type === "add_element" && action?.element?.type === "text"
    );
    const textItems = textActions.map((action, index) => {
      const element = action.element;
      const text = String(element.text || "");
      let fontSize = Number(element.fontSize || 14);
      let x = Number(element.x ?? 10);
      let y = Number(element.y ?? 18);
      let w = Number(element.w ?? 78);
      let h = Number(element.h ?? 8);

      w = Math.max(18, Math.min(86, w));
      x = Math.max(7, Math.min(93 - w, x));
      fontSize = Math.max(9, Math.min(30, fontSize));

      // Approximate wrapping to ensure tall or long text cannot visually spill into the next item.
      const approxCharsPerLine = Math.max(10, Math.floor((w * 3.15) / Math.max(6, fontSize * 0.53)));
      const hardLines = Math.max(1, text.split("\\n").length);
      const estimatedLines = Math.max(hardLines, Math.ceil(text.length / approxCharsPerLine));
      const neededHeight = Math.max(4.5, (estimatedLines * fontSize * 1.35 / 5.8) + 1.2);
      h = Math.max(h, neededHeight);
      return { action, element, index, text, x, y, w, h, fontSize };
    }).sort((a, b) => a.y - b.y || a.x - b.x || a.index - b.index);

    // Layout in reading order, maintaining a gap between every text element.
    let cursor = 6.5;
    const pageBottom = 94;
    for (const item of textItems) {
      let { element, x, y, w, h, fontSize } = item;
      // Never allow duplicate large headings to fight for the same top area.
      if (y < 23 && fontSize > 21 && cursor > 6.5) {
        fontSize = Math.min(fontSize, 18);
      }
      y = Math.max(y, cursor);
      h = Math.min(32, h);

      // When a page has dense copy, shrink text before allowing overlap or overflow.
      if (y + h > pageBottom) {
        const available = Math.max(4.5, pageBottom - y);
        const ratio = Math.min(1, available / h);
        fontSize = Math.max(9, Math.floor(fontSize * ratio));
        h = Math.max(4.5, Math.min(available, (Math.max(1, item.text.length / Math.max(12, Math.floor(w * 0.48))) * fontSize * 1.35 / 5.8) + 1.2));
      }
      if (y + h > pageBottom) {
        y = Math.max(6.5, pageBottom - h);
      }

      element.x = Number(x.toFixed(2));
      element.y = Number(y.toFixed(2));
      element.w = Number(w.toFixed(2));
      element.h = Number(h.toFixed(2));
      element.fontSize = Number(fontSize.toFixed(1));
      cursor = Math.min(pageBottom, element.y + element.h + 1.8);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("PDF design agent handler error", error);
    return res.status(500).json({
      error: error?.message || "Greška pri analizi PDF-a."
    });
  }
}
