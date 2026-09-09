import { Container } from "../layout/Container";

const columns = [
  { title: "SıraBende", links: ["Hakkımızda", "Nasıl Çalışır?", "Kategoriler"] },
  { title: "Destek", links: ["Yardım", "İletişim", "Sık Sorulanlar"] },
  { title: "Yasal", links: ["Gizlilik", "Kullanım Koşulları", "Çerezler"] },
];

export function Footer() {
  return (
    <footer className="footer" id="footer">
      <Container>
        <div className="footer-top">
          <div>
            <a className="brand" href="#top"><span className="brand-mark">S</span><span>SıraBende</span></a>
            <p className="footer-brand-copy">İhtiyacını anlat, seçenekleri birlikte bulalım.</p>
          </div>
          <div className="footer-links">
            {columns.map((column) => (
              <div key={column.title}>
                <h3>{column.title}</h3>
                {column.links.map((link) => <a href="#top" key={link}>{link}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SıraBende. Tüm hakları saklıdır.</span>
          <span>İhtiyacın, başlangıç noktan.</span>
        </div>
      </Container>
    </footer>
  );
}