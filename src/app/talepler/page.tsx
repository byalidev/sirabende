import { RequestCondition } from "@prisma/client";
import Link from "next/link";
import { Container } from "../../components/layout/Container";
import { RequestCard } from "../../components/home/RequestCard";
import { RequestFilterForm } from "../../components/requests/RequestFilterForm";
import { ResponsiveFilterPanel } from "../../components/requests/ResponsiveFilterPanel";
import { SearchModeTabs } from "../../components/requests/SearchModeTabs";
import { locations } from "../../config/locations";
import { AiSearchForm } from "../../components/requests/AiSearchForm";
import { getFavoriteRequestIds } from "../../server/favorites/repository";
import { getCurrentUser } from "../../server/auth/auth";
import { getRecommendedRequestsForSession } from "../../server/matching";
import { getActiveCategories, getActiveRequests, normalizeRequestFilters } from "../../server/requests/repository";

const conditionLabels: Record<RequestCondition, string> = {
  NEW: " / Sıfır",
  USED: " / İkinci El",
  REFURBISHED: " / Yenilenmiş",
  UNKNOWN: " / Fark Etmez",
};

type SearchParams = Record<string, string | string[] | undefined>;

function formatBudget(value: string | null) {
  if (!value) return null;
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(Number(value));
}

function budgetLabel(minBudget: string | null, maxBudget: string | null) {
  const min = formatBudget(minBudget);
  const max = formatBudget(maxBudget);
  if (min && max) return `${min} - ${max} TL`;
  if (max) return `${max} TL'ye kadar`;
  if (min) return `${min} TL'den başlayan`;
  return "Bütçe açık";
}

