import { InfoPage } from "../../components/content/InfoPage";

export default function KvkkPage() {
  return <InfoPage
    eyebrow="Yasal bilgilendirme"
    title="KVKK Aydınlatma Metni"
    intro="My Turn olarak kişisel verilerinizi 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında nasıl işlediğimizi aşağıda açıklıyoruz."
    sections={[
      {
        title: "1. Veri Sorumlusu",
        text: "İşbu KVKK Aydınlatma Metni, My Turn internet sitesi ve buna bağlı hizmetlerin işletilmesi kapsamında kişisel verilerin işlenmesine ilişkin olarak hazırlanmıştır. 6698 sayılı Kanun kapsamında veri sorumlusu My Turn'dur (unvan, adres, e-posta, telefon ve web sitesi bilgileri en kısa sürede bu alana eklenecektir). My Turn, kullanıcılarının kişisel verilerini Kanun, ilgili mevzuat ve Kişisel Verileri Koruma Kurulu kararları doğrultusunda işlemeyi ve gerekli teknik/idari güvenlik tedbirlerini almayı amaçlamaktadır.",
      },
      {
        title: "2. İşlenen Kişisel Veriler",
        text: "My Turn'ın kullanım şekline ve sunulan özelliklere bağlı olarak aşağıdaki kişisel veri kategorileri işlenebilmektedir: kimlik, iletişim, hesap/işlem, işlem güvenliği ve kullanıcı tarafından oluşturulan içerik bilgileri.",
        bullets: [
          "Kimlik: Ad, soyad, kullanıcı adı/takma ad, hesap bilgileri",
          "İletişim: E-posta adresi, telefon numarası, kullanıcının paylaştığı diğer iletişim bilgileri",
          "Hesap ve işlem: Giriş bilgileri, hesap durumu, kullanıcı rolü, e-posta doğrulama bilgileri, talep/teklif/favori/mesaj/bildirim/değerlendirme/şikâyet/engelleme kayıtları",
          "İşlem güvenliği: IP adresi, oturum bilgileri, cihaz/tarayıcı bilgileri, tarih-saat bilgileri, güvenlik logları",
          "Kullanıcı içerikleri: Talep başlığı/açıklaması, ürün-kategori-fiyat bilgisi, teklif, mesaj, değerlendirme, profil ve yüklenen görseller",
        ],
      },
      {
        title: "3. Kişisel Verilerin İşlenme Amaçları",
        text: "Kişisel verileriniz aşağıdaki amaçlarla işlenebilir:",
        bullets: [
          "Kullanıcı hesabının oluşturulması ve yönetilmesi",
          "Kimlik doğrulama ve hesap güvenliğinin sağlanması",
          "E-posta doğrulama işlemlerinin gerçekleştirilmesi",
          "Talep oluşturma, yayınlama ve yönetme hizmetlerinin sunulması",
          "Kullanıcıların taleplere teklif gönderebilmesinin sağlanması",
          "Talep sahipleri ile teklif verenlerin platform üzerinden iletişimi",
          "Mesajlaşma ve bildirim hizmetlerinin yürütülmesi",
          "Favori, engelleme ve benzeri özelliklerin çalıştırılması",
          "Değerlendirme ve şikâyetlerin yönetilmesi",
          "Kötüye kullanım, spam, dolandırıcılık ve sahte hesaplara karşı korunma",
          "Kullanıcı ve platform güvenliğinin sağlanması",
          "Kullanım şartlarının ve platform kurallarının uygulanması",
          "Yetkili kamu kurum ve kuruluşlarının taleplerinin yerine getirilmesi",
          "Hukuki yükümlülüklerin ve uyuşmazlık süreçlerinin yürütülmesi",
          "Sistem performansı ve bilgi güvenliğinin geliştirilmesi",
          "Platformun ve kullanıcı deneyiminin iyileştirilmesi",
        ],
      },
      {
        title: "4. Hukuki Sebepler",
        text: "Kişisel verileriniz, işleme faaliyetinin niteliğine göre KVKK'nın 5. maddesinde belirtilen hukuki sebeplerden biri veya birkaçı kapsamında işlenebilir. Kişisel verilerin işlenmesi her durumda açık rızaya dayandırılmak zorunda değildir; hukuki sebep, işleme faaliyetinin niteliğine göre ayrıca değerlendirilir.",
        bullets: [
          "Kanunlarda açıkça öngörülmesi",
          "Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili ve gerekli olması",
          "Veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi için zorunlu olması",
          "Bir hakkın tesisi, kullanılması veya korunması için zorunlu olması",
          "İlgili kişinin kendisi tarafından alenileştirilmiş olması",
          "Veri sorumlusunun meşru menfaati için zorunlu olması",
          "Kanunda öngörülen hallerde açık rızanızın bulunması",
        ],
      },
      {
        title: "5. Özel Nitelikli Kişisel Veriler",
        text: "My Turn, hizmetin normal şekilde kullanılabilmesi için özel nitelikli kişisel verilerin toplanmasını amaçlamamaktadır. Kullanıcıların aşağıdaki türden bilgileri talep, mesaj, profil veya diğer alanlarda gereksiz şekilde paylaşmaması gerekir; bu veriler KVKK kapsamında daha sıkı korumaya tabidir.",
        bullets: [
          "Sağlık bilgileri",
          "Dini veya felsefi inançlar",
          "Siyasi düşünceler",
          "Sendika/dernek/vakıf üyelikleri",
          "Ceza mahkûmiyeti ve güvenlik tedbirleri bilgileri",
          "Biyometrik veya genetik veriler",
        ],
      },
      {
        title: "6. Toplanma Yöntemi",
        text: "Kişisel verileriniz aşağıdaki kanallar aracılığıyla elektronik ortamda toplanabilir:",
        bullets: [
          "My Turn internet sitesi ve üyelik/kayıt formları",
          "Giriş ve doğrulama işlemleri",
          "Profil ve hesap ayarları",
          "Talep ve teklif formları",
          "Mesajlaşma ve bildirim sistemi",
          "Şikâyet ve raporlama mekanizmaları",
          "Teknik sistemler, log kayıtları ve çerezler",
          "Hukuken yetkili kurum ve kuruluşlardan gelen bildirimler",
        ],
      },
      {
        title: "7. Aktarılma",
        text: "Kişisel verileriniz, işleme amacıyla sınırlı olmak üzere ve gerekli güvenlik tedbirleri alınarak aşağıdaki taraflara aktarılabilir. Kullanıcının platformda herkese açık şekilde yayınladığı bilgiler, ilgili özelliğin niteliğine göre diğer kullanıcılar tarafından görülebilir.",
        bullets: [
          "Teknik altyapı ve barındırma hizmeti sağlayıcıları",
          "E-posta ve iletişim hizmeti sağlayıcıları",
          "Bilgi teknolojileri ve güvenlik hizmeti sağlayıcıları",
          "Hukuk, mali müşavirlik veya danışmanlık hizmeti alınan kişi/kuruluşlar",
          "Yetkili kamu kurum ve kuruluşları",
        ],
      },
      {
        title: "8. Kullanıcı İçeriklerinin Görünürlüğü",
        text: "My Turn üzerinde oluşturulan talepler, teklifler, kullanıcı adı, değerlendirmeler veya herkese açık paylaşılan bilgiler, platformun ilgili özelliklerine göre diğer kullanıcılar tarafından görülebilir. Kullanıcılar herkese açık alanlara telefon numarası, adres, kimlik numarası, banka bilgileri veya başkalarına ait kişisel veri yazmamalıdır.",
      },
      {
        title: "9. Saklama Süresi",
        text: "Kişisel verileriniz; işleme amacının gerektirdiği süre, ilgili mevzuatta öngörülen süreler, zamanaşımı süreleri ve hukuki yükümlülükler boyunca saklanabilir. Saklama süresinin sona ermesi halinde veriler mevzuata uygun şekilde silinir, yok edilir veya anonim hale getirilir.",
      },
      {
        title: "10. Veri Güvenliği",
        text: "My Turn, kişisel verilerin hukuka aykırı işlenmesini ve erişilmesini önlemek amacıyla uygun teknik ve idari tedbirleri almaya çalışır. Bununla birlikte internet üzerinden gerçekleştirilen hiçbir veri aktarımının tamamen risksiz olduğu garanti edilemez.",
        bullets: [
          "Erişim kontrolleri ve yetkilendirme",
          "Oturum ve şifre güvenliği",
          "Veri tabanı güvenliği ve loglama",
          "Yetkisiz erişimlerin önlenmesine yönelik teknik kontroller",
        ],
      },
      {
        title: "11. İlgili Kişinin Hakları",
        text: "KVKK'nın 11. maddesi kapsamında ilgili kişiler aşağıdaki haklara sahiptir:",
        bullets: [
          "Kişisel verilerinin işlenip işlenmediğini öğrenme",
          "İşlenmişse buna ilişkin bilgi talep etme",
          "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
          "Yurt içinde/dışında aktarıldığı üçüncü kişileri bilme",
          "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
          "Kanunda öngörülen şartlarda silinmesini veya yok edilmesini isteme",
          "Düzeltme/silme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme",
          "Otomatik sistemlerle analiz sonucu aleyhine bir sonucun ortaya çıkmasına itiraz etme",
          "Kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme",
        ],
      },
      {
        title: "12. Başvuru Yöntemi",
        text: "KVKK kapsamındaki taleplerinizi, bu sayfada yayınlanacak olan başvuru e-postası ve adres bilgileri üzerinden veya KVKK kapsamında kabul edilen diğer başvuru yöntemleriyle iletebilirsiniz. Başvurular, ilgili mevzuatta öngörülen usul ve süreler kapsamında değerlendirilir.",
      },
      {
        title: "13. Güncellemeler",
        text: "My Turn; mevzuat, teknik altyapı, sunulan hizmetler veya kişisel veri işleme faaliyetlerinde meydana gelebilecek değişiklikler nedeniyle bu Aydınlatma Metni'ni güncelleyebilir. Güncel metin, My Turn internet sitesinde yayınlandığı tarihten itibaren geçerli olur.",
      },
    ]}
  />;
}
