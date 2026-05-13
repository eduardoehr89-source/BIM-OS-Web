/** Lista nombres de modelos publicados por la API (para depurar 404 en Vercel). */
export async function fetchGeminiModelNames(apiKey: string): Promise<{ v1: string[]; v1beta: string[] }> {
  const result: { v1: string[]; v1beta: string[] } = { v1: [], v1beta: [] };

  for (const ver of ["v1", "v1beta"] as const) {
    try {
      const url = `https://generativelanguage.googleapis.com/${ver}/models?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, { method: "GET", cache: "no-store" });
      if (!res.ok) {
        result[ver] = [`(HTTP ${res.status} al listar ${ver})`];
        continue;
      }
      const data = (await res.json()) as { models?: { name?: string }[] };
      result[ver] = (data.models ?? [])
        .map((m) => (m.name ?? "").replace(/^models\//, ""))
        .filter(Boolean);
    } catch (e) {
      result[ver] = [`(error listando ${ver}: ${e instanceof Error ? e.message : String(e)})`];
    }
  }

  return result;
}

export function logGeminiModelsOnFailure(apiKey: string, context: string): void {
  void fetchGeminiModelNames(apiKey)
    .then((lists) => {
      console.log(`[${context}] Gemini modelos API v1 (${lists.v1.length}):`, lists.v1.join(", ") || "(vacío)");
      console.log(`[${context}] Gemini modelos API v1beta (${lists.v1beta.length}):`, lists.v1beta.join(", ") || "(vacío)");
    })
    .catch((e) => {
      console.log(`[${context}] No se pudieron listar modelos Gemini:`, e);
    });
}
