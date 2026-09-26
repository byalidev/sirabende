import { Container } from "../layout/Container";
import { SectionHeading } from "../ui/SectionHeading";

const points = [
  { number: "01", title: "İhtiyaç odaklı başlar.", copy: "Aradığın şeyi değil, hangi problemi çözeceğini anlatırsın; platform bunu doğru kişilere iletir." },
  { number: "02", title: "Hızla karşılaştırılır.", copy: "Fiyat, teslimat ve koşullar tek ekranda görünür; karar vermek çok daha kolay olur." },
  { number: "03", title: "Sana en uygun olan seçilir.", copy: "Bütçene, konumuna ve beklediğin kaliteye göre en doğru teklifler ön plana çıkar." },
];

export function TrustSection() {
  return (
    <section className="section-pad trust-section">
      <Container>
        <div className="trust-grid">
          <SectionHeading eyebrow="Neden My Turn?" title="Daha az arama. Daha çok uygun seçenek." copy="İlanlar yerine ihtiyacın merkezde olur; doğru teklifler sana gelir." />
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