import { InfoPage } from "../../components/content/InfoPage";

export default function PrivacyPage() {
  return <InfoPage eyebrow="Yasal bilgilendirme" title="Gizliliğini korumaya önem veriyoruz." intro="Bu sayfa taslak bilgilendirme metnidir. Yayına almadan önce gerçek şirket bilgileri, veri sorumlusu iletişim adresi ve yürürlükteki mevzuata göre hukuk danışmanlığı ile güncellenmelidir." sections={[{ title: "Toplanan bilgiler", text: "Hesap oluşturma, talep yayınlama ve iletişim özelliklerini sunmak için gerekli bilgileri toplarız. Hangi bilginin neden istendiği ilgili formlarda açıklanmalıdır." }, { title: "Kullanım amacı", text: "Bilgiler; hesabını yönetmek, talepleri ve teklifleri eşleştirmek, güvenliği sağlamak ve hizmeti geliştirmek amacıyla kullanılabilir." }, { title: "Hakların", text: "Kişisel verilerinle ilgili erişim, düzeltme, silme ve diğer yasal hakların için belirlenen iletişim kanallarını kullanabilirsin." }]} />;
}
