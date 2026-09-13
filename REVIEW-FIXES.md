# App Store Review Düzeltmeleri — Uygulama Kaydı

**Tarih:** 2026-09-13
**Kapsam:** App Store hazırlık denetiminde bulunan 5 Critical, 7 High, 13 Medium, 8 Low bulgunun tamamı.
**Durum:** Kod tarafındaki tüm maddeler uygulandı. Kalan işler → `SUBMISSION-TODO.md`

> Bu dosya *neden* böyle yapıldığını kaydeder. Bir kararı değiştirmeden önce buradaki
> gerekçeyi oku — çoğu "tuhaf" görünen kod, somut bir App Store red riskine karşı yazıldı.

---

## 0. Doğrulama durumu

```
npm run typecheck   ✅ temiz
npm run lint        ✅ temiz (0 hata)
npm test            ✅ 4 suite / 20 test geçti
npx expo export     ✅ iOS bundle üretildi (5.6 MB)
npx expo prebuild   ✅ ios/ yeni config'ten yeniden üretildi
```

---

## 1. Mimari karar: Yapılandırma artık `app.config.ts`'te

**Yapılan:** `app.json` silindi, yerine `app.config.ts` geldi. `constants/config.ts` artık
değerleri `Constants.expoConfig.extra` üzerinden okuyor. `.env.example` eklendi,
`.gitignore` `.env` ve `.env.*` dosyalarını dışlıyor.

**Neden:** `ios/` ve `android/` klasörleri `.gitignore`'da ve git'te izlenmiyor — proje
**CNG (Continuous Native Generation)** modunda. `ios/Info.plist`'e elle yapılan her
düzenleme bir sonraki `expo prebuild` veya EAS Build'de **sessizce siliniyordu**. Bu
yüzden native ayarların tek doğru yeri `app.config.ts`.

**Önemli:** Bu raporda yapılan iOS ayar değişikliklerinin hiçbirini `ios/` içinde elle
düzenleme. Her zaman `app.config.ts`'i değiştir, sonra `npm run prebuild` çalıştır.

**Secret notu:** RevenueCat *public* SDK key'i ve AdMob unit ID'leri tasarımı gereği
client-side'dır — binary'den zaten çıkarılabilirler, gizli değiller. Env'e taşınmalarının
sebebi gizlilik değil, **ortam ayrımı ve rotasyon**. RevenueCat'in **secret** key'i
(`sk_...`) bu uygulamaya asla girmemeli.

---

## 2. Critical düzeltmeler

### 2.1 Placeholder monetizasyon config'i artık build'i kırıyor

**Dosyalar:** `constants/config.ts`, `app/_layout.tsx`

Eskiden `services/revenuecat.ts` API key'inin içinde `xxxx` görünce sessizce
`return` ediyordu. Sonuç: `purchaseMonthly()` her zaman `purchase_failed` dönüyor,
reviewer "Premium'a Geç"e basınca hata alert'i görüyordu (Guideline 2.1 + 3.1.1).

Artık `assertReleaseConfig()` var ve `app/_layout.tsx` içinde açılışta çağrılıyor:

- **Release build'de** eksik değer varsa **hata fırlatır** — placeholder'lı bir binary
  bir daha sessizce üretilemez.
- **Dev build'de** sadece uyarır, böylece `.env` olmadan da uygulama çalışabilir.

Kontrol edilenler: RevenueCat API key, AdMob rewarded unit ID, privacy policy URL,
terms URL.

### 2.2 AdMob SDK artık initialize ediliyor

**Dosyalar:** `services/admob.ts`, `app/_layout.tsx`

`initAdMob()` tanımlıydı ama **hiçbir yerden çağrılmıyordu**. Google Mobile Ads SDK
ilk reklam isteğinden önce initialize edilmek zorundadır; edilmeyince ödüllü reklam
akışı tamamen ölüydü.

