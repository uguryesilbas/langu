# KAPSAMLI GELİŞTİRME ANALİZİ — LinguaCard

**Dil Öğrenme Mobil Uygulaması | İngilizce — Türkçe**

**Claude Code + Opus 4.6 Agent Modeli İçin Optimize Edilmiş Teknik Dokümantasyon**

LOCAL-FIRST MİMARİ | Versiyon 3.0 | Eylül 2026

| Alan | Değer |
|------|-------|
| Hedef Platform | iOS & Android (React Native 0.83 / Expo SDK 55) |
| Veri Mimarisi | Local-First (expo-sqlite) |
| Backend Gereksinimi | YOK (Sadece RevenueCat + AdMob) |
| Durum | Faz 1 + Faz 2 **uygulandı**; App Store denetimi tamamlandı |

> **v3.0 notu (Eylül 2026):** Bu doküman başlangıçta bir *geliştirme planı* olarak
> yazıldı. Faz 1 ve Faz 2 tamamlandıktan sonra App Store hazırlık denetimi yapıldı
> ve bulunan tüm bulgular giderildi. Aşağıdaki bölümler **uygulanan gerçek duruma**
> göre güncellendi. Denetim sonrası yapılan değişikliklerin gerekçeleri için
> `REVIEW-FIXES.md`, gönderim öncesi kalan işler için `SUBMISSION-TODO.md`.

---

## 1. PROJE ÖZETİ VE MİMARİ KARAR

Bu doküman, İngilizce-Türkçe dil öğrenme mobil uygulaması "LinguaCard" projesinin Claude Code ajanı ve Opus 4.6 modeli tarafından okunarak, anlaşılarak ve adım adım hayata geçirilmesi için hazırlanmış kapsamlı bir teknik analiz ve geliştirme kılavuzudur.

### 1.1 Mimari Karar: Local-First Yaklaşım

Bu projede bilinçli bir mimari tercih olarak local-first yaklaşım benimsenmiştir. Tüm kullanıcı verileri (öğrenme ilerlemesi, özel kelimeler, reklam hakları) cihaz üzerindeki SQLite veritabanında saklanır. Herhangi bir backend sunucu veya bulut veritabanı KULLANILMAZ.

**Bu Kararın Gerekçeleri:**

- Kullanıcı verileri tamamen kişiseldir, başka kullanıcılarla paylaşım yoktur
- Backend maliyeti sıfıra iner (sunucu, veritabanı, auth hizmeti masrafı yok)
- İnternet bağlantısı olmadan tam çalışır (offline-first)
- Geliştirme süresi ve karmaşıklığı ciddi ölçüde azalır
- Kullanıcı gizliliği doğası gereği korunur (veri cihazdan çıkmaz)

**Bilinen Trade-Off'lar:**

