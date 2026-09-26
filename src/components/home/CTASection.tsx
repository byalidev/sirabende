import { Container } from "../layout/Container";
import { Button } from "../ui/Button";

export function CTASection() {
  return (
    <section className="cta-section">
      <Container>
        <div className="cta-inner">
          <div>
            <span className="eyebrow">Hemen başla</span>
            <h2>İhtiyacını anlat, uygun teklifler sana gelsin.</h2>
          </div>
          <div className="cta-actions">
            <Button href="/talep-olustur">Talep Oluştur</Button>
            <Button href="/talepler" variant="secondary" className="button-secondary-light">Talepleri Gör</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}