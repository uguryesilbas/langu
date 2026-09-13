# LinguaCard Design System

Bu dosya LinguaCard uygulamasının tüm tasarım kararlarını, renk tokenlarını, component pattern'larını ve ekran yapılarını belgeler. Yeni bir geliştirme yaparken bu dokümana uygun kalınmalıdır.

---

## Renk Tokenları

| Token | Hex | Kullanım |
|-------|-----|----------|
| Primary Blue | `#1565C0` | Ana buton, vurgu, shadow, header |
| Gold Accent | `#FFD54F` | İkincil vurgu, progress bar dolu kısım, aktif tab göstergesi |
| Light Blue | `#90CAF9` | İkincil metin, pasif label, küçük açıklama |
| Background | `#F0F4FF` | Tüm ekranların arka planı |
| Card Tint | `#EEF4FF` | Buton arka planı, badge, pill, istatistik kutusu |
| Divider | `#DCE8FF` | Yatay çizgiler, ince kenarlıklar |
| Text Primary | `#1A1A2E` | Başlık, kelime metni |
| Text Secondary | `#555555` | Normal metin |
| Text Muted | `#9E9E9E` | Açıklama, placeholder |
| White Card | `#FFFFFF` | Kart arka planı |
| Orange Accent | `#E65100` | Reklam / rewarded ad teması |
| Purple Accent | `#7B1FA2` | Premium kaynaklı özel kelime teması |

---

## Gölge Standardı

Tüm kartlarda `shadowColor: '#1565C0'` kullanılır. Siyah (`#000`) gölge KESİNLİKLE kullanılmaz.

```js
// Küçük kart gölgesi
shadowColor: '#1565C0',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.08,
shadowRadius: 8,
elevation: 3,

// Orta kart gölgesi
shadowColor: '#1565C0',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.12,
shadowRadius: 12,
elevation: 6,

// Hero kart gölgesi (mavi arka planlı)
shadowColor: '#1565C0',
shadowOffset: { width: 0, height: 6 },
shadowOpacity: 0.35,
shadowRadius: 14,
elevation: 10,

// FlashCard gölgesi
shadowColor: '#1565C0',
shadowOffset: { width: 0, height: 8 },
shadowOpacity: 0.15,
shadowRadius: 20,
elevation: 8,
```

---

## Component Pattern'ları

### 1. Beyaz Liste Kartı (White List Card)

Kelime listelerinde, ayarlar kartlarında kullanılan standart beyaz kart.

```jsx
<View
  style={{
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden', // Sol accent bar için şart
  }}
>
  {/* Sol accent bar — kaynak tipine göre renklendirilir */}
  <View
    style={{
      position: 'absolute',
      left: 0, top: 0, bottom: 0,
      width: 4,
      backgroundColor: accentColor, // #1565C0 | #7B1FA2 | #E65100
    }}
  />
  <View style={{ paddingLeft: 18, paddingRight: 14, paddingVertical: 14 }}>
    {/* İçerik */}
  </View>
</View>
```

### 2. Hero Kart (Hero Card)

Mavi arka planlı öne çıkan kart. ProgressCard, SubscriptionBanner, tamamlanma ekranı.

```jsx
<View
  style={{
    backgroundColor: '#1565C0',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  }}
>
  {/* Başlık satırı — icon + label */}
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
    <Ionicons name="trophy" size={18} color="#FFD54F" />
    <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '600', marginLeft: 8, opacity: 0.9 }}>
      BAŞLIK
    </Text>
  </View>

  {/* Ana içerik — beyaz metin */}
  <Text style={{ color: '#FFFFFF', fontSize: 52, fontWeight: '800' }}>42</Text>
  <Text style={{ color: '#90CAF9', fontSize: 14 }}>açıklama</Text>

  {/* Altın buton */}
  <Pressable
    style={{
      backgroundColor: '#FFD54F',
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
    }}
  >
    <Ionicons name="star" size={16} color="#1565C0" />
    <Text style={{ color: '#1565C0', fontSize: 15, fontWeight: '700' }}>Buton Metni</Text>
  </Pressable>

  {/* Motivasyon pill */}
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
    <Ionicons name="sparkles-outline" size={13} color="#FFD54F" />
    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>Motivasyon mesajı</Text>
  </View>
</View>
```

### 3. Gold Progress Bar

```jsx
{/* Track */}
<View style={{ height: 10, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
  {/* Dolu kısım */}
  <View
    style={{
      height: 10,
      backgroundColor: '#FFD54F',
      borderRadius: 6,
      width: `${pct}%`,
    }}
  />
</View>
{/* Milestone marks */}
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  {[25, 50, 75, 100].map((mark) => (
    <Text
      key={mark}
      style={{
        fontSize: 10,
        color: pct >= mark ? '#FFD54F' : 'rgba(255,255,255,0.35)',
        fontWeight: pct >= mark ? '700' : '400',
      }}
    >
      {mark}%
    </Text>
  ))}
</View>
```

### 4. EEF4FF Pill (Badge/Tag)

```jsx
<View
  style={{
    backgroundColor: '#EEF4FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  }}
>
  <Ionicons name="checkmark-circle" size={13} color="#1565C0" />
  <Text style={{ color: '#1565C0', fontSize: 12, fontWeight: '700' }}>
    Pill içeriği
  </Text>
</View>
```

### 5. Tekrar (Restore) Butonu

```jsx
<Pressable
  onPress={onRestore}
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF4FF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  }}
>
  <Ionicons name="refresh-outline" size={14} color="#1565C0" />
  <Text style={{ color: '#1565C0', fontSize: 12, fontWeight: '700' }}>Tekrar</Text>
</Pressable>
```

