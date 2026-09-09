/* eslint-disable @next/next/no-img-element */

import { categoryLabels, conditionLabels, type RequestFormData } from "./requestData";

type RequestPreviewProps = {
  data: RequestFormData;
  compact?: boolean;
};

export function RequestPreview({ data, compact = false }: RequestPreviewProps) {
  const budget = data.flexibleBudget
    ? "Bütçede esnek"
    : data.minBudget || data.maxBudget
      ? `${data.minBudget || "0"} ₺ - ${data.maxBudget || "Sınır yok"} ₺`
      : "Bütçe belirtilmedi";

  return (
    <article className={`request-preview ${compact ? "request-preview-compact" : ""}`}>
      <div className="request-preview-heading">
        <span className="request-badge">Alıcı talebi</span>
        <span className="request-preview-status">Yayın önizlemesi</span>
      </div>
      <h2>{data.title || data.searchText || "Talep başlığın"}</h2>
      <div className="request-preview-facts">
        <span>⌖ {data.city || "İl"}{data.district ? ` / ${data.district}` : ""}</span>
        <span>₺ {budget}</span>
        <span>◈ {data.condition ? conditionLabels[data.condition] : "Ürün durumu"}</span>
      </div>
      {data.description ? <p className="request-preview-description">{data.description}</p> : null}
      {data.images.length > 0 ? (
        <div className="request-preview-images" aria-label={`${data.images.length} fotoğraf önizlemesi`}>
          {data.images.map((image) => <img src={image.url} alt="Talep fotoğrafı" key={image.id} />)}
        </div>
      ) : null}
      <div className="request-preview-footer">
        <span>{categoryLabels[data.category] || "Kategori seçilmedi"}</span>
        <span>Henüz teklif yok</span>
      </div>
    </article>
  );
}