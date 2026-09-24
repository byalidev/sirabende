import { InfoPage } from "../../components/content/InfoPage";

export default function HowItWorksPage() {
  return <InfoPage eyebrow="Nasıl çalışır?" title="Aramak yerine ihtiyacını anlat." intro="My Turn’de süreç üç sade adımda ilerler. Sen ihtiyacını paylaşırsın, uygun kişiler sana ulaşır, seçenekleri karşılaştırırsın." action={{ label: "Talep oluşturmaya başla", href: "/talep-olustur" }} sections={[{ title: "Talebini oluştur", text: "Kategori, konum, bütçe ve ürün durumu gibi temel bilgileri ekleyerek ihtiyacını anlaşılır biçimde anlat." }, { title: "Teklifleri incele", text: "İlgilenen satıcıların gönderdiği teklifleri, açıklamaları ve profilleri tek ekranda karşılaştır." }, { title: "Sana uygun seçeneği seç", text: "İletişime geçmek istediğin teklifi seç. Karar tamamen senin; platform sana seçenekleri düzenli bir şekilde sunar." }]} />;
}