### 6. SectionHeader (Bölüm Başlığı)

```jsx
<View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 12 }}>
  <View style={{ flex: 1, height: 1, backgroundColor: '#DCE8FF' }} />
  <View style={{ backgroundColor: '#EEF4FF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
    <Ionicons name="checkmark-circle" size={13} color="#1565C0" />
    <Text style={{ color: '#1565C0', fontSize: 12, fontWeight: '700' }}>{count} Kelime</Text>
  </View>
  <View style={{ flex: 1, height: 1, backgroundColor: '#DCE8FF' }} />
</View>
```

### 7. Navigasyon Butonları (Circular Nav)

```jsx
<Pressable
  onPress={onPress}
  disabled={disabled}
  style={{
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.3 : 1,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  }}
>
  <Ionicons name="chevron-back" size={20} color="#1565C0" />
</Pressable>
```

---

## FlashCard Sistemi

### FlashCard.tsx — Genel Kart Wrapper

- `borderRadius: 24`
- `shadowColor: '#1565C0'`, `shadowOpacity: 0.15`, `shadowRadius: 20`
- Ön yüz: beyaz `#FFFFFF`
- Arka yüz: açık mavi `#F0F4FF`
- Flip animasyonu: `rotateY` + `backfaceVisibility: 'hidden'` — bu ikisi ŞART

### CardFront.tsx

- Kelime: `fontSize: 34, fontWeight: '800', color: '#1A1A2E'`
- Ses ikonu: kelimenin ALTINDA, `flexDirection: 'column'`, ikon boyutu `16`, `backgroundColor: '#EEF4FF'`, `borderRadius: 16`, `padding: 5`
- Gold divider: `width: 48, height: 3, backgroundColor: '#FFD54F'`
- HighlightedText: `highlightColor="#1565C0"`, `fontSize={16}`
- Hint pill: `#EEF4FF` bg, `sync-outline` icon, `#90CAF9` renk

### CardBack.tsx

- Aynı kelime + ses ikonu yapısı (kelimenin altında)
- `justifyContent: 'space-between'` + iç `flex: 1, justifyContent: 'center'` View
- "Öğrendim" butonu: `backgroundColor: '#1565C0'`, `checkmark-circle` gold icon, white text, mavi shadow

### HighlightedText.tsx

- `<Pressable>` KULLANILMAZ — yerine `<Text onPress={...}>` kullanılır (layout bozulması önlenir)
- Tüm output `<View style={{ alignItems: 'center', width: '100%' }}>` içinde döner
- `textAlign: 'center'` her zaman uygulanır

---

## Tab Bar

```js
// _layout.tsx
tabBarActiveTintColor: '#1565C0',
tabBarInactiveTintColor: '#BDBDBD',
tabBarStyle: {
  backgroundColor: '#FFFFFF',
  borderTopWidth: 0,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  paddingBottom: 10,
  paddingTop: 0,
  height: 72,
  shadowColor: '#1565C0',
  shadowOffset: { width: 0, height: -6 },
  shadowOpacity: 0.12,
  shadowRadius: 16,
  elevation: 16,
},
```

**TabIcon komponenti** — aktif tab'da altın üst şerit göstergesi:

```jsx
function TabIcon({ name, color, size, focused }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 2 }}>
      <View
        style={{
          width: 22,
          height: 3,
          borderRadius: 2,
          backgroundColor: focused ? '#FFD54F' : 'transparent',
          marginBottom: 5,
        }}
      />
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}
```

---

## Ekran Yapısı

Header kaldırılmıştır. Her tab ekranı `SafeAreaView` ile başlar:

```jsx
import { SafeAreaView } from 'react-native-safe-area-context';

return (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F4FF' }} edges={['top']}>
    {/* içerik */}
  </SafeAreaView>
);
```

`KeyboardAvoidingView` kullanan ekranlarda SafeAreaView dışarıda olur:

```jsx
<SafeAreaView style={{ flex: 1, backgroundColor: '#F0F4FF' }} edges={['top']}>
  <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={{ flex: 1 }}>
      {/* içerik */}
    </View>
  </KeyboardAvoidingView>
</SafeAreaView>
```

---

## Tipografi

| Kullanım | fontSize | fontWeight | color |
|----------|----------|------------|-------|
| Kart kelimesi | 34 | 800 | `#1A1A2E` |
| Hero büyük sayı | 52 | 800 | `#FFFFFF` |
| Bölüm başlığı | 14-15 | 700 | `#1A1A2E` |
| Kelime (liste) | 17 | 700 | `#1A1A2E` |
| Çeviri | 14 | 600 | `#1565C0` |
| Cümle | 12 | 400 | `#9E9E9E` |
| Buton metni | 14-16 | 700 | duruma göre |
| Küçük label | 11-12 | 400-600 | `#9E9E9E` / `#90CAF9` |

---

## Genel Kurallar

1. Tüm kart gölgeleri `shadowColor: '#1565C0'` — siyah ASLA kullanılmaz
2. Ekran arka planı daima `#F0F4FF`
3. Kelime baş harfleri her zaman büyük: `word.charAt(0).toUpperCase() + word.slice(1)`
4. `<Pressable>` asla `<Text>` içine yerleştirilmez — `<Text onPress>` kullanılır
5. FlashCard'da `backfaceVisibility: 'hidden'` ŞART
6. Tüm ekranlar `SafeAreaView edges={['top']}` ile başlar
7. Fonksiyonel component + named export
8. Component 150 satırı geçmemeli
