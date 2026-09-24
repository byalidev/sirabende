"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton({ className = "dashboard-nav-link" }: { className?: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/giris");
    router.refresh();
  }

  return (
    <button className={className} type="button" onClick={logout} aria-label="Çıkış yap" title="Çıkış yap">
      <LogOut size={16} />
    </button>
  );
}
