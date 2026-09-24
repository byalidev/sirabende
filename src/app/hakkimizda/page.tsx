import { InfoPage } from "../../components/content/InfoPage";

export default function AboutPage() {
  return <InfoPage eyebrow="My Turn hakkında" title="İhtiyaçları doğru insanlarla buluşturuyoruz." intro="My Turn, bir ürün ya da hizmet arayan kişilerle yardımcı olabilecek satıcıları aynı yerde buluşturan bir talep platformudur." image sections={[{ title: "Neye inanıyoruz?", text: "İyi bir alışverişin, ne aradığını açıkça anlatmakla başladığına inanıyoruz. Platformu bu fikri sade, anlaşılır ve güvenli bir deneyime dönüştürmek için tasarlıyoruz." }, { title: "Alıcılar için", text: "İhtiyacını birkaç adımda oluşturabilir, farklı teklifleri karşılaştırabilir ve kararını kendi önceliklerine göre verebilirsin.", bullets: ["İhtiyacını özgürce anlat", "Gelen teklifleri tek yerde gör", "Kararını acele etmeden ver"] }, { title: "Satıcılar için", text: "Sunduğun ürün veya hizmetle gerçekten ilgilenen taleplere ulaşabilir, uygun gördüğün taleplere teklif gönderebilirsin." }]} />;
}
