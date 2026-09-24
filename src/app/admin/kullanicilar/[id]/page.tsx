import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminDeleteButton } from "../../../../components/admin/AdminDeleteButton";
import { AdminModerationForm } from "../../../../components/admin/AdminModerationForm";
import { AdminStrikeForm } from "../../../../components/admin/AdminStrikeForm";
import { AdminStatus, formatDate } from "../../../../components/admin/AdminPageParts";
import { getAdminUser } from "../../../../server/admin/repository";
import { getAdminStrikesForUser, getTrustScore, strikeLevelLabels, strikeReasonLabels } from "../../../../server/strikes/repository";
import { getCurrentUser } from "../../../../server/auth/auth";
import { SuperAdminSanctionControls } from "../../../../components/admin/SuperAdminSanctionControls";
import { TrustScoreBadge } from "../../../../components/trust/TrustScoreBadge";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, strikes, currentUser, trustScore] = await Promise.all([getAdminUser(id), getAdminStrikesForUser(id), getCurrentUser(), getTrustScore(id)]);
  if (!user) notFound();
  const isSuperAdmin = currentUser?.userRoles.some(({ role }) => role.name === "SUPER_ADMIN") ?? false;

  return <div className="dashboard-page">
    <Link className="admin-back-link" href="/admin/kullanicilar">← Kullanıcılara dön</Link>
    <header className="dashboard-page-header compact"><div><span className="eyebrow">Kullanıcı detayı</span><h1>{user.username}</h1><p>{user.email}</p></div><TrustScoreBadge trustScore={trustScore} /><AdminStatus value={user.isActive ? "ACTIVE" : "CLOSED"} /></header>
    <section className="admin-detail-grid">
      <div className="dashboard-panel-section"><h2>Temel bilgiler</h2><dl className="admin-detail-list"><div><dt>Roller</dt><dd>{user.userRoles.map((item) => item.role.name).join(", ") || "USER"}</dd></div><div><dt>Ad soyad</dt><dd>{[user.firstName, user.lastName].filter(Boolean).join(" ") || "Belirtilmemiş"}</dd></div><div><dt>Konum</dt><dd>{[user.city, user.district].filter(Boolean).join(" / ") || "Belirtilmemiş"}</dd></div><div><dt>Kayıt tarihi</dt><dd>{formatDate(user.createdAt)}</dd></div><div><dt>Doğrulama</dt><dd>{user.isVerified ? "Doğrulanmış" : "Doğrulanmamış"}</dd></div></dl></div>
      <div className="dashboard-panel-section"><h2>Block bilgisi</h2><p className="admin-note">Engellediği: {user.blocksInitiated.map((item) => item.blocked.username).join(", ") || "Yok"}</p><p className="admin-note">Engellendiği: {user.blocksReceived.map((item) => item.blocker.username).join(", ") || "Yok"}</p></div>
    </section>
    <section className="dashboard-section-grid">
      <div className="dashboard-panel-section"><h2>Talepler</h2>{user.requests.map((item) => <p className="admin-detail-row" key={item.id}><span>{item.title}</span><span><AdminStatus value={item.status} /> <AdminDeleteButton endpoint={`/api/admin/requests/${item.id}`} label="Bu talep" /></span></p>)}</div>
      <div className="dashboard-panel-section"><h2>Teklifler</h2>{user.offers.map((item) => <p className="admin-detail-row" key={item.id}><span>{item.request.title}</span><span><strong>{item.price.toString()} TRY</strong> <AdminDeleteButton endpoint={`/api/admin/offers/${item.id}`} label="Bu teklif" /></span></p>)}</div>
      <div className="dashboard-panel-section"><h2>Review kayıtları</h2>{user.reviewsReceived.map((item) => <p className="admin-detail-row" key={item.id}><span>{item.reviewer.username}: {item.comment ?? "Yorum yok"}</span><strong>{item.rating}/5</strong></p>)}</div>
      <div className="dashboard-panel-section"><h2>Rapor geçmişi</h2>{user.reportsFiled.map((item) => <p className="admin-detail-row" key={item.id}><span>{item.reason}</span><AdminStatus value={item.status} /></p>)}</div>
    </section>
    <section className="dashboard-panel-section"><h2>Yaptırım yönetimi</h2><p className="admin-note">Tarih alanlarını boş bırakırsanız ilgili yasak kaldırılır. Hesap aktif seçimini kapatmak genel ban uygular.</p><AdminModerationForm id={user.id} isActive={user.isActive} bannedUntil={user.bannedUntil?.toISOString() ?? null} postingBannedUntil={user.postingBannedUntil?.toISOString() ?? null} offeringBannedUntil={user.offeringBannedUntil?.toISOString() ?? null} />{isSuperAdmin ? <SuperAdminSanctionControls userId={user.id} /> : null}<div className="strike-counts"><span>Düşük <strong>{user.lowStrikeCount}/20</strong></span><span>Orta <strong>{user.mediumStrikeCount}/10</strong></span><span>Yüksek <strong>{user.highStrikeCount}/3</strong></span></div><AdminStrikeForm userId={user.id} /></section>
    <section className="dashboard-panel-section"><h2>Yaptırım geçmişi</h2>{strikes.length ? <div className="moderation-history">{strikes.map((strike) => <article className="moderation-history-item" key={strike.id}><div><strong>{strikeLevelLabels[strike.level]} · {strikeReasonLabels[strike.reason]}</strong><p>{strike.adminNote || "Admin notu eklenmemiş."}</p></div><small>{formatDate(strike.createdAt)} · {strike.admin.username} · {strike.status === "ACTIVE" ? "Aktif" : "Geri çekildi"}</small>{isSuperAdmin && strike.status === "ACTIVE" ? <SuperAdminSanctionControls userId={user.id} strikeId={strike.id} /> : null}</article>)}</div> : <p className="admin-note">Henüz yaptırım kaydı yok.</p>}</section>
  </div>;
}
