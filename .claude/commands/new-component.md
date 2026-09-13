# Yeni Component Oluştur

`$ARGUMENTS` adında yeni bir React Native component oluştur. Aşağıdaki pattern ve kurallara uy.

---

## Dosya Konumu

- UI component → `components/ui/$ARGUMENTS.tsx`
- Kart component → `components/cards/$ARGUMENTS.tsx`

---

## Temel Şablon

```tsx
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface $ARGUMENTSProps {
  // prop tipleri
}

export function $ARGUMENTS({ }: $ARGUMENTSProps) {
  return (
    <View>
      {/* İçerik */}
    </View>
  );
}
```

**Kurallar:**
- `export function` (named export) kullan — `export default` KULLANMA
- Functional component + hooks
- 150 satır sınırı — gerekirse alt componentlere böl

---

## Renk ve Gölge Referansı

```js
// Renkler
const COLORS = {
  primary:     '#1565C0',  // Ana mavi
  gold:        '#FFD54F',  // Altın vurgu
  lightBlue:   '#90CAF9',  // İkincil metin
  background:  '#F0F4FF',  // Ekran arka planı
  cardTint:    '#EEF4FF',  // Badge / pill arka planı
  divider:     '#DCE8FF',  // Çizgi
  textMain:    '#1A1A2E',  // Ana metin
  textSub:     '#555555',  // Normal metin
  textMuted:   '#9E9E9E',  // Açıklama
  orange:      '#E65100',  // Reklam teması
  purple:      '#7B1FA2',  // Premium özel kelime
};

// Gölge — daima mavi
const shadow = {
  shadowColor: '#1565C0',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
};
```

---

## Pattern Kataloğu

### Beyaz Kart (Sol Accent Bar'lı)

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
    overflow: 'hidden',
  }}
>
  <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: accentColor }} />
  <View style={{ paddingLeft: 18, paddingRight: 14, paddingVertical: 14 }}>
    {/* içerik */}
  </View>
</View>
```

Accent rengi — kaynağa göre seç:
- Standart → `#1565C0`
- Premium → `#7B1FA2`
- Rewarded ad → `#E65100`

### Hero Kart (Mavi Arka Planlı)

```jsx
<View
  style={{
    backgroundColor: '#1565C0',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  }}
>
  {/* Başlık */}
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
    <Ionicons name="trophy" size={18} color="#FFD54F" />
    <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '600', marginLeft: 8, opacity: 0.9 }}>
      BAŞLIK
    </Text>
  </View>
  {/* İçerik */}
</View>
```

### EEF4FF Pill

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
  <Ionicons name="icon-outline" size={13} color="#1565C0" />
  <Text style={{ color: '#1565C0', fontSize: 12, fontWeight: '700' }}>Metin</Text>
</View>
```

### Altın Progress Bar

```jsx
function ProgressBar({ pct }: { pct: number }) {
  return (
    <>
      <View style={{ height: 10, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
        <View style={{ height: 10, backgroundColor: '#FFD54F', borderRadius: 6, width: `${pct}%` }} />
      </View>
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
    </>
  );
}
```

### SectionHeader

```jsx
function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 12 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: '#DCE8FF' }} />
      <View style={{ backgroundColor: '#EEF4FF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <Ionicons name="checkmark-circle" size={13} color="#1565C0" />
        <Text style={{ color: '#1565C0', fontSize: 12, fontWeight: '700' }}>{count} {label}</Text>
      </View>
      <View style={{ flex: 1, height: 1, backgroundColor: '#DCE8FF' }} />
    </View>
  );
}
```

### Animated Speaker Button (Pulse)

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, cancelAnimation } from 'react-native-reanimated';

const scale = useSharedValue(1);
const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

async function handleSpeak() {
  scale.value = withRepeat(withTiming(1.3, { duration: 300 }), 4, true);
  await speakWord(word, 'en');
  setTimeout(() => {
    cancelAnimation(scale);
    scale.value = withTiming(1, { duration: 150 });
  }, 1200);
}

// JSX — ikon kelimenin ALTINDA olacak şekilde
<Pressable
  onPress={handleSpeak}
  style={{ flexDirection: 'column', alignItems: 'center', gap: 8 }}
>
  <Text style={{ fontSize: 34, fontWeight: '800', color: '#1A1A2E' }}>{word}</Text>
  <Animated.View style={[pulseStyle, { backgroundColor: '#EEF4FF', borderRadius: 16, padding: 5 }]}>
    <Ionicons name="volume-high-outline" size={16} color="#1565C0" />
  </Animated.View>
</Pressable>
```

### HighlightedText Kuralı

`<Pressable>` asla `<Text>` içine koyma. Tıklanabilir inline metin için `<Text onPress>` kullan:

```tsx
<View style={{ alignItems: 'center', width: '100%' }}>
  <Text style={{ fontSize, color: '#555555', lineHeight: fontSize * 1.6, textAlign: 'center' }}>
    {before}
    <Text onPress={onWordPress} style={{ color: highlightColor, fontWeight: '700', fontSize }}>
      {match}
    </Text>
    {after}
  </Text>
</View>
```

---

## Checklist

- [ ] `export function` (named export)
- [ ] Props interface tanımlı
- [ ] `shadowColor: '#1565C0'` (siyah shadow yok)
- [ ] Arka plan tokenları kullanıldı (`#F0F4FF`, `#EEF4FF`, `#FFFFFF`)
- [ ] `<Pressable>` asla `<Text>` içinde değil
- [ ] Ses ikonu varsa kelimenin ALTINDA
- [ ] 150 satır altında
