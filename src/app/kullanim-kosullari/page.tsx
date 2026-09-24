import { InfoPage } from "../../components/content/InfoPage";

export default function TermsPage() {
  return <InfoPage eyebrow="Yasal bilgilendirme" title="Platformu açık ve adil kullanalım." intro="Bu sayfa düzenlenebilir bir kullanım koşulları taslağıdır. Yayına almadan önce şirket bilgileri, hizmet kapsamı, sorumluluklar ve yürürlükteki mevzuatla birlikte hukuk danışmanlığı tarafından gözden geçirilmelidir." sections={[{ title: "Kullanıcı sorumluluğu", text: "Kullanıcılar hesap bilgilerinin doğruluğundan, paylaştıkları içeriklerden ve platformu yasalara uygun kullanmaktan sorumludur." }, { title: "Teklifler ve anlaşmalar", text: "My Turn teklifler için bir buluşma alanı sunar. Taraflar arasındaki ürün, hizmet, ödeme ve teslimat anlaşmaları ayrıca değerlendirilmelidir." }, { title: "Uygunsuz kullanım", text: "Yanıltıcı içerik, spam, taciz, dolandırıcılık veya başkalarının haklarını ihlal eden kullanım platform kurallarına aykırıdır." }]} />;
}
