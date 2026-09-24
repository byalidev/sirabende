import { InfoPage } from "../../components/content/InfoPage";

export default function DisclaimerPage() {
  return <InfoPage
    eyebrow="Yasal bilgilendirme"
    title="Sorumluluk Reddi Beyanı"
    intro="Bu Sorumluluk Reddi Beyanı, My Turn platformunun kullanımına ilişkin tarafların hak ve sorumluluklarını açıklamak amacıyla hazırlanmıştır. Platform Sahibi/İşletmecisi: Ali Emir Cettel · Platform: My Turn · Web Sitesi: myturntr.com · Son Güncelleme: 22 Eylül 2026"
    sections={[
      {
        title: "1. My Turn'ün Rolü",
        text: "My Turn, kullanıcıların ihtiyaç duydukları ürün veya hizmetlere ilişkin talepler oluşturmasını ve diğer kullanıcıların bu taleplere teklif sunmasını sağlayan bir aracı platformdur. My Turn, kullanıcılar tarafından oluşturulan taleplerin veya verilen tekliflerin doğrudan satıcısı, alıcısı ya da tarafı değildir. Platform üzerinden gerçekleşen kullanıcılar arası iletişim, anlaşma, ürün/hizmet temini, ödeme, teslimat ve benzeri işlemler kullanıcıların kendi sorumluluğundadır. My Turn, kullanıcılar arasındaki işlemlerde taraf veya garantör değildir.",
      },
      {
        title: "2. Kullanıcı İçerikleri ve Bilgileri",
        text: "Kullanıcıların platforma eklediği aşağıdaki bilgi ve içerikler ilgili kullanıcıların sorumluluğundadır. My Turn, kullanıcılar tarafından sağlanan bilgilerin her durumda doğru, eksiksiz, güncel veya gerçeğe uygun olduğunu garanti etmez. Kullanıcılar platforma ekledikleri içeriklerin hukuka uygun olmasından ve üçüncü kişilerin haklarını ihlal etmemesinden kendileri sorumludur.",
        bullets: [
          "Ürün bilgileri, ürün açıklamaları ve fiyat bilgileri",
          "Fotoğraflar",
          "Talepler ve teklifler",
          "Kullanıcı profili bilgileri",
          "Mesajlar ve diğer kullanıcı tarafından oluşturulan içerikler",
        ],
      },
      {
        title: "3. Kullanıcılar Arasındaki İşlemler",
        text: "My Turn, kullanıcılar arasında gerçekleşen ürün veya hizmet alışverişlerinin tarafı değildir. My Turn üzerinden şu anda kullanıcılar adına veya kullanıcılar arasında herhangi bir ödeme tahsilatı yapılmamaktadır. Kullanıcıların My Turn aracılığıyla birbirleriyle iletişim kurması, My Turn'ün gerçekleştirilen işlemi onayladığı veya garanti ettiği anlamına gelmez.",
        bullets: [
          "Fiyat anlaşmaları ve ödeme işlemleri",
          "Ürün teslimleri, kargo ve elden teslim işlemleri",
          "Ürünlerin gerçekliği, durumu ve sahipliği",
          "Ürün veya hizmetin vaat edilen şekilde sunulması",
        ],
      },
      {
        title: "4. Yasadışı ve Yasaklı İçerikler",
        text: "My Turn üzerinde yürürlükteki mevzuata aykırı ürün, hizmet veya faaliyetlerin paylaşılması, aranması, teklif edilmesi veya satışının gerçekleştirilmesi kesinlikle yasaktır. My Turn, bu tür içerikleri tespit ettiğinde ilgili içeriği kaldırma, talebi veya teklifi sonlandırma, kullanıcı hesabını kısıtlama veya kapatma ve gerekli durumlarda ilgili mercilere bildirimde bulunma hakkını saklı tutar.",
        bullets: [
          "Yasadışı ürün ve hizmetler, kaçak ve çalıntı ürünler",
          "Sahte veya taklit ürünler",
          "Yasal olarak satışı veya devri yasaklanan ürünler",
          "Dolandırıcılık amacı taşıyan ilan ve teklifler",
          "Başkalarının kişisel bilgilerini kötüye kullanan içerikler",
          "Tehdit, şantaj veya benzeri hukuka aykırı faaliyetler",
        ],
      },
      {
        title: "5. İçerik Denetimi ve Mesajlar",
        text: "My Turn üzerinde güvenli ve hukuka uygun bir platform oluşturulması amacıyla kullanıcıların oluşturduğu içerikler ve platform içerisindeki kullanıcı iletişimleri denetlenebilir. Kullanıcılar, My Turn'u kullanarak platform içerisinde gerçekleştirdikleri mesajlaşmaların ve diğer içeriklerin platform kuralları ile yürürlükteki mevzuata uygun olması gerektiğini kabul eder. Yapılan denetimler kapsamında kurallara veya yürürlükteki mevzuata aykırı olduğu değerlendirilen içerikler kaldırılabilir ve ilgili kullanıcıya platform kurallarına uygun şekilde yaptırım uygulanabilir.",
      },
      {
        title: "6. Kullanıcı Hesapları ve Yaptırımlar",
        text: "My Turn, platform kurallarını veya yürürlükteki mevzuatı ihlal eden kullanıcılar hakkında gerekli gördüğü işlemleri uygulama hakkına sahiptir. Uygulanacak yaptırım, ihlalin niteliğine ve platform kurallarına göre belirlenebilir.",
        bullets: [
          "İçeriğin kaldırılması ve uyarı verilmesi",
          "Geçici kısıtlama",
          "Teklif veya talep oluşturma yetkisinin sınırlandırılması",
          "Mesajlaşma özelliklerinin sınırlandırılması",
          "Hesabın geçici olarak askıya alınması",
          "Hesabın kalıcı olarak kapatılması",
        ],
      },
      {
        title: "7. Ürün ve Hizmetlerin Güvenilirliği",
        text: "My Turn, kullanıcılar tarafından sunulan ürün veya hizmetlerin gerçek, orijinal, açıklamalara uygun, belirtilen fiyat veya koşullarda sunulacak ve yasal olarak satılabilir olduğunu ya da kullanıcının ürünü satma hakkına sahip olduğunu garanti etmez. Kullanıcılar, herhangi bir işlem gerçekleştirmeden önce karşı tarafı, ürünü, hizmeti ve işlem koşullarını kendileri değerlendirmelidir.",
      },
      {
        title: "8. Ödeme ve Teslimat",
        text: "My Turn, mevcut sistem kapsamında kullanıcılar arasındaki ödeme ve teslimat işlemlerinin tarafı değildir. Ödeme yöntemi, teslimat yöntemi, ürünün teslim edilmesi ve işlem sonrasında ortaya çıkabilecek uyuşmazlıklar ilgili kullanıcıların kendi sorumluluğundadır. My Turn'ün platform içerisinde kullanıcıların birbirleriyle iletişim kurmasına veya teklif oluşturmasına imkan sağlaması, yapılan işlemin güvence altına alındığı anlamına gelmez.",
      },
      {
        title: "9. Teknik Kesintiler",
        text: "My Turn'ün sürekli, kesintisiz veya hatasız şekilde çalışacağı garanti edilmez. Sunucu arızaları, bakım çalışmaları, teknik problemler, internet bağlantısı sorunları, üçüncü taraf hizmet sağlayıcılarında meydana gelen kesintiler veya My Turn'ün makul kontrolü dışında gerçekleşen teknik nedenlerden dolayı hizmetlerde geçici kesintiler meydana gelebilir.",
      },
      {
        title: "10. Kullanıcıların Yasal Sorumluluğu",
        text: "Her kullanıcı, My Turn platformunu kullanırken yürürlükteki Türkiye Cumhuriyeti mevzuatına ve platformun kullanım kurallarına uymakla yükümlüdür. Kullanıcının gerçekleştirdiği hukuka aykırı faaliyetlerden, oluşturduğu içeriklerden ve diğer kullanıcılara verdiği zararlardan doğabilecek hukuki ve cezai sorumluluk ilgili kullanıcıya aittir. My Turn'ün bir içeriğin platformda bulunmasına izin vermesi, söz konusu içeriğin hukuka uygun olduğunu veya My Turn tarafından onaylandığını göstermez.",
      },
      {
        title: "11. Yaş Sınırı",
        text: "My Turn platformu 16 yaş ve üzerindeki kullanıcıların kullanımına açıktır. 16 yaşından küçük kişilerin platformu kullanması yasaktır. 16 yaşını doldurmuş kullanıcılar, platformu kullanırken yürürlükteki mevzuata ve My Turn kullanım koşullarına uygun hareket etmekle yükümlüdür.",
      },
      {
        title: "12. Sorumluluğun Sınırlandırılması",
        text: "My Turn, yürürlükteki mevzuatın izin verdiği ölçüde, kullanıcıların birbirleriyle gerçekleştirdiği işlemlerden, kullanıcı içeriklerinden, ürün veya hizmetlerin niteliğinden, kullanıcıların beyanlarından, ödeme veya teslimat işlemlerinden ve kullanıcılar arasındaki uyuşmazlıklardan doğan zararlardan sorumlu değildir. Bu hüküm, yürürlükteki mevzuat kapsamında önceden sınırlandırılması mümkün olmayan yasal sorumlulukları ortadan kaldırmayı amaçlamaz.",
      },
      {
        title: "13. Beyanın Güncellenmesi",
        text: "My Turn, bu Sorumluluk Reddi Beyanı'nı platformun işleyişindeki değişikliklere, yeni özelliklere veya yürürlükteki mevzuattaki değişikliklere bağlı olarak güncelleyebilir. Güncel metin My Turn platformu üzerinden yayımlandığı tarihten itibaren geçerli olur.",
      },
      {
        title: "14. İletişim",
        text: "Sorumluluk Reddi Beyanı veya My Turn platformu hakkında iletişim kurmak için: Platform: My Turn · Web: myturntr.com · İşletmeci: Ali Emir Cettel",
      },
    ]}
  />;
}
