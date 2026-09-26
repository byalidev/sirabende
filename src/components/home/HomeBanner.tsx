import { Container } from "../layout/Container";

export function HomeBanner() {
  return (
    <section className="home-banner" aria-label="My Turn tanıtımı">
      <Container>
        <div className="home-banner-shell">
          <div className="home-banner-copy">
            <span className="eyebrow home-banner-eyebrow">My Turn Akışı</span>
            <h2>Arama yerine ihtiyaç öne çıkıyor.</h2>
            <p>
              İstediğini tek mesajla anlat, uygun teklifleri gör, fiyat ve koşulları karşılaştır, en doğru seçeneğe karar ver.
            </p>
          </div>
          <div className="home-banner-pills" aria-label="Özellikler">
            <span>Talep oluştur</span>
            <span>Teklifleri al</span>
            <span>Karşılaştır</span>
            <span>Seç</span>
          </div>
        </div>
      </Container>
    </section>
  );
}