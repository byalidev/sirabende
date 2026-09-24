import { Container } from "../../components/layout/Container";
import { RequestWizard } from "../../components/request/RequestWizard";

export default function CreateRequestPage() {
  return (
    <div className="request-page">
      <main>
        <section className="request-page-hero">
          <Container>
            <span className="eyebrow" style={{ color: "var(--lime)" }}>Talep oluştur</span>
            <h1>İhtiyacını net yaz,<br />uygun teklifler sana gelsin.</h1>
            <p>
              Kategori, bölge, bütçe ve teslimat tercihlerini belirle. Talebin oluştuğunda
              ilgili kullanıcılar seni doğrudan görüp teklif verebilir.
            </p>
          </Container>
        </section>
        <Container><RequestWizard /></Container>
      </main>
    </div>
  );
}