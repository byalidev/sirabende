import Link from "next/link";
import Image from "next/image";

type InfoSection = {
  title: string;
  text: string;
  bullets?: string[];
};

type InfoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: InfoSection[];
  image?: boolean;
  action?: { label: string; href: string };
};

export function InfoPage({ eyebrow, title, intro, sections, image = false, action }: InfoPageProps) {
  return (
    <main className="info-page">
      <section className="info-hero">
        <div className="container-shell info-hero-grid">
          <div className="info-hero-copy">
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{intro}</p>
            <div className="info-hero-meta" aria-label="Özellikler">
              <span>Hızlı anlaşma</span>
              <span>Güvenli iletişim</span>
              <span>Net eşleşme</span>
            </div>
            {action ? <Link className="button-primary" href={action.href}>{action.label} <span aria-hidden="true">↗</span></Link> : null}
          </div>
          {image ? <div className="info-visual"><div className="info-visual-glow" /><Image src="/Gemini_Generated_Image_vf0xohvf0xohvf0x.png" alt="My Turn marka görseli" width={900} height={600} /></div> : null}
        </div>
      </section>
      <section className="container-shell info-content">
        <div className="info-section-grid">
          {sections.map((section, index) => (
            <article className={`info-card ${index === 0 ? "featured" : ""}`} key={section.title}>
              <span className="info-card-number">{String(index + 1).padStart(2, "0")}</span>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
              {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