Şimdi iki kat güvence var: `app/_layout.tsx` açılışta çağırıyor **ve**
`showRewardedAd()` kendi içinde `await initAdMob()` yapıyor (idempotent, `initPromise`
ile tekilleştirilmiş; hata durumunda promise sıfırlanıyor ki sonraki deneme tekrar
şans bulsun).

### 2.3 Uygulama ikonu ve splash

**Dosyalar:** `assets/images/*.png`, `assets/images/BRAND_MARK_SOURCE.swift.txt`

Eski görseller Expo'nun **varsayılan şablonuydu** — ikonun üzerinde tasarım kılavuz
çizgileri ve crosshair, splash'te gri ızgara vardı. Apple bunu metadata aşamasında,
kodu hiç çalıştırmadan reddeder (Guideline 4.0 / 2.3.8).

Yerine özgün bir marka işareti üretildi: mavi gradyan zemin üzerinde beyaz flashcard,
üzerinde büyük "A" ve altın renkli alt çizgi, arkada hafif döndürülmüş altın kart.
6 varyant üretildi (iOS ikonu, splash, favicon, Android adaptive foreground/background/
monochrome).

> **iOS ikonu alfa kanalsız (RGB) üretildi** — Apple alfa kanallı app icon'u reddeder.
> Üreteç Swift/CoreGraphics kaynağı `assets/images/BRAND_MARK_SOURCE.swift.txt` içinde
> saklandı: `swift BRAND_MARK_SOURCE.swift.txt <çıktı-klasörü>` ile yeniden üretilebilir.

**Not:** Bu işaret teknik blokeri kaldırmak için üretildi ve tutarlı/temiz bir marka
işareti. Profesyonel bir tasarımcıyla değiştirmek istersen sadece PNG'leri değiştir,
kod değişikliği gerekmez.

### 2.4 Abonelik yasal bildirimleri

**Dosyalar:** `components/ui/SubscriptionDisclosure.tsx` (yeni),
`components/ui/SubscriptionBanner.tsx`, `components/settings/SubscriptionHeroCard.tsx`,
`constants/translations.ts`

Guideline 3.1.2(a) abonelik satın alma akışının **içinde** şunları zorunlu kılar:
süre, fiyat, otomatik yenileme davranışı, nasıl iptal edileceği, Terms of Use (EULA)
ve Privacy Policy linkleri. Hiçbiri yoktu.

Yeni `SubscriptionDisclosure` component'i her iki paywall'ın altında bu metni ve
linkleri gösteriyor. Metinler TR/EN olarak `translations.ts`'te
(`subscriptionTerms`, `subscriptionTitle`, `subscriptionBenefits`).

`onDark` prop'u var çünkü aynı bileşen hem marka mavisi kart üzerinde hem açık
zeminde kullanılıyor.

### 2.5 Uygulama içi Privacy Policy / Terms erişimi

**Dosyalar:** `components/settings/LegalCard.tsx` (yeni), `app/(tabs)/settings.tsx`

Guideline 5.1.1(i): üçüncü taraf reklam gösteren her uygulama için uygulama içinden
erişilebilir privacy policy **zorunlu**. Uygulamanın hiçbir yerinde link yoktu.

Ayarlar'a "Yasal" kartı eklendi (Gizlilik Politikası / Kullanım Koşulları / Destek),
`expo-web-browser` ile in-app tarayıcıda açılıyor.

> **Davranış notu:** URL'si boş olan satır render edilmez, üçü de boşsa kart hiç
> görünmez. Bu bilinçli — yarım bir link göstermektense hiç göstermemek daha iyi.
> **Ama bu, URL'leri girmeyi opsiyonel yapmaz:** `assertReleaseConfig()` release
> build'de eksik URL için hata fırlatır.

---

## 3. High düzeltmeler

### 3.1 Fiyat artık StoreKit'ten geliyor

