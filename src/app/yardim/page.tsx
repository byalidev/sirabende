import { InfoPage } from "../../components/content/InfoPage";

export default function HelpPage() {
  return <InfoPage eyebrow="Destek" title="Takıldığın yerde yanındayız." intro="Hesabın, taleplerin, teklifler veya mesajlarınla ilgili soruların için aşağıdaki başlangıç bilgilerini kullanabilirsin." action={{ label: "Bize ulaş", href: "/iletisim" }} sections={[{ title: "Talep oluşturma", text: "Talep oluştur sayfasında ihtiyacını, konumunu ve bütçe aralığını ne kadar açık yazarsan uygun teklifler alma ihtimalin o kadar artar." }, { title: "Teklif ve mesajlar", text: "Gelen teklifleri panelinden inceleyebilir, iletişim kurmak istediğin teklif üzerinden mesajlaşabilirsin." }, { title: "Hesap güvenliği", text: "Şifreni kimseyle paylaşma. Şüpheli bir durum görürsen hesabından çıkış yapıp destek ekibine bildir." }]} />;
}
