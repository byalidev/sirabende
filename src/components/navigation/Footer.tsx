import { Container } from "../layout/Container";
import { BrandLogo } from "./BrandLogo";

const columns = [
  { title: "My Turn", links: [{ label: "Hakkımızda", href: "/hakkimizda" }, { label: "Nasıl Çalışır?", href: "/nasil-calisir" }, { label: "Kategoriler", href: "/kategoriler" }] },
  { title: "Destek", links: [{ label: "Yardım", href: "/yardim" }, { label: "İletişim", href: "/iletisim" }, { label: "Sık Sorulanlar", href: "/sss" }] },
  { title: "Yasal", links: [{ label: "Gizlilik", href: "/gizlilik" }, { label: "Kullanım Koşulları", href: "/kullanim-kosullari" }, { label: "Çerezler", href: "/cerezler" }, { label: "Sorumluluk Reddi Beyanı", href: "/sorumluluk-reddi" }] },
];

export function Footer() {
  return (
    <footer className="footer" id="footer">
      <Container>
        <div className="footer-top">
          <div>
            <a className="brand footer-brand" href="#top"><BrandLogo /></a>
            <p className="footer-brand-copy">İhtiyacını anlat, seçenekleri birlikte bulalım.</p>
          </div>
          <div className="footer-links">
            {columns.map((column) => (
              <div key={column.title}>
                <h3>{column.title}</h3>
                {column.links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 My Turn. Tüm hakları saklıdır.</span>
          <span>İhtiyacın, başlangıç noktan.</span>
        </div>
      </Container>
    </footer>
  );
}