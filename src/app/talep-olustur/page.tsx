import { Footer } from "../../components/navigation/Footer";
import { Navbar } from "../../components/navigation/Navbar";
import { Container } from "../../components/layout/Container";
import { RequestWizard } from "../../components/request/RequestWizard";

export default function CreateRequestPage() {
  return (
    <div className="request-page">
      <Navbar />
      <main>
        <section className="request-page-hero">
          <Container>
            <span className="eyebrow" style={{ color: "var(--lime)" }}>Yeni bir talep</span>
            <h1>İhtiyacını anlat,<br />seçenekler sana gelsin.</h1>
            <p>Birkaç kısa adımda talebini oluştur. İlgilenen satıcılar seni bulsun.</p>
          </Container>
        </section>
        <Container><RequestWizard /></Container>
      </main>
      <Footer />
    </div>
  );
}