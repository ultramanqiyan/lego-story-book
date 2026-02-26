describe('Character Utils', () => {
  describe('filterCharacters', () => {
    const filterCharacters = (characters, userId) => {
      const preset = characters.filter(c => c.creator_id === 'system');
      const custom = characters.filter(c => c.creator_id !== 'system' && c.creator_id === userId);
      return { preset, custom };
    };

    test('should filter preset characters correctly', () => {
      const characters = [
        { character_id: '1', name: 'Hero', creator_id: 'system' },
        { character_id: '2', name: 'Villain', creator_id: 'system' },
        { character_id: '3', name: 'MyChar', creator_id: 'user123' },
      ];
      
      const { preset, custom } = filterCharacters(characters, 'user123');
      
      expect(preset).toHaveLength(2);
      expect(preset[0].name).toBe('Hero');
      expect(preset[1].name).toBe('Villain');
    });

    test('should filter custom characters for specific user', () => {
      const characters = [
        { character_id: '1', name: 'Hero', creator_id: 'system' },
        { character_id: '2', name: 'MyChar', creator_id: 'user123' },
        { character_id: '3', name: 'OtherChar', creator_id: 'user456' },
      ];
      
      const { preset, custom } = filterCharacters(characters, 'user123');
      
      expect(custom).toHaveLength(1);
      expect(custom[0].name).toBe('MyChar');
    });

    test('should return empty custom array when user has no characters', () => {
      const characters = [
        { character_id: '1', name: 'Hero', creator_id: 'system' },
      ];
      
      const { preset, custom } = filterCharacters(characters, 'user123');
      
      expect(custom).toHaveLength(0);
    });

    test('should handle empty characters array', () => {
      const { preset, custom } = filterCharacters([], 'user123');
      
      expect(preset).toHaveLength(0);
      expect(custom).toHaveLength(0);
    });

    test('should not show other users characters', () => {
      const characters = [
        { character_id: '1', name: 'Char1', creator_id: 'user123' },
        { character_id: '2', name: 'Char2', creator_id: 'user456' },
        { character_id: '3', name: 'Char3', creator_id: 'user789' },
      ];
      
      const { custom } = filterCharacters(characters, 'user123');
      
      expect(custom).toHaveLength(1);
      expect(custom[0].name).toBe('Char1');
    });

    test('should handle null userId', () => {
      const characters = [
        { character_id: '1', name: 'Hero', creator_id: 'system' },
        { character_id: '2', name: 'MyChar', creator_id: 'user123' },
      ];
      
      const { preset, custom } = filterCharacters(characters, null);
      
      expect(preset).toHaveLength(1);
      expect(custom).toHaveLength(0);
    });

    test('should handle undefined userId', () => {
      const characters = [
        { character_id: '1', name: 'Hero', creator_id: 'system' },
        { character_id: '2', name: 'MyChar', creator_id: 'user123' },
      ];
      
      const { preset, custom } = filterCharacters(characters, undefined);
      
      expect(preset).toHaveLength(1);
      expect(custom).toHaveLength(0);
    });
  });

  describe('validateCharacterData', () => {
    const validateCharacterData = (data) => {
      const errors = [];
      
      if (!data.name || data.name.trim() === '') {
        errors.push('名称不能为空');
      }
      
      if (data.name && data.name.length > 20) {
        errors.push('名称不能超过20个字符');
      }
      
      return { isValid: errors.length === 0, errors };
    };

    test('should validate valid character data', () => {
      const result = validateCharacterData({ name: 'Test Character' });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject empty name', () => {
      const result = validateCharacterData({ name: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('名称不能为空');
    });

    test('should reject whitespace-only name', () => {
      const result = validateCharacterData({ name: '   ' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('名称不能为空');
    });

    test('should reject name longer than 20 characters', () => {
      const result = validateCharacterData({ name: 'This is a very long character name' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('名称不能超过20个字符');
    });
  });

  describe('API Request Body Validation', () => {
    test('should create correct request body for character creation', () => {
      const createCharacterBody = (userId, name, emoji, personality, speakingStyle) => ({
        creatorId: userId,
        name: name.trim(),
        emoji: emoji || '🎭',
        personality: personality || '',
        speakingStyle: speakingStyle || '',
      });
      
      const body = createCharacterBody('user123', 'Test Char', '🧙', 'Brave', 'Formal');
      
      expect(body.creatorId).toBe('user123');
      expect(body.name).toBe('Test Char');
      expect(body.emoji).toBe('🧙');
      expect(body.personality).toBe('Brave');
      expect(body.speakingStyle).toBe('Formal');
    });

    test('should use default emoji when not provided', () => {
      const createCharacterBody = (userId, name, emoji, personality, speakingStyle) => ({
        creatorId: userId,
        name: name.trim(),
        emoji: emoji || '🎭',
        personality: personality || '',
        speakingStyle: speakingStyle || '',
      });
      
      const body = createCharacterBody('user123', 'Test Char');
      
      expect(body.emoji).toBe('🎭');
    });
  });

  describe('URL Parameter Construction', () => {
    test('should construct correct URL with userId', () => {
      const buildCharactersUrl = (userId) => `/characters?userId=${userId || ''}`;
      
      const url = buildCharactersUrl('user123');
      expect(url).toBe('/characters?userId=user123');
    });

    test('should handle null userId in URL', () => {
      const buildCharactersUrl = (userId) => `/characters?userId=${userId || ''}`;
      
      const url = buildCharactersUrl(null);
      expect(url).toBe('/characters?userId=');
    });

    test('should handle undefined userId in URL', () => {
      const buildCharactersUrl = (userId) => `/characters?userId=${userId || ''}`;
      
      const url = buildCharactersUrl(undefined);
      expect(url).toBe('/characters?userId=');
    });
  });
});
