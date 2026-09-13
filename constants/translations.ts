export type Lang = 'tr' | 'en';

const tr = {
  // Loading
  loading: 'Yükleniyor...',

  // Tab labels
  tabCards: 'Kartlar',
  tabLearned: 'Öğrendiklerim',
  tabMyWords: 'Kelimelerim',
  tabSettings: 'Ayarlar',

  // Home screen
  congratulations: 'Tebrikler!',
  allWordsLearned: 'Tüm kelimeleri öğrendiniz.\nÖğrendiklerim sekmesinden tekrar edebilirsiniz.',
  wordsLearned: (n: number) => `${n} kelime öğrenildi`,

  // Learned screen
  nWords: (n: number) => `${n} Kelime`,
  noLearnedYet: 'Henüz öğrenilen kelime yok',
  startLearningHint: 'Kartlar ekranında kelimeleri öğrenmeye başla!',
  progressTitle: 'ÖĞRENME İLERLEMESİ',
  learned: 'öğrenilen',
  remaining: 'kalan',
  total: 'toplam',
  review: 'Tekrar',
  msg0: 'Kartlar ekranında kelimeleri öğrenmeye başla!',
  msg25: 'Harika başlangıç! Devam et',
  msg50: 'İyi gidiyorsun! Yarıya yaklaştın.',
  msg75: 'Mükemmel! Artık az kaldı.',
  msg99: 'Neredeyse tamamladın! Son aşamadasın.',
  msg100: 'Tebrikler! Tüm kelimeleri öğrendin!',

  // Custom words screen
  customWordCount: (n: number) => `${n} özel kelime`,
  adCreditsRemaining: (n: number) => `· ${n} reklam hakkı kaldı`,
  deleteWord: 'Kelimeyi Sil',
  deleteConfirm: (word: string) => `"${word}" kelimesini silmek istediğinize emin misiniz?`,
  cancel: 'İptal',
  delete: 'Sil',
  missingInfo: 'Eksik Bilgi',
  fillAllFields: 'Tüm alanları doldurun.',
  success: 'Başarılı',
  wordUpdated: 'Kelime güncellendi!',
  wordAdded: 'Kelime eklendi!',
  editWord: 'Kelimeyi Düzenle',
  newWord: 'Yeni Kelime',
  enWordPlaceholder: 'İngilizce kelime',
  trWordPlaceholder: 'Türkçe kelime',
  enSentencePlaceholder: 'İngilizce cümle',
  trSentencePlaceholder: 'Türkçe cümle',
  enSentenceLabel: 'Cümle (EN)',
  trSentenceLabel: 'Cümle (TR)',
  saving: 'Kaydediliyor...',
  update: 'Güncelle',
  save: 'Kaydet',
  addWord: '+ Kelime Ekle',
  noCustomWords: 'Henüz özel kelime yok',
  tapToAddWord: 'Yukarıdaki butona tıklayarak kelime ekleyin.',
  subscribeOrWatchAd: 'Premium üye olun veya reklam izleyerek kelime ekleyin.',
  error: 'Hata',

  // Settings screen
  premiumActivatedMsg: 'Premium üyeliğiniz aktifleşti. Sınırsız kelime ekleyebilirsiniz.',
  subscriptionRestored: 'Aboneliğiniz geri yüklendi.',
  info: 'Bilgi',
  noActiveSubscription: 'Aktif abonelik bulunamadı.',
  premiumMember: 'Premium Üye',
  freeAccount: 'Ücretsiz Hesap',
  unlimitedActive: 'Sınırsız özel kelime ekleme aktif',
  upgradeToPremium: "Özel kelime eklemek için Premium'a geç",
  active: 'AKTİF',
  goPremium: "Premium'a Geç",
  perMonth: '/ay',
  restorePurchases: 'Satın Alımları Geri Yükle',
  adCreditsTitle: 'Reklam Hakları',
  youHaveNCredits: (n: number) => `${n} kelime hakkınız var`,
  watchAdsInWordsTab: 'Kelimeler sekmesinden reklam izleyin',
  progressStats: 'İLERLEME İSTATİSTİKLERİ',
  learnedLabel: 'Öğrenilen',
  remainingLabel: 'Kalan',
  customLabel: 'Özel',
  overallProgress: 'Genel İlerleme',
  totalWords: (n: number) => `${n} toplam kelime`,
  darkTheme: 'Koyu Tema',
  lightTheme: 'Açık Tema',
  darkModeActive: 'Karanlık mod aktif',
  lightModeActive: 'Aydınlık mod aktif',
  localFirst: 'Local-first · Offline çalışır',
  language: 'Dil',
  languageTR: 'Türkçe',
  languageEN: 'English',
  shuffleCards: 'Kartları Karıştır',
  shuffleCardsDesc: 'Kart sırasını rastgele değiştir',
  shuffleButton: 'Karıştır',
  shuffleDone: 'Kartlar karıştırıldı! Kartlar ekranına geçebilirsiniz.',

  // Card components
  tapToFlip: 'Kartı çevirmek için dokun',
  markLearned: 'Öğrendim',

  // SubscriptionBanner
  premiumMemberBanner: 'Premium Üye',
  unlimitedWordsActive: 'Sınırsız kelime ekleyebilirsiniz.',
  goPremiumBanner: "Premium'a Geç",
  monthlyForPrice: (price: string) => `Aylık ${price} ile sınırsız özel kelime ekleyin.`,
  subscribeForPrice: (price: string) => `Abone Ol — ${price}/ay`,

  // AdRewardButton
  watchAdTitle: 'Reklam İzle',
  adRewardDesc: (n: number) => `1 reklam = ${n} kelime hakkı`,
  nCredits: (n: number) => `${n} hak`,
  watchAdButton: 'Reklam İzle ve Hak Kazan',

  // Purchase error codes
  monthly_not_found: 'Aylık paket bulunamadı.',
  purchase_cancelled: 'İşlem iptal edildi.',
  purchase_failed: 'Satın alma başarısız. Lütfen tekrar deneyin.',
  no_subscription_to_restore: 'Geri yüklenecek aktif abonelik bulunamadı.',
  restore_failed: 'Geri yükleme başarısız. Lütfen tekrar deneyin.',
  not_configured: 'Satın alma şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
  web_not_supported: 'Web platformunda desteklenmiyor.',

  // Subscription disclosure (App Store Review Guideline 3.1.2)
  subscriptionTitle: 'LinguaCard Premium — Aylık Abonelik',
  subscriptionTerms:
    'Abonelik aylıktır ve otomatik olarak yenilenir. Ücret, satın alma onayında Apple Kimliğinize yansıtılır. ' +
    'Abonelik, dönem bitiminden en az 24 saat önce iptal edilmezse otomatik olarak yenilenir ve yenileme ücreti ' +
    'dönem bitiminden önceki 24 saat içinde tahsil edilir. Aboneliğinizi satın aldıktan sonra ' +
    'iPhone Ayarlar > Apple Kimliği > Abonelikler bölümünden yönetebilir veya iptal edebilirsiniz.',
  subscriptionBenefits: 'Premium ile sınırsız özel kelime ekleyebilir, reklam izlemeden çalışabilirsiniz.',
  priceLoading: 'Fiyat yükleniyor...',

  // Legal
  legalSectionTitle: 'Yasal',
  privacyPolicy: 'Gizlilik Politikası',
  termsOfUse: 'Kullanım Koşulları',
  support: 'Destek',
  legalLinkUnavailable: 'Bağlantı şu anda açılamıyor.',

  // Ad results
  adUnavailable: 'Şu anda gösterilebilecek bir reklam yok. Lütfen biraz sonra tekrar deneyin.',
  adDismissed: 'Hak kazanmak için reklamı sonuna kadar izlemelisiniz.',
  adNoCreditsLeft: 'Reklam hakkınız kalmadı. Yeni hak için reklam izleyin veya Premium\'e geçin.',

  // Data / privacy copy
  localFirstDetail:
    'Öğrenme verileriniz yalnızca bu cihazda saklanır, sunucuya gönderilmez. Reklamlar Google AdMob tarafından sunulur.',

  // Errors
  loadFailedTitle: 'Kelimeler yüklenemedi',
  loadFailedBody: 'Veritabanına erişilemedi. Lütfen tekrar deneyin.',
  retry: 'Tekrar Dene',
  notFoundTitle: 'Sayfa bulunamadı',
  notFoundBody: 'Aradığınız ekran mevcut değil.',
  goHome: 'Ana ekrana dön',

  // Accessibility
  speakWordA11y: (word: string) => `${word} kelimesini seslendir`,
  previousCardA11y: 'Önceki kart',
  nextCardA11y: 'Sonraki kart',
  editWordA11y: (word: string) => `${word} kelimesini düzenle`,
  deleteWordA11y: (word: string) => `${word} kelimesini sil`,
};

