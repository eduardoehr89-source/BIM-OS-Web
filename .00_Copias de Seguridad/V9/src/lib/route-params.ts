/**
 * Normaliza `params` en Route Handlers (Next puede pasar Promise u objeto).
 */
export async function resolveRouteIdParam(
  params: Promise<{ id: string }> | { id: string } | undefined | null,
): Promise<string | null> {
  if (params == null) return null;
  const p = await Promise.resolve(params);
  const id = typeof p.id === "string" ? p.id.trim() : "";
  return id || null;
}
