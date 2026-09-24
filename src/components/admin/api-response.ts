export async function readApiResponse<T extends { error?: string }>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return await response.json() as T;
  const text = await response.text();
  return { error: text.startsWith("<!DOCTYPE") ? `Sunucu bu endpoint'i tanımıyor (HTTP ${response.status}). Dev server'ı yeniden başlatın.` : text || `Sunucudan geçersiz yanıt alındı (HTTP ${response.status}).` } as T;
}
