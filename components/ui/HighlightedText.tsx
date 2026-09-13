import { Text, View } from 'react-native';

interface HighlightedTextProps {
  sentence: string;
  targetWord: string;
  highlightColor: string;
  bodyColor?: string;
  onWordPress?: () => void;
  fontSize?: number;
}

export function HighlightedText({
  sentence,
  targetWord,
  highlightColor,
  bodyColor = '#555555',
  onWordPress,
  fontSize = 16,
}: HighlightedTextProps) {
  const lowerSentence = sentence.toLowerCase();
  const lowerTarget = targetWord.toLowerCase();
  const matchIndex = lowerSentence.indexOf(lowerTarget);

  const textStyle = {
    fontSize,
    color: bodyColor,
    lineHeight: fontSize * 1.6,
    textAlign: 'center' as const,
  };

  if (matchIndex === -1) {
    return <Text style={textStyle}>{sentence}</Text>;
  }

  const before = sentence.slice(0, matchIndex);
  const match = sentence.slice(matchIndex, matchIndex + targetWord.length);
  const after = sentence.slice(matchIndex + targetWord.length);

  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <Text style={textStyle}>
        {before}
        <Text
          onPress={onWordPress}
          style={{ color: highlightColor, fontWeight: '700', fontSize }}
        >
          {match}
        </Text>
        {after}
      </Text>
    </View>
  );
}
