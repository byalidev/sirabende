import { Container } from "../layout/Container";
import { SectionHeading } from "../ui/SectionHeading";

const points = [
  { number: "01", title: "Satıcılar seni aramaz. Senin talebine ulaşır.", copy: "İhtiyacın net olduğunda, yalnızca gerçekten yardımcı olabilecek kişiler cevap verir." },
  { number: "02", title: "Fiyatları karşılaştır.", copy: "Tek bir seçeneğe bağlı kalmadan, farklı teklifleri aynı yerde değerlendir." },
  { number: "03", title: "Karar senin olsun.", copy: "Bütçene, koşullarına ve beklentine uyan satıcıyı kendi zamanında seç." },
];

export function TrustSection() {
  return (
    <section className="section-pad trust-section">
      <Container>
        <div className="trust-grid">
          <SectionHeading eyebrow="Neden My Turn?" title="Daha az arama. Daha çok seçenek." copy="My Turn, alışverişi satıcının vitrininden değil, senin ihtiyacından başlatır." />
          <div className="trust-points">
            {points.map((point) => (
              <article className="trust-point" key={point.number}>
                <span className="trust-point-number">{point.number}</span>
                <div>
                  <h3>{point.title}</h3>
                  <p>{point.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}