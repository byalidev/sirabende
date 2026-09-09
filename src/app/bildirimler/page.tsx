import Link from "next/link";
import { NotificationList } from "../../components/notifications/NotificationList";
import { getRequestActor } from "../../server/requests/actor";
import { getNotificationsForActor } from "../../server/notifications/repository";
import { requireUser } from "../../server/auth/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  try { await requireUser(); } catch { redirect("/giris"); }
  const actor = await getRequestActor();
  const notifications = await getNotificationsForActor(actor.id);
  return <main className="notifications-page"><header className="notifications-page-header"><div><Link className="back-link dark" href="/panel">← Panele dön</Link><span className="eyebrow">Güncel</span><h1>Bildirimler</h1><p>Mesaj ve hesap hareketlerini burada takip et.</p></div><Link className="button-quiet" href="/mesajlar">Mesajlara git ↗</Link></header><NotificationList initialNotifications={notifications} /></main>;
}