- Telefon değişiminde veya uygulama silinmesinde veri kaybı riski (Faz 3'te isteğe bağlı cloud sync ile çözülebilir)
- Reklam hakkı manipülasyonu riski (düşük değerli ekonomide ihmal edilebilir)

> **Gelecek Planlama Notu:** Kullanıcı tabanı büyüdüğünde ve 'verilerim kayboldu' şikayetleri gelmeye başladığında, isteğe bağlı cloud sync katmanı Faz 3 olarak eklenebilir. Local-first mimari bu geçişe uygundur çünkü SQLite şeması doğrudan cloud tablolarına map edilebilir.

### 1.2 Temel Özellikler Matrisi

| # | Özellik | Öncelik | Tier | Faz |
|---|---------|---------|------|-----|
| F1 | 100 Temel Kelime Kartları (EN/TR cümleli) | **Kritik** | Ücretsiz | Faz 1 |
| F2 | Kart Çevirme Animasyonu (flip card) | **Kritik** | Ücretsiz | Faz 1 |
| F3 | Kelime Vurgulama (bold/renk) Cümle İçinde | **Yüksek** | Ücretsiz | Faz 1 |
| F4 | Text-to-Speech (Kelimeye Tıklayınca Seslendirme) | **Yüksek** | Ücretsiz | Faz 1 |
| F5 | "Öğrendim" Butonu + Öğrenilen Kelime Havuzu | **Yüksek** | Ücretsiz | Faz 1 |
| F6 | Öğrenilen Kelimeleri Geri Getirme (Tekrar Havuzu) | **Yüksek** | Ücretsiz | Faz 1 |
| F7 | Aylık 1$ Abonelik (Özel Kelime Ekleme) | **Kritik** | Premium | Faz 2 |
| F8 | Kullanıcı Bazlı Özel Kelime/Cümle (Lokal) | **Kritik** | Premium | Faz 2 |
| F9 | Reklam İzleyerek Ücretsiz Kelime Kaydetme | **Orta** | Ücretsiz | Faz 2 |
| F10 | İsteğe Bağlı Cloud Sync | Düşük | Premium | Faz 3 |

---

## 2. CLAUDE CODE PROJE YAPILANDIRMASI

Bu bölüm, Claude Code ajanının projeyi doğru başlatabilmesi ve tutarlı kod üretebilmesi için gerekli tüm yapılandırma dosyalarını içerir.

### 2.1 CLAUDE.md Dosyası

Projenin kök dizinine yerleştirilecek CLAUDE.md dosyasının tam içeriği:

```markdown
# LinguaCard - Dil Ogrenme Mobil Uygulamasi

## Proje Ozeti
Ingilizce-Turkce flashcard tabanli dil ogrenme uygulamasi.
Local-first mimari: tum kullanici verisi cihazda saklanir.
Backend YOKTUR. Auth sistemi YOKTUR.

## Tech Stack
- Runtime: React Native 0.76+ with Expo SDK 52
- Language: TypeScript (strict mode)
- State: Zustand (in-memory) + expo-sqlite (persistence)
- Navigation: Expo Router (file-based)
- Local DB: expo-sqlite/next (synchronous API)
- Payments: RevenueCat (iOS/Android IAP)
- Ads: Google AdMob (rewarded video)
- TTS: expo-speech
- Animations: react-native-reanimated 3.x
- Styling: NativeWind 4.x (Tailwind for RN)

## KRITIK: Backend/Auth/Supabase/Firebase KULLANMA
Tum veri cihazdaki SQLite'da saklanir. Auth YOK. API YOK.

## Key Directories
- app/              -> Expo Router ekranlari
- components/cards/ -> FlashCard, CardFront, CardBack
- components/ui/    -> HighlightedText, SpeakButton, LearnedButton
- stores/           -> Zustand stores
- services/         -> SQLite, TTS, RevenueCat, AdMob
- hooks/            -> Custom hooks
- constants/        -> 100 kelime, tema, config
- types/            -> TypeScript types
- db/               -> SQLite schema + seed

## Code Style
- Functional components + hooks ONLY
- Named exports, ES modules
- NativeWind className (NO inline styles)
- Components under 150 lines
- Zustand selectors for state

## Commands
- Dev:       npx expo start
- iOS:       npx expo run:ios
- Android:   npx expo run:android
- Lint:      npx eslint . --fix
- TypeCheck: npx tsc --noEmit
- Test:      npx jest

## Gotchas
- expo-speech: Android Expo Go'da calismaz -> dev build
- RevenueCat: native build gerekli
- AdMob: dev'de test ad unit ID kullan
- expo-sqlite/next: synchronous API (useSQLiteContext)
- FlashCard: rotateY + backfaceVisibility:'hidden' SART
```

### 2.2 Proje Dizin Yapısı

> Aşağıdaki ağaç **gerçekte var olan** yapıdır (denetim sonrası).

```
linguacard/
  CLAUDE.md
  ANALYSIS.md                    # Bu dokuman
  REVIEW-FIXES.md                # Denetim sonrasi degisiklikler + gerekceler
  SUBMISSION-TODO.md             # Gonderim oncesi kullanici gorevleri
  app.config.ts                  # Native + runtime config (app.json YOK)
  .env / .env.example            # Public client key'ler (gitignored)
  eslint.config.js / tsconfig.json / package.json
  babel.config.js / metro.config.js / tailwind.config.js

  app/
    _layout.tsx                  # Root: config guard, AdMob+RC init, SQLiteProvider
    +not-found.tsx               # Temali 404
    +html.tsx                    # Web-only
    (tabs)/
      _layout.tsx                # Tab navigator
      index.tsx                  # Kart gorunumu (ana ekran)
      learned.tsx                # Ogrenilen kelimeler
      custom-words.tsx           # Ozel kelime ekleme
      settings.tsx               # Ayarlar + abonelik

  components/
    ErrorBoundary.tsx            # Expo Router root error boundary
    cards/
      FlashCard.tsx              # Flip animation (responsive)
      CardFront.tsx              # EN kelime + cumle
      CardBack.tsx               # TR kelime + cumle
    ui/
      HighlightedText.tsx        # Kelime vurgulama
      AdRewardButton.tsx         # Reklam izle butonu
      SubscriptionBanner.tsx
      SubscriptionDisclosure.tsx # Guideline 3.1.2 yasal bildirim
    settings/
      SettingsCard.tsx           # Paylasilan kart yuzeyi
      SubscriptionHeroCard.tsx
      StatsCard.tsx
      LegalCard.tsx              # Privacy / Terms / Support linkleri

  stores/
    wordStore.ts                 # Kelime state + computeTotals()
    subscriptionStore.ts         # Abonelik + fiyat + reklam hakki
    themeStore.ts                # Koyu/acik tema
    languageStore.ts             # TR/EN arayuz dili

  services/
    database.ts                  # SQLite init, schema, seed, CRUD
    tts.ts                       # expo-speech wrapper (onSettled callback'li)
    revenuecat.ts / .web.ts      # RevenueCat IAP + entitlement listener
    admob.ts / .web.ts           # AdMob rewarded (timeout + AdResult union)

  hooks/
    useDeckTotals.ts             # Memoized sayaclar (zustand v5 guvenli)
    useRewardedAd.ts             # Reklam izleme
    useSpeakPulse.ts             # TTS + senkron pulse animasyonu
    useTheme.ts / useTranslation.ts

  constants/
    words.ts                     # 100 temel kelime
    theme.ts                     # light/dark palet
    translations.ts              # TR/EN (124 anahtar, tam parite)
    config.ts / .web.ts          # Runtime config + assertReleaseConfig()

  types/
    word.ts / subscription.ts

  db/
    schema.ts                    # SQLite CREATE TABLE (seed database.ts icinde)

  utils/
    locale.ts                    # expo-localization tabanli dil/bolge
    sanitize.ts                  # Kullanici girdisi temizligi

  plugins/
    withInfoPlistCleanup.js      # Istenmeyen Info.plist anahtarlarini kaldirir

  __tests__/                     # 4 suite / 20 test
    sanitize.test.ts / wordStore.test.ts
    translations.test.ts / words.test.ts

  ios/  android/                 # GENERATED — gitignored, ELLE DUZENLEME
```

> **Planlanandan sapmalar:** `SpeakButton`, `LearnedButton`, `ProgressBar`,
> `layout/TabBar` ayrı dosyalar olarak çıkarılmadı — ilgili ekran/kart
> bileşenlerinin içinde kaldılar. `db/seed.ts` ayrılmadı, seed mantığı
> `services/database.ts` içinde. `useFlashCard`, `useWordProgress`,
> `useSubscription`, `useDatabase` hook'ları yerine store selector'ları ve
> `useSQLiteContext()` doğrudan kullanıldı.

---

## 3. VERİ MİMARİSİ: LOCAL SQLite

Tüm veriler `expo-sqlite` paketi ile cihaz üzerindeki SQLite veritabanında saklanır.
(SDK 55'te `/next` alt yolu yoktur; async API kullanılır: `getAllAsync`, `runAsync`, `getFirstAsync`.)

> **Neden expo-sqlite/next?** expo-sqlite/next, Expo SDK 51+ ile gelen yeni synchronous SQLite API'dir. useSQLiteContext() ile doğrudan erişim sağlar, transaction desteği güçlüdür ve React Suspense ile uyumludur. AsyncStorage yerine SQLite: ilişkisel sorgular, index desteği, limitsiz veri boyutu ve daha iyi performans.

### 3.1 SQLite Tablo Şeması

db/schema.ts dosyasında tanımlanacak SQL ifadeleri:

```typescript
// db/schema.ts
export const CREATE_TABLES_SQL = `

  CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    en_word TEXT NOT NULL,
    tr_word TEXT NOT NULL,
    en_sentence TEXT NOT NULL,
    tr_sentence TEXT NOT NULL,
    difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 3),
    sort_order INTEGER NOT NULL UNIQUE,
    is_learned INTEGER DEFAULT 0,
    learned_at TEXT,
    review_count INTEGER DEFAULT 0,
    last_seen_at TEXT
  );

  CREATE TABLE IF NOT EXISTS custom_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    en_word TEXT NOT NULL,
    tr_word TEXT NOT NULL,
    en_sentence TEXT NOT NULL,
    tr_sentence TEXT NOT NULL,
    is_learned INTEGER DEFAULT 0,
    learned_at TEXT,
    source TEXT DEFAULT 'premium' CHECK (source IN ('premium','rewarded_ad')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS ad_rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    words_earned INTEGER DEFAULT 3,
    watched_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_words_learned ON words(is_learned);
  CREATE INDEX IF NOT EXISTS idx_words_sort ON words(sort_order);
  CREATE INDEX IF NOT EXISTS idx_custom_source ON custom_words(source);
`;
```

### 3.2 Database Service

services/database.ts dosyasındaki temel CRUD işlemleri:

```typescript
// services/database.ts
import * as SQLite from 'expo-sqlite/next';
import { CREATE_TABLES_SQL } from '../db/schema';
import { INITIAL_WORDS } from '../constants/words';

export async function initDatabase(db: SQLite.SQLiteDatabase) {
  await db.execAsync(CREATE_TABLES_SQL);
  await seedWordsIfEmpty(db);
}

async function seedWordsIfEmpty(db: SQLite.SQLiteDatabase) {
  const count = db.getFirstSync<{cnt:number}>(
    'SELECT COUNT(*) as cnt FROM words'
  );
  if (count && count.cnt > 0) return;

  for (const w of INITIAL_WORDS) {
    db.runSync(
      `INSERT INTO words
       (en_word,tr_word,en_sentence,tr_sentence,difficulty,sort_order)
       VALUES (?,?,?,?,?,?)`,
      [w.en_word, w.tr_word, w.en_sentence, w.tr_sentence,
       w.difficulty, w.sort_order]
    );
  }
}

// Ogrenilmemis kelimeler
export function getUnlearnedWords(db: SQLite.SQLiteDatabase) {
  return db.getAllSync<Word>(
    'SELECT * FROM words WHERE is_learned=0 ORDER BY sort_order'
  );
}

// Ogrenilmis kelimeler
export function getLearnedWords(db: SQLite.SQLiteDatabase) {
  return db.getAllSync<Word>(
    'SELECT * FROM words WHERE is_learned=1 ORDER BY learned_at DESC'
  );
}

// Ogrenildi olarak isaretle
export function markWordAsLearned(db: SQLite.SQLiteDatabase, id: number) {
  db.runSync(
    `UPDATE words SET is_learned=1, learned_at=datetime('now'),
     review_count=review_count+1 WHERE id=?`, [id]
  );
}

// Tekrar ogrenilecek olarak isaretle
export function markWordAsUnlearned(db: SQLite.SQLiteDatabase, id: number) {
  db.runSync(
    'UPDATE words SET is_learned=0, learned_at=NULL WHERE id=?', [id]
  );
}

// Ozel kelime ekle
export function addCustomWord(db: SQLite.SQLiteDatabase, w: NewCustomWord) {
  db.runSync(
    `INSERT INTO custom_words
     (en_word,tr_word,en_sentence,tr_sentence,source)
     VALUES (?,?,?,?,?)`,
    [w.en_word, w.tr_word, w.en_sentence, w.tr_sentence, w.source]
  );
}

// Reklam hakki hesapla
export function getRemainingAdWordSlots(db: SQLite.SQLiteDatabase): number {
  const earned = db.getFirstSync<{t:number}>(
    'SELECT COALESCE(SUM(words_earned),0) as t FROM ad_rewards'
  );
  const used = db.getFirstSync<{t:number}>(
    `SELECT COUNT(*) as t FROM custom_words WHERE source='rewarded_ad'`
  );
  return (earned?.t ?? 0) - (used?.t ?? 0);
}

// Reklam odulu kaydet
export function recordAdReward(db: SQLite.SQLiteDatabase) {
  db.runSync('INSERT INTO ad_rewards (words_earned) VALUES (3)');
}
```

### 3.3 SQLiteProvider Entegrasyonu

```typescript
// app/_layout.tsx
import { SQLiteProvider } from 'expo-sqlite/next';
import { Suspense } from 'react';
import { initDatabase } from '../services/database';

export default function RootLayout() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SQLiteProvider databaseName="linguacard.db" onInit={initDatabase}>
        <Tabs> {/* tab screens */} </Tabs>
      </SQLiteProvider>
    </Suspense>
  );
}
```

### 3.4 TypeScript Tip Tanımları

```typescript
// types/word.ts
export interface Word {
  id: number;
  en_word: string;
  tr_word: string;
  en_sentence: string;
  tr_sentence: string;
  difficulty: 1 | 2 | 3;
  sort_order: number;
  is_learned: 0 | 1;       // SQLite boolean: 0=false, 1=true
  learned_at: string | null;
  review_count: number;
  last_seen_at: string | null;
}

export interface CustomWord {
  id: number;
  en_word: string;
  tr_word: string;
  en_sentence: string;
  tr_sentence: string;
  is_learned: 0 | 1;
  learned_at: string | null;
  source: 'premium' | 'rewarded_ad';
  created_at: string;
}

export type NewCustomWord = Pick<CustomWord,
  'en_word' | 'tr_word' | 'en_sentence' | 'tr_sentence' | 'source'>;
```

> **SQLite Boolean Uyarısı:** SQLite'da native boolean yoktur. 0=false, 1=true olarak INTEGER saklanır. TypeScript'te `0|1` kullan, UI'da `Boolean(word.is_learned)` ile dönüştür. WHERE koşullarında `=0` veya `=1` kullan, `=true`/`=false` KULLANMA.

---

## 4. COMPONENT MİMARİSİ VE UI DETAYLARI

### 4.1 FlashCard Bileşeni

react-native-reanimated ile 3D flip animasyonu. Uygulamanın en kritik UI parçasıdır.

#### 4.1.1 Kart Ön Yüzü (CardFront)

- İngilizce kelime: 24pt, bold, #1A1A2E
- İngilizce cümle: 16pt, normal, #555555
- Hedef kelime cümlede: #1565C0 mavi, bold (HighlightedText ile)
- Kelimeye tıklayınca: expo-speech ile İngilizce telaffuz
- Speaker ikonu kelime yanında, ses oynarken pulse animasyonu

#### 4.1.2 Kart Arka Yüzü (CardBack)

- Türkçe kelime: 24pt, bold, #1A1A2E
- Türkçe cümle: 16pt, normal, #555555
- Hedef kelime cümlede: #E65100 turuncu, bold
- "Öğrendim" butonu: kartın altında, yeşil, tam genişlik

#### 4.1.3 Flip Animasyon

```typescript
// FlashCard.tsx
const FLIP_DURATION = 400;
const SPRING_CONFIG = { damping: 15, stiffness: 120, mass: 1 };

// rotation = useSharedValue(0)
// On yuz: rotateY(rotation), opacity: rotation < 90 ? 1 : 0
// Arka yuz: rotateY(rotation+180), opacity: rotation >= 90 ? 1 : 0
// Her iki yuzde backfaceVisibility: 'hidden' ZORUNLU
// Flip: rotation.value = withSpring(isFlipped ? 0 : 180, SPRING_CONFIG)
```

### 4.2 HighlightedText

```typescript
// Props: sentence, targetWord, highlightColor, onWordPress?
//
// Algoritma:
// 1. sentence icinde targetWord bul (case-insensitive)
// 2. Cumleyi 3 parcaya bol: [onceki, kelime, sonraki]
// 3. Kelimeye {color: highlightColor, fontWeight: 'bold'} uygula
// 4. Kelimeye Pressable wrap -> onWordPress (TTS tetikle)
//
// Edge case: birden fazla eslesme -> sadece ILK esleme
// Edge case: esleme yoksa -> cumlenin tamamini normal goster
```

### 4.3 Ekran Akış Tablosu

| Ekran | Route | Bileşenler | Erişim |
|-------|-------|------------|--------|
| **Ana Sayfa** | app/index.tsx | FlashCard, ProgressBar | Herkes |
| **Öğrenilenler** | app/learned.tsx | WordList, RestoreButton | Herkes |
| **Kelime Ekle** | app/custom-words.tsx | AddWordForm, AdRewardBtn | Premium/Reklam |
| **Ayarlar** | app/settings.tsx | SubscriptionCard, Stats | Herkes |

---

## 5. İŞ MANTIĞI VE KURALLARI

### 5.1 Kelime Akış Yönetimi

1. Uygulama açılışında SQLiteProvider veritabanını başlatır ve seed kontrol eder
2. words tablosundan `is_learned=0` olan kelimeler `sort_order` sırasına göre çekilir
3. Kullanıcıya ilk öğrenilmemiş kelime kartı gösterilir
4. Karta tıklanır veya swipe edilir → flip animasyonu → arka yüz
5. "Öğrendim" tıklanır → `markWordAsLearned()` → kart kaybolur → sonraki kart
6. Öğrenilenler sekmesinde `learned_at DESC` sırasıyla liste
7. "Tekrar Öğren" → `markWordAsUnlearned()` → kelime ana havuza döner
8. `custom_words` tablosundaki kelimeler ayrı bölümde aynı akışla gösterilir

### 5.2 Monetizasyon Kuralları

**Ücretsiz Katman:**
- 100 temel kelime + öğrendim/tekrar + TTS tam erişim
- Özel kelime ekleme YOK (paywall gösterilir)

**Premium (aylık abonelik):**
- Sınırsız özel kelime ekleme (`source='premium'`)
- RevenueCat SDK ile cihaz bazlı kontrol (backend gereksiz)
- Entitlement açılışta kontrol edilir + `addCustomerInfoUpdateListener` ile canlı takip

> ⚠️ **Fiyat asla kodda sabitlenmez.** Gösterilen fiyat yalnızca StoreKit'ten
> gelebilir (`product.priceString`). Sabit bir `$1` / `₺10` etiketi, diğer
> storefront'larda yanlış olur ve Apple bunu yanıltıcı fiyatlandırma sayar.
> (Denetimde bulunan ve giderilen bir hataydı — bkz. `REVIEW-FIXES.md` §3.1.)

**Reklam ile Kelime (1 Reklam = 3 Kelime):**
- AdMob rewarded video izlenerek hak kazanılır
- Hak = `SUM(ad_rewards.words_earned) - COUNT(custom_words WHERE source='rewarded_ad')`
- Hak <= 0 ise yeni kelime ekleme engellenir

> **Reklam Hakkı Hesaplama:** `getRemainingAdWordSlots()` her kelime ekleme
> denemesinde ve ekran odağında (`useFocusEffect`) çağrılır. Uygulama verisi
> sıfırlanırsa haklar da sıfırlanır — düşük değerli ekonomide kabul edilebilir
> trade-off. Jailbreak'li cihazda DB dosyası düzenlenerek hak üretilebilir; bu da
> bilinçli bir kabul (kullanıcı yalnızca kendi cihazında kendi kotasını açar,
> sunucu maliyeti yok). Asıl gelir kapısı olan premium entitlement RevenueCat
> üzerinden sunucu tarafında doğrulanır.

**Reklam akışı sözleşmesi:** `showRewardedAd()` **her zaman** resolve eder
(20 sn timeout) ve `'rewarded' | 'dismissed' | 'unavailable'` döner. Üç durumun
da kullanıcıya bir karşılığı olmalıdır — sessiz başarısızlık, butonun bozuk
görünmesine ve Guideline 2.1 reddine yol açar.

---

## 6. TEXT-TO-SPEECH ENTEGRASYONU

`services/tts.ts` `speakWord(text, lang, { onSettled })` imzasını kullanır.
`onSettled`, `onDone` / `onStopped` / `onError` durumlarının üçünde de **tam bir
kez** tetiklenir.

- Ön yüz: `speakWord(en_word, 'en')` | Arka yüz: `speakWord(tr_word, 'tr')`
- Pulse animasyonu `hooks/useSpeakPulse.ts` içinde; animasyon sabit bir süreyle
  değil, **konuşma bitince** durur ve unmount'ta temizlenir
- Çakışma varsa önce durdur, sonra yenisini başlat
- Tüm çağrılar try/catch içinde — expo-speech bazı cihazlarda (Android Expo Go)
  mevcut değil

> Denetim öncesi burada temizlenmeyen bir `setTimeout(…, 1200)` vardı; unmount
> olmuş component'in shared value'suna yazıyordu. Bkz. `REVIEW-FIXES.md` §4.3.

---

## 7. 100 TEMEL KELİME VERİ YAPISI

```typescript
// constants/words.ts - Ornek format
export const INITIAL_WORDS: SeedWord[] = [
  {
    en_word: 'time',
    tr_word: 'zaman',
    en_sentence: 'I don\'t have enough time to finish this.',
    tr_sentence: 'Bunu bitirmek icin yeterli zamanim yok.',
    difficulty: 1,
    sort_order: 1,
  },
  {
    en_word: 'people',
    tr_word: 'insanlar',
    en_sentence: 'Many people enjoy traveling in summer.',
    tr_sentence: 'Bircok insan yazin seyahat etmekten hoslanir.',
    difficulty: 1,
    sort_order: 2,
  },
  // ... toplam 100 kelime
];
```

### 7.1 Seçim Kriterleri

- Oxford 3000'den en sık kullanılanlar
- Cümleler 8-15 kelime, doğal diyalog tarzında
- Türkçe çeviriler doğal ifadeler (birebir değil)
- Dağılım: difficulty 1=40, 2=35, 3=25 kelime
- Hedef kelime her cümlede tam 1 kez geçmeli

> **Subagent Stratejisi:** 100 kelime üretimi için: Ana ajan listeyi belirler → Subagent 1: sort_order 1-50 → Subagent 2: sort_order 51-100 → Ana ajan birleştirip tip kontrolü yapar.

---

## 8. STATE YÖNETİMİ (ZUSTAND + SQLite)

İki katmanlı state: Zustand (hızlı UI) + SQLite (kalıcılık). Her action önce SQLite'a yazar, sonra Zustand'ı günceller.

### 8.1 wordStore

```typescript
// stores/wordStore.ts
interface WordState {
  words: Word[];
  learnedWords: Word[];
  customWords: CustomWord[];
  currentIndex: number;
  isLoading: boolean;

  loadWords: (db: SQLiteDatabase) => Promise<void>;
  markAsLearned: (db: SQLiteDatabase, wordId: number) => Promise<void>;
  markAsUnlearned: (db: SQLiteDatabase, wordId: number) => Promise<void>;
  addCustomWord: (db: SQLiteDatabase, word: NewCustomWord) => Promise<void>;
  nextCard: () => void;
  prevCard: () => void;
}

// ONEMLI: Her action su adimlari izler:
// 1) SQLite CRUD -> 2) set() -> 3) UI re-render
```

### 8.2 subscriptionStore

```typescript
// stores/subscriptionStore.ts
interface SubscriptionState {
  isPremium: boolean;
  remainingAdWords: number;
  isLoading: boolean;

  checkSubscription: () => Promise<void>;   // RevenueCat SDK
  purchaseMonthly: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  watchAd: (db: SQLiteDatabase) => Promise<boolean>;        // AdMob + recordAdReward
  refreshAdWordCount: (db: SQLiteDatabase) => Promise<void>; // getRemainingAdWordSlots
}
```

---

## 9. CLAUDE CODE AJAN TALİMATLARI

> **Durum notu:** Faz 1 ve Faz 2 uygulandı. Aşağıdaki görev listeleri artık
> *yapılacak iş* değil, *neyin neden yapıldığının* kaydıdır. Faz 2 sonrası
> yapılan App Store denetimi düzeltmeleri için `REVIEW-FIXES.md`.

### 9.1 Faz 1: MVP  ✅ TAMAMLANDI

1. `npx create-expo-app@latest linguacard --template tabs`
2. `npx expo install expo-sqlite react-native-reanimated nativewind expo-speech expo-router`
3. `npm install zustand tailwindcss`
4. tsconfig strict mode + babel NativeWind preset
5. types/ dizininde tip tanımları (Bölüm 3.4)
6. db/schema.ts SQLite şeması (Bölüm 3.1)
7. constants/words.ts 100 kelime verisi (Bölüm 7 — subagent)
8. services/database.ts CRUD fonksiyonları (Bölüm 3.2)
9. app/_layout.tsx SQLiteProvider + tabs (Bölüm 3.3)
10. stores/wordStore.ts (Bölüm 8.1)
11. components/ui/HighlightedText.tsx (Bölüm 4.2)
12. services/tts.ts (Bölüm 6)
13. components/cards/ CardFront + CardBack (Bölüm 4.1)
14. components/cards/FlashCard.tsx flip animasyonu (Bölüm 4.1.3)
15. app/index.tsx ana ekran + swipe + progress bar
16. app/learned.tsx öğrenilen kelimeler + tekrar öğren
17. Tab bar ayarla + lint + type check + testler

### 9.2 Faz 2: Monetizasyon  ✅ TAMAMLANDI

1. `npx expo install expo-ads-admob react-native-purchases`
2. services/revenuecat.ts + services/admob.ts
3. stores/subscriptionStore.ts (Bölüm 8.2)
4. hooks/useRewardedAd.ts
5. app/custom-words.tsx + paywall + reklam butonu
6. app/settings.tsx abonelik yönetimi
7. SubscriptionBanner + AdRewardButton bileşenleri
8. Tüm akışı test ad ID + sandbox IAP ile test et

### 9.3 Faz 3: Cloud Sync (Gelecek)  ⏸ BAŞLANMADI

- İsteğe bağlı Supabase/Firebase entegrasyonu
- SQLite → Cloud tek yönlü sync (cihaz master)
- Bu faz için ayrı teknik doküman hazırlanacak

### 9.4 Context Yönetimi

- Her yeni görev öncesi `/clear` ile bağlamı sıfırla
- Bileşen tamamlanınca `/compact` ile özetle
- 100 kelime verisi subagent'lara delege et
- Her dosya sonrası `npx tsc --noEmit`
- Her 3-4 dosyadan sonra `npx eslint . --fix`
- Tek seferde 1 dosya, tamamlanınca sonrakine geç

---

## 10. CLAUDE CODE CUSTOM SKILLS

### 10.1 add-word

```markdown
# .claude/skills/add-word/SKILL.md
---
name: add-word
description: Add a new word pair with EN/TR sentences
allowed-tools: Read, Edit, Bash(npx:*)
---

1. Parse from $ARGUMENTS ("en_word:tr_word")
2. Generate EN sentence (8-15 words)
3. Generate TR sentence
4. Add to constants/words.ts
5. Run npx tsc --noEmit
```

### 10.2 new-component

```markdown
# .claude/skills/new-component/SKILL.md
---
name: new-component
description: Scaffold React Native component with LinguaCard conventions
allowed-tools: Read, Write, Bash(npx:*)
---

- Functional + TypeScript props interface
- NativeWind className (NO inline styles)
- Named export, under 150 lines
- Place in correct components/ subdirectory
```

### 10.3 db-migrate

```markdown
# .claude/skills/db-migrate/SKILL.md
---
name: db-migrate
description: Add table/column to local SQLite schema
allowed-tools: Read, Edit, Bash(npx:*)
---

1. Read db/schema.ts
2. Add CREATE TABLE IF NOT EXISTS (idempotent)
3. Update types/
4. Add CRUD to services/database.ts
5. IMPORTANT: SQLite has no DROP COLUMN
```

---

## 11. CLAUDE CODE HOOKS

```json
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "[ \"$(git branch --show-current)\" != \"main\" ] || exit 2",
        "timeout": 5
      }]
    }],
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "npx eslint --fix $FILE_PATH 2>/dev/null; npx tsc --noEmit 2>&1 | head -20",
        "timeout": 30
      }]
    }]
  }
}
```

---

## 12. TEST STRATEJİSİ

**Mevcut durum:** Jest (`jest-expo` preset) kurulu, **4 suite / 20 test** geçiyor.
`npm test` veya `npm run verify` ile çalışır.

| Dosya | Test Kapsamı | Durum |
|-------|-------------|-------|
| `__tests__/sanitize.test.ts` | kontrol/bidi karakter temizliği, uzunluk kırpma, TR karakter korunumu | ✅ 7 test |
| `__tests__/wordStore.test.ts` | `computeTotals` sayaç tutarlılığı, custom kelime dahil etme, %0 ve %100 sınırları | ✅ 4 test |
| `__tests__/translations.test.ts` | TR/EN anahtar paritesi, boş string yok, tüm hata kodları, zorunlu abonelik disclosure metni | ✅ 4 test |
| `__tests__/words.test.ts` | 100 kelime, benzersiz `sort_order`, boş alan yok, geçerli `difficulty`, hedef kelimenin kendi cümlesinde geçmesi | ✅ 5 test |

**Henüz yazılmamış (öncelik sırasıyla):**

| Hedef | Kapsam | Mock |
|-------|--------|------|
| `database.ts` | init, seed, CRUD, hak hesaplama | expo-sqlite (in-memory) |
| `admob.ts` | timeout, listener temizliği, `AdResult` dalları | react-native-google-mobile-ads |
| `revenuecat.ts` | entitlement parse, restore, listener unsubscribe | react-native-purchases |
| `HighlightedText` | vurgulama, case-insensitive, eşleşmeme fallback'i | Yok |
| `FlashCard` | flip, responsive boyut | reanimated |

> **Statik analiz:** `npm run typecheck` (tsc strict) ve `npm run lint` (ESLint)
> temiz olmalı. `react-hooks/exhaustive-deps` bilinçli olarak **error**
> seviyesinde — bu projede eksik deps gerçek buglara yol açtı.

---

## 13. DEPLOYMENT

- iOS: EAS Build → App Store Connect
- Android: EAS Build → Google Play Console (AAB)
- Backend env vars YOK (local-first avantajı)
- CI/CD: GitHub Actions → `npm run verify` → EAS Build
- OTA: `EXUpdatesEnabled: false` — mağaza build'i deterministik olsun diye
  kapalı. Açmak istersen `expo-updates` yapılandırması gerekir.

### 13.1 Yapılandırma zinciri

```
.env  ->  app.config.ts (extra + ios.infoPlist)  ->  constants/config.ts
                        |
                        +-> npm run prebuild -> ios/Info.plist
```

Env değişkenleri (hepsi `EXPO_PUBLIC_` önekli, hepsi **public client key**):

| Değişken | Kullanım |
|---|---|
| `EXPO_PUBLIC_RC_IOS_KEY` / `_RC_ANDROID_KEY` | RevenueCat SDK |
| `EXPO_PUBLIC_ADMOB_IOS_APP_ID` / `_ANDROID_APP_ID` | Info.plist `GADApplicationIdentifier` |
| `EXPO_PUBLIC_ADMOB_IOS_REWARDED_ID` / `_ANDROID_REWARDED_ID` | Rewarded ad unit |
| `EXPO_PUBLIC_PRIVACY_POLICY_URL` / `_TERMS_URL` / `_SUPPORT_URL` | Ayarlar → Yasal kartı |

> ⚠️ RevenueCat **secret** key'i (`sk_...`) asla uygulamaya girmez.
> EAS Build kullanılıyorsa aynı değişkenler **EAS Secrets** olarak da tanımlanmalı.

### 13.2 CNG uyarısı

`ios/` ve `android/` klasörleri git'te izlenmiyor ve `expo prebuild` her
çalıştığında yeniden üretiliyor. **Native ayarlar için tek doğru yer
`app.config.ts`.** Expo şablonunun eklediği istenmeyen anahtarlar
`plugins/withInfoPlistCleanup.js` config plugin'i ile kaldırılıyor.

### 13.3 Release guard

`constants/config.ts` içindeki `assertReleaseConfig()`, `app/_layout.tsx`'te
açılışta çağrılır:

- **Release build:** eksik config varsa **hata fırlatır** — placeholder'lı bir
  binary üretilemez (denetimde bulunan en kritik sorun buydu)
- **Dev build:** sadece uyarır, `.env` olmadan geliştirme yapılabilir

---

## 14. SONUÇ

### 14.1 Mimari Karşılaştırma

| Kriter | Önceki (Supabase) | Güncel (Local) |
|--------|--------------------|----------------|
| Backend Maliyeti | ~$25-50/ay | **$0** |
| Auth | Supabase Auth | **Gerekli değil** |
| Offline | Hayır | **Tam destek** |
| Geliştirme Süresi | ~4-5 hafta | **~2-3 hafta** |
| Veri Kalıcılığı | Cloud (güvenli) | Cihaz (sıfırlanabilir) |
| Cihaz Değişimi | Otomatik sync | Faz 3'te çözülecek |

### 14.2 Faz Durumu

| Faz | Kapsam | Durum |
|-----|--------|-------|
| Faz 1 | MVP: 100 kelime, flip kart, TTS, öğrendim/tekrar | ✅ Tamamlandı |
| Faz 2 | Monetizasyon: RevenueCat aboneliği, AdMob ödüllü reklam, özel kelimeler | ✅ Tamamlandı |
| — | **App Store hazırlık denetimi** (5 Critical / 7 High / 13 Medium / 8 Low) | ✅ Kod tarafı giderildi |
| — | Gönderim öncesi konsol/hukuk işleri | ⏳ `SUBMISSION-TODO.md` |
| Faz 3 | Cloud Sync | ⏸ Başlanmadı |

> **Faz 3 uyarısı:** Bulut senkronizasyonu için üçüncü taraf login (Google,
> Facebook vb.) eklenirse **Sign in with Apple** (Guideline 4.8) *ve*
> **uygulama içi hesap silme** (Guideline 5.1.1(v)) aynı anda zorunlu hale gelir.
> İkisi de şu an gerekmiyor çünkü uygulamada hiç hesap sistemi yok.

### 14.3 Önemli Hatırlatmalar

**Mimari kısıtlar (değiştirilemez):**
- CLAUDE.md'deki "Backend/Auth KULLANMA" talimatı en kritik kısıtlamadır
- Kodda tek bir `fetch`/`axios` çağrısı yok; böyle kalmalı
- `ios/` klasörü elle düzenlenmez — `app.config.ts` → `npm run prebuild`

**Denetimden çıkan, kolayca geri kırılabilecek kararlar:**
- `computeTotals()` bir zustand selector'ı **değildir** (v5 snapshot cache'ini
  bozar) — `hooks/useDeckTotals.ts` üzerinden kullanılır
