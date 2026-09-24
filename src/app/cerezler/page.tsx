import { InfoPage } from "../../components/content/InfoPage";

export default function CookiesPage() {
  return <InfoPage eyebrow="Yasal bilgilendirme" title="Çerezleri deneyimi iyileştirmek için kullanırız." intro=" Çerezleri deneyimi iyileştirmek için kullanırız.My Turn, site deneyimini geliştirmek ve temel işlevlerin düzgün çalışmasını sağlamak için çerezlerden yararlanır.." sections={[{ title: "Çerez nedir?", text: "Çerezler, web sitesinin tarayıcında küçük bilgiler saklamasına yardımcı olan metin dosyalarıdır. Oturumun korunması ve tercihlerin hatırlanması gibi amaçlarla kullanılabilir." }, { title: "Zorunlu çerezler", text: "Giriş oturumu, güvenlik ve temel site işlevlerinin çalışması için gerekli teknik çerezler kullanılabilir." }, { title: "Tercihlerin", text: "Tarayıcı ayarlarından çerezleri yönetebilirsin. Bazı çerezleri kapatmak, sitenin bazı işlevlerinin beklenenden farklı çalışmasına neden olabilir." }]} />;
}
