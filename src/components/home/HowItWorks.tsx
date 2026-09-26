import { Container } from "../layout/Container";
import { SectionHeading } from "../ui/SectionHeading";

const steps = [
  { number: "01", icon: "✦", title: "İhtiyacını net anlat.", copy: "Ürün, bütçe, lokasyon ve koşullarını kısa bir talepte açıkça belirt." },
  { number: "02", icon: "↗", title: "Uygun teklifler sana gelsin.", copy: "Talebin ilgili kişiler tarafından hızlıca görsün; gereksiz arama süreci yaşanmasın." },
  { number: "03", icon: "≋", title: "Fiyat ve koşulları kıyasla.", copy: "Teklifleri tek ekranda karşılaştır, en güçlü seçenekleri kolayca filtrele." },
  { number: "04", icon: "✓", title: "En doğru seçimi yap.", copy: "Sana en uygun olanı seç, güvenle ilerle ve anında iletişime geç." },
];

export function HowItWorks() {
  return (
    <section className="section-pad" id="how-it-works">
      <Container>
        <div className="section-heading-row">
          <SectionHeading eyebrow="Nasıl çalışır?" title="Arama sürecini tersine çeviriyoruz." />
          <p className="section-copy">My Turn’da senin ihtiyacın öne çıkar; seçenekler seni bulur.</p>
        </div>
        <div className="steps-grid">
          {steps.map((step) => (
            <article className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>
              <div className="step-icon" aria-hidden="true">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}