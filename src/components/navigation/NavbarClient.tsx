"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, BriefcaseBusiness, LayoutDashboard, MessageSquare, UserRound } from "lucide-react";
import { Container } from "../layout/Container";
import { Button } from "../ui/Button";
import { LogoutButton } from "../auth/LogoutButton";
import { BrandLogo } from "./BrandLogo";

type NavbarUser = { firstName: string | null; username: string };

export function NavbarClient({ user }: { user: NavbarUser | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const guestLinks = [
    { label: "Talepler", href: "/talepler" },
    { label: "Nasıl Çalışır?", href: "/#how-it-works" },
    { label: "AI ile Ara", href: "/talepler#ai-search" },
  ];
  const memberLinks = [
    { label: "Talepler", href: "/talepler", icon: BriefcaseBusiness },
    { label: "Bildirimler", href: "/bildirimler", icon: Bell },
    { label: "Profil", href: "/panel/profil", icon: UserRound },
  ];
  const utilityLinks = [
    { label: "Mesajlar", href: "/mesajlar", icon: MessageSquare },
    { label: "Panel", href: "/panel", icon: LayoutDashboard },
  ];
  const links = user ? [] : guestLinks;

  return (
    <header className="navbar">
      {menuOpen ? <button className="nav-backdrop" type="button" aria-label="Menüyü kapat" onClick={() => setMenuOpen(false)} /> : null}
      <Container>
        <div className={`nav-inner ${menuOpen ? "menu-open" : ""}`}>
          <Link className="brand" href="/" aria-label="My Turn ana sayfa"><BrandLogo /></Link>
          <nav id="mobile-navigation" className="nav-links" aria-label="Ana navigasyon">
            {links.map((link) => (
              <a className="nav-link" href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            {user ? (
              <>
                <div className="nav-action-links" aria-label="Hızlı erişim menüsü">
                  {memberLinks.map(({ label, href, icon: Icon }) => (
                    <Link className="nav-icon-button" href={href} key={href} aria-label={label} data-label={label}>
                      <Icon size={16} />
                    </Link>
                  ))}
                  {utilityLinks.map(({ label, href, icon: Icon }) => (
                    <Link className="nav-icon-button nav-icon-button-utility" href={href} key={href} aria-label={label} data-label={label}>
                      <Icon size={16} />
                    </Link>
                  ))}
                </div>
                <a className="nav-login" href="/panel">{user.firstName || user.username}</a>
                <span className="nav-logout-desktop"><LogoutButton className="nav-login" /></span>
              </>
            ) : (
              <>
                <a className="nav-login" href="/giris">Giriş Yap</a>
                <Button href="/kayit" variant="primary">Üye Ol</Button>
              </>
            )}
            <button
              className="menu-toggle"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}
