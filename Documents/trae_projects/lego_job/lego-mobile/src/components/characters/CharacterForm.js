import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../utils/constants';

const PERSONALITY_OPTIONS = [
  '勇敢', '善良', '聪明', '幽默', '害羞', '调皮', '温柔', '坚强', '机智', '忠诚'
];

const SPEAKING_STYLE_OPTIONS = [
  '正常', '活泼', '沉稳', '傲娇', '可爱', '神秘', '豪爽', '文雅'
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
      <View style={styles.field}>
        <Text style={styles.label}>📛 角色名称 *</Text>
        <TextInput
          style={styles.input}
          placeholder="给角色起个名字"
          placeholderTextColor={COLORS.textMuted}
          value={name}
          onChangeText={setName}
          maxLength={20}
        />
        <Text style={styles.hint}>{name.length}/20</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>📝 角色描述</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="描述一下这个角色的特点..."
          placeholderTextColor={COLORS.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          maxLength={200}
          textAlignVertical="top"
        />
        <Text style={styles.hint}>{description.length}/200</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>✨ 性格特点</Text>
        <Text style={styles.subLabel}>选择一个性格标签</Text>
        <View style={styles.optionsGrid}>
          {PERSONALITY_OPTIONS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.optionChip,
                personality === p && styles.optionChipSelected,
              ]}
              onPress={() => selectPersonality(p)}
            >
              <Text
                style={[
                  styles.optionText,
                  personality === p && styles.optionTextSelected,
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>💬 说话风格</Text>
        <Text style={styles.subLabel}>选择一个说话风格</Text>
        <View style={styles.optionsGrid}>
          {SPEAKING_STYLE_OPTIONS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.optionChip,
                speakingStyle === s && styles.optionChipSelected,
              ]}
              onPress={() => selectSpeakingStyle(s)}
            >
              <Text
                style={[
                  styles.optionText,
                  speakingStyle === s && styles.optionTextSelected,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.submitButton,
            !name.trim() && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!name.trim()}
        >
          <Text style={styles.submitButtonText}>
            {character ? '保存修改' : '创建角色'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.legoYellow,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 100,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'right',
    marginTop: 4,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionChipSelected: {
    backgroundColor: COLORS.legoYellow,
    borderColor: COLORS.legoOrange,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  optionTextSelected: {
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
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
