import { useCallback, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { useWordStore } from '../../stores/wordStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { SubscriptionBanner } from '../../components/ui/SubscriptionBanner';
import { AdRewardButton } from '../../components/ui/AdRewardButton';
import { sanitizeUserText, MAX_WORD_LENGTH, MAX_SENTENCE_LENGTH } from '../../utils/sanitize';
import type { CustomWord } from '../../types/word';

const EMPTY_FORM = { en_word: '', tr_word: '', en_sentence: '', tr_sentence: '' };

type FormKey = keyof typeof EMPTY_FORM;

interface CustomWordItemProps {
  word: CustomWord;
  onEdit: () => void;
  onDelete: () => void;
}

function CustomWordItem({ word, onEdit, onDelete }: CustomWordItemProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderRadius: 12,
        padding: 14,
        marginHorizontal: 16,
        marginBottom: 8,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={2}
            style={{ fontSize: 16, fontWeight: '700', color: theme.textPrimary }}
          >
            {word.en_word}
          </Text>
          <Text numberOfLines={2} style={{ fontSize: 14, color: theme.textSecondary, marginTop: 2 }}>
            {word.tr_word}
          </Text>
          <Text numberOfLines={3} style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
            {word.en_sentence}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 8 }}>
          <View
            style={{
              backgroundColor: word.source === 'premium' ? theme.premiumTint : theme.adTint,
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Ionicons
              name={word.source === 'premium' ? 'star' : 'tv-outline'}
              size={14}
              color={word.source === 'premium' ? theme.purple : theme.orange}
            />
          </View>
          <Pressable
            onPress={onEdit}
            accessibilityRole="button"
            accessibilityLabel={t.editWordA11y(word.en_word)}
            style={{ padding: 6 }}
          >
            <Ionicons name="pencil-outline" size={18} color={theme.primary} />
          </Pressable>
          <Pressable
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel={t.deleteWordA11y(word.en_word)}
            style={{ padding: 6 }}
          >
            <Ionicons name="trash-outline" size={18} color="#C62828" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function CustomWordsScreen() {
  const db = useSQLiteContext();
  const theme = useTheme();
  const { t } = useTranslation();

  const customWords = useWordStore((s) => s.customWords);
  const addCustomWord = useWordStore((s) => s.addCustomWord);
  const updateCustomWord = useWordStore((s) => s.updateCustomWord);
  const deleteCustomWord = useWordStore((s) => s.deleteCustomWord);

  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const remainingAdWords = useSubscriptionStore((s) => s.remainingAdWords);
  const purchaseMonthly = useSubscriptionStore((s) => s.purchaseMonthly);
  const refreshAdWordCount = useSubscriptionStore((s) => s.refreshAdWordCount);

  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const listRef = useRef<FlatList<CustomWord>>(null);

  // The form sits at the top of the list, so opening it while scrolled down
  // would change nothing visible. Scroll back up whenever it opens.
  const openForm = useCallback(() => {
    setShowForm(true);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshAdWordCount(db);
    }, [db, refreshAdWordCount])
  );

  const canAddWord = isPremium || remainingAdWords > 0;

  const handleEdit = (word: CustomWord) => {
    setForm({
      en_word: word.en_word,
      tr_word: word.tr_word,
      en_sentence: word.en_sentence,
      tr_sentence: word.tr_sentence,
    });
    setEditingId(word.id);
    openForm();
  };

  const handleDelete = (word: CustomWord) => {
    Alert.alert(t.deleteWord, t.deleteConfirm(word.en_word), [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.delete,
        style: 'destructive',
        onPress: () => deleteCustomWord(db, word.id),
      },
    ]);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    // Strip control/bidi characters and clamp length before anything reaches
    // the database — an unbounded "word" wrecks the card layout and the list.
    const clean = {
      en_word: sanitizeUserText(form.en_word, MAX_WORD_LENGTH),
      tr_word: sanitizeUserText(form.tr_word, MAX_WORD_LENGTH),
      en_sentence: sanitizeUserText(form.en_sentence, MAX_SENTENCE_LENGTH),
      tr_sentence: sanitizeUserText(form.tr_sentence, MAX_SENTENCE_LENGTH),
    };

    if (!clean.en_word || !clean.tr_word || !clean.en_sentence || !clean.tr_sentence) {
      Alert.alert(t.missingInfo, t.fillAllFields);
      return;
    }

    const isEditing = editingId !== null;
    if (!isEditing && !canAddWord) {
      // Previously this returned silently and the Save button looked dead.
      Alert.alert(t.watchAdTitle, t.adNoCreditsLeft);
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        await updateCustomWord(db, editingId, clean);
        Alert.alert(t.success, t.wordUpdated);
      } else {
        await addCustomWord(db, { ...clean, source: isPremium ? 'premium' : 'rewarded_ad' });
        await refreshAdWordCount(db);
        Alert.alert(t.success, t.wordAdded);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (e) {
      console.warn('save custom word error:', e);
      Alert.alert(t.error, t.loadFailedBody);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubscribe = async () => {
    const result = await purchaseMonthly();
    if (!result.success && result.errorCode) {
      Alert.alert(t.error, t[result.errorCode]);
    }
  };

  const formFields: { key: FormKey; placeholder: string; label: string; max: number }[] = [
    { key: 'en_word', placeholder: t.enWordPlaceholder, label: 'EN', max: MAX_WORD_LENGTH },
    { key: 'tr_word', placeholder: t.trWordPlaceholder, label: 'TR', max: MAX_WORD_LENGTH },
    {
      key: 'en_sentence',
      placeholder: t.enSentencePlaceholder,
      label: t.enSentenceLabel,
      max: MAX_SENTENCE_LENGTH,
    },
    {
      key: 'tr_sentence',
      placeholder: t.trSentencePlaceholder,
      label: t.trSentenceLabel,
      max: MAX_SENTENCE_LENGTH,
    },
  ];

  // Everything above the list is rendered as the list's *header* so that it
  // scrolls with the page. As a sibling of the list it could not scroll at
  // all: with the banner, the ad button and four inputs, the Save button fell
  // past the bottom edge of the screen and was unreachable.
  //
  // Keep this a JSX *element*. Passing an inline component function instead
  // gives the header a new type on every render, which remounts it and makes
  // the focused TextInput lose the keyboard after every keystroke.
  const listHeader = (
    <View>
      {/* Header stats */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontSize: 13, color: theme.textMuted }}>
          {t.customWordCount(customWords.length)}{' '}
          {!isPremium && remainingAdWords > 0 && t.adCreditsRemaining(remainingAdWords)}
        </Text>
      </View>

      {/* Paywall / Banner */}
      {!isPremium && (
        <>
          <SubscriptionBanner onSubscribe={handleSubscribe} />
          <AdRewardButton onRewarded={openForm} />
        </>
      )}

      {/* Add / Edit word form */}
      {(canAddWord || editingId !== null) && showForm && (
        <View
          style={{
            backgroundColor: theme.card,
            marginHorizontal: 16,
            marginBottom: 12,
            borderRadius: 12,
            padding: 16,
            shadowColor: theme.shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: '700',
              color: theme.textPrimary,
              marginBottom: 12,
            }}
          >
            {editingId !== null ? t.editWord : t.newWord}
          </Text>
          {formFields.map(({ key, placeholder, label, max }) => (
            <View key={key} style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>
                {label}
              </Text>
              <TextInput
                value={form[key]}
                onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))}
                placeholder={placeholder}
                placeholderTextColor={theme.textMuted}
                maxLength={max}
                accessibilityLabel={label}
                style={{
                  borderWidth: 1,
                  borderColor: theme.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 14,
                  color: theme.textPrimary,
                  backgroundColor: theme.inputBg,
                }}
              />
            </View>
          ))}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
            <Pressable
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel={t.cancel}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 8,
                paddingVertical: 11,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, color: theme.textSecondary, fontWeight: '600' }}>
                {t.cancel}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              accessibilityRole="button"
              accessibilityLabel={editingId !== null ? t.update : t.save}
              accessibilityState={{ disabled: isSaving, busy: isSaving }}
              style={{
                flex: 2,
                backgroundColor: theme.primary,
                borderRadius: 8,
                paddingVertical: 11,
                alignItems: 'center',
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              <Text style={{ fontSize: 14, color: '#FFFFFF', fontWeight: '700' }}>
                {isSaving ? t.saving : editingId !== null ? t.update : t.save}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Add button (if can add and form hidden) */}
      {canAddWord && !showForm && (
        <Pressable
          onPress={openForm}
          accessibilityRole="button"
          accessibilityLabel={t.addWord}
          style={{
            marginHorizontal: 16,
            marginBottom: 12,
            backgroundColor: theme.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>{t.addWord}</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <FlatList
        ref={listRef}
        style={{ flex: 1 }}
        data={customWords}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CustomWordItem
            word={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListHeaderComponent={listHeader}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        // iOS insets the list by the keyboard height and scrolls the focused
        // field into view. Android resizes the window instead (Expo's default
        // softwareKeyboardLayoutMode), so the list just gets shorter and stays
        // scrollable. This replaces a KeyboardAvoidingView, which shrank the
        // screen without giving the form anywhere to scroll.
        automaticallyAdjustKeyboardInsets
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 40, paddingHorizontal: 32 }}>
            <Ionicons name="create-outline" size={48} color={theme.textMuted} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: theme.textPrimary,
                marginTop: 12,
                textAlign: 'center',
              }}
            >
              {t.noCustomWords}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: theme.textMuted,
                marginTop: 6,
                textAlign: 'center',
              }}
            >
              {canAddWord ? t.tapToAddWord : t.subscribeOrWatchAd}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
