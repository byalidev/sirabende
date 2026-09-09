import Link from "next/link";
import { BlockToggle } from "../../../components/trust/BlockToggle";
import { DashboardEmptyState } from "../../../components/dashboard/DashboardEmptyState";
import { getRequestActor } from "../../../server/requests/actor";
import { getBlockedUsers } from "../../../server/blocks/repository";

export default async function BlockedUsersPage() {
  const actor = await getRequestActor();
  const blockedUsers = await getBlockedUsers(actor.id);
  return <div className="dashboard-page"><header className="dashboard-page-header compact"><div><span className="eyebrow">Güvenlik</span><h1>Engellediklerim</h1><p>Engellediğin kullanıcıları buradan yönet.</p></div><Link className="button-quiet" href="/panel">Panele dön ↗</Link></header>{blockedUsers.length ? <div className="blocked-user-list">{blockedUsers.map((item) => <div className="blocked-user-item" key={item.blockedId}><div><strong>{item.blocked.firstName || item.blocked.username}</strong><small>@{item.blocked.username}</small></div><BlockToggle userId={item.blockedId} initialBlocked /></div>)}</div> : <DashboardEmptyState title="Engellediğin kullanıcı yok." description="Engellediğin kullanıcılar burada listelenecek." href="/talepler" action="Taleplere dön" />}</div>;
}