export default async function RequestsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = await searchParams;
  const filters = await normalizeRequestFilters(query);
  const user = await getCurrentUser();
  const [result, categories, recommended] = await Promise.all([
    getActiveRequests(filters),
    getActiveCategories(),
    user ? getRecommendedRequestsForSession() : Promise.resolve([]),
  ]);
  const favoriteIds = user ? await getFavoriteRequestIds(user.id, [...result.requests, ...recommended].map((request) => request.id)) : new Set<string>();
  const categoryNames = Object.fromEntries(categories.map((item) => [item.slug, item.name]));
  const queryFor = (changes: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      const item = Array.isArray(value) ? value[0] : value;
      if (item) params.set(key, item);
    }
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value); else params.delete(key);
    }
    return params.toString();
  };
  const pageCount = Math.ceil(result.total / result.pageSize);
  const pageHref = (page: number) => `/talepler?${queryFor({ page: String(page) })}`;
  const removeFilter = (key: string) => `/talepler?${queryFor({ [key]: undefined, page: "1" })}`;
  const categoryHref = (slug?: string, featured?: boolean) => `/talepler?${queryFor({ category: slug || undefined, featured: featured ? "1" : undefined, page: "1" })}`;
  const conditionLabel = filters.condition ? conditionLabels[filters.condition] : null;
  const dateLabels = { today: "Bugün", "3d": "Son 3 gün", "7d": "Son 7 gün", "30d": "Son 30 gün" };
  const sortLabels = { newest: "En yeni", oldest: "En eski", budget_asc: "Bütçe: düşükten yükseğe", budget_desc: "Bütçe: yüksekten düşüğe", expiring: "Süresi yaklaşan" };
  const activeChips = [
    filters.q ? { key: "q", label: `“${filters.q}”` } : null,
    filters.featured ? { key: "featured", label: "Öne çıkanlar" } : null,
    filters.category ? { key: "category", label: categories.find((item) => item.slug === filters.category)?.name ?? filters.category } : null,
    filters.city ? { key: "city", label: filters.city } : null,
    filters.district ? { key: "district", label: filters.district } : null,
    filters.minBudget !== undefined ? { key: "minBudget", label: `${filters.minBudget.toLocaleString("tr-TR")} TL min.` } : null,
    filters.maxBudget !== undefined ? { key: "maxBudget", label: `${filters.maxBudget.toLocaleString("tr-TR")} TL max.` } : null,
    conditionLabel ? { key: "condition", label: conditionLabel } : null,
    filters.date ? { key: "date", label: dateLabels[filters.date] } : null,
    filters.sameDayNeeded ? { key: "sameDayNeeded", label: "Aynı Gün Lazım" } : null,
  ].filter((chip): chip is { key: string; label: string } => Boolean(chip));

  return (
    <div className="requests-page">
      <main>
        <section className="requests-page-hero">
          <Container>
            <span className="eyebrow" style={{ color: "var(--lime)" }}>Canlı talep akışı</span>
            <h1>İhtiyacın için doğru talebi keşfet.</h1>
            <p>
              Şehir, bütçe, koşul ve kategori filtrelerini kullanarak en uygun talepleri gör,
              hızlıca eşleşen fırsatları bul ve teklifi doğru kişiye ulaştır.
            </p>
          </Container>
        </section>
        <Container>
          <section className="request-list-shell">
            <AiSearchForm categoryNames={categoryNames} />
            <SearchModeTabs
              quick={<RequestFilterForm categories={categories} locations={locations} initial={filters} conditionLabels={conditionLabels} dateLabels={dateLabels} sortLabels={sortLabels} mode="quick" />}
              detailed={<ResponsiveFilterPanel>
                <summary>Filtreler <span>⌄</span></summary>
                <RequestFilterForm categories={categories} locations={locations} initial={filters} conditionLabels={conditionLabels} dateLabels={dateLabels} sortLabels={sortLabels} mode="detailed" />
              </ResponsiveFilterPanel>}
            />
            {recommended.length ? (
              <div className="ai-recommended">
                <div className="request-list-heading compact"><div><span className="eyebrow">Sana uygun talepler</span><h2>Geçmiş taleplerine yakın ihtiyaçlar.</h2></div></div>
                <div className="request-grid">{recommended.map((request) => <RequestCard key={`rec-${request.id}`} requestId={request.id} isFavorited={favoriteIds.has(request.id)} title={request.title} location={`${request.city}${request.district ? ` / ${request.district}` : ""}`} budget={budgetLabel(request.minBudget, request.maxBudget)} condition={conditionLabels[request.condition]} offers={request.offerCount} description={request.description ?? "Detay verilmedi."} category={request.category?.name} href={`/talepler/${request.id}`} isFeatured={request.isFeatured} isPinned={request.isPinned} isUrgent={request.isUrgent} />)}</div>
              </div>
            ) : null}
            <div className="request-category-pills" aria-label="Kategori filtreleri">
              <Link className={filters.featured ? "active premium" : "premium"} href={categoryHref(undefined, true)}>Öne çıkanlar</Link>
              <Link className={!filters.category && !filters.featured ? "active" : ""} href={categoryHref()}>Tümü</Link>
              {categories.map((category) => (
                <Link className={filters.category === category.slug ? "active" : ""} href={categoryHref(category.slug)} key={category.slug}>{category.name}</Link>
              ))}
            </div>
            {activeChips.length ? <div className="request-filter-chips" aria-label="Aktif filtreler">{activeChips.map((chip) => <Link href={removeFilter(chip.key)} key={chip.key}>{chip.label} <span aria-hidden="true">×</span></Link>)}</div> : null}
            <div className="request-list-heading"><div><span className="eyebrow">{result.total} talep bulundu</span><h2>İhtiyaç sahiplerini keşfet.</h2></div><a className="button-quiet" href="/talep-olustur">Talep oluştur ↗</a></div>
            {result.requests.length > 0 ? <><div className="request-grid">{result.requests.map((request) => <RequestCard key={request.id} requestId={request.id} isFavorited={favoriteIds.has(request.id)} title={request.title} location={`${request.city}${request.district ? ` / ${request.district}` : ""}`} budget={budgetLabel(request.minBudget, request.maxBudget)} condition={conditionLabels[request.condition]} offers={request.offerCount} description={request.description ?? "Detay verilmedi."} category={request.category?.name} href={`/talepler/${request.id}`} isFeatured={request.isFeatured} isPinned={request.isPinned} isUrgent={request.isUrgent} isSameDayNeeded={request.sameDayNeeded} />)}</div>{pageCount > 1 ? <nav className="request-pagination" aria-label="Talep sonuçları sayfalaması"><span>Sayfa {result.page} / {pageCount}</span><div>{result.page > 1 ? <Link href={pageHref(result.page - 1)}>← Önceki</Link> : null}{Array.from({ length: pageCount }, (_, index) => index + 1).slice(Math.max(0, result.page - 2), result.page + 1).map((page) => <Link className={page === result.page ? "active" : ""} href={pageHref(page)} key={page}>{page}</Link>)}{result.page < pageCount ? <Link href={pageHref(result.page + 1)}>Sonraki →</Link> : null}</div></nav> : null}</> : <div className="request-empty"><span className="complete-mark">⌁</span><h2>Aradığın kriterlere uygun talep bulunamadı.</h2><p>Filtreleri değiştirerek yeniden deneyebilirsin.</p><Link className="button-primary" href="/talepler">Filtreleri temizle</Link></div>}
          </section>
        </Container>
      </main>
    </div>
  );
}
