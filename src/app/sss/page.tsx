import { InfoPage } from "../../components/content/InfoPage";

export default function FaqPage() {
  return <InfoPage eyebrow="Sık sorulanlar" title="Merak edilenler için kısa cevaplar." intro="Aşağıdaki bilgiler başlangıç rehberidir. Ürün ve kullanım koşulları geliştikçe bu sayfayı güncelleyebilirsin." sections={[{ title: "My Turn ücretli mi?", text: "Güncel ücretlendirme ve olası hizmet bedelleri, ilgili akışta ve kullanım koşullarında açıkça belirtilir." }, { title: "Kimler teklif gönderebilir?", text: "Platform kurallarına uyan, gerçek ve uygun bir çözüm sunabileceğini düşünen kullanıcılar ilgili taleplere teklif gönderebilir." }, { title: "Teklif geldiğinde ne olur?", text: "Teklifleri panelinden inceler, uygun gördüklerinle mesajlaşır ve kararını kendi değerlendirmenle verirsin." }]} />;
}
