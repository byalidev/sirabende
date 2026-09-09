import { Container } from "../layout/Container";
import { SectionHeading } from "../ui/SectionHeading";

const categories = [
  { icon: "✦", name: "Elektronik", description: "Günlük teknoloji ve elektronik ihtiyaçları", count: "124 talep" },
  { icon: "▣", name: "Telefon", description: "Yeni veya yenilenmiş telefon arayanlar", count: "86 talep" },
  { icon: "⌘", name: "Bilgisayar", description: "İş, oyun ve üretim için bilgisayarlar", count: "72 talep" },
  { icon: "◈", name: "Oyun Konsolu", description: "Konsol, oyun ve aksesuar talepleri", count: "48 talep" },
  { icon: "◇", name: "Otomobil", description: "İhtiyacına uygun aracı bul", count: "39 talep" },
  { icon: "○", name: "Ev & Yaşam", description: "Yaşam alanın için aradığın her şey", count: "61 talep" },
];

export function Categories() {
  return (
    <section className="section-pad" id="categories">
      <Container>
        <div className="section-heading-row">
          <SectionHeading eyebrow="Kategoriler" title="Aradığın şey hangi dünyada?" copy="İhtiyacını doğru kategoriye bırak, doğru tekliflere daha hızlı ulaş." />
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <article className="category-card" key={category.name}>
              <div className="category-card-top">
                <span className="category-icon" aria-hidden="true">{category.icon}</span>
                <span className="category-count">{category.count}</span>
              </div>
              <h3 className="mt-6">{category.name}</h3>
              <p>{category.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}