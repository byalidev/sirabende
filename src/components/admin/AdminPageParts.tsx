import Link from "next/link";

export function AdminPagination({ page, total, pageSize, basePath, query = "" }: { page: number; total: number; pageSize: number; basePath: string; query?: string }) {
  const pages = Math.ceil(total / pageSize);
  if (pages < 2) return null;
  const href = (value: number) => `${basePath}?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(query)), page: String(value) }).toString()}`;
  return <nav className="admin-pagination" aria-label="Sayfalama"><span>{total} kayıt</span><div>{page > 1 ? <Link href={href(page - 1)}>← Önceki</Link> : <span className="disabled">← Önceki</span>}{Array.from({ length: pages }, (_, index) => index + 1).slice(Math.max(0, page - 2), page + 1).map((value) => <Link className={value === page ? "active" : ""} href={href(value)} key={value}>{value}</Link>)}{page < pages ? <Link href={href(page + 1)}>Sonraki →</Link> : <span className="disabled">Sonraki →</span>}</div></nav>;
}

export function AdminStatus({ value }: { value: string }) {
  return <span className={`dashboard-status dashboard-status-${value.toLowerCase()}`}>{value}</span>;
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));
}
