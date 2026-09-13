# LinguaCard'ı App Store'a Yayınlama Rehberi

**Bu rehber, daha önce hiç uygulama yayınlamamış biri için yazıldı.**
Hiçbir ön bilgi varsaymıyor. Terimleri ilk geçtikleri yerde açıklıyor.

Kodun tarafı bitti. Kalan iş **hesap açmak, ayar yapmak ve test etmek**.
Bunların çoğu kod yazmayı değil, web sitelerinde form doldurmayı gerektiriyor.

**Gerçekçi süre:** İlk kez yapıyorsan 2–4 gün (bekleme süreleri dahil).
Apple'ın incelemesi ayrıca 1–3 gün sürer.

---

## İçindekiler

| Bölüm | Konu | Tahmini süre |
|---|---|---|
| [0](#0-önce-kavramlar) | Önce kavramlar — bu kelimeler ne demek? | 15 dk okuma |
| [1](#1-yol-haritası) | Yol haritası (hangi iş hangi sırayla) | 5 dk |
| [2](#2-ön-koşullar) | Ön koşullar: neye sahip olman gerekiyor | 1 saat |
| [3](#3-projeyi-kendi-bilgisayarında-çalıştır) | Projeyi kendi bilgisayarında çalıştır | 30 dk |
| [4](#4-apple-developer-hesabı-aç) | Apple Developer hesabı aç | 30 dk + onay beklemesi |
| [5](#5-app-store-connectte-uygulamayı-oluştur) | App Store Connect'te uygulamayı oluştur | 20 dk |
| [6](#6-abonelik-ürününü-oluştur) | Abonelik ürününü oluştur | 30 dk |
| [7](#7-revenuecat-kurulumu) | RevenueCat kurulumu | 45 dk |
| [8](#8-admob-kurulumu) | AdMob kurulumu | 30 dk |
| [9](#9-hukuki-sayfaları-yayınla) | Gizlilik Politikası + Kullanım Koşulları | 1 saat |
| [10](#10-env-dosyasını-doldur) | `.env` dosyasını doldur | 15 dk |
| [11](#11-ilk-gerçek-buildi-al) | İlk gerçek build'i al | 1 saat |
| [12](#12-testflightte-test-et) | TestFlight'ta test et | 2 saat |
| [13](#13-mağaza-bilgilerini-doldur) | Mağaza bilgilerini doldur | 2 saat |
| [14](#14-incelemeye-gönder) | İncelemeye gönder | 15 dk |
| [15](#15-reddedilirsen) | Reddedilirsen ne yapmalı | — |
| [16](#16-benden-karar-bekleyenler) | Benden karar bekleyen 6 soru | 10 dk |
| [17](#17-sorun-giderme) | Sorun giderme | — |
| [18](#18-komut-sözlüğü) | Komut sözlüğü | — |

---

## 0. Önce Kavramlar

Bu bölümü atlamadan oku. Rehberin geri kalanı bu kelimeleri kullanacak.

### Uygulama nasıl çalışıyor?

**React Native** — Normalde iPhone uygulaması Swift diliyle yazılır. React Native,
uygulamayı **JavaScript/TypeScript** ile yazmanı sağlayan bir teknoloji. Yazdığın
kod, gerçek iPhone arayüz bileşenlerine dönüşür. Yani bu bir "web sitesi
uygulama kılığında" değil — gerçek bir iPhone uygulaması.

**Expo** — React Native'i kullanılabilir hale getiren araç seti. Kamera, ses,
veritabanı gibi şeyleri tek tek kurmak yerine Expo bunları hazır getirir. Ayrıca
uygulamayı **derlemek** (build) için bulut servisi sunar, böylece karmaşık Xcode
ayarlarıyla uğraşmazsın.

> Bizim projede Expo **SDK 55** kullanılıyor. "SDK sürümü" Expo'nun versiyonu.

**TypeScript** — JavaScript'in hata yakalayan versiyonu. `npm run typecheck`
komutu bu hataları kontrol eder.

### Derleme (build) ile ilgili kavramlar

**Build (derleme)** — Yazdığın kodun, iPhone'a kurulabilir bir dosyaya
dönüştürülmesi işlemi. Sonuçta `.ipa` uzantılı bir dosya çıkar.

**Native klasörler (`ios/` ve `android/`)** — Expo, senin ayarlarından yola
çıkarak bu klasörleri **otomatik üretir**. İçinde Xcode projesi vardır.

> ⚠️ **Bu projede en kritik kural:** `ios/` klasörünü **elle düzenleme**.
> Git'te saklanmıyor ve her `npm run prebuild` komutunda sıfırdan üretiliyor.
> Elle yaptığın değişiklik sessizce kaybolur. Native ayar değiştirmek için
> `app.config.ts` dosyasını düzenle, sonra `npm run prebuild` çalıştır.

**prebuild** — `app.config.ts` dosyasındaki ayarları okuyup `ios/` klasörünü
yeniden üreten komut.

**EAS (Expo Application Services)** — Expo'nun bulut servisi. Kodunu yükler,
kendi sunucularında derler, sana `.ipa` dosyasını verir. Kendi Mac'inde
derlemek de mümkün ama EAS çok daha kolay.

> EAS'ın ücretsiz bir katmanı var; build sırası beklemeli olabilir (yoğunlukta
> 10–60 dk). Ücretli plan sırayı atlatır. Başlangıçta ücretsiz yeterli.

### Apple tarafı

**Apple Developer Program** — App Store'da uygulama yayınlamak için gereken
üyelik. **Yıllık ~$99** (Türkiye'de TL karşılığı tahsil edilir). Bu ücreti
ödemeden yayınlayamazsın.

**App Store Connect** — Apple'ın yönetim paneli: `appstoreconnect.apple.com`.
Uygulamanı burada oluşturur, açıklamasını yazar, ekran görüntülerini yükler,
incelemeye gönderirsin.

**Bundle ID** — Uygulamanın dünya çapında benzersiz kimliği. Bizimki:
**`com.linguacard.app`**. Bir kez belirlenir, sonra **asla değiştirilemez**.

**Sertifika ve Provisioning Profile** — Uygulamanın gerçekten sana ait olduğunu
kanıtlayan dijital imzalar. Kulağa korkutucu geliyor ama **EAS bunları senin
için otomatik oluşturuyor**; sadece "evet oluştur" demen yeterli.

**TestFlight** — Apple'ın test platformu. Uygulamayı mağazaya koymadan önce
kendi iPhone'una kurup deneyebilirsin. **Satın alma ve reklam testleri için
şart** — bunlar simülatörde çalışmaz.

**App Review (İnceleme)** — Apple'da bir insan uygulamanı elle test eder.
Beğenmezse reddeder ve sebebini yazar. Reddedilmek normaldir, düzeltip
tekrar gönderirsin.

**Guideline (Kural)** — Apple'ın kural kitabı. "Guideline 3.1.2" gibi numaralarla
anılır. Kodda bu kurallara göre düzeltmeler yapıldı.

### Para kazanma tarafı

**IAP (In-App Purchase / Uygulama İçi Satın Alma)** — Dijital bir şey satıyorsan
(bizim durumda premium abonelik) **Apple'ın sistemini kullanmak zorundasın**.
Apple komisyon alır. Kredi kartı sayfası açmak veya Stripe kullanmak yasaktır.

**Abonelik (Auto-Renewable Subscription)** — Aylık otomatik yenilenen satın alma.
Bizim premium üyeliğimiz bu tipte.

**RevenueCat** — Apple'ın abonelik sistemini kullanmayı kolaylaştıran servis.
"Bu kullanıcı premium mi?" sorusunu senin yerine cevaplar. Küçük gelirlerde
**ücretsiz**.

**Entitlement (Yetki)** — RevenueCat'te "premium olmak ne demek" tanımı.
Bizim kodumuz **`premium`** adında bir entitlement bekliyor. Bu ismi birebir
aynı yazmalısın, yoksa satın alma çalışmaz.

**AdMob** — Google'ın reklam servisi. Bizim uygulamada **ödüllü video reklam**
var: kullanıcı reklam izler, 3 kelime hakkı kazanır.

**Sandbox** — Apple'ın test ortamı. Sahte para ile gerçek satın alma akışını
test edersin. Gerçek ücret alınmaz.

### Bizim projeye özel

**`.env` dosyası** — Gizli/değişken ayarların tutulduğu dosya. RevenueCat ve
AdMob anahtarların buraya yazılır. Git'e gönderilmez.

**`assertReleaseConfig()`** — Kodda bir güvenlik ağı. `.env` eksikse yayın
build'inin **çökmesini sağlar**. Bu bilinçli: yarım ayarlarla mağazaya
gönderip reddedilmeni engellemek için.

---

## 1. Yol Haritası

İşler birbirine bağlı. Bu sırayı takip et, yoksa tıkanırsın:

```
[2] Ön koşullar (Mac, Xcode, hesaplar)
         |
[3] Projeyi kendi bilgisayarında çalıştır  ← ilk başarı anı
         |
[4] Apple Developer hesabı  ($99, onay 24-48 saat sürebilir)
         |
         +---------------------------+
         |                           |
[5] App Store Connect'te       [8] AdMob kurulumu
    uygulamayı oluştur              (bağımsız, paralel yapılabilir)
         |
[6] Abonelik ürününü oluştur
         |
[7] RevenueCat kurulumu  (5 ve 6 bitmeden yapılamaz)
         |
[9] Hukuki sayfaları yayınla  (bağımsız, erken başlayabilirsin)
         |
[10] .env dosyasını doldur   (7, 8, 9 bitmeden tamamlanamaz)
         |
[11] İlk gerçek build
         |
[12] TestFlight'ta test et   ← burada hata bulursan geri dönersin
         |
[13] Mağaza bilgilerini doldur
         |
[14] İncelemeye gönder
```

> **İpucu:** [4] Apple hesabı onayı beklerken [8] AdMob ve [9] hukuki sayfalar
> ile ilerleyebilirsin. Bunlar Apple'dan bağımsız.

---

## 2. Ön Koşullar

### 2.1 Donanım ve yazılım

| Gereksinim | Durum | Not |
|---|---|---|
| **Mac bilgisayar** | ✅ Sende var | iPhone uygulaması derlemek için zorunlu |
| **Xcode** | ✅ Kurulu (26.3) | App Store'dan ücretsiz |
| **Node.js** | ✅ Kurulu (v25.8.1) | Aşağıdaki nota bak |
| **Gerçek bir iPhone** | Gerekli | Satın alma ve reklam testi için şart |
| **Apple Developer üyeliği** | ❌ Bölüm 4'te alacaksın | ~$99/yıl |

> ⚠️ **Node.js sürüm notu:** Sende v25 var. Bu bir "tek numaralı" sürüm, yani
> deneysel. Expo resmi olarak **LTS** (çift numaralı: 20, 22, 24) sürümleri
> destekler. Şu an her şey çalışıyor, ama ileride tuhaf bir hata alırsan ilk
> şüphelenilecek şey budur. Sorun yaşarsan Bölüm 17'ye bak.

### 2.2 Açman gereken hesaplar

Hepsi ücretsiz (Apple hariç):

| Hesap | Adres | Ne için |
|---|---|---|
| **Apple ID** | Muhtemelen zaten var | Developer üyeliğinin temeli |
| **Expo hesabı** | `expo.dev` | Bulutta build almak için |
| **RevenueCat** | `revenuecat.com` | Abonelik yönetimi |
| **Google/AdMob** | `admob.google.com` | Reklamlar |

Şimdi Expo hesabını açıp giriş yap:

```bash
cd /Users/uguryesilbas/Desktop/UgurYesilbas/Projects/LinguaCard
npx eas-cli login
```

E-posta ve şifre soracak. Hesabın yoksa önce `expo.dev` adresinden kaydol.

Giriş yaptığını doğrula:

```bash
npx eas-cli whoami
```

Kullanıcı adını yazdırırsa tamam.

---

## 3. Projeyi Kendi Bilgisayarında Çalıştır

Hesaplarla uğraşmadan önce uygulamayı bir gör. Bu, her şeyin yerinde olduğunu
kanıtlar ve sana moral verir.

### 3.1 Her şey sağlam mı?

```bash
cd /Users/uguryesilbas/Desktop/UgurYesilbas/Projects/LinguaCard
npm run verify
```

Bu komut üç şey yapar: tip kontrolü, kod kalitesi kontrolü, testler.
**Beklenen çıktı** (sonunda):

```
Test Suites: 4 passed, 4 total
Tests:       20 passed, 20 total
```

Hata alırsan Bölüm 17'ye bak.

### 3.2 Simülatörde çalıştır

```bash
npm run ios
```

İlk çalıştırmada **10–20 dakika** sürer (her şeyi derliyor). Sonrasında hızlanır.
iPhone simülatörü açılır ve uygulama başlar.

**Ne göreceksin:**
- Mavi zeminde beyaz kart ve "A" harfi (açılış ekranı)
- Ardından kelime kartı ekranı
- Alt tarafta 4 sekme: Kartlar, Öğrendiklerim, Kelimelerim, Ayarlar

**Şimdi dene:**
- Karta dokun → arkaya döner (Türkçe karşılığı)
- Hoparlör ikonuna dokun → kelimeyi seslendirir
- "Öğrendim" → kart desteden çıkar
- Ayarlar → koyu tema, dil değiştirme

**Ne çalışmayacak (normal):**
- "Premium'a Geç" → hata verir (henüz RevenueCat bağlı değil)
- "Reklam İzle" → çalışmaz (henüz AdMob bağlı değil)
- Ayarlar'da "Yasal" kartı **görünmeyecek** (henüz URL girilmedi)

Bunlar Bölüm 10'dan sonra çalışacak.

> Simülatörü kapatmak için terminalde `Ctrl + C`.

---

## 4. Apple Developer Hesabı Aç

### 4.1 Kaydol

1. `developer.apple.com/programs/enroll` adresine git
2. Apple ID'nle giriş yap
3. **Individual (Bireysel)** seç

> **Individual mi Organization mı?** Bireysel çok daha hızlı — sadece kimlik
> doğrulaması ister. Organization (şirket) seçersen **D-U-N-S numarası**
> gerekir ve haftalar sürebilir. Şahıs olarak yayınlayacaksan Individual seç.
>
> ⚠️ Fark: Individual'da App Store'da **kendi adın soyadın** geliştirici adı
> olarak görünür. Şirket adı görünsün istiyorsan Organization gerekir. Bu
> sonradan değiştirilmesi zor bir karardır.

4. Kimlik bilgilerini gir
5. **~$99** yıllık ücreti öde

### 4.2 Onayı bekle

Apple genelde **24–48 saat** içinde onaylar. Bazen birkaç saatte biter.
E-posta ile bildirilir.

> **Bu süreyi boşa harcama:** Bölüm 8 (AdMob) ve Bölüm 9 (hukuki sayfalar)
> Apple'dan bağımsız. Şimdi onlara geç, onay gelince buraya dön.

### 4.3 Sözleşme ve banka bilgileri ⚠️

**Bu adım atlanırsa satın alma hiç çalışmaz — test ortamında bile.**

Onay geldikten sonra `appstoreconnect.apple.com` → **Business** (veya
**Agreements, Tax, and Banking**) bölümüne git:

- [ ] **Paid Applications Agreement**'ı kabul et
- [ ] **Banka hesabı** bilgilerini gir (para buraya yatacak)
- [ ] **Vergi formları**nı doldur (Türkiye için W-8BEN)

Durum **"Active"** olana kadar bekle. Bu birkaç gün sürebilir.

> Apple'ın panel menüleri zaman zaman değişir. "Agreements" veya "Business"
> yazan yeri ara.

---

## 5. App Store Connect'te Uygulamayı Oluştur

### 5.1 Bundle ID'yi kaydet

1. `developer.apple.com/account` → **Certificates, Identifiers & Profiles**
2. **Identifiers** → **+** (artı)
3. **App IDs** → **App** seç
4. Doldur:
   - **Description:** `LinguaCard`
   - **Bundle ID:** **Explicit** seç ve tam olarak şunu yaz:
     ```
     com.linguacard.app
     ```
5. **Capabilities** listesinde **In-App Purchase**'ın işaretli olduğundan emin ol
   (genelde varsayılan açıktır)
6. **Continue** → **Register**

> ⚠️ Bundle ID'yi **birebir** `com.linguacard.app` yaz. Kodda bu değer sabit.
> Farklı yazarsan hiçbir şey eşleşmez.

### 5.2 Uygulamayı oluştur

1. `appstoreconnect.apple.com` → **My Apps** → **+** → **New App**
2. Doldur:
   - **Platforms:** iOS
   - **Name:** `LinguaCard`
     > Bu isim App Store'da görünür ve **dünya çapında benzersiz** olmalı.
     > Alınmışsa `LinguaCard - Kelime Kartları` gibi bir varyant dene.
   - **Primary Language:** Turkish (veya English)
   - **Bundle ID:** Az önce kaydettiğin `com.linguacard.app`
   - **SKU:** `linguacard-001`
     > SKU sadece senin iç takibin için. Kullanıcı görmez. Ne yazdığın önemsiz.
   - **User Access:** Full Access
3. **Create**

Uygulama oluştu. Şimdilik boş; içini Bölüm 13'te dolduracaksın.

---

## 6. Abonelik Ürününü Oluştur

Bu adım, kullanıcının satın alacağı "premium üyelik" ürününü tanımlar.

### 6.1 Abonelik grubu oluştur

1. App Store Connect → LinguaCard → sol menüde **Subscriptions**
2. **Create** (Subscription Group)
3. **Reference Name:** `LinguaCard Premium`
   > Bu isim sadece panelde görünür, kullanıcı görmez.

> **Grup neden gerekli?** Apple, aboneliklerin gruplar halinde olmasını ister
> (ki kullanıcı aylık/yıllık arasında geçiş yapabilsin). Tek ürünün olsa bile
> grup zorunlu.

### 6.2 Aboneliği oluştur

Grubun içinde **Create** (Subscription):

- **Reference Name:** `Premium Aylık`
- **Product ID:** ⚠️ **Çok önemli** — tam olarak şunu yaz:
  ```
  linguacard_monthly_10try
  ```
  > Kod bu ID'yi arıyor (`constants/config.ts` içinde
  > `RC_MONTHLY_PRODUCT_ID_TR`). Harfi harfine aynı olmalı.
  >
  > Kod ayrıca bir yedek mekanizma kullanıyor: bu ID bulunamazsa RevenueCat'in
  > "monthly" paketini kullanır. Yine de doğru yaz.

Sonra:

- **Subscription Duration:** 1 Month
- **Subscription Prices** → **Add Pricing**:
  - Türkiye fiyatını seç (örn. ₺29,99 — Apple'ın hazır fiyat basamaklarından)
  - Apple diğer ülkeler için otomatik karşılık önerir, kabul et

> 💡 Kodda fiyat **sabit değil**. Uygulama fiyatı Apple'dan canlı çekiyor. Yani
> buradan fiyatı değiştirirsen uygulamada otomatik güncellenir, kod
> değiştirmen gerekmez. (Bu, denetimde düzeltilen bir hataydı — eskiden kodda
> `$1` yazıyordu ve her ülkede yanlış görünüyordu.)

### 6.3 Yerelleştirme (zorunlu)

**App Store Localization** → **Turkish** ekle:

- **Display Name:** `Premium Üyelik`
- **Description:**
  ```
  Sınırsız özel kelime ekleyin, reklam izlemeden çalışın.
  Aylık otomatik yenilenen abonelik.
  ```

İngilizce de ekle:

- **Display Name:** `Premium Membership`
- **Description:**
  ```
  Add unlimited custom words with no ads to watch.
  Monthly auto-renewing subscription.
  ```

### 6.4 Ekran görüntüsü ve inceleme notu

Apple, abonelik için bir **inceleme ekran görüntüsü** ister:
- Simülatörde Ayarlar sekmesini aç (premium kartının göründüğü ekran)
- Ekran görüntüsü al (`Cmd + S` simülatörde)
- Buraya yükle

**Review Notes:**
```
Premium abonelik, "Kelimelerim" sekmesinde sınırsız özel kelime
eklemeyi açar. Ücretsiz kullanıcılar ödüllü reklam izleyerek
3'er kelime hakkı kazanabilir.
```

### 6.5 Durumu kontrol et

Ürünün durumu **"Ready to Submit"** olmalı.

> ⚠️ **Kritik:** Abonelik ürünü, uygulamanın **ilk build'iyle birlikte**
> gönderilmeli. Ayrı gönderirsen Apple aboneliği incelemez ve uygulamayı
> "satın alma çalışmıyor" diye reddeder. Bölüm 14'te buna tekrar değineceğiz.

---

## 7. RevenueCat Kurulumu

RevenueCat, Apple'ın karmaşık abonelik sistemini basitleştirir.

> **Bölüm 5 ve 6 bitmeden bu bölüme başlama** — RevenueCat'in Apple'daki
> ürünü görmesi gerekiyor.

### 7.1 Proje oluştur

1. `revenuecat.com` → kaydol
2. **Create new project** → isim: `LinguaCard`
3. **Apps** → **+ New** → **App Store**
4. **App Bundle ID:** `com.linguacard.app`

### 7.2 App Store Connect anahtarını bağla

RevenueCat'in Apple ile konuşabilmesi için iki bilgiye ihtiyacı var.

**a) In-App Purchase Key (.p8 dosyası):**

1. App Store Connect → **Users and Access** → **Integrations** sekmesi
2. **In-App Purchase** → **+** → isim ver (`RevenueCat`) → **Generate**
3. **`.p8` dosyasını indir**
   > ⚠️ Bu dosya **yalnızca bir kez** indirilebilir. Kaybedersen yenisini
   > oluşturman gerekir. Güvenli bir yere kaydet.
4. RevenueCat → uygulamanın ayarları → bu `.p8` dosyasını yükle
   (Key ID ve Issuer ID de istenirse aynı sayfadan kopyala)

**b) App-Specific Shared Secret:**

1. App Store Connect → LinguaCard → **App Information**
2. **App-Specific Shared Secret** → **Manage** → oluştur ve kopyala
3. RevenueCat'e yapıştır

### 7.3 Entitlement oluştur ⚠️

**Bu adımdaki isim yanlış olursa premium hiç açılmaz.**

1. RevenueCat → **Entitlements** → **+ New**
2. **Identifier:** tam olarak
   ```
   premium
   ```
   > Küçük harf, tek kelime. Kod bunu bekliyor
   > (`constants/config.ts` → `RC_ENTITLEMENT_ID = 'premium'`).

### 7.4 Ürünü ekle ve bağla

1. RevenueCat → **Products** → **+ New**
2. **Store:** App Store
3. **Identifier:** `linguacard_monthly_10try` (Apple'dakiyle aynı)
4. Kaydet
5. **Entitlements** → `premium` → **Attach** → bu ürünü seç

### 7.5 Offering oluştur ⚠️

**Bu adım atlanırsa satın alma "paket bulunamadı" hatası verir.**

1. RevenueCat → **Offerings** → **+ New**
2. **Identifier:** `default`
3. **Make current** işaretle (bu, "varsayılan teklif" demek)
4. İçine **Package** ekle:
   - **Identifier:** `$rc_monthly` seç (RevenueCat'in standart aylık paketi)
   - **Product:** `linguacard_monthly_10try`

> **Neden önemli?** Kod şöyle çalışıyor: önce Türkiye ürününü arıyor,
> bulamazsa `offerings.current.monthly` paketine düşüyor. Offering boşsa
> ikisi de bulunamaz ve kullanıcı "Aylık paket bulunamadı" hatası görür.

### 7.6 API anahtarını al

1. RevenueCat → **Project Settings** → **API Keys**
2. **Public SDK key** bölümünden **App Store** anahtarını kopyala
   (`appl_` ile başlar)
3. Bir yere not et — Bölüm 10'da kullanacaksın

> 🔒 **Güvenlik uyarısı:** Sadece **Public SDK key** (`appl_...`) al.
> RevenueCat'in **Secret key**'i (`sk_...` ile başlar) **asla** uygulamaya
> girmemeli. O sunucu tarafı içindir; uygulamaya koyarsan herkes senin
> abonelik verilerini değiştirebilir.

---

## 8. AdMob Kurulumu

> Bu bölüm Apple'dan bağımsız. Developer onayı beklerken yapabilirsin.

### 8.1 Uygulamayı ekle

1. `admob.google.com` → Google hesabınla gir
2. **Apps** → **Add app**
3. **Platform:** iOS
4. "Uygulamanız App Store'da yayınlandı mı?" → **Hayır** (henüz değil)
5. **App name:** `LinguaCard`
6. Oluştur → **App ID**'yi kopyala (`ca-app-pub-XXXXXXXX~XXXXXXXX` formatında)

> 💡 App ID'de **tilde (`~`)** vardır. Ad unit ID'de **eğik çizgi (`/`)**.
> Karıştırma — en sık yapılan hatalardan biri.

### 8.2 Ödüllü reklam birimi oluştur

1. Uygulamanın içinde → **Ad units** → **Add ad unit**
2. **Rewarded** (Ödüllü) seç
3. **Ad unit name:** `LinguaCard Rewarded`
4. Oluştur → **Ad unit ID**'yi kopyala (`ca-app-pub-XXXXXXXX/XXXXXXXX`)

### 8.3 Ödeme bilgileri

AdMob → **Payments** → adres, ödeme yöntemi ve vergi bilgilerini doldur.
Bunlar tamamlanmadan reklam geliri ödenmez.

### 8.4 `app-ads.txt` (gelir için gerekli)

Bu, "bu reklam alanı gerçekten bana ait" diyen bir doğrulama dosyası.

1. AdMob → **Apps** → **app-ads.txt** bölümünden sana verilen satırı kopyala
2. Bölüm 9'da oluşturacağın web sitesinin **kök dizinine** `app-ads.txt`
   adıyla koy (örn. `https://siten.com/app-ads.txt`)
3. Aynı alan adını App Store Connect'teki **Marketing URL** alanına yaz

> Bu olmadan da reklamlar çalışır, ama gelirin ciddi şekilde düşer.

### 8.5 GDPR mesajı (Avrupa kullanıcıları için)

AdMob → **Privacy & messaging** → **GDPR** → mesaj oluştur.

> Bu, Avrupa'daki kullanıcılara gösterilecek onay ekranı. **Şu an kodda
> entegre değil** — Bölüm 16'daki 2. soruya bak. Türkiye odaklı başlayacaksan
> acil değil.

---

## 9. Hukuki Sayfaları Yayınla

Apple iki şeyi zorunlu kılıyor:
- **Gizlilik Politikası** — reklam gösterdiğin için (Guideline 5.1.1)
- **Kullanım Koşulları** — abonelik sattığın için (Guideline 3.1.2)

Bunlar hem uygulama içinde hem App Store Connect'te linklenmeli.
Kod hazır; sadece URL bekliyor.

### 9.1 Nerede yayınlarsın?

Ücretsiz seçenekler:
- **GitHub Pages** — repo oluştur, `index.html` koy, Settings → Pages
- **Notion** — sayfa yaz → Share → Publish to web
- **Google Sites** — sürükle bırak, ücretsiz

Tek şart: **kalıcı ve herkese açık** olması. Apple bu linki açıp kontrol eder.

> `app-ads.txt` (Bölüm 8.4) için kök dizine dosya koyabilmen gerekiyorsa
> Notion uygun değil — GitHub Pages veya kendi alan adını kullan.

### 9.2 Gizlilik Politikasında ne yazmalı?

Aşağıdakileri **mutlaka** içermeli. Bu metni başlangıç olarak kullanabilirsin,
ama kendi durumuna göre gözden geçir:

```
GİZLİLİK POLİTİKASI — LinguaCard
Son güncelleme: [TARİH]

TOPLANMAYAN VERİLER
LinguaCard kullanıcı hesabı gerektirmez. Ad, e-posta, telefon
veya konum bilgisi toplamaz.

CİHAZDA SAKLANAN VERİLER
Öğrendiğiniz kelimeler, eklediğiniz özel kelimeler, ilerleme
durumunuz ve tema/dil tercihleriniz yalnızca cihazınızda saklanır.
Bu veriler hiçbir sunucuya gönderilmez. Uygulamayı silerseniz
bu veriler de silinir.

ÜÇÜNCÜ TARAF HİZMETLER

1) Google AdMob (reklam)
Uygulamada ödüllü video reklamlar gösterilir. Google AdMob;
cihaz tanımlayıcısı, IP adresi ve reklam etkileşim verilerini
işleyebilir. Uygulama kişiselleştirilmemiş reklam talep eder ve
reklam kimliğinizi (IDFA) istemez.
Google'ın gizlilik politikası:
https://policies.google.com/privacy

2) RevenueCat (abonelik)
Premium abonelik durumunuzu yönetmek için RevenueCat kullanılır.
Anonim bir kullanıcı kimliği ve satın alma geçmişi işlenir.
https://www.revenuecat.com/privacy

3) Apple (satın alma)
Ödemeler Apple üzerinden yapılır. Kart bilgileriniz uygulamaya
hiçbir zaman ulaşmaz.

ÇOCUKLARIN GİZLİLİĞİ
Uygulama 13 yaş altı çocuklara yönelik değildir.

HAKLARINIZ
Verileriniz cihazınızda olduğu için silmek için uygulamayı
kaldırmanız yeterlidir.

İLETİŞİM
[E-POSTA ADRESİN]
```

> ⚠️ `[TARİH]` ve `[E-POSTA ADRESİN]` kısımlarını doldurmayı unutma.
> Boş köşeli parantez bırakmak reddedilme sebebi olabilir.

### 9.3 Kullanım Koşulları

**En kolay yol:** Apple'ın standart sözleşmesini kullan:
```
https://www.apple.com/legal/internet-services/itunes/dev/stdeula/
```
Bu adresi hem `.env` dosyasına hem App Store Connect'e yazabilirsin.

Kendi metnini yazmak istersen abonelik şartlarını, iptal koşullarını ve
sorumluluk sınırlarını içermeli.

### 9.4 Destek sayfası

Basit bir sayfa yeterli: uygulama adı, kısa açıklama, iletişim e-postası.
Apple'ın **Support URL** alanı için zorunlu.

---

## 10. `.env` Dosyasını Doldur

Artık tüm anahtarların elinde olmalı. Bunları uygulamaya tanıtma zamanı.

### 10.1 Dosyayı oluştur

```bash
cd /Users/uguryesilbas/Desktop/UgurYesilbas/Projects/LinguaCard
cp .env.example .env
```

Sonra `.env` dosyasını bir metin editöründe aç (VS Code veya
`open -e .env` komutu).

### 10.2 Doldur

Her satırın `=` işaretinden sonrasını doldur. **Tırnak işareti kullanma,
boşluk bırakma:**

```bash
# DOĞRU
EXPO_PUBLIC_RC_IOS_KEY=appl_AbCdEfGhIjKlMnOp

# YANLIŞ
EXPO_PUBLIC_RC_IOS_KEY="appl_AbCdEfGhIjKlMnOp"
EXPO_PUBLIC_RC_IOS_KEY = appl_AbCdEfGhIjKlMnOp
```

| Değişken | Nereden geldi | Format |
|---|---|---|
| `EXPO_PUBLIC_RC_IOS_KEY` | Bölüm 7.6 | `appl_...` |
| `EXPO_PUBLIC_RC_ANDROID_KEY` | Android yoksa boş bırak | `goog_...` |
| `EXPO_PUBLIC_ADMOB_IOS_APP_ID` | Bölüm 8.1 | `ca-app-pub-...~...` |
| `EXPO_PUBLIC_ADMOB_ANDROID_APP_ID` | Android yoksa boş bırak | `ca-app-pub-...~...` |
| `EXPO_PUBLIC_ADMOB_IOS_REWARDED_ID` | Bölüm 8.2 | `ca-app-pub-.../...` |
| `EXPO_PUBLIC_ADMOB_ANDROID_REWARDED_ID` | Android yoksa boş bırak | `ca-app-pub-.../...` |
| `EXPO_PUBLIC_PRIVACY_POLICY_URL` | Bölüm 9.2 | `https://...` |
| `EXPO_PUBLIC_TERMS_URL` | Bölüm 9.3 | `https://...` |
| `EXPO_PUBLIC_SUPPORT_URL` | Bölüm 9.4 | `https://...` |

> **Sadece iOS yayınlayacaksan** Android satırlarını boş bırakabilirsin.
> Kontrol mekanizması sadece çalıştığın platformun anahtarına bakar.

> 🔒 `.env` dosyası git'e **gönderilmez** (`.gitignore`'da). Anahtarların
> yanlışlıkla paylaşılmasın diye. Ama bu yüzden EAS'ın da onları ayrıca
> bilmesi gerekiyor — bir sonraki adım bu.

### 10.3 Native ayarları güncelle

AdMob App ID'si `Info.plist` dosyasına işlenmeli:

```bash
npm run prebuild
```

> Bu komut `ios/` klasörünü `app.config.ts` ve `.env` değerlerinden yeniden
> üretir. Uzun sürebilir, normal.

Sonra kontrol et — gerçek AdMob ID'nin işlendiğini doğrula:

```bash
grep -A1 GADApplicationIdentifier ios/LinguaCard/Info.plist
```

Çıktıda **kendi** App ID'ni görmelisin. Hâlâ `3940256099942544` görüyorsan
(bu Google'ın test ID'si) `.env` doğru doldurulmamış demektir.

### 10.4 Kontrol et

```bash
npm run verify
npm run ios
```

Şimdi uygulamada:
- Ayarlar'da **"Yasal"** kartı görünmeli (Gizlilik Politikası / Kullanım
  Koşulları / Destek)
- Linklere dokununca tarayıcı açılmalı

> Satın alma ve reklam simülatörde hâlâ çalışmayacak — bunlar gerçek cihaz
> gerektirir. Bölüm 12'de test edeceksin.

### 10.5 Anahtarları EAS'e de tanıt

EAS bulutta derliyor ve senin `.env` dosyanı göremiyor. Aynı değerleri oraya
da göndermelisin:

```bash
npx eas-cli env:push production --path .env
```

Onay isterse kabul et. Sonra doğrula:

```bash
npx eas-cli env:list production
```

> Bu adım atlanırsa bulut build'i `.env` boş sanır ve
> `assertReleaseConfig()` uygulamayı açılışta çökertir. Kasıtlı bir güvenlik
> ağı — ama sebebini bilmezsen kafa karıştırıcı olur.

---

## 11. İlk Gerçek Build'i Al

### 11.1 EAS projesini bağla

```bash
npx eas-cli init
```

Proje oluşturmayı onayla. Bu, `app.config.ts` dosyasına bir proje kimliği ekler.

### 11.2 Build başlat

```bash
npx eas-cli build --platform ios --profile production
```

**Sana soracakları:**

| Soru | Cevap |
|---|---|
| Apple hesabına giriş | Apple ID ve şifren (iki adımlı doğrulama kodu da ister) |
| "Generate a new Apple Distribution Certificate?" | **Yes** |
| "Generate a new Apple Provisioning Profile?" | **Yes** |

> Bunlar Bölüm 0'da bahsedilen dijital imzalar. EAS hepsini otomatik
> oluşturup saklıyor. Bir daha sormayacak.

Sonra kod yüklenir ve bulutta derlenir. **10–40 dakika** sürer (ücretsiz
katmanda sıra beklemesi olabilir). Terminal bir link verir; oradan canlı
takip edebilirsin.

### 11.3 TestFlight'a gönder

Build bitince:

```bash
npx eas-cli submit --platform ios --latest
```

Bu, `.ipa` dosyasını App Store Connect'e yükler.

> Apple'ın işlemesi **5–30 dakika** sürer. App Store Connect → LinguaCard →
> **TestFlight** sekmesinde belirir.
>
> Bu sırada Apple'dan "ITMS-…" başlıklı bir uyarı e-postası gelebilir. Çoğu
> bilgilendirmedir; build TestFlight'ta görünüyorsa sorun yok.

### 11.4 Kendini test kullanıcısı yap

1. App Store Connect → TestFlight → **Internal Testing**
2. Grup oluştur → kendi Apple ID'ni ekle
3. iPhone'una App Store'dan **TestFlight** uygulamasını indir
4. Aynı Apple ID ile gir → LinguaCard görünecek → **Install**

---

## 12. TestFlight'ta Test Et

**Bu bölüm en önemlisi.** Apple'ın inceleyicisi tam olarak bunları deneyecek.
Burada bulacağın her hata, reddedilmekten kurtulman demek.

### 12.1 Sandbox test hesabı oluştur

Gerçek para harcamadan satın alma testi için:

1. App Store Connect → **Users and Access** → **Sandbox** → **Test Accounts**
2. **+** → yeni bir **e-posta adresi** gir
   > ⚠️ Gerçek Apple ID'n **olmayan** bir e-posta kullan. Var olmayan bir
   > adres de olur (`test1@linguacard-test.com` gibi) — Apple doğrulama
   > e-postası göndermez.
3. Şifre belirle ve not et
4. iPhone'da: **Ayarlar** → **App Store** → en altta **Sandbox Account** →
   bu hesapla giriş yap

### 12.2 Test listesi

Sırayla dene ve işaretle:

**Temel akış**
- [ ] Uygulama açılıyor, çökmüyor
- [ ] Açılışta **"Tebrikler, tüm kelimeleri öğrendiniz"** ekranı
      **görünmüyor** (yükleme dönüyor, sonra kartlar geliyor)
- [ ] Kart dokununca dönüyor
- [ ] Hoparlör ikonu kelimeyi seslendiriyor, animasyon ses bitince duruyor
- [ ] "Öğrendim" çalışıyor, kart desteden çıkıyor
- [ ] "Öğrendiklerim" sekmesinde kelime görünüyor, "Tekrar" geri getiriyor
- [ ] İleri/geri okları çalışıyor

**Satın alma** (en kritik)
- [ ] Ayarlar → "Premium'a Geç" → **gerçek fiyat görünüyor** (₺29,99 gibi,
      `$1` değil)
- [ ] Satın alma ekranı açılıyor, sandbox hesabı soruyor
- [ ] Satın alma tamamlanıyor → premium aktif oluyor
- [ ] **Uygulamayı tamamen kapat (arka plandan da kaydır) ve yeniden aç →
      premium HÂLÂ AKTİF**
      > ⚠️ Bu maddeyi atlama. Eskiden burada bir hata vardı: kullanıcı
      > premium alıyor, uygulamayı kapatıp açınca tekrar ücretsiz görünüyordu.
      > Düzeltildi, ama gerçek RevenueCat bağlantısıyla doğrulanmalı.
      > Apple'ın inceleyicisi tam olarak bunu dener.
- [ ] "Kelimelerim" sekmesinde sınırsız kelime eklenebiliyor
- [ ] Abonelik yazısı görünüyor (otomatik yenileme, iptal bilgisi)
- [ ] "Gizlilik Politikası" ve "Kullanım Koşulları" linkleri açılıyor

**Geri yükleme**
- [ ] Uygulamayı sil, tekrar kur → "Satın Alımları Geri Yükle" → premium dönüyor

**Reklam**
- [ ] Ücretsiz hesapla "Reklam İzle" → reklam açılıyor
- [ ] Sonuna kadar izle → **3 kelime hakkı** geliyor
- [ ] Reklamı **yarıda kapat** → "sonuna kadar izlemelisiniz" mesajı çıkıyor
- [ ] **Uçak modunu aç** → "Reklam İzle" → en geç 20 saniyede
      "reklam yok" mesajı çıkıyor, **sonsuz dönen çark olmuyor**
      > Bu da denetimde düzeltilen bir hataydı.

**Diğer**
- [ ] Koyu tema açılıp kapanıyor, uygulama kapatılıp açılınca hatırlanıyor
- [ ] TR/EN dil değişimi tüm ekranlarda çalışıyor
- [ ] Özel kelime ekle / düzenle / sil çalışıyor
- [ ] Çok uzun bir kelime yazmayı dene → 40 karakterde duruyor, düzen bozulmuyor
- [ ] iPad'de aç → döndür → kart düzeni bozulmuyor
      (iPad desteklemeyeceksen Bölüm 16 soru 3'e bak)

### 12.3 Hata bulursan

Bana hatayı tarif et, düzeltelim. Sonra:

```bash
npm run verify
npx eas-cli build --platform ios --profile production
npx eas-cli submit --platform ios --latest
```

> Build numarası `eas.json` içinde `autoIncrement: true` sayesinde otomatik
> artar; elle değiştirmen gerekmez.

---

## 13. Mağaza Bilgilerini Doldur

App Store Connect → LinguaCard → **iOS App** bölümü.

### 13.1 App Privacy (en çok atlanan adım) ⚠️

Sol menüde **App Privacy** → **Get Started**.

Apple "hangi verileri topluyorsun?" diye soracak. **"Hiçbiri" deme** —
AdMob ve RevenueCat veri topluyor. Yanlış beyan, yayından sonra bile
sorun çıkarır.

**Şunları işaretle:**

| Veri türü | Nerede bulunur | Amaç | Kimliğe bağlı | Takip |
|---|---|---|---|---|
| **Device ID** | Identifiers | Third-Party Advertising | Evet | **Hayır** |
| **Product Interaction** | Usage Data | Advertising, Analytics | Evet | Hayır |
| **Advertising Data** | Usage Data | Third-Party Advertising | Evet | Hayır |
| **Crash Data** | Diagnostics | App Functionality | Hayır | Hayır |
| **Performance Data** | Diagnostics | App Functionality | Hayır | Hayır |
| **Purchase History** | Purchases | App Functionality | Evet | Hayır |

> **"Takip (Tracking)" neden hep Hayır?** Uygulama kişiselleştirilmemiş
> reklam istiyor ve reklam kimliğini (IDFA) hiç talep etmiyor. Bu yüzden
> Apple'ın tanımına göre "tracking" yapmıyorsun ve izin ekranı (ATT)
> göstermen gerekmiyor. Kod bu şekilde ayarlandı.

Ayrıca sorulursa:
- **"Does this app use the Advertising Identifier (IDFA)?"** → **Yes**
  (reklam gösteriyorsun)
- Alt seçenek: **"Serve advertisements within the app"** işaretle
- **"Track users"** → **işaretleme**

### 13.2 Metin bilgileri

- **Subtitle (30 karakter):** `İngilizce Kelime Kartları`
- **Promotional Text (170 karakter):** `100 temel İngilizce kelime, örnek
  cümleler ve seslendirme ile. Kendi kelimelerinizi de ekleyin.`
- **Description:** Aşağıdaki metni kullanabilirsin.

```
LinguaCard ile İngilizce kelime dağarcığınızı kart yöntemiyle
geliştirin.

ÖZELLİKLER
• En sık kullanılan 100 İngilizce kelime
• Her kelime için örnek cümle (İngilizce ve Türkçe)
• Kelimeyi cümle içinde vurgulama
• Seslendirme — doğru telaffuzu dinleyin
• "Öğrendim" işaretleme ve tekrar havuzu
• İlerleme takibi
• Koyu tema
• Türkçe ve İngilizce arayüz

KENDİ KELİMELERİNİZ
Kendi kelime ve cümlelerinizi ekleyin. Ödüllü reklam izleyerek
3 kelime hakkı kazanın veya Premium'a geçerek sınırsız ekleyin.

VERİLERİNİZ SİZDE KALIR
Hesap açmanız gerekmez. Tüm öğrenme verileriniz yalnızca
cihazınızda saklanır, sunucuya gönderilmez.

PREMIUM ABONELİK
LinguaCard Premium aylık abonelik olarak sunulur ve sınırsız
özel kelime ekleme imkânı verir. Abonelik, dönem bitiminden en
az 24 saat önce iptal edilmezse otomatik olarak yenilenir.
Ücret, satın alma onayında Apple Kimliğinize yansıtılır.
Aboneliğinizi iPhone Ayarlar > Apple Kimliği > Abonelikler
bölümünden yönetebilir veya iptal edebilirsiniz.

Gizlilik Politikası: [URL]
Kullanım Koşulları: [URL]
```

> ⚠️ Sondaki abonelik paragrafı **zorunlu** (Guideline 3.1.2). Silme.
> `[URL]` kısımlarını gerçek adreslerinle değiştir.

- **Keywords (100 karakter, virgülle):**
  ```
  ingilizce,kelime,flashcard,kart,öğren,dil,vocabulary,english,telaffuz,sözlük
  ```
  > Boşluk kullanma, virgülle ayır — boşluk karakter hakkını yer.

### 13.3 Ekran görüntüleri

**Zorunlu boyutlar:**

| Cihaz | Gerekli mi |
|---|---|
| 6.9" iPhone (iPhone 16 Pro Max vb.) | ✅ Zorunlu |
| 6.5" iPhone (iPhone 11 Pro Max vb.) | ✅ Zorunlu |
| 13" iPad | ⚠️ `supportsTablet: true` olduğu için **zorunlu** |

> iPad görselleri hazırlamak istemiyorsan Bölüm 16 soru 3'e bak — iPad
> desteğini kapatabilirim, o zaman bu zorunluluk kalkar.

**Nasıl alınır:** Simülatörde ilgili cihazı aç, `Cmd + S` ile kaydet.

```bash
# Simülatör cihaz listesini gör
xcrun simctl list devices available
```

Her boyut için 3–5 görsel öner: kart ekranı, öğrendiklerim, kelimelerim,
ayarlar.

### 13.4 Kategori ve derecelendirme

- **Primary Category:** Education
- **Secondary Category:** Reference
- **Age Rating** anketini doldur:
  - Şiddet, cinsellik, madde vb. → hepsi **None**
  - **"Does your app contain advertising?"** → **Yes**
  - Sonuç muhtemelen **4+** çıkar

### 13.5 İnceleme bilgileri

- **Sign-in required:** **Hayır** (uygulamada hesap yok)
- **Contact Information:** ad, telefon, e-posta
- **Notes:** Şunu yapıştır:

```
Bu uygulama kullanıcı hesabı gerektirmez; demo hesabı yoktur.
Tüm veriler cihazda SQLite ile saklanır, sunucu veya API yoktur.

PREMIUM TEST:
Ayarlar sekmesi > "Premium'a Geç" ile abonelik satın alınabilir.
Premium, "Kelimelerim" sekmesinde sınırsız özel kelime ekler.

ÖDÜLLÜ REKLAM TEST:
"Kelimelerim" sekmesi > "Reklam İzle" ile 3 kelime hakkı kazanılır.

KULLANICI İÇERİĞİ:
Kullanıcının eklediği kelimeler yalnızca kendi cihazında kalır;
paylaşılmaz, sunucuya gönderilmez, başka kullanıcılar göremez.

GİZLİLİK:
Kişiselleştirilmemiş reklam kullanılır; IDFA talep edilmez,
bu nedenle ATT izin ekranı gösterilmez.
```

### 13.6 Diğer alanlar

- **Support URL:** Bölüm 9.4'teki adres (zorunlu)
- **Marketing URL:** `app-ads.txt` koyduğun alan adı
- **Privacy Policy URL:** Bölüm 9.2'deki adres (zorunlu)
- **Copyright:** `2026 [Adın Soyadın]`
- **Content Rights:** 100 kelimenin cümleleri özgün mü, telifli bir kaynaktan
  mı alındı? Doğrula ve buna göre beyan et.

---

## 14. İncelemeye Gönder

### 14.1 Son kontrol

- [ ] TestFlight testlerinin hepsi geçti (Bölüm 12)
- [ ] App Privacy dolduruldu
- [ ] Ekran görüntüleri yüklendi (iPad dahil)
- [ ] Açıklama, anahtar kelimeler, kategori tamam
- [ ] Support ve Privacy Policy URL'leri çalışıyor (linke tıklayıp kontrol et)
- [ ] Paid Applications Agreement **"Active"**
- [ ] Abonelik ürünü **"Ready to Submit"**

### 14.2 Aboneliği build ile birlikte ekle ⚠️

**En kritik adım. Atlanırsa kesin reddedilirsin.**

App Store Connect → uygulama sürümü sayfası → **In-App Purchases and
Subscriptions** bölümünü bul → **`linguacard_monthly_10try` ürününü bu
sürüme ekle**.

> **Neden?** İlk gönderimde abonelik ürünü, uygulama build'iyle **aynı anda**
> incelenmeli. Ayrı gönderirsen Apple aboneliği görmez, uygulamayı test eder,
> satın alma çalışmaz ve "IAP çalışmıyor" diye reddeder.

### 14.3 Gönder

1. **Build** bölümünde TestFlight'ta test ettiğin build'i seç
2. **Version Release:** "Manually release this version" öneririm
   > Böylece onaylandığında ne zaman yayınlanacağına sen karar verirsin.
3. **Add for Review** → **Submit to App Review**

### 14.4 Bekle

| Durum | Anlamı |
|---|---|
| **Waiting for Review** | Sırada (genelde 1–2 gün) |
| **In Review** | İnceleniyor (birkaç saat) |
| **Pending Developer Release** | ✅ Onaylandı! Yayınlamayı bekliyor |
| **Rejected** | Reddedildi — Bölüm 15'e bak |

---

## 15. Reddedilirsen

**Panik yok.** İlk gönderimde reddedilmek çok yaygındır. Apple sebebini
**Resolution Center**'da yazar.

### Nasıl cevaplanır

1. App Store Connect → **Resolution Center** → mesajı oku
2. Guideline numarasını not et (örn. "Guideline 3.1.2")
3. Bana o mesajı olduğu gibi ilet — birlikte düzeltiriz
4. Kod değişikliği gerekiyorsa yeni build al ve gönder
5. Sadece açıklama gerekiyorsa Resolution Center'dan cevap yaz

> Apple'a Resolution Center üzerinden yazabilirsin; kibar ve net bir açıklama
> çoğu zaman yeni build gerektirmeden sorunu çözer.

### Bu projede olası red sebepleri ve hazır cevaplar

| Guideline | Sebep | Ne yapmalı |
|---|---|---|
| **2.1** | "Satın alma çalışmadı" | Sandbox'ta test et; RevenueCat Offering'i "current" mi kontrol et (Bölüm 7.5) |
| **2.1** | "Reklam butonu çalışmadı" | AdMob'da yeni hesapta reklam envanteri birkaç gün gecikebilir. Reviewer'a bunu açıkla. |
| **3.1.2** | "Abonelik bilgisi eksik" | Kodda var. Açıklama metnindeki abonelik paragrafını da eklediğinden emin ol |
| **5.1.1** | "Gizlilik politikası erişilemedi" | URL'yi tarayıcıda aç, gerçekten açılıyor mu kontrol et |
| **4.0** | "Tasarım/placeholder" | İkon değiştirildi; başka bir şeyi kastediyorlarsa bana ilet |
| **2.3.10** | "Android'den bahsediliyor" | Açıklamada "Android", "Google Play" geçmemeli |

---

## 16. Benden Karar Bekleyenler

Bu 6 soruya cevap verirsen kalan işleri hallederim.

### 1. SKAdNetwork listesini doğrula
`app.config.ts` içinde 46 adet reklam ağı kimliği var. Bunları hafızamdan
yazdım; **Google'ın resmî listesinden doğrulaman gerekiyor:**
`developers.google.com/admob/ios/download#skadnetwork-identifiers`

> Yanlış bir kimlik zararsızdır (sadece eşleşmez), ama eksik kimlik reklam
> gelirini düşürür. Güncel listeyi bana yapıştırırsan güncellerim.

### 2. GDPR/UMP onay ekranı eklensin mi?
Avrupa kullanıcıları için Google, reklam öncesi onay ekranı istiyor.
Şu an kodda **yok**. Apple bu yüzden reddetmez, ama Google'ın politikasını
ihlal eder ve Avrupa'da reklam sunumu durdurulabilir.

- Sadece Türkiye hedefliyorsan → şimdilik gerek yok
- Dünya geneli yayınlayacaksan → eklemeliyiz

> Önce AdMob'da GDPR mesajını yapılandırman gerekiyor (Bölüm 8.5). Sonra
> söyle, kodu yazayım.

### 3. iPad'i destekleyecek miyiz?
Şu an **evet** ve kart düzeni iPad için düzeltildi. Ama bu, **13" iPad ekran
görüntüsü hazırlamayı zorunlu** kılıyor ve inceleyici iPad'de de test ediyor.

Desteklemek istemiyorsan söyle, kapatayım — iş yükün azalır.

### 4. NativeWind kalsın mı?
Bir stil kütüphanesi kurulu ama neredeyse hiç kullanılmıyor. Kaldırmak
uygulamayı biraz küçültür. Yayın öncesi gereksiz risk de olabilir.
**Önerim:** şimdilik dursun, yayından sonra temizleyelim.

### 5. Uygulama ikonu
İkonu ben ürettim (mavi zemin, beyaz kart, "A" harfi, altın çizgi).
`assets/images/icon.png` dosyasına bakabilirsin.

Profesyonel tasarımcıyla değiştirmek istersen sadece PNG'leri değiştirmen
yeterli, kod değişmez. Üreteç kodunu
`assets/images/BRAND_MARK_SOURCE.swift.txt` içinde bıraktım.

### 6. Kart karıştırma kalıcı olsun mu?
"Kartları Karıştır" şu an sadece o oturum için geçerli — uygulamayı kapatıp
açınca eski sıra döner. Kalıcı olmasını istersen yaparım.

---

## 17. Sorun Giderme

### `npm run verify` hata veriyor
Hatanın tamamını bana ilet. Genelde tek satırlık bir düzeltmedir.

### `npm run ios` çok uzun sürüyor / takılıyor
İlk derleme normalde 10–20 dakika. Takıldıysa:
```bash
# Terminalde Ctrl+C, sonra:
rm -rf ios
npm run prebuild
npm run ios
```

### "Command not found: npx" veya Node hataları
Node.js sürümün v25 (deneysel). Sorun yaşarsan LTS sürüme geç:
```bash
# nvm kuruluysa:
nvm install 22
nvm use 22
rm -rf node_modules package-lock.json
npm install
```

### Build "config incomplete" hatasıyla çöküyor
`.env` eksik veya EAS'e gönderilmemiş:
```bash
cat .env                                  # dolu mu?
npx eas-cli env:list production           # EAS'te var mı?
npx eas-cli env:push production --path .env
```

### Satın alma "Aylık paket bulunamadı" diyor
Sırayla kontrol et:
1. RevenueCat → Offerings → bir offering **"current"** olarak işaretli mi? (7.5)
2. Offering içinde paket var mı ve doğru ürüne bağlı mı?
3. Apple'daki Product ID `linguacard_monthly_10try` ile birebir aynı mı?
4. Apple'daki ürün durumu "Ready to Submit" mi?

### Satın alma çalışıyor ama premium açılmıyor
RevenueCat → Entitlements → kimlik tam olarak **`premium`** mi?
Büyük harf veya boşluk varsa çalışmaz.

### Reklam hiç gelmiyor
- Yeni AdMob hesaplarında reklam envanteri **birkaç gün** gecikebilir. Normal.
- Ad unit ID'de `/` (eğik çizgi) var mı? App ID'de `~` (tilde) var mı?
- `.env` doldurup `npm run prebuild` çalıştırdın mı?

### TestFlight'ta build görünmüyor
Apple'ın işlemesi 30 dakikayı bulabilir. Ayrıca App Store Connect'te
"Export Compliance" sorusu bekliyor olabilir — kodda `usesNonExemptEncryption:
false` ayarlı olduğu için sorulmaması gerekir, ama sorulursa **"No"** de.

### `ios/` klasöründe bir şey değiştirdim, kayboldu
Beklenen davranış. O klasör otomatik üretiliyor. Değişikliği
`app.config.ts` içinde yap, sonra `npm run prebuild`.

---

## 18. Komut Sözlüğü

```bash
# Günlük geliştirme
npm run ios              # Simülatörde çalıştır
npm start                # Geliştirme sunucusunu başlat
npm run verify           # Tip + kalite + test kontrolü (commit öncesi hep çalıştır)

# Ayar değiştirdikten sonra
npm run prebuild         # app.config.ts -> ios/ klasörünü yeniden üret

# Yayın
npx eas-cli login                                    # Expo'ya giriş
npx eas-cli env:push production --path .env          # Anahtarları buluta gönder
npx eas-cli build --platform ios --profile production # Build al
npx eas-cli submit --platform ios --latest           # TestFlight'a gönder

# Kontrol
npx eas-cli whoami                       # Kim olarak girişliyim
npx eas-cli build:list                   # Geçmiş build'ler
npx eas-cli env:list production          # EAS'teki değişkenler
```

### Altın kurallar

1. **`ios/` klasörünü elle düzenleme.** `app.config.ts` → `npm run prebuild`.
2. **`.env` dosyasını kimseyle paylaşma, git'e ekleme.**
3. **RevenueCat secret key'ini (`sk_...`) uygulamaya koyma.** Sadece
   public key (`appl_...`).
4. **Her build öncesi `npm run verify`.**
5. **Satın alma ve reklamı mutlaka gerçek cihazda test et.** Simülatör
   bunları desteklemez.

---

## Takıldığın Anda

Bana şunları söyle:
- Hangi bölümdesin
- Ne yapmaya çalıştın
- **Hata mesajının tamamı** (ekran görüntüsü veya metin)

Kod tarafında bir düzeltme gerekiyorsa yaparım; panel tarafında bir ayarsa
adım adım tarif ederim.

**İlgili dokümanlar:**
- `REVIEW-FIXES.md` — kodda neyin neden değiştirildiği (teknik)
- `CLAUDE.md` — projenin teknik kuralları
- `ANALYSIS.md` — mimari ve veritabanı detayları
