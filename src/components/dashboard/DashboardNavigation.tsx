"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutButton } from "../auth/LogoutButton";

const links = [
  { label: "Genel Bakış", href: "/panel", icon: "⌂" },
  { label: "Taleplerim", href: "/panel/talepler", icon: "◎" },
  { label: "Tekliflerim", href: "/panel/teklifler", icon: "↗" },
  { label: "Mesajlar", href: "/mesajlar", icon: "✉" },
  { label: "Bildirimler", href: "/bildirimler", icon: "◌" },
  { label: "Favorilerim", href: "/panel/favoriler", icon: "♡" },
  { label: "Engellediklerim", href: "/panel/engellenenler", icon: "⊘" },
  { label: "Yaptırım geçmişim", href: "/panel/yaptirim-gecmisim", icon: "!" },
  { label: "Profilim", href: "/panel/profil", icon: "◯" },
];

export function DashboardNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <section className={`dashboard-sidebar ${open ? "open" : ""}`} aria-label="Panel menüsü">
      <div className="dashboard-sidebar-top">
        <span className="dashboard-menu-label">Panel menüsü</span>
        <button className="dashboard-menu-toggle" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={open ? "Panel menüsünü kapat" : "Panel menüsünü aç"}>{open ? "×" : "☰"}</button>
      </div>
      <nav className="dashboard-nav" aria-label="Panel navigasyonu">
        {links.map((link) => {
          const active = link.href === "/panel" ? pathname === link.href : pathname.startsWith(link.href);
          return <Link className={`dashboard-nav-link ${active ? "active" : ""}`} href={link.href} key={link.href} onClick={() => setOpen(false)}><span className="dashboard-nav-icon" aria-hidden="true">{link.icon}</span><span>{link.label}</span><span className="dashboard-nav-arrow" aria-hidden="true">↗</span></Link>;
        })}
      </nav>
      <div className="dashboard-sidebar-footer"><span className="dashboard-demo-dot" />Gerçek kullanıcı hesabı<LogoutButton /></div>
    </section>
  );
}
