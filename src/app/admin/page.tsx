import Link from "next/link";
import { DashboardStatCard } from "../../components/dashboard/DashboardStatCard";
import { getAdminStats } from "../../server/admin/repository";

export default async function AdminPage() {
  const stats = await getAdminStats();
  const cards = [
    ["Toplam kullanıcı", stats.users, `${stats.activeUsers} aktif`, "◉"],
    ["Toplam talep", stats.requests, `${stats.activeRequests} aktif`, "⌁"],
    ["Toplam teklif", stats.offers, `${stats.pendingOffers} bekliyor`, "↗"],
    ["Conversation", stats.conversations, `${stats.messages} mesaj`, "✦"],
    ["Toplam rapor", stats.reports, `${stats.pendingReports} bekliyor`, "!"],
    ["Toplam review", stats.reviews, "Yayınlanan değerlendirmeler", "★"],
    ["Düşük yaptırımlar", stats.lowStrikes, "Aktif kayıtlar", "!"],
    ["Orta yaptırımlar", stats.mediumStrikes, "Aktif kayıtlar", "!"],
    ["Yüksek yaptırımlar", stats.highStrikes, "Aktif kayıtlar", "!"],
    ["Kalıcı kapatılanlar", stats.permanentlySuspendedUsers, "Eşik nedeniyle kapatılan", "⊘"],
  ] as const;
  return <div className="dashboard-page"><header className="dashboard-page-header"><div><span className="eyebrow">Yönetim merkezi</span><h1>Platform özeti</h1><p>My Turn verilerini ve moderasyon bekleyen kayıtları takip et.</p></div><Link className="button-quiet" href="/">Siteyi görüntüle ↗</Link></header><section className="dashboard-stat-grid admin-stat-grid" aria-label="Admin istatistikleri">{cards.map(([label, value, detail, icon]) => <DashboardStatCard key={label} label={label} value={value} detail={detail} icon={icon} />)}</section><div className="dashboard-section-grid"><section className="dashboard-panel-section"><div className="dashboard-section-heading"><div><span className="eyebrow">Öncelikli işler</span><h2>Hızlı erişim</h2></div></div><div className="admin-quick-links"><Link href="/admin/kullanicilar">Kullanıcıları incele <span>→</span></Link><Link href="/admin/talepler?status=ACTIVE">Aktif talepler <span>→</span></Link><Link href="/admin/teklifler?status=PENDING">Bekleyen teklifler <span>→</span></Link><Link href="/admin/raporlar?status=PENDING">Bekleyen raporlar <span>→</span></Link></div></section><section className="dashboard-panel-section"><div className="dashboard-section-heading"><div><span className="eyebrow">Kapsam</span><h2>Yönetim notu</h2></div></div><p className="admin-note">Bu panel mevcut demo actor sınırında çalışır. Authentication ve gerçek authorization bu fazın kapsamı dışındadır.</p></section></div></div>;
}
