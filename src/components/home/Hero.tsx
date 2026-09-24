import { Container } from "../layout/Container";
import { Button } from "../ui/Button";
import { AiSearchForm } from "../requests/AiSearchForm";
import { prisma } from "../../lib/prisma";
import { getActiveCategories } from "../../server/requests/repository";

export async function Hero() {
  const [categories, activeRequestCount, userCount, messageCount] = await Promise.all([
    getActiveCategories(),
    prisma.request.count({
      where: {
        status: "ACTIVE",
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    }),
    prisma.user.count(),
    prisma.message.count(),
  ]);
  const categoryNames = Object.fromEntries(categories.map((item) => [item.slug, item.name]));

  return (
    <section className="hero-section" id="top">
      <div className="hero-orb hero-orb-a" aria-hidden="true" />
      <div className="hero-orb hero-orb-b" aria-hidden="true" />
      <Container>
        <div className="hero-grid">
          <div className="hero-copy-block">
            <span className="eyebrow hero-eyebrow">Hızlı buluşma</span>
            <h1 className="display-title hero-title">İstediğini hızlıca bul, teklifleri karşılaştır.</h1>
            <p className="hero-copy">
              Talep oluştur, uygun fırsatları gör, bütçene ve lokasyonuna göre en doğru seçenekleri anında karşılaştır.
            </p>
            <div className="hero-ai-panel">
              <AiSearchForm categoryNames={categoryNames} compact />
            </div>
            <div className="hero-actions">
              <Button href="/talepler">Taleplere Göz At</Button>
              <Button href="/talep-olustur" variant="secondary">Talep Oluştur</Button>
            </div>
            <div className="hero-stats" aria-label="İstatistikler">
              <div className="hero-stat">
                <strong>{activeRequestCount.toLocaleString("tr-TR")}</strong>
                <span>Aktif Talep</span>
              </div>
              <div className="hero-stat">
                <strong>{userCount.toLocaleString("tr-TR")}</strong>
                <span>Toplam Kullanıcı</span>
              </div>
              <div className="hero-stat">
                <strong>{messageCount.toLocaleString("tr-TR")}</strong>
                <span>Mesaj Gönderimi</span>
              </div>
            </div>
          </div>
          <div className="hero-showcase" aria-hidden="true">
            <div className="showcase-card back">
              <span className="showcase-label">Talep</span>
              <h2>MacBook Pro</h2>
              <p>İstanbul · 45.000 TL’ye kadar</p>
            </div>
            <div className="showcase-card main">
              <span className="showcase-label">AI anladı</span>
              <h2>Temiz PS5 Slim</h2>
              <p>İzmir / Bornova · ikinci el · 20.000 TL’ye kadar</p>
              <div className="showcase-meta">
                <span><strong>92%</strong><br />eşleşme</span>
                <span><strong>3</strong><br />teklif</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
