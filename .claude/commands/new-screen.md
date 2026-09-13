# Yeni Ekran Oluştur

`$ARGUMENTS` adında yeni bir tab ekranı oluştur. Aşağıdaki kuralların TÜMÜNE uy.

---

## Dosya Konumu

`app/(tabs)/$ARGUMENTS.tsx`

---

## Zorunlu Yapı

```tsx
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function $ARGUMENTSScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F4FF' }} edges={['top']}>
      {/* İçerik buraya */}
    </SafeAreaView>
  );
}
```

**KeyboardAvoidingView gereken ekranlarda:**

```tsx
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function $ARGUMENTSScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F4FF' }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ flex: 1 }}>
          {/* İçerik */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
```

---

## Tasarım Kuralları

### Renkler

- Arka plan: `backgroundColor: '#F0F4FF'`
- Kart arka planı: `backgroundColor: '#FFFFFF'`
- Ana vurgu: `#1565C0`
- Altın vurgu: `#FFD54F`
- İkincil metin: `#90CAF9`
- Muted metin: `#9E9E9E`
- Tint arka plan: `#EEF4FF`

### Kart Gölgesi (daima mavi)

```js
shadowColor: '#1565C0',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.08,
shadowRadius: 8,
elevation: 3,
```

### Kart Yapısı

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
  {/* Sol accent bar (isteğe bağlı) */}
  <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: '#1565C0' }} />
  <View style={{ paddingLeft: 18, paddingRight: 14, paddingVertical: 14 }}>
    {/* İçerik */}
  </View>
</View>
```

### Hero Kart (öne çıkan alan)

```jsx
<View
  style={{
    backgroundColor: '#1565C0',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  }}
>
  <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '700' }}>Başlık</Text>
  <Text style={{ color: '#90CAF9', fontSize: 13 }}>Açıklama</Text>
</View>
```

### Tipografi

| Kullanım | fontSize | fontWeight | color |
|----------|----------|------------|-------|
| Ekran başlığı | 20 | 800 | `#1A1A2E` |
| Kart başlığı | 15-17 | 700 | `#1A1A2E` |
| Çeviri / vurgu | 14 | 600 | `#1565C0` |
| Normal metin | 13-14 | 400 | `#555555` |
| Açıklama | 12 | 400 | `#9E9E9E` |
| Buton | 14-16 | 700 | duruma göre |

### Butonlar

```jsx
{/* Primary buton */}
<Pressable
  style={{
    backgroundColor: '#1565C0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  }}
>
  <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>Buton</Text>
</Pressable>

{/* Gold / secondary buton */}
<Pressable
  style={{
    backgroundColor: '#FFD54F',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  }}
>
  <Text style={{ color: '#1565C0', fontSize: 15, fontWeight: '700' }}>Buton</Text>
</Pressable>
```

---

## Tab Bar'a Ekle

`app/(tabs)/_layout.tsx` dosyasında `<Tabs.Screen>` bloğuna ekle:

```jsx
<Tabs.Screen
  name="$ARGUMENTS"
  options={{
    headerTitle: 'Ekran Başlığı',
    tabBarLabel: 'Label',
    tabBarIcon: ({ color, size, focused }) => (
      <TabIcon name="icon-name-outline" color={color} size={size} focused={focused} />
    ),
  }}
/>
```

---

## Checklist

- [ ] `SafeAreaView edges={['top']}` ile başlıyor
- [ ] Arka plan `#F0F4FF`
- [ ] Tüm gölgeler `shadowColor: '#1565C0'`
- [ ] Kelime baş harfleri büyük (`charAt(0).toUpperCase() + slice(1)`)
- [ ] 150 satır altında, gerekirse alt componentlere böl
- [ ] Named export değil, `export default function` kullan (Expo Router şartı)
- [ ] Tab bar'a eklendi