**Dosyalar:** `utils/locale.ts`, `services/revenuecat.ts`, `stores/subscriptionStore.ts`,
`components/ui/SubscriptionBanner.tsx`, `components/settings/SubscriptionHeroCard.tsx`

`getDisplayPrice()` **tamamen kaldırıldı**. Cihaz locale'ine bakıp `'₺10'` veya `'$1'`
döndürüyordu; Almanya'daki kullanıcı "$1" görüp EUR ödüyordu. Apple bunu yanıltıcı
fiyatlandırma sayar.

Artık tek kaynak var: `Purchases.getOfferings() → pkg.product.priceString`.
`subscriptionStore.price` alanında tutuluyor, açılışta `loadPrice()` ile yükleniyor.
Fiyat henüz gelmediyse buton fiyatsız etiket gösteriyor (uydurma fiyat göstermiyor).

### 3.2 Premium durumu açılışta kontrol ediliyor

**Dosyalar:** `app/_layout.tsx`, `stores/subscriptionStore.ts`, `services/revenuecat.ts`

Eskiden `checkSubscription()` **sadece Ayarlar ekranı açıldığında** çağrılıyordu.
Abone bir kullanıcı uygulamayı yeniden başlattığında `isPremium: false` ile başlıyor,
"Kelimelerim" sekmesinde paywall görüyordu. Reviewer'ın standart testi (satın al →
kapat → aç → dene) tam buraya çarpar (Guideline 3.1.1).

İki katmanlı çözüm:
1. `app/_layout.tsx` RevenueCat configure olur olmaz `checkSubscription()` çağırıyor.
2. `onSubscriptionChange()` ile `addCustomerInfoUpdateListener` bağlanıyor — yenileme,
   iptal, başka cihazda satın alma anında yansıyor.

> **API tuzağı:** `Purchases.addCustomerInfoUpdateListener` **void döner**, unsubscribe
> fonksiyonu vermez. Bu yüzden `onSubscriptionChange` handler referansını kendisi
> saklayıp `removeCustomerInfoUpdateListener(handler)` çağıran bir closure döndürüyor.

### 3.3 Ödüllü reklam akışı — timeout, temizlik, geri bildirim

**Dosyalar:** `services/admob.ts`, `hooks/useRewardedAd.ts`,
`components/ui/AdRewardButton.tsx`

Eski `showRewardedAd()` üç ayrı şekilde bozuktu:

1. **Timeout yoktu.** Hiçbir event gelmezse promise asla resolve olmuyordu →
   `isWatchingAd` sonsuza kadar `true` → **sonsuz spinner**.
2. **Listener sızıntısı.** `show()` hata verdiğinde `unsubscribeError` ve
   `unsubscribeDismissed` temizlenmiyordu; her deneme 4 listener biriktiriyordu.
3. **Sessiz başarısızlık.** `false` dönünce kullanıcıya hiçbir şey söylenmiyordu —
   buton bozuk görünüyordu. Reklam envanteri boşken reviewer tam bunu görürdü.

Yeniden yazıldı:

- **20 saniye timeout** (`AD_TIMEOUT_MS`) — her yol mutlaka resolve eder.
- Tek bir `finish()` fonksiyonu, `settled` guard'ı ve **tüm** listener'ları temizleyen
  ortak `unsubscribers` dizisi.
- `@ts-ignore`'lu string event tipleri yerine gerçek `AdEventType.ERROR` /
  `AdEventType.CLOSED` enum'ları.
