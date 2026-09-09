import { Container } from "../../../components/layout/Container";
import Link from "next/link";

export default function RequestNotFound() {
  return (
    <main className="request-not-found">
      <Container>
        <span className="eyebrow">404 · Talep bulunamadı</span>
        <h1>Bu talep artık burada değil.</h1>
        <p>Bağlantıyı kontrol et veya güncel taleplere geri dön.</p>
        <Link className="button-primary" href="/talepler">Taleplere dön ↗</Link>
      </Container>
    </main>
  );
}
