"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutButton } from "../auth/LogoutButton";

const links = [
  { label: "Genel Bakış", href: "/panel" },
  { label: "Taleplerim", href: "/panel/talepler" },
  { label: "Tekliflerim", href: "/panel/teklifler" },
  { label: "Mesajlar", href: "/mesajlar" },
  { label: "Bildirimler", href: "/bildirimler" },
  { label: "Favorilerim", href: "/panel/favoriler" },
  { label: "Engellediklerim", href: "/panel/engellenenler" },
  { label: "Profilim", href: "/panel/profil" },
];

export function DashboardNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className={`dashboard-sidebar ${open ? "open" : ""}`}>
      <div className="dashboard-sidebar-top">
        <Link className="dashboard-brand" href="/panel" onClick={() => setOpen(false)}><span className="brand-mark">S</span><span>SıraBende</span></Link>
        <button className="dashboard-menu-toggle" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={open ? "Panel menüsünü kapat" : "Panel menüsünü aç"}>{open ? "×" : "☰"}</button>
      </div>
      <nav className="dashboard-nav" aria-label="Panel navigasyonu">
        {links.map((link) => {
          const active = link.href === "/panel" ? pathname === link.href : pathname.startsWith(link.href);
          return <Link className={`dashboard-nav-link ${active ? "active" : ""}`} href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}</Link>;
        })}
      </nav>
      <div className="dashboard-sidebar-footer"><span className="dashboard-demo-dot" />Gerçek kullanıcı hesabı<LogoutButton /></div>
    </aside>
  );
}