- Dönüş tipi `boolean` yerine **`AdResult`** union'ı: `'rewarded' | 'dismissed' |
  'unavailable'`. Böylece `AdRewardButton` üç durumu ayırt edip her biri için uygun
  mesajı gösterebiliyor (`adDismissed` / `adUnavailable`).

### 3.4 Açılıştaki "Tebrikler" flash'ı

**Dosyalar:** `stores/wordStore.ts`, `app/(tabs)/index.tsx`

`isLoading` **`false`** ile başlıyordu. İlk render'da `words: []` olduğu için
`if (!currentWord)` dalı çalışıyor ve **"Tebrikler! Tüm kelimeleri öğrendiniz"**
kutlama ekranı yanıp sönüyordu — 0 kelime öğrenmiş bir kullanıcıya.

Düzeltme: `isLoading: true` ile başla, ayrıca **`hasLoaded`** bayrağı eklendi.
Ekranda `if (isLoading || !hasLoaded)` kontrolü diğer tüm dalların önünde.
Böylece "henüz yüklenmedi" ile "deste gerçekten boş" birbirinden ayrıldı.

### 3.5 Şablon artıkları silindi

**Silinen dosyalar:** `app/modal.tsx`, `components/EditScreenInfo.tsx`,
`components/StyledText.tsx`, `components/Themed.tsx`, `components/ExternalLink.tsx`,
`components/useColorScheme.ts(.web)`, `components/useClientOnlyValue.ts(.web)`,
`constants/Colors.ts`

`app/modal.tsx` Expo Router tarafından `/modal` rotası olarak kaydediliyordu ve
**`linguacard://modal` deep link'iyle açılabiliyordu**. İçinde "Open up the code for
this screen: app/modal.tsx" ve Expo dokümantasyon linki vardı. Reviewer'ların deep
link şemalarını denemesi rutindir.

`app/+not-found.tsx` de yeniden yazıldı — artık tema ve çeviri sistemini kullanıyor
(eskiden sadece İngilizce, şablon stilinde).

### 3.6 Error Boundary

**Dosyalar:** `components/ErrorBoundary.tsx` (yeni), `app/_layout.tsx`

Expo Router root layout'tan `ErrorBoundary` export'unu otomatik yakalar. Öncesinde
render hatası kullanıcıyı **boş beyaz ekranda** bırakıyordu — App Review bunu crash
sayar.

> **Tasarım notu:** Bu bileşen bilinçli olarak `useTheme`/`useTranslation`
> kullanmıyor, renkleri ve metinleri kendi içinde tutuyor. Hata tam olarak o
> store'lardan birinde çıktıysa fallback'in yine de render olması gerekir.

---

## 4. Medium / Low düzeltmeler

### 4.1 Sayaçlar tek kaynaktan

**Dosyalar:** `stores/wordStore.ts` (`computeTotals`), `hooks/useDeckTotals.ts` (yeni),
üç ekran

Üç ekran üç farklı formül kullanıyordu. Ayarlar'da "Öğrenilen: 12" ile "Genel
İlerleme: %10" yan yana çıkabiliyordu (biri custom kelimeleri sayıyor, diğeri saymıyordu).

`computeTotals()` tek doğru kaynak. Testlerle korunuyor (`__tests__/wordStore.test.ts`).

> **⚠️ Zustand v5 tuzağı — buraya dikkat:** `computeTotals` bilinçli olarak zustand
> *selector'ı değil*. Her çağrıda yeni dizi/obje üretiyor; böyle bir selector'ı
> doğrudan `useWordStore(selectTotals)` şeklinde kullanmak zustand v5'te
> `useSyncExternalStore`'un snapshot cache'ini bozar ve sonsuz render döngüsüne yol
> açar. Bu yüzden `useDeckTotals()` hook'u dört diziyi **ayrı ayrı** seçip
> (referansları stabil kalır) sonucu `useMemo` ile türetiyor.
> Bunu "sadeleştirip" selector'a geri çevirme.

### 4.2 iPad / responsive

**Dosyalar:** `components/cards/FlashCard.tsx`, `app.config.ts`

`Dimensions.get('window')` **modül seviyesinde** okunuyordu — uygulama açılırken bir
kez. Döndürme, iPad Split View ve Slide Over'da kart boyutu hiç güncellenmiyordu.
`supportsTablet: true` olduğu için reviewer iPad'de test eder.

