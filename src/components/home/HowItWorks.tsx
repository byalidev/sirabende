import { Container } from "../layout/Container";
import { SectionHeading } from "../ui/SectionHeading";

const steps = [
  { number: "01", icon: "⌁", title: "Ne aradığını söyle.", copy: "İhtiyacını, bütçeni ve bulunduğun yeri birkaç cümleyle anlat." },
  { number: "02", icon: "↗", title: "Satıcılar sana teklif versin.", copy: "Talebin doğru satıcıların önüne çıksın, seçenekler sana gelsin." },
  { number: "03", icon: "≋", title: "Teklifleri karşılaştır.", copy: "Fiyat, koşul ve teslimat detaylarını tek bakışta değerlendir." },
  { number: "04", icon: "✓", title: "Sana uygun olanı seç.", copy: "Karar senin. En iyi seçeneği bulduğunda bir adım öndesin." },
];

export function HowItWorks() {
  return (
    <section className="section-pad" id="how-it-works">
      <Container>
        <div className="section-heading-row">
          <SectionHeading eyebrow="Nasıl çalışır?" title="Arama sürecini tersine çeviriyoruz." />
          <p className="section-copy">Klasik ilan sitelerinde saatlerce aramak yerine, ihtiyacını doğru kişilere ulaştırırsın.</p>
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