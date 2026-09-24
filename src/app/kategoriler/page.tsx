import { InfoPage } from "../../components/content/InfoPage";

export default function CategoriesPage() {
  return <InfoPage eyebrow="Keşfet" title="Aradığın ihtiyaca yakın bir kategori seç." intro="Elektronikten ev yaşamına, ulaşım ve hizmetlerden kişisel ihtiyaçlara kadar farklı alanlarda talepleri keşfet." action={{ label: "Aktif talepleri gör", href: "/talepler" }} sections={[{ title: "Elektronik", text: "Telefon, bilgisayar, oyun konsolu ve aksesuar gibi teknoloji ihtiyaçlarını keşfet." }, { title: "Ev ve yaşam", text: "Mobilya, beyaz eşya, dekorasyon ve günlük yaşam ürünleri için talep oluştur veya teklif gönder." }, { title: "Hizmetler", text: "Yerel hizmet ihtiyaçlarını açıkça anlat; sana yardımcı olabilecek kişilere ulaş." }]} />;
}
