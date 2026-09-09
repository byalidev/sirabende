"use client";

import { useEffect, useState } from "react";
import { Container } from "../layout/Container";
import { Button } from "../ui/Button";
import { LogoutButton } from "../auth/LogoutButton";

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
    { label: "Talepler", href: "/talepler" },
    { label: "Mesajlar", href: "/mesajlar" },
    { label: "Bildirimler", href: "/bildirimler" },
    { label: "Panel", href: "/panel" },
    { label: "Profil", href: "/panel/profil" },
  ];
  const links = user ? memberLinks : guestLinks;

  return (
    <header className="navbar">
      {menuOpen ? <button className="nav-backdrop" type="button" aria-label="Menüyü kapat" onClick={() => setMenuOpen(false)} /> : null}
      <Container>
        <div className={`nav-inner ${menuOpen ? "menu-open" : ""}`}>
          <a className="brand" href="/" aria-label="SıraBende ana sayfa">
            <span className="brand-mark">S</span>
            <span>SıraBende</span>
          </a>
          <nav id="mobile-navigation" className="nav-links" aria-label="Ana navigasyon">
            {links.map((link) => (
              <a className="nav-link" href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            {user ? <span className="nav-user-mobile"><LogoutButton className="nav-login" /></span> : null}
          </nav>
          <div className="nav-actions">
            {user ? (
              <>
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
