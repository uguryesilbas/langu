# LinguaCard - Dil Ogrenme Mobil Uygulamasi

## Proje Ozeti
Ingilizce-Turkce flashcard tabanli dil ogrenme uygulamasi.
Local-first mimari: tum kullanici verisi cihazda saklanir.
Backend YOKTUR. Auth sistemi YOKTUR.

## Tech Stack
- Runtime: React Native 0.83 with Expo SDK 55 (New Architecture / Fabric acik)
- Language: TypeScript (strict mode)
- State: Zustand 5 (in-memory) + expo-sqlite (persistence)
- Navigation: Expo Router (file-based, typedRoutes)
- Local DB: expo-sqlite (async API: getAllAsync / runAsync / getFirstAsync)
- Payments: RevenueCat (react-native-purchases)
- Ads: Google AdMob (react-native-google-mobile-ads, rewarded video)
- TTS: expo-speech
- Animations: react-native-reanimated 4.x
- Config: app.config.ts (app.json YOK) + expo-constants

## KRITIK: Backend/Auth/Supabase/Firebase KULLANMA
Tum veri cihazdaki SQLite'da saklanir. Auth YOK. API YOK.
Kodda tek bir `fetch`/`axios` cagrisi bile yok; boyle kalmali.

## KRITIK: ios/ ve android/ klasorlerini ELLE DUZENLEME
Proje CNG (Continuous Native Generation) modunda. `ios/` git'te izlenmiyor ve
`expo prebuild` her calistiginda sifirdan uretiliyor. Info.plist, entitlements
veya Xcode ayarlarina yapilan elle mudahale SESSIZCE KAYBOLUR.

Native ayar degisikligi her zaman:
1. `app.config.ts` duzenlenir
2. `npm run prebuild` calistirilir

Expo sablonunun ekledigi istenmeyen anahtarlar icin
`plugins/withInfoPlistCleanup.js` config plugin'i var.

## Key Directories
- app/               -> Expo Router ekranlari
- components/cards/  -> FlashCard, CardFront, CardBack
- components/ui/     -> HighlightedText, AdRewardButton, SubscriptionBanner,
                        SubscriptionDisclosure
- components/settings/ -> SettingsCard, SubscriptionHeroCard, StatsCard, LegalCard
- stores/            -> Zustand stores
- services/          -> SQLite, TTS, RevenueCat, AdMob (.web.ts stub'lari ile)
- hooks/             -> Custom hooks
- constants/         -> kelime havuzu (100), tema, ceviriler, config
- types/             -> TypeScript types
- db/                -> SQLite schema
- utils/             -> locale, sanitize
- plugins/           -> Expo config plugin'leri
- __tests__/         -> Jest testleri

## Code Style
- Functional components + hooks ONLY
- Named exports, ES modules
- Inline style objects (NativeWind kurulu ama pratikte kullanilmiyor —
  yeni kod da inline style kullanmali, tutarlilik icin)
- Components under 150 lines
- Zustand selectors for state (asagidaki tuzaga dikkat)

## Commands
- Dev:       npm start
- iOS:       npm run ios
- Android:   npm run android
- Lint:      npm run lint  (veya lint:fix)
- TypeCheck: npm run typecheck
- Test:      npm test
- Hepsi:     npm run verify
- Prebuild:  npm run prebuild

## Gotchas

### Zustand v5 selector tuzagi
Her cagrida YENI obje/dizi donduren bir selector'i dogrudan
`useStore(selector)` ile kullanma — `useSyncExternalStore`'un snapshot cache'ini
bozar ve sonsuz render dongusune yol acar.
`computeTotals()` bu yuzden selector DEGIL; `hooks/useDeckTotals.ts` dort diziyi
ayri ayri secip sonucu `useMemo` ile turetiyor. Bu yapiyi "sadelestirme".

### Config ve secret'lar
Tum anahtarlar `.env` -> `app.config.ts` (`extra`) -> `constants/config.ts`
zincirinden gelir. Kodda hardcoded key YOK.
`assertReleaseConfig()` release build'de eksik config icin HATA FIRLATIR —
bu bilincli, placeholder'li binary uretilmesin diye.
RevenueCat SECRET key'i (`sk_...`) asla uygulamaya girmemeli.

### Fiyat gosterimi
Kullaniciya gosterilen fiyat SADECE StoreKit'ten gelebilir
(`product.priceString`). Hardcoded fiyat Apple tarafindan yaniltici
fiyatlandirma sayilir. `getDisplayPrice()` bu yuzden silindi, geri ekleme.

### AdMob
- `initAdMob()` reklam istemeden once cagrilmali (SDK zorunlulugu)
- `showRewardedAd()` MUTLAKA resolve eder (20 sn timeout) — donen deger
  `'rewarded' | 'dismissed' | 'unavailable'`, her uc durum da kullaniciya
  mesaj gosterir
- `requestNonPersonalizedAdsOnly: true` kullaniliyor -> IDFA istenmiyor ->
  ATT prompt'u YOK -> `NSPrivacyTracking: false`
  Personalized reklama gecersen bu UCUNU BIRLIKTE degistir.

### Baslangic kelime sayisi
Yeni kurulumda kac kelime yuklenecegi `constants/words.ts` icindeki
`INITIAL_WORD_COUNT` (su an 25) ile belirlenir. `SEED_WORD_POOL` 100 kelime
tutar; `INITIAL_WORDS` bunun ilk N tanesidir. Sayiyi buyutmek tek satirlik
bir degisiklik.
Ancak `seedWordsIfEmpty()` sadece `words` tablosu BOSSA calisir — mevcut
kurulumlarda sayi degismez, test icin uygulamayi silip yeniden kurmak gerekir.

### Diger
- expo-speech: Android Expo Go'da calismaz -> dev build
- RevenueCat & AdMob: native build gerekli
- `__DEV__` ile AdMob test unit'i otomatik secilir
- FlashCard: rotateY + backfaceVisibility:'hidden' SART
- Form + liste ayni ekranda ise form `ListHeaderComponent` olarak verilir
  (tek kaydirma alani). Bu prop bir JSX *element* olmali; inline component
  fonksiyonu verirsen header her render'da remount olur ve odaktaki
  TextInput her harfte klavyeyi kaybeder.
  Klavye icin `automaticallyAdjustKeyboardInsets` kullaniliyor,
  `KeyboardAvoidingView` DEGIL (o ekrani kucultur, kaydirma alani yaratmaz)
- Boyutlar icin `useWindowDimensions()` kullan, modul seviyesinde
  `Dimensions.get()` KULLANMA (iPad Split View / rotasyon kirilir)
- Kullanici girdisi `sanitizeUserText()` ile temizlenmeli (uzunluk + kontrol
  karakterleri); SQL injection riski yok, sorgular zaten parametrize

## Dokumanlar
- `REVIEW-FIXES.md`    -> App Store denetimi sonrasi yapilan tum degisiklikler
                          ve gerekceleri. Bir karari degistirmeden once oku.
- `SUBMISSION-TODO.md` -> Gonderim oncesi kullanicinin yapmasi gerekenler
- `ANALYSIS.md`        -> Detayli teknik analiz, DB semasi, faz planlari
