import { InfoPage } from "../../components/content/InfoPage";

export default function UserAgreementPage() {
  return <InfoPage
    eyebrow="Yasal bilgilendirme"
    title="Kullanıcı Sözleşmesi"
    intro="My Turn hizmetlerini kullanırken geçerli olan kurallar ve karşılıklı yükümlülükler aşağıda özetlenmiştir."
    sections={[
      {
        title: "1. Taraflar",
        text: "İşbu Kullanıcı Sözleşmesi, My Turn internet sitesi ve ilgili dijital hizmetlerini kullanan gerçek veya tüzel kişi (Kullanıcı) ile My Turn arasında, Kullanıcının My Turn hizmetlerinden yararlanmasına ilişkin şartları düzenlemek amacıyla oluşturulmuştur. My Turn, aksi açıkça belirtilmediği sürece kullanıcıların birbirleriyle gerçekleştirdiği ürün veya hizmet işlemlerinin doğrudan tarafı değildir.",
      },
      {
        title: "2. Tanımlar",
        text: "My Turn: Kullanıcıların ihtiyaç duydukları ürün veya hizmetleri talep olarak yayınlayabildiği ve diğer kullanıcıların bu taleplere teklif sunabildiği dijital platform. Talep: Kullanıcının edinmek istediği ürün/hizmete ilişkin oluşturduğu ilan niteliğindeki içerik. Teklif: Bir kullanıcının başka bir kullanıcının talebine karşı sunduğu fiyat, ürün, hizmet veya teslimat önerisi. Hesap: Kullanıcının My Turn üzerindeki üyelik hesabı. İçerik: Kullanıcıların platforma yüklediği veya oluşturduğu metin, görsel, fiyat, açıklama, yorum ve mesajlar.",
      },
      {
        title: "3. Sözleşmenin Kabulü",
        text: "Kullanıcı, My Turn'a kayıt olarak veya platformu kullanarak işbu Sözleşmeyi okuduğunu, anladığını ve belirtilen kurallara uygun hareket edeceğini kabul eder. Sözleşmeyi kabul etmeyen kullanıcının My Turn hizmetlerini kullanmaması gerekir. KVKK Aydınlatma Metni, işbu Sözleşmeden ayrı olarak sunulur.",
      },
      {
        title: "4. Üyelik",
        text: "Kullanıcı hesabı oluşturulması gereken durumlarda Kullanıcı doğru, güncel ve eksiksiz bilgi vermekle yükümlüdür. Kullanıcı, hesap bilgilerinin başkaları tarafından kullanılmasına izin vermemek ve hesap güvenliğini sağlamakla yükümlüdür. Hesap üzerinden gerçekleştirilen işlemlerden, mevzuatın izin verdiği ölçüde hesap sahibi sorumludur. Kullanıcı, yetkisiz bir işlem veya güvenlik ihlali fark etmesi halinde My Turn'a bildirimde bulunmalıdır.",
      },
      {
        title: "5. E-posta Doğrulaması",
        text: "My Turn, hesap güvenliğinin sağlanması amacıyla kullanıcıdan e-posta adresini doğrulamasını isteyebilir. E-posta doğrulaması tamamlanmamış hesapların bazı özelliklere erişimi sınırlandırılabilir. My Turn, doğrulama kodlarının kullanım süresi, deneme sayısı ve yeniden gönderim sıklığına ilişkin teknik sınırlar uygulayabilir.",
      },
      {
        title: "6. My Turn'ın Platformdaki Rolü",
        text: "My Turn, kullanıcıların taleplerini yayınlamasına ve diğer kullanıcıların bu taleplere teklif göndermesine olanak sağlayan bir dijital platformdur. Talep sahibi ile teklif veren arasındaki işlemin şartları taraflar arasında belirlenir; My Turn kullanıcılar arasındaki işlemlerin her durumda gerçekleşeceğini veya teklif edilen ürün/hizmetlerin gerçekliğini garanti etmez. Bununla birlikte My Turn, güvenliği sağlamak ve platform kurallarını uygulamak amacıyla gerekli gördüğü teknik ve idari kontrolleri uygulayabilir.",
      },
      {
        title: "7. Talepler",
        text: "Talep sahibi; talebin doğru kategoride oluşturulmasından, ürün veya hizmet açıklamasının gerçeğe uygun olmasından, bütçe/fiyat bilgisinin mümkün olduğunca doğru verilmesinden, talep içeriğinde hukuka aykırı veya yasaklı bir ürün/hizmet bulunmamasından ve üçüncü kişilerin kişisel verilerinin izinsiz paylaşılmamasından sorumludur. Yanıltıcı, sahte, spam niteliğinde veya platform kurallarını ihlal eden talepler kaldırılabilir.",
      },
      {
        title: "8. Teklifler",
        text: "Teklif veren kullanıcı; sunduğu ürün veya hizmet hakkında doğru bilgi vermek, fiyat konusunda yanıltıcı bilgi vermemek, sahip olmadığı ürünleri varmış gibi göstermemek, teslimat/hizmet koşullarını açıkça belirtmek ve hukuka aykırı ürün veya hizmet teklif etmemek zorundadır. Teklif gönderilmesi tek başına satış sözleşmesinin My Turn ile kurulduğu anlamına gelmez.",
      },
      {
        title: "9. Kullanıcılar Arasındaki İşlemler",
        text: "Talep sahibi ile teklif veren arasında gerçekleşen satış, hizmet, ödeme, teslimat, garanti, iade, ayıp veya bedel uyuşmazlığı gibi konularda tarafların tabi oldukları mevzuattan doğan hak ve yükümlülükler saklıdır. Kullanıcılar, işlem gerçekleştirmeden önce karşı tarafın bilgilerini ve sunduğu ürün/hizmeti dikkatlice değerlendirmelidir. My Turn'ın taraf olmadığı durumlarda uyuşmazlıkların taraflar arasında çözülmesi esastır.",
      },
      {
        title: "10. Yasaklı Kullanımlar",
        text: "My Turn aşağıdaki amaçlarla kullanılamaz:",
        bullets: [
          "Dolandırıcılık yapmak veya sahte ürün/hizmet sunmak",
          "Sahte hesap oluşturmak veya başka bir kişinin kimliğini kullanmak",
          "Başka kişilere ait kişisel verileri izinsiz paylaşmak",
          "Spam içerik, sahte talep, teklif, değerlendirme veya yorum oluşturmak",
          "Platformu yasa dışı faaliyetler veya hukuken yasaklanmış ürünler için kullanmak",
          "Tehdit veya şantaj amacıyla platformu kullanmak",
          "Güvenlik sistemlerini aşmaya çalışmak veya yetkisiz erişim sağlamak",
          "Platformun teknik altyapısına zarar vermeye çalışmak veya aşırı yük göndermek",
          "Kullanıcıları platform dışına hileli şekilde yönlendirmek",
          "My Turn'ın marka, yazılım, tasarım veya içeriklerini izinsiz kullanmak",
        ],
      },
      {
        title: "11. Kişisel Verilerin Paylaşılması",
        text: "Kullanıcılar platform üzerinde kendilerine veya üçüncü kişilere ait T.C. kimlik numarası, banka/kredi kartı bilgileri, şifre, açık adres, özel nitelikli kişisel veriler veya başka kişilere ait kişisel bilgileri gereksiz şekilde paylaşmamalıdır. Kişisel verilerin işlenmesine ilişkin detaylar My Turn KVKK Aydınlatma Metni'nde açıklanmaktadır.",
      },
      {
        title: "12. Mesajlaşma Sistemi",
        text: "My Turn üzerindeki mesajlaşma özelliği yalnızca platformun kullanım amaçları doğrultusunda kullanılmalıdır; spam, tehdit, hakaret, şantaj, dolandırıcılık veya yasaklı ürün/hizmet teklifleri amacıyla kullanılamaz. Güvenlik, kötüye kullanımın önlenmesi ve şikâyetlerin incelenmesi amacıyla mevzuatın izin verdiği ölçüde mesaj ve işlem kayıtları incelenebilir.",
      },
      {
        title: "13. Değerlendirme ve Yorumlar",
        text: "Kullanıcılar gerçekleştirdikleri deneyimlere ilişkin değerlendirme veya yorum oluşturabilir. Değerlendirmeler gerçek deneyime dayanmalı, yanıltıcı olmamalı, hakaret veya tehdit içermemeli ve kişisel verileri gereksiz şekilde içermemelidir. Sahte veya manipülatif değerlendirmeler kaldırılabilir.",
      },
      {
        title: "14. Şikâyet ve Raporlama",
        text: "Kullanıcılar, platform kurallarını ihlal ettiğini düşündükleri içerikleri veya kullanıcıları My Turn'a bildirebilir. İnceleme sonucunda içeriğin kaldırılması, kullanıcıya uyarı verilmesi, özelliklerin sınırlandırılması veya hesabın geçici/kalıcı olarak kapatılması gibi işlemler uygulanabilir. Uygulanacak işlem, ihlalin niteliği ve tekrarlanması dikkate alınarak belirlenir.",
      },
      {
        title: "15. Hesabın Askıya Alınması veya Kapatılması",
        text: "My Turn; sözleşmenin ihlali, hukuka aykırı kullanım, sahtecilik, dolandırıcılık şüphesi, kullanıcı güvenliğinin tehlikeye atılması, spam veya güvenlik tehdidi gibi durumlarda hesabı geçici olarak sınırlandırabilir veya kapatabilir. Acil güvenlik durumlarında önceden bildirim yapılmaksızın teknik önlem alınabilir. Hesabın kapatılması, mevcut hukuki yükümlülüklerin ortadan kalktığı anlamına gelmez.",
      },
      {
        title: "16. İçeriklerin Kullanımı",
        text: "Kullanıcı tarafından My Turn'a yüklenen içeriklerin fikri mülkiyet hakları kural olarak kullanıcıya aittir. Kullanıcı, içeriği paylaşmaya yetkili olduğunu ve içeriğin üçüncü kişilerin haklarını ihlal etmediğini kabul eder. Kullanıcı, yüklediği içeriklerin hizmetin sunulabilmesi amacıyla teknik olarak barındırılmasına ve platformda görüntülenmesine izin verir; bu izin içeriğin mülkiyetinin My Turn'a geçtiği anlamına gelmez.",
      },
      {
        title: "17. Fikri Mülkiyet Hakları",
        text: "My Turn markası, logo, tasarım, yazılım, arayüz, metinler ve platforma ilişkin diğer unsurlar üzerindeki fikri ve sınai mülkiyet hakları, aksi belirtilmedikçe My Turn veya ilgili hak sahiplerine aittir. Bu unsurlar izinsiz kopyalanamaz, çoğaltılamaz, dağıtılamaz veya ticari amaçla kullanılamaz.",
      },
      {
        title: "18. Ücretli Hizmetler",
        text: "My Turn ilerleyen dönemlerde öne çıkarma, sabitleme, acil talep, işletme hesabı özellikleri veya diğer ücretli dijital hizmetler sunabilir. Ücretli hizmetlerin sunulması halinde hizmetin kapsamı, fiyatı, ödeme koşulları ve varsa ilgili tüketici hakları hizmet satın alma aşamasında ayrıca gösterilir.",
      },
      {
        title: "19. Vergi ve Ticari Yükümlülükler",
        text: "Kullanıcıların kendi gerçekleştirdikleri ticari faaliyetlerden doğan vergi, fatura, tüketici mevzuatı, mesafeli satış, garanti ve iade gibi yasal yükümlülükleri ilgili mevzuat çerçevesinde kendilerine ait olabilir. My Turn'ın kullanıcıların yerine getirmesi gereken yasal yükümlülükleri ortadan kaldırdığı şeklinde yorum yapılamaz.",
      },
      {
        title: "20. Tüketici Hakları",
        text: "My Turn üzerinde gerçekleştirilen işlemin niteliğine göre 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve ilgili mevzuat uygulanabilir. İşleme taraf olan satıcı/sağlayıcı ve tüketicinin ilgili mevzuattan doğan hak ve yükümlülükleri saklıdır. My Turn'ın işlemdeki hukuki rolü, sunulan hizmetin niteliğine göre ayrıca değerlendirilir.",
      },
      {
        title: "21. Güvenlik ve Teknik Kesintiler",
        text: "My Turn hizmetlerin sürekli ve kesintisiz çalışması için makul çabayı gösterir. Bakım, güncelleme, sunucu problemleri, siber saldırılar, teknik arızalar veya mücbir sebepler nedeniyle hizmetlerde geçici kesintiler meydana gelebilir. My Turn, güvenliği veya teknik altyapıyı korumak amacıyla gerekli gördüğü zamanlarda hizmetleri geçici olarak sınırlandırabilir.",
      },
      {
        title: "22. Yapay Zekâ ve Otomatik Sistemler",
        text: "My Turn'da kullanıcıların taleplerini daha kolay bulmasına, sınıflandırmasına veya aramasına yardımcı olmak amacıyla yapay zekâ veya otomatik sistemlerden yararlanılabilir. Bu sistemler tarafından oluşturulan sonuçlar her zaman kesin veya hatasız olmayabilir. Kullanıcılar önemli ticari kararlarını yalnızca otomatik sistemlerin sonuçlarına dayanarak vermemelidir.",
      },
      {
        title: "23. Hesap Silme",
        text: "Kullanıcı, hesabının silinmesini talep edebilir. Hesabın silinmesi halinde teknik olarak hesabın kullanımına son verilebilir. Ancak kanuni yükümlülükler, uyuşmazlıklar veya mevzuat kapsamında saklanması gereken bilgiler bakımından gerekli kayıtlar öngörülen süre boyunca tutulabilir.",
      },
      {
        title: "24. Sözleşme Değişiklikleri",
        text: "My Turn, hizmetlerin geliştirilmesi, yeni özelliklerin eklenmesi, mevzuat değişiklikleri veya teknik gereklilikler nedeniyle işbu Sözleşmede değişiklik yapabilir. Güncel Sözleşme, My Turn internet sitesinde yayınlandığı tarihten itibaren geçerli olur. Önemli değişikliklerde kullanıcılara uygun bildirim yöntemleri kullanılabilir.",
      },
      {
        title: "25. Mücbir Sebep",
        text: "Tarafların kontrolü dışında gerçekleşen doğal afetler, savaş, salgın, geniş çaplı internet veya altyapı kesintileri, siber saldırılar, kamu otoritelerinin kararları veya mevzuat değişiklikleri gibi durumlar mücbir sebep olarak değerlendirilebilir.",
      },
      {
        title: "26. Uygulanacak Hukuk",
        text: "İşbu Sözleşmenin uygulanmasında Türkiye Cumhuriyeti hukuku esas alınır. Tüketici işlemleri bakımından tüketicinin emredici mevzuattan doğan hakları saklıdır; uyuşmazlıklarda ilgili mevzuat uyarınca görevli ve yetkili mercilere başvurulabilir.",
      },
      {
        title: "27. İletişim",
        text: "My Turn ile iletişim kurmak için bu sayfada yayınlanacak olan e-posta, adres ve telefon bilgileri kullanılabilir.",
      },
      {
        title: "28. Yürürlük",
        text: "Kullanıcı, My Turn'a üye olarak veya platformu kullanarak işbu Sözleşmenin hükümlerini kabul etmiş olur. Sözleşmenin yürürlük tarihi, güncel sürümün yayınlandığı tarih olarak belirlenmiştir.",
      },
    ]}
  />;
}
