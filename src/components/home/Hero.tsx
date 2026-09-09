import { Container } from "../layout/Container";
import { Button } from "../ui/Button";
import { AiSearchForm } from "../requests/AiSearchForm";
import { getActiveCategories } from "../../server/requests/repository";

export async function Hero() {
  const categories = await getActiveCategories();
  const categoryNames = Object.fromEntries(categories.map((item) => [item.slug, item.name]));

  return (
    <section className="hero-section" id="top">
      <div className="hero-orb hero-orb-a" aria-hidden="true" />
      <div className="hero-orb hero-orb-b" aria-hidden="true" />
      <Container>
        <div className="hero-grid">
          <div className="hero-copy-block">
            <span className="eyebrow">SıraBende</span>
            <h1 className="display-title hero-title">Aradığını söyle, teklifleri karşılaştır.</h1>
            <p className="hero-copy">Aradığın ürünü tarif et. Satıcılar sana teklif versin. AI destekli arama ile ihtiyacını saniyeler içinde filtreye çevir.</p>
            <div className="hero-ai-panel">
              <AiSearchForm categoryNames={categoryNames} compact />
            </div>
            <div className="hero-actions">
              <Button href="/talepler">Taleplere Göz At</Button>
              <Button href="/talep-olustur" variant="secondary">Talep Oluştur</Button>
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
