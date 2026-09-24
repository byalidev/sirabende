import Image from "next/image";

export function BrandLogo({ compact = false, admin = false }: { compact?: boolean; admin?: boolean }) {
  const logoSrc = compact ? "/logo-icon.png?v=2026-09-11" : "/logo.png?v=2026-09-11";

  return (
    <Image
      className={`brand-logo ${compact ? "brand-logo-compact" : ""}`}
      src={logoSrc}
      alt={admin ? "My Turn yönetim paneli" : "My Turn"}
      width={compact ? 52 : 176}
      height={compact ? 52 : 96}
      priority={!compact}
      unoptimized
    />
  );
}