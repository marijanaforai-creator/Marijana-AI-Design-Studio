export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metod nije dozvoljen." });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Nedostaje OPENAI_API_KEY u Vercel Environment Variables." });
  }

  try {
    const body = req.body || {};
    const mode = String(body.mode || "page_design");
    const prompt = String(body.prompt || "").trim();
    const page = Math.max(1, Number(body.page) || 1);
    const pageCount = Math.max(1, Number(body.pageCount) || 1);
    const pageText = String(body.pageText || "").slice(0, 18000);
    const documentType = String(body.documentType || "vrsta originalnog dokumenta").slice(0, 120);
    const documentContext = body.documentContext && typeof body.documentContext === "object" ? body.documentContext : {};
    const images = Array.isArray(body.images) ? body.images.slice(0, 3) : [];
    const documentPages = Array.isArray(body.pages) ? body.pages.slice(0, 200) : [];

    if (!prompt) return res.status(400).json({ error: "Napiši šta želiš da napraviš na osnovu PDF-a." });
    if (mode === "analyze_document") {
      if (!documentPages.length) return res.status(400).json({ error: "Nema teksta strana za globalnu analizu PDF-a." });
    } else {
      if (!images.length) return res.status(400).json({ error: "Izaberi PDF i strane za vizuelnu analizu." });
      if (images.some((image) => typeof image !== "string" || !/^data:image\/(png|jpeg|webp);base64,/.test(image))) {
        return res.status(400).json({ error: "Slika strane nije u podržanom formatu." });
      }
    }

    const globalAnalysisInstructions = "Ti si stručnjak za analizu celih PDF dokumenata. Napravi mapu dokumenta pre redizajniranja pojedinačnih strana.\n" +
      "Vrati isključivo JSON oblika {\"documentPlan\":{\"documentTitle\":\"...\",\"documentType\":\"...\",\"purpose\":\"...\",\"styleGuide\":{\"palette\":[\"#FAF7F2\",\"#1C1917\",\"#8A9A86\",\"#C5A059\"],\"headingFont\":\"Cormorant Garamond\",\"bodyFont\":\"DM Sans\",\"layoutPrinciples\":[\"...\"]},\"sections\":[{\"title\":\"...\",\"startPage\":1,\"endPage\":1,\"purpose\":\"...\"}],\"pageSummaries\":[{\"page\":1,\"role\":\"...\",\"contentSummary\":\"...\",\"preserve\":[\"...\"]}]}}.\n" +
      "Pregledaj sve dostavljene strane i prepoznaj naslov, namenu, tok sadržaja, poglavlja, ponavljajuće tipove stranica i razlike među njima. Svaka dostavljena strana mora dobiti kratak sažetak u pageSummaries. Ne izmišljaj delove koji nisu podržani tekstom. Sačuvaj originalnu vrstu dokumenta, sadržaj, redosled i jezik. Razlikuj naslovne strane, sadržajne strane, radne listove, primere, beleške i završne strane. Predloži dosledan vizuelni sistem, ali nemoj forsirati isti raspored na svim tipovima stranica.";
    const pageIndexText = documentPages.map((item) => "STRANA " + Number(item.page || 0) + ":\n" + String(item.text || "").slice(0, 3000)).join("\n\n---\n\n");
    const pageInstructions = "Ti si PDF dizajn agent unutar Marijana AI Design Studio. Redizajniraš jednu stranu uz kontekst celog dokumenta i praviš uređive elemente.\n" +
      "Vrati isključivo JSON objekat sa poljima \"message\" i \"actions\".\n" +
      "Primer: {\"message\":\"Dizajn je spreman.\",\"actions\":[{\"type\":\"add_element\",\"page\":" + page + ",\"element\":{\"type\":\"text\",\"text\":\"Naslov\",\"x\":10,\"y\":8,\"w\":80,\"h\":8,\"font\":\"Cormorant Garamond\",\"fontSize\":24,\"color\":\"#26312A\",\"align\":\"center\"}}]}\n" +
      "Dozvoljene akcije: add_element, add_page, change_color, change_fonts. Dozvoljeni tipovi elemenata: text, image, mockup, shape, icon, link, video, table, chart, divider.\n" +
      "VRSTA DOKUMENTA: " + documentType + ". Sačuvaj je. Ne pretvaraj dnevnik u planer niti menjaj namenu.\n" +
      "GLOBALNI KONTEKST: " + JSON.stringify(documentContext).slice(0, 12000) + "\n" +
      "Tekst originalne strane je jedini izvor za tekstualni sadržaj. Slika je samo vizuelna referenca. Sačuvaj redosled, naslove, pitanja, primere i pasuse; ne izmišljaj ili ponavljaj tekst. Raspored prilagodi ulozi strane iz globalnog plana. Koristi doslednu paletu i tipografiju iz plana. Sav tekst mora ostati na srpskom. Ciljne akcije napravi samo za stranu " + page + " od ukupno " + pageCount + ".";

    const userContent = mode === "analyze_document"
      ? [{ type: "input_text", text: "Napravi globalnu mapu dokumenta. Ukupan broj dostavljenih strana: " + documentPages.length + ". Zahtev: " + prompt + "\n\n" + pageIndexText }]
      : [
          {
            type: "input_text",
            text: "Output format: json. Return only a valid JSON object.\nVrsta originalnog dokumenta: " + documentType + "\nKorisnički zahtev: " + prompt + "\nStrana " + page + " od " + pageCount + "\nGlobalni kontekst: " + JSON.stringify(documentContext).slice(0, 12000) + "\n" + (pageText ? "TEKST ORIGINALNE PDF STRANE — JEDINI IZVOR ZA TEKST:\n" + pageText + "\n" : "") + "\nSlika služi isključivo za vizuelni stil. Napravi uređive elemente bez ponavljanja sadržaja i bez menjanja vrste dokumenta."
          },
          ...images.map((image_url) => ({ type: "input_image", image_url, detail: "high" }))
        ];

    const instructions = mode === "analyze_document" ? globalAnalysisInstructions : pageInstructions;

    // Claude is an optional provider for document-wide analysis only.
    // It remains inactive unless PDF_ANALYSIS_PROVIDER=claude is explicitly configured.
    const useClaudeForAnalysis = mode === "analyze_document" &&
      String(process.env.PDF_ANALYSIS_PROVIDER || "").toLowerCase() === "claude";

    if (useClaudeForAnalysis && !process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({
        error: "Claude analiza nije aktivirana: nedostaje ANTHROPIC_API_KEY kao serverska promenljiva."
      });
    }

    const upstream = useClaudeForAnalysis
      ? await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01"
          },
          body: JSON.stringify({
            model: process.env.CLAUDE_MODEL || "claude-sonnet-5-5",
            max_tokens: 6000,
            system: instructions + "\nVrati isključivo validan JSON bez markdown oznaka.",
            messages: [{
              role: "user",
              content: userContent.map((part) => part.text || "").join("\n")
            }]
          })
        })
      : await fetch("https://api.openai.com/v1/responses", {
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
        error: data?.error?.message || data?.message || "PDF dizajn analiza nije uspela."
      });
    }

    const outputText = String(
      useClaudeForAnalysis
        ? (Array.isArray(data.content) ? data.content.filter((part) => part.type === "text").map((part) => part.text || "").join("\n") : "")
        : (data.output_text ||
          (Array.isArray(data.output) ? data.output.flatMap((item) =>
            Array.isArray(item.content)
              ? item.content.filter((part) => part.type === "output_text" || part.type === "text").map((part) => part.text || "")
              : []
          ).join("\n") : ""))
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

    if (mode === "analyze_document") {
      const documentPlan = result && typeof result.documentPlan === "object" ? result.documentPlan : null;
      if (!documentPlan || !Array.isArray(documentPlan.pageSummaries)) {
        return res.status(502).json({ error: "AI nije vratio validnu mapu kompletnog PDF dokumenta." });
      }
      return res.status(200).json({ documentPlan });
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
