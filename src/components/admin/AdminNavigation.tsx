"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutButton } from "../auth/LogoutButton";

const links = [
  { label: "Dashboard", href: "/admin" },
  { label: "Kullanıcılar", href: "/admin/kullanicilar" },
  { label: "Talepler", href: "/admin/talepler" },
  { label: "Teklifler", href: "/admin/teklifler" },
  { label: "Kategoriler", href: "/admin/kategoriler" },
  { label: "Raporlar", href: "/admin/raporlar" },
  { label: "Yorumlar", href: "/admin/yorumlar" },
];

export function AdminNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <aside className={`dashboard-sidebar ${open ? "open" : ""}`}><div className="dashboard-sidebar-top"><Link className="dashboard-brand" href="/admin" onClick={() => setOpen(false)}><span className="brand-mark">S</span><span>SıraBende Admin</span></Link><button className="dashboard-menu-toggle" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={open ? "Admin menüsünü kapat" : "Admin menüsünü aç"}>{open ? "×" : "☰"}</button></div><nav className="dashboard-nav" aria-label="Admin navigasyonu">{links.map((link) => { const active = link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href); return <Link className={`dashboard-nav-link ${active ? "active" : ""}`} href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}</Link>; })}</nav><div className="dashboard-sidebar-footer"><span className="dashboard-demo-dot" />Yetkili yönetici<LogoutButton /></div></aside>;
}
