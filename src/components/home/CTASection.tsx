import { Container } from "../layout/Container";
import { Button } from "../ui/Button";

export function CTASection() {
  return (
    <section className="cta-section" id="cta">
      <Container>
        <div className="cta-inner">
          <h2>Aradığını bulmak için saatlerce arama.</h2>
          <Button href="/talep-olustur">İlk Talebini Oluştur <span aria-hidden="true">↗</span></Button>
        </div>
      </Container>
    </section>
  );
}