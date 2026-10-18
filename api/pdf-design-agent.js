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
    const pageText = String(body.pageText || "").slice(0, 18000);
    const documentType = String(body.documentType || "vrsta originalnog dokumenta").slice(0, 120);
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
VRSTA DOKUMENTA JE ZAKLJUČANA: ${documentType}. Ovu vrstu moraš sačuvati na svakoj strani. Ne pretvaraj dnevnik u planer, planer u radnu svesku, e-knjigu u planer niti menjaj namenu dokumenta.
TEKSTUALNO PRAVILO: Ako je dostavljen TEKST ORIGINALNE PDF STRANE, koristi njega kao jedini izvor za tekstualni sadržaj. Slika je samo referenca za vizuelni stil; ne prepisuj tekst sa slike i ne dodaj tekst koji nije u pageText. Sačuvaj redosled, naslove, pitanja, primere i pasuse. Nemoj ponavljati naslov niti stvarati alternativne naslove. Nemoj dodavati nazive šablona, kao što su „Nedeljni planer“, „Premium planner“ ili „Nova priča“, osim ako se tačan izraz pojavljuje u originalnom tekstu.
Prouči vizuelni stil referentne strane: paletu, kontrast, margine, hijerarhiju tipografije i gustinu. Uredi postojeći sadržaj u jasne, uređive tekstualne elemente. Ne izostavljaj delove i ne sabijaj tekst. Ako je stranica puna, postavi kasnije tekstualne blokove niže od y=91 da bi aplikacija mogla da ih premesti na nastavnu stranu.
Ograniči se na 1 glavni naslov samo ako ga originalni tekst sadrži, postojeće podnaslove i postojeći tekst. Nemoj izmišljati uvod, završetak, pitanja ili reklamne natpise. Koristi najviše 1–2 diskretna dekorativna elementa i izbegavaj image, mockup i lažne ilustracije. Daj prednost čitljivosti nad ukrasima.
Koordinate i dimenzije su procenti od 0 do 100. Drži elemente unutar x>=7, x+w<=93; y može biti veći od 94 samo za tekstualne blokove koji se nastavljaju na dodatnu stranu. Koristi Cormorant Garamond za naslove i DM Sans za tekst gde odgovara. Koristi dosledno boje: #FAF7F2, #1C1917, #8A9A86 i #C5A059. Sav tekst mora ostati na srpskom. Ciljne akcije napravi samo za stranu ${page}.`;

    const userContent = [
      {
        type: "input_text",
        text: "Output format: json. Return only a valid JSON object.\nVrsta originalnog dokumenta: " + documentType + "\nKorisnički zahtev: " + prompt + "\nCiljna strana u editoru: " + page + "\n" + (pageText ? "TEKST ORIGINALNE PDF STRANE — JEDINI IZVOR ZA TEKST, ne dodaj druge naslove ili sadržaj:\n" + pageText + "\n" : "") + "\nSlike služe isključivo za vizuelni stil. Napravi uredive elemente bez ponavljanja sadržaja i bez menjanja vrste dokumenta."
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

    // Layout pass based on rendered font height, not only model-supplied boxes.
    // Keep one primary heading and flow text blocks down the page with consistent spacing.
    const originalTextItems = result.actions
      .map((action, index) => ({ action, index, element: action?.element }))
      .filter((item) => item.action?.type === "add_element" && item.element?.type === "text");

    const titleCandidates = originalTextItems.filter((item) =>
      Number(item.element.y ?? 50) < 28 &&
      Number(item.element.fontSize ?? 14) >= 20 &&
      String(item.element.text || "").trim().length > 8
    );
    let chosenTitle = null;
    if (titleCandidates.length > 1) {
      chosenTitle = [...titleCandidates].sort((a, b) =>
        String(b.element.text || "").trim().length - String(a.element.text || "").trim().length
      )[0];
      for (const candidate of titleCandidates) {
        if (candidate !== chosenTitle) {
          result.actions = result.actions.filter((action) => action !== candidate.action);
        }
      }
    }

    const textItems = result.actions
      .map((action, index) => ({ action, index, element: action?.element }))
      .filter((item) => item.action?.type === "add_element" && item.element?.type === "text")
      .map((item) => {
        const element = item.element;
        const text = String(element.text || "").trim();
        const originalY = Number(element.y ?? 18);
        let fontSize = Math.max(9, Math.min(30, Number(element.fontSize || 14)));
        let x = Number(element.x ?? 10);
        let w = Number(element.w ?? 78);
        x = Math.max(7, Math.min(93 - Math.max(18, Math.min(86, w)), x));
        w = Math.max(18, Math.min(86, w));

        const approximateCharsPerLine = Math.max(12, Math.floor((w * 3.15) / Math.max(6, fontSize * 0.53)));
        const lines = Math.max(
          1,
          String(text).split("\\n").length,
          Math.ceil(text.length / approximateCharsPerLine)
        );
        let h = Math.max(4.8, lines * fontSize * 1.48 / 5.8 + 1.4);
        if (chosenTitle && item.action !== chosenTitle.action && originalY < 28 && fontSize >= 18) {
          fontSize = 14;
          h = Math.max(5.8, Math.ceil(text.length / Math.max(20, Math.floor(w * 0.55))) * fontSize * 1.48 / 5.8 + 1.4);
        }
        return { ...item, text, originalY, x, w, fontSize, h, lines };
      })
      .sort((a, b) => a.originalY - b.originalY || a.x - b.x || a.index - b.index);

    const pageTop = 6.5;
    const pageBottom = 94;
    const gap = 2.8;
    const availableHeight = pageBottom - pageTop;
    let requiredHeight = textItems.reduce((sum, item) => sum + item.h, 0) + Math.max(0, textItems.length - 1) * gap;

    // If the model supplied too much text, scale typography and heights uniformly before placing.
    if (requiredHeight > availableHeight && textItems.length) {
      const scale = Math.max(0.62, availableHeight / requiredHeight);
      for (const item of textItems) {
        item.fontSize = Math.max(9, item.fontSize * scale);
        const charsPerLine = Math.max(12, Math.floor((item.w * 3.15) / Math.max(6, item.fontSize * 0.53)));
        item.lines = Math.max(1, Math.ceil(item.text.length / charsPerLine));
        item.h = Math.max(4.8, item.lines * item.fontSize * 1.48 / 5.8 + 1.4);
      }
      requiredHeight = textItems.reduce((sum, item) => sum + item.h, 0) + Math.max(0, textItems.length - 1) * gap;
    }

    // Absolute vertical flow prevents text boxes from occupying the same area.
    let cursor = pageTop;
    for (const item of textItems) {
      const { element, x, w } = item;
      let h = Math.min(32, item.h);
      let fontSize = item.fontSize;
      if (cursor + h > pageBottom) {
        const available = Math.max(4.5, pageBottom - cursor);
        const factor = Math.min(1, available / h);
        h = available;
        fontSize = Math.max(9, fontSize * factor);
      }
      element.x = Number(x.toFixed(2));
      element.y = Number(cursor.toFixed(2));
      element.w = Number(w.toFixed(2));
      element.h = Number(h.toFixed(2));
      element.fontSize = Number(fontSize.toFixed(1));
      cursor = cursor + h + gap; // Keep overflow positions so the caller can move them to continuation pages.
    }

    // Keep long decorative rules outside text blocks; AI-generated dividers must never cut through titles.
    const placedText = textItems.map((item) => ({
      x: Number(item.element.x),
      y: Number(item.element.y),
      w: Number(item.element.w),
      h: Number(item.element.h)
    }));
    const longRules = result.actions.filter((action) => {
      const element = action?.element;
      if (action?.type !== "add_element" || !element) return false;
      const width = Number(element.w ?? 0);
      const height = Number(element.h ?? 0);
      return element.type === "divider" || (element.type === "shape" && width >= 35 && height <= 4);
    });
    for (const action of longRules) {
      const element = action.element;
      const x = Number(element.x ?? 10);
      const width = Number(element.w ?? 60);
      const height = Math.max(0.8, Number(element.h ?? 1.2));
      const originalY = Number(element.y ?? 50);
      const candidates = [originalY];
      for (const item of placedText) {
        if (x < item.x + item.w && x + width > item.x) {
          candidates.push(item.y - height - 2.5);
          candidates.push(item.y + item.h + 2.5);
        }
      }
      candidates.sort((a, b) => Math.abs(a - originalY) - Math.abs(b - originalY));
      const safeY = candidates.find((y) =>
        y >= 6 && y + height <= 94 &&
        !placedText.some((item) =>
          x < item.x + item.w &&
          x + width > item.x &&
          y < item.y + item.h + 1.5 &&
          y + height + 1.5 > item.y
        )
      );
      if (safeY !== undefined) element.y = Number(safeY.toFixed(2));
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("PDF design agent handler error", error);
    return res.status(500).json({
      error: error?.message || "Greška pri analizi PDF-a."
    });
  }
}
