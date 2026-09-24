import { InfoPage } from "../../components/content/InfoPage";

export default function ContactConsentPage() {
  return <InfoPage
    eyebrow="Yasal bilgilendirme"
    title="İletişim ve Bildirim İzni"
    intro="My Turn hesabınızla ve platform hizmetleriyle ilgili bilgilendirmeleri hangi kanallardan alacağınızı aşağıda bulabilirsiniz."
    sections={[
      {
        title: "1. E-posta Bildirimleri",
        text: "Onay vermeniz halinde My Turn; yeni teklif ve mesaj bildirimleri, talep/teklif durumları, hesap ve güvenlik bildirimleri, platformdaki önemli değişiklikler ve kullanıcı hesabınızla ilgili diğer bilgilendirmeler hakkında e-posta gönderebilir.",
      },
      {
        title: "2. Push Bildirimleri",
        text: "Push bildirimi, My Turn'ın tarayıcınız veya desteklenen uygulama/cihaz üzerinden cihazınıza gönderebildiği anlık bildirimdir (örneğin yeni teklif, yeni mesaj veya teklif kabul bildirimleri). Push bildirimlerini cihazınızın veya tarayıcınızın bildirim ayarlarından istediğiniz zaman kapatabilirsiniz.",
      },
      {
        title: "3. Telefon Araması",
        text: "My Turn tarafından telefon araması yoluyla ticari veya pazarlama amaçlı iletişim yapılmayacaktır.",
      },
      {
        title: "4. Ticari Elektronik İletiler",
        text: "My Turn'ın kampanya, tanıtım, reklam veya benzeri ticari içerikli elektronik ileti göndermesi için gerekli olduğu durumlarda ilgili mevzuata uygun şekilde ayrıca izin alınır. Bu izin, üyelik oluşturulması veya My Turn'ın temel hizmetlerinin kullanılması için zorunlu değildir.",
      },
      {
        title: "5. İzinlerin Geri Alınması",
        text: "Kullanıcı, vermiş olduğu iletişim izinlerini ilgili hesap ayarlarından veya My Turn tarafından sunulan diğer uygun yöntemlerden değiştirebilir veya geri alabilir. İznin geri alınması, daha önce hukuka uygun şekilde gerçekleştirilmiş iletişimlerin hukuka uygunluğunu etkilemez. Hesap güvenliği, hizmetin sunulması veya yasal yükümlülükler için gerekli zorunlu bildirimler, ticari iletişim izninden bağımsız olarak gönderilebilir.",
      },
    ]}
  />;
}