const en: typeof tr = {
  // Loading
  loading: 'Loading...',

  // Tab labels
  tabCards: 'Cards',
  tabLearned: 'Learned',
  tabMyWords: 'My Words',
  tabSettings: 'Settings',

  // Home screen
  congratulations: 'Congratulations!',
  allWordsLearned: "You've learned all the words.\nReview them in the Learned tab.",
  wordsLearned: (n: number) => `${n} words learned`,

  // Learned screen
  nWords: (n: number) => `${n} Words`,
  noLearnedYet: 'No learned words yet',
  startLearningHint: 'Start learning words on the Cards screen!',
  progressTitle: 'LEARNING PROGRESS',
  learned: 'learned',
  remaining: 'remaining',
  total: 'total',
  review: 'Review',
  msg0: 'Start learning words on the Cards screen!',
  msg25: 'Great start! Keep going!',
  msg50: "You're doing well! Halfway there.",
  msg75: 'Excellent! Almost there.',
  msg99: "Almost done! You're at the final stage.",
  msg100: "Congratulations! You've learned all the words!",

  // Custom words screen
  customWordCount: (n: number) => `${n} custom words`,
  adCreditsRemaining: (n: number) => `· ${n} ad credits remaining`,
  deleteWord: 'Delete Word',
  deleteConfirm: (word: string) => `Are you sure you want to delete "${word}"?`,
  cancel: 'Cancel',
  delete: 'Delete',
  missingInfo: 'Missing Info',
  fillAllFields: 'Please fill in all fields.',
  success: 'Success',
  wordUpdated: 'Word updated!',
  wordAdded: 'Word added!',
  editWord: 'Edit Word',
  newWord: 'New Word',
  enWordPlaceholder: 'English word',
  trWordPlaceholder: 'Turkish word',
  enSentencePlaceholder: 'English sentence',
  trSentencePlaceholder: 'Turkish sentence',
  enSentenceLabel: 'Sentence (EN)',
  trSentenceLabel: 'Sentence (TR)',
  saving: 'Saving...',
  update: 'Update',
  save: 'Save',
  addWord: '+ Add Word',
  noCustomWords: 'No custom words yet',
  tapToAddWord: 'Tap the button above to add a word.',
  subscribeOrWatchAd: 'Subscribe to Premium or watch an ad to add words.',
  error: 'Error',

  // Settings screen
  premiumActivatedMsg: 'Your Premium membership is active. You can add unlimited words.',
  subscriptionRestored: 'Your subscription has been restored.',
  info: 'Info',
  noActiveSubscription: 'No active subscription found.',
  premiumMember: 'Premium Member',
  freeAccount: 'Free Account',
  unlimitedActive: 'Unlimited custom word adding is active',
  upgradeToPremium: 'Upgrade to Premium to add custom words',
  active: 'ACTIVE',
  goPremium: 'Go Premium',
  perMonth: '/mo',
  restorePurchases: 'Restore Purchases',
  adCreditsTitle: 'Ad Credits',
  youHaveNCredits: (n: number) => `You have ${n} word credits`,
  watchAdsInWordsTab: 'Watch ads in the Words tab',
  progressStats: 'LEARNING STATISTICS',
  learnedLabel: 'Learned',
  remainingLabel: 'Remaining',
  customLabel: 'Custom',
  overallProgress: 'Overall Progress',
  totalWords: (n: number) => `${n} total words`,
  darkTheme: 'Dark Theme',
  lightTheme: 'Light Theme',
  darkModeActive: 'Dark mode active',
  lightModeActive: 'Light mode active',
  localFirst: 'Local-first · Works offline',
  language: 'Language',
  languageTR: 'Türkçe',
  languageEN: 'English',
  shuffleCards: 'Shuffle Cards',
  shuffleCardsDesc: 'Randomize the card order',
  shuffleButton: 'Shuffle',
  shuffleDone: 'Cards shuffled! You can go to the Cards screen.',

  // Card components
  tapToFlip: 'Tap card to flip',
  markLearned: 'Mark as Learned',

  // SubscriptionBanner
  premiumMemberBanner: 'Premium Member',
  unlimitedWordsActive: 'You can add unlimited words.',
  goPremiumBanner: 'Go Premium',
  monthlyForPrice: (price: string) => `Add unlimited custom words for just ${price}/month.`,
  subscribeForPrice: (price: string) => `Subscribe — ${price}/mo`,

  // AdRewardButton
  watchAdTitle: 'Watch Ad',
  adRewardDesc: (n: number) => `1 ad = ${n} word credits`,
  nCredits: (n: number) => `${n} credits`,
  watchAdButton: 'Watch Ad & Earn Credits',

  // Purchase error codes
  monthly_not_found: 'Monthly package not found.',
  purchase_cancelled: 'Purchase cancelled.',
  purchase_failed: 'Purchase failed. Please try again.',
  no_subscription_to_restore: 'No active subscription found to restore.',
  restore_failed: 'Restore failed. Please try again.',
  not_configured: 'Purchases are unavailable right now. Please try again later.',
  web_not_supported: 'Not supported on web platform.',

  // Subscription disclosure (App Store Review Guideline 3.1.2)
  subscriptionTitle: 'LinguaCard Premium — Monthly Subscription',
  subscriptionTerms:
    'This is a monthly auto-renewing subscription. Payment is charged to your Apple ID account at confirmation ' +
    'of purchase. The subscription renews automatically unless it is cancelled at least 24 hours before the end ' +
    'of the current period; your account is charged for renewal within 24 hours prior to the end of the current ' +
    'period. You can manage or cancel your subscription in iPhone Settings > Apple ID > Subscriptions after purchase.',
  subscriptionBenefits: 'Premium unlocks unlimited custom words with no ads to watch.',
  priceLoading: 'Loading price...',

  // Legal
  legalSectionTitle: 'Legal',
  privacyPolicy: 'Privacy Policy',
  termsOfUse: 'Terms of Use',
  support: 'Support',
  legalLinkUnavailable: 'That link cannot be opened right now.',

  // Ad results
  adUnavailable: 'No ad is available right now. Please try again in a moment.',
  adDismissed: 'You need to watch the full ad to earn credits.',
  adNoCreditsLeft: 'You have no word credits left. Watch an ad or go Premium to add more.',

  // Data / privacy copy
  localFirstDetail:
    'Your learning data is stored only on this device and never sent to a server. Ads are served by Google AdMob.',

  // Errors
  loadFailedTitle: 'Could not load words',
  loadFailedBody: 'The database could not be reached. Please try again.',
  retry: 'Try Again',
  notFoundTitle: 'Page not found',
  notFoundBody: "The screen you're looking for doesn't exist.",
  goHome: 'Go to home screen',

  // Accessibility
  speakWordA11y: (word: string) => `Speak the word ${word}`,
  previousCardA11y: 'Previous card',
  nextCardA11y: 'Next card',
  editWordA11y: (word: string) => `Edit the word ${word}`,
  deleteWordA11y: (word: string) => `Delete the word ${word}`,
};

export const translations: Record<Lang, typeof tr> = { tr, en };
export type Translations = typeof tr;
