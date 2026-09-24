import { InfoPage } from "../../components/content/InfoPage";

export default function ContactPage() {
  return <InfoPage eyebrow="İletişim" title="Sorunu veya önerini bize ilet." intro="My Turn hakkında sorularınız, önerileriniz, geri bildirimleriniz veya yaşadığınız sorunlar için bizimle iletişime geçebilirsiniz.

Mesajınızı mümkün olduğunca açık ve detaylı şekilde iletmeniz, size daha hızlı yardımcı olmamızı sağlar.

E-posta: iletisim@wwwmyturn.com

Talebinizi hazırlayın, bize gönderin. En kısa sürede sizinle iletişime geçeceğiz." image sections={[{ title: "Destek talepleri", text: "Hesap, talep, teklif veya bildirimlerle ilgili yaşadığın durumu mümkün olduğunca açık anlat." }, { title: "İş birlikleri", text: "Platform hakkında iş birliği, içerik veya satıcı önerilerin varsa konu başlığıyla birlikte iletebilirsin." }, { title: "Kullanıcı geri bildirimleri", text: "My Turn’ü daha iyi hale getiren en değerli kaynak kullanıcı deneyimleri. Önerilerini bizimle paylaş." }]} />;
}