- Fiyat yalnızca StoreKit'ten gelir; hardcoded fiyat eklenmez
- `showRewardedAd()` her zaman resolve eder; her sonuç kullanıcıya bildirilir
- `wordStore.isLoading` `true` ile başlar + `hasLoaded` bayrağı vardır
  (yoksa açılışta "Tebrikler, hepsini öğrendiniz" ekranı yanıp söner)
- Boyutlar `useWindowDimensions()` ile alınır, modül seviyesinde
  `Dimensions.get()` ile değil
- `requestNonPersonalizedAdsOnly: true` + ATT yok + `NSPrivacyTracking: false`
  üçlüsü birlikte değişir

**Süreç:**
- Her commit öncesi `npm run verify`
- SKAdNetwork listesi her release öncesi Google'ın sayfasından tazelenmeli
- Proje büyüdükçe CLAUDE.md, ANALYSIS.md ve `REVIEW-FIXES.md` güncellenmelidir

### 14.4 İlgili Dokümanlar

| Dosya | İçerik |
|---|---|
| `CLAUDE.md` | Ajan için kısa kurallar, komutlar, tuzaklar |
| `REVIEW-FIXES.md` | Denetim sonrası her değişikliğin gerekçesi |
| `SUBMISSION-TODO.md` | Gönderim öncesi kullanıcı görevleri + açık sorular |
