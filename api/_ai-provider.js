export async function generateText({ system = "", input = "", openaiModel } = {}) {
  const provider = String(process.env.AI_PROVIDER || "openai").toLowerCase();

  if (provider === "gemini") {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY nije podešen na serveru.");
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const contents = [{ role: "user", parts: [{ text: String(input || "") }] }];
    const payload = {
      contents,
      generationConfig: { responseMimeType: "text/plain" }
    };
    if (system) payload.systemInstruction = { parts: [{ text: String(system) }] };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.error?.message || "Gemini zahtev nije uspeo.";
      throw new Error(message);
    }
    const text = (data?.candidates?.[0]?.content?.parts || [])
      .map(part => part.text || "")
      .join("")
      .trim();
    if (!text) throw new Error("Gemini nije vratio tekst. Pokušaj ponovo.");
    return { text, provider: "gemini", responseId: data?.responseId || null };
  }

  if (provider !== "openai") throw new Error("AI_PROVIDER mora biti 'openai' ili 'gemini'.");
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY nije podešen na serveru.");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + process.env.OPENAI_API_KEY
    },
    body: JSON.stringify({
      model: openaiModel || process.env.OPENAI_MODEL || "gpt-4.1",
      ...(system ? { instructions: system } : {}),
      input: String(input || "")
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenAI zahtev nije uspeo.");
  }
  const extracted = data.output_text || (Array.isArray(data.output)
    ? data.output.flatMap(item => Array.isArray(item.content)
      ? item.content.filter(part => part.type === "output_text" || part.type === "text").map(part => part.text || "")
      : []).join("\\n")
    : "");
  const text = String(extracted || "").trim();
  if (!text) {
    const reason = data.incomplete_details?.reason;
    throw new Error(reason
      ? "OpenAI odgovor je prekinut pre nego što je vratio sadržaj (" + reason + "). Pokušaj ponovo."
      : "OpenAI nije vratio tekstualni sadržaj. Pokušaj ponovo.");
  }
  return { text, provider: "openai", responseId: data.id || null };
}
