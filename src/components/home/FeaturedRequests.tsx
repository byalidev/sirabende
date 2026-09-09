import { Container } from "../layout/Container";
import { Button } from "../ui/Button";
import { SectionHeading } from "../ui/SectionHeading";
import { RequestCard } from "./RequestCard";

const requests = [
  { title: "PS5 Slim", location: "İzmir", budget: "20.000 TL", condition: "Temiz / Kullanılmış", offers: 3, description: "Kutusu ve garantisi olan, temiz bir PS5 Slim arıyorum." },
  { title: "iPhone 15 Pro", location: "İstanbul", budget: "35.000 TL", condition: "Sıfır veya temiz", offers: 5, description: "Pil sağlığı iyi, tercihen doğal titanyum renkli bir cihaz arıyorum." },
  { title: "Gaming Laptop", location: "Ankara", budget: "30.000 TL", condition: "RTX ekran kartı", offers: 2, description: "Oyun ve tasarım için RTX ekran kartlı, taşınabilir bir laptop." },
];

export function FeaturedRequests() {
  return (
    <section className="section-pad requests-section" id="requests">
      <Container>
        <div className="section-heading-row">
          <SectionHeading eyebrow="Şehrinden talepler" title="İnsanlar ne arıyor, bir göz at." copy="Bunlar gerçek bir ihtiyacın ilanı değil; doğru satıcıyı bekleyen örnek alıcı talepleri." />
          <Button href="#categories" variant="quiet">Tüm talepleri gör <span aria-hidden="true">↗</span></Button>
        </div>
        <div className="request-grid">
          {requests.map((request) => <RequestCard key={request.title} {...request} />)}
        </div>
      </Container>
    </section>
  );
}