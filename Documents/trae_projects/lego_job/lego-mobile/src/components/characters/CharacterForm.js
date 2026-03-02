import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { COLORS } from '../../utils/constants';

const PERSONALITY_OPTIONS = [
  { label: '勇敢', emoji: '🦁' },
  { label: '善良', emoji: '💖' },
  { label: '聪明', emoji: '🧠' },
  { label: '幽默', emoji: '😄' },
  { label: '害羞', emoji: '😊' },
  { label: '调皮', emoji: '😜' },
  { label: '温柔', emoji: '🌸' },
  { label: '坚强', emoji: '💪' },
  { label: '机智', emoji: '🎯' },
  { label: '忠诚', emoji: '🛡️' },
];

const SPEAKING_STYLE_OPTIONS = [
  { label: '正常', emoji: '💬' },
  { label: '活泼', emoji: '🎉' },
  { label: '沉稳', emoji: '🧘' },
  { label: '傲娇', emoji: '😏' },
  { label: '可爱', emoji: '🥰' },
  { label: '神秘', emoji: '🌙' },
  { label: '豪爽', emoji: '🔥' },
  { label: '文雅', emoji: '📚' },
];

const CharacterForm = ({ character, onSubmit, onCancel }) => {
  const [name, setName] = useState(character?.name || '');
  const [description, setDescription] = useState(character?.description || '');
  const [personality, setPersonality] = useState(character?.personality || '');
  const [speakingStyle, setSpeakingStyle] = useState(character?.speaking_style || '');

  const handleSubmit = () => {
    if (!name.trim()) {
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      personality: personality.trim(),
      speaking_style: speakingStyle.trim(),
    });
  };

  const selectPersonality = (p) => {
    setPersonality(personality === p ? '' : p);
  };

  const selectSpeakingStyle = (s) => {
    setSpeakingStyle(speakingStyle === s ? '' : s);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📛</Text>
          <Text style={styles.sectionTitle}>角色名称</Text>
          <Text style={styles.required}>*必填</Text>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="给角色起个响亮的名字..."
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
            maxLength={20}
          />
          <Text style={styles.charCount}>{name.length}/20</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📝</Text>
          <Text style={styles.sectionTitle}>角色描述</Text>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="描述一下这个角色的特点、背景故事..."
            placeholderTextColor={COLORS.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={200}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length}/200</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>✨</Text>
          <Text style={styles.sectionTitle}>性格特点</Text>
        </View>
        <Text style={styles.sectionHint}>选择一个最符合的性格标签</Text>
        <View style={styles.optionsGrid}>
          {PERSONALITY_OPTIONS.map((p) => (
            <TouchableOpacity
              key={p.label}
              style={[
                styles.optionChip,
                personality === p.label && styles.optionChipSelected,
              ]}
              onPress={() => selectPersonality(p.label)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionEmoji}>{p.emoji}</Text>
              <Text
                style={[
                  styles.optionText,
                  personality === p.label && styles.optionTextSelected,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>💬</Text>
          <Text style={styles.sectionTitle}>说话风格</Text>
        </View>
        <Text style={styles.sectionHint}>选择角色的说话方式</Text>
        <View style={styles.optionsGrid}>
          {SPEAKING_STYLE_OPTIONS.map((s) => (
            <TouchableOpacity
              key={s.label}
              style={[
                styles.optionChip,
                speakingStyle === s.label && styles.optionChipSelected,
              ]}
              onPress={() => selectSpeakingStyle(s.label)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionEmoji}>{s.emoji}</Text>
              <Text
                style={[
                  styles.optionText,
                  speakingStyle === s.label && styles.optionTextSelected,
                ]}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.submitButton,
            !name.trim() && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!name.trim()}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>
            {character ? '💾 保存修改' : '✨ 创建角色'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  required: {
    fontSize: 12,
    color: COLORS.legoOrange,
    fontWeight: '600',
  },
  sectionHint: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
  },
  charCount: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    fontSize: 12,
    color: COLORS.textMuted,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  optionChipSelected: {
    backgroundColor: COLORS.legoYellow,
    borderColor: COLORS.legoOrange,
    transform: [{ scale: 1.02 }],
  },
  optionEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  optionTextSelected: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
    paddingTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1.5,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.legoYellow,
    borderWidth: 2,
    borderColor: COLORS.legoOrange,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: 'bold',
  },
});

export default CharacterForm;