`useWindowDimensions()` hook'una geçildi, boyutlar `useMemo` ile türetiliyor.
Yükseklik artık oransal (`height * 0.55`, 300–420 arası sınırlı) — iPhone SE'de taşma,
iPad'de aşırı büyüme yok. Genişlik `MAX_CARD_WIDTH = 460` ile sınırlı.

iPhone'da oryantasyon artık sadece `Portrait` (eskiden `PortraitUpsideDown` de açıktı).

### 4.3 TTS animasyon sızıntısı

**Dosyalar:** `hooks/useSpeakPulse.ts` (yeni), `services/tts.ts`, `CardFront`, `CardBack`

Eskiden her iki kartta da:
```ts
setTimeout(() => { cancelAnimation(scale); ... }, 1200);
```
Handle saklanmıyor, unmount'ta temizlenmiyordu. Kullanıcı hoparlöre basıp hemen
"Sonraki"ye geçerse timeout unmount olmuş component'in shared value'suna yazıyordu.
Ayrıca sabit 1200ms, gerçek konuşma süresinden bağımsızdı.

Yeni `useSpeakPulse()` hook'u: `speakWord`'e `onSettled` callback'i eklendi
(`onDone`/`onStopped`/`onError`'ın üçünde de tam bir kez tetiklenir), animasyon
**konuşma bitince** duruyor. Unmount'ta `cancelAnimation` + `stopSpeaking()`.

`services/tts.ts` ayrıca try/catch ile sarıldı — expo-speech bazı cihazlarda
(özellikle Android Expo Go) yok.

### 4.4 Girdi doğrulama

**Dosyalar:** `utils/sanitize.ts` (yeni), `app/(tabs)/custom-words.tsx`

Eskiden sadece `.trim()` vardı. Uzunluk sınırı, kontrol karakteri veya bidi-override
filtresi yoktu.

> **Netleştirme:** SQL injection riski **zaten yoktu** — tüm sorgular parametrize
> (`?` placeholder). Bu değişiklik escaping için değil, **layout bütünlüğü** için:
> 50.000 karakterlik bir "kelime" kart düzenini ve FlatList satırını bozuyordu.
> U+202E gibi bidi karakterleri de listeyi görsel olarak karıştırabiliyordu.

`sanitizeUserText()` kontrol/bidi karakterlerini siler, boşlukları normalize eder
(yapıştırılan satır sonları dahil) ve uzunluğu kırpar. `TextInput`'lara `maxLength`
eklendi (kelime 40, cümle 200).

Ayrıca `handleSave` artık kredi yokken **sessizce return etmiyor** — `adNoCreditsLeft`
alert'i gösteriyor (eskiden Kaydet butonu ölü görünüyordu) ve try/catch ile DB
hatalarını yakalıyor.

### 4.5 Hata yönetimi ve effect bağımlılıkları

**Dosyalar:** `stores/wordStore.ts`, `stores/subscriptionStore.ts`, tüm ekranlar

- `loadWords` artık `try/catch/finally`. `isLoading: false` **`finally`'de** —
  eskiden DB hatası sonsuz spinner bırakıyordu. `error` state'i ve ana ekranda
  retry butonlu bir hata durumu eklendi.
- Tüm store mutasyonları try/catch ile sarıldı (unhandled rejection yoktu artık).
- `useEffect` deps dizileri düzeltildi (`[db]` eksikti).
- Odakta tazelenmesi gerekenler `useFocusEffect`'e taşındı: Ayarlar'da
  `checkSubscription` + `refreshAdWordCount`, Kelimelerim'de `refreshAdWordCount`.
  Eskiden sadece ilk mount'ta çalışıyordu, sekme değişince sayaçlar bayat kalıyordu.

### 4.6 Locale tespiti

**Dosya:** `utils/locale.ts`

`Intl.DateTimeFormat().resolvedOptions().locale.split('-')[1]` üç parçalı locale'lerde
yanlış sonuç veriyordu: `"zh-Hans-CN"` → `"Hans"` (region değil, script).
`expo-localization`'ın `getLocales()[0].regionCode` / `.languageCode` alanlarına
geçildi — paket zaten kuruluydu ama kullanılmıyordu.

### 4.7 Settings ekranı bölündü

**Dosyalar:** `components/settings/` (4 yeni dosya), `app/(tabs)/settings.tsx`

548 satırdı (CLAUDE.md kuralı: 150). `SettingsCard` (paylaşılan yüzey),
`SubscriptionHeroCard`, `StatsCard`, `LegalCard` olarak ayrıldı. Ekran ~250 satıra indi.

### 4.8 "Local First" rozeti dürüstleştirildi

**Dosya:** `app/(tabs)/settings.tsx`, `constants/translations.ts` (`localFirstDetail`)

Kalkan ikonuyla "Local First" mesajı, AdMob cihaz tanımlayıcısı ve IP'yi Google'a
gönderirken yanıltıcıydı. Artık altına açıklama eklendi: öğrenme verisi cihazda kalır,
**reklamlar Google AdMob tarafından sunulur**.

### 4.9 Erişilebilirlik

Tüm `Pressable`'lara `accessibilityRole`, `accessibilityLabel` ve uygun yerlerde
`accessibilityState` eklendi. Özellikle ikon-only butonlar (ileri/geri, kalem, çöp
kutusu, hoparlör) VoiceOver'da isimsiz okunuyordu. Yeni çeviri anahtarları:
`speakWordA11y`, `previousCardA11y`, `nextCardA11y`, `editWordA11y`, `deleteWordA11y`.

### 4.10 Deste karıştırma

**Dosya:** `stores/wordStore.ts`

`shuffleWords` sadece `words` dizisini karıştırıyordu; özel kelimeler deste sonunda
sırasız kalıyordu. Artık hem base hem unlearned custom kelimeleri karıştırıyor.

> **Bilinen sınırlama (bilinçli):** Karıştırma DB'ye yazılmıyor, sadece oturum içi.
> Uygulama yeniden başlatılınca `ORDER BY sort_order` ile eski sıra döner. Kalıcı
> yapmak istersen `app_settings`'e bir `deck_seed` yazıp yükleme sırasında uygula.

---

## 5. iOS yapılandırma değişiklikleri

Hepsi `app.config.ts` üzerinden, `npm run prebuild` ile uygulanır.

| Ayar | Önce | Sonra | Neden |
|---|---|---|---|
| `ITSAppUsesNonExemptEncryption` | yok | `false` | Her yüklemede "Missing Compliance" sorusunu kaldırır |
| `NSAllowsLocalNetworking` | `true` | kaldırıldı | Uygulamanın hiç ağ çağrısı yok; gereksiz ATS istisnası |
| `SKAdNetworkItems` | yok | 46 ID | Reklam ilişkilendirmesi; yoksa eCPM düşer |
| iPhone oryantasyon | Portrait + UpsideDown | sadece Portrait | Kart UI'ı için upside-down anlamsız |
| `CFBundleURLSchemes` | `linguacard`, `com.linguacard.app` | sadece `linguacard` | İkincisi kullanılmıyordu, gereksiz yüzey |
| `LSMinimumSystemVersion` | `12.0` | kaldırıldı | macOS anahtarı; iOS'ta inert ve gerçek target (15.1) ile çelişiyordu |
| Build number | elle | EAS remote (`autoIncrement`) | `eas.json` ile otomatik artar, elle takip gerekmez |
| `NSPrivacyCollectedDataTypes` | boş | `PurchaseHistory` | RevenueCat'in topladığı veri beyan edildi |

**`plugins/withInfoPlistCleanup.js` (yeni):** Expo şablonunun eklediği ama istenmeyen
iki anahtarı (`LSMinimumSystemVersion`, fazladan URL şeması) kaldıran config plugin.
Elle Info.plist düzenlemesi prebuild'de geri alınacağı için plugin olarak yazıldı.

**Değiştirilmeyenler (zaten doğruydu):** boş entitlements, ATT description yokluğu
(IDFA hiç istenmiyor), `NSPrivacyTracking: false`, Required Reason API beyanları,
`EXUpdatesEnabled: false`, deployment target 15.1.

---

## 6. Tooling

**Dosyalar:** `package.json`, `eslint.config.js` (yeni), `__tests__/` (yeni)

CLAUDE.md `npx eslint` ve `npx jest` komutlarını dokümante ediyordu ama **ikisi de
kurulu değildi**. Kuruldu:

```
npm run typecheck   tsc --noEmit
npm run lint        eslint .
npm test            jest (preset: jest-expo)
npm run verify      üçü birden
npm run prebuild    expo prebuild --clean
```

`react-hooks/exhaustive-deps` bilinçli olarak **error** seviyesinde — bu projede eksik
deps gerçek buglara yol açtı (bayat `db` referansları, tazelenmeyen sayaçlar).

> **ESLint config tuzağı:** Temel `no-unused-vars` kuralı TypeScript interface method
> imzalarındaki parametre adlarını "kullanılmıyor" sanıp 25 yanlış pozitif üretiyor.
> Bu yüzden kapatılıp `@typescript-eslint/no-unused-vars` açıldı ve plugin aynı config
> objesinde açıkça register edildi (flat config bunu zorunlu kılıyor).

**20 test / 4 suite:** `sanitize` (girdi temizliği), `wordStore` (sayaç tutarlılığı),
`translations` (TR/EN parite + zorunlu disclosure metinleri), `words` (100 seed
kelimenin bütünlüğü, benzersiz `sort_order`, hedef kelimenin kendi cümlesinde geçmesi).

---

## 7. Bilinçli olarak yapılmayanlar

| Konu | Neden |
|---|---|
| **UMP / GDPR onay akışı** | `GoogleUserMessagingPlatform` pod'u bağımlılık olarak geliyor ama entegrasyonu, Google AdMob konsolunda "funding choices" mesajının önce yapılandırılmasını gerektiriyor. Konsol tarafı hazır olmadan yazılan kod test edilemez. → `SUBMISSION-TODO.md` |
| **Hesap silme** | Uygulamada hesap sistemi yok; Guideline 5.1.1(v) tetiklenmiyor. |
| **Sign in with Apple** | Üçüncü taraf login yok; Guideline 4.8 tetiklenmiyor. |
| **NativeWind kaldırma** | Kurulu ama neredeyse hiç kullanılmıyor (sadece `_layout.tsx`). Kaldırmak bundle'ı küçültür ama davranışsal bir kazanç yok ve release öncesi gereksiz risk. Karar senin. |
| **Onboarding ekranı** | Red riski değil, ürün kararı. |
| **Reklam preload** | `AD_TIMEOUT_MS` ile bekleme sınırlandı; preload optimizasyon, bloker değil. |

---

## 8. Gelecekte dikkat edilecekler

1. **`ios/` klasörünü asla elle düzenleme.** `app.config.ts` → `npm run prebuild`.
2. **`computeTotals`'ı zustand selector'ına çevirme** (bkz. 4.1).
3. **Personalized reklama geçersen** üç şeyi birlikte değiştir: ATT prompt ekle,
   `NSUserTrackingUsageDescription` ekle, `privacyManifests.NSPrivacyTracking: true`
   yap. Biri eksik kalırsa Apple reddeder.
4. **Bulut senkronizasyonu (ANALYSIS.md Faz 3) eklersen** üçüncü taraf login gelirse
   **Sign in with Apple** *ve* **uygulama içi hesap silme** aynı anda zorunlu olur.
5. **SKAdNetwork listesi** her release öncesi Google'ın sayfasından tazelenmeli
   (`app.config.ts` içinde inline, URL yorumda).
6. Release öncesi her zaman `npm run verify`.
