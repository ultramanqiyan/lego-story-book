import * as Types from '../types';

describe('API Types', () => {
  describe('User Types', () => {
    it('should export UserCreateParams', () => {
      expect(Types.UserCreateParams).toBeDefined();
    });

    it('should export UserCreateResult', () => {
      expect(Types.UserCreateResult).toBeDefined();
    });

    it('should export UserUpdateParams', () => {
      expect(Types.UserUpdateParams).toBeDefined();
    });

    it('should export User', () => {
      expect(Types.User).toBeDefined();
    });
  });

  describe('Character Types', () => {
    it('should export CharacterCreateParams', () => {
      expect(Types.CharacterCreateParams).toBeDefined();
    });

    it('should export CharacterUpdateParams', () => {
      expect(Types.CharacterUpdateParams).toBeDefined();
    });

    it('should export Character', () => {
      expect(Types.Character).toBeDefined();
    });
  });

  describe('Book Types', () => {
    it('should export BookCreateParams', () => {
      expect(Types.BookCreateParams).toBeDefined();
    });

    it('should export BookUpdateParams', () => {
      expect(Types.BookUpdateParams).toBeDefined();
    });

    it('should export Book', () => {
      expect(Types.Book).toBeDefined();
    });
  });

  describe('Book Character Types', () => {
    it('should export BookCharacterAddParams', () => {
      expect(Types.BookCharacterAddParams).toBeDefined();
    });

    it('should export BookCharacterUpdateParams', () => {
      expect(Types.BookCharacterUpdateParams).toBeDefined();
    });

    it('should export BookCharacter', () => {
      expect(Types.BookCharacter).toBeDefined();
    });
  });

  describe('Chapter Types', () => {
    it('should export ChapterCreateParams', () => {
      expect(Types.ChapterCreateParams).toBeDefined();
    });

    it('should export ChapterGenerateParams', () => {
      expect(Types.ChapterGenerateParams).toBeDefined();
    });

    it('should export Chapter', () => {
      expect(Types.Chapter).toBeDefined();
    });
  });

  describe('Story Types', () => {
    it('should export StoryGenerateParams', () => {
      expect(Types.StoryGenerateParams).toBeDefined();
    });

    it('should export CharacterData', () => {
      expect(Types.CharacterData).toBeDefined();
    });

    it('should export PuzzleData', () => {
      expect(Types.PuzzleData).toBeDefined();
    });

    it('should export PlotSelection', () => {
      expect(Types.PlotSelection).toBeDefined();
    });
  });

  describe('Puzzle Types', () => {
    it('should export PuzzleSubmitParams', () => {
      expect(Types.PuzzleSubmitParams).toBeDefined();
    });

    it('should export PuzzleSubmitResult', () => {
      expect(Types.PuzzleSubmitResult).toBeDefined();
    });

    it('should export Puzzle', () => {
      expect(Types.Puzzle).toBeDefined();
    });
  });

  describe('Share Types', () => {
    it('should export ShareCreateParams', () => {
      expect(Types.ShareCreateParams).toBeDefined();
    });

    it('should export ShareCreateResult', () => {
      expect(Types.ShareCreateResult).toBeDefined();
    });

    it('should export Share', () => {
      expect(Types.Share).toBeDefined();
    });
  });
});
