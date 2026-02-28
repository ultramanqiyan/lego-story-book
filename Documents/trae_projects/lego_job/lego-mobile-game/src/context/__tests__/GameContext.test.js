import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GameProvider, useGame } from '../GameContext';

const TestComponent = () => {
  const {
    currentBook,
    currentChapter,
    selectedCharacters,
    gameState,
    score,
    adventureProgress,
    selectBook,
    selectChapter,
    addCharacter,
    removeCharacter,
    startGame,
    endGame,
    addScore,
    recordAnswer,
    resetGame,
  } = useGame();
  
  return (
    <>
      <span testID="book">{currentBook?.title || 'null'}</span>
      <span testID="chapter">{currentChapter?.title || 'null'}</span>
      <span testID="characters">{selectedCharacters.length}</span>
      <span testID="gameState">{gameState}</span>
      <span testID="score">{score}</span>
      <button testID="selectBook" onPress={() => selectBook({ id: '1', title: 'Test Book' })}>Select Book</button>
      <button testID="selectChapter" onPress={() => selectChapter({ id: '1', title: 'Test Chapter' })}>Select Chapter</button>
      <button testID="addChar" onPress={() => addCharacter({ id: '1', name: 'Test Char' })}>Add Char</button>
      <button testID="removeChar" onPress={() => removeCharacter('1')}>Remove Char</button>
      <button testID="startGame" onPress={startGame}>Start</button>
      <button testID="endGame" onPress={endGame}>End</button>
      <button testID="addScore" onPress={() => addScore(10)}>Add Score</button>
      <button testID="recordCorrect" onPress={() => recordAnswer(true)}>Correct</button>
      <button testID="recordWrong" onPress={() => recordAnswer(false)}>Wrong</button>
      <button testID="reset" onPress={resetGame}>Reset</button>
    </>
  );
};

describe('GameContext', () => {
  it('应提供初始状态', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    expect(getByTestId('book').props.children).toBe('null');
    expect(getByTestId('gameState').props.children).toBe('idle');
    expect(getByTestId('score').props.children).toBe(0);
  });

  it('应选择书籍', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    fireEvent.press(getByTestId('selectBook'));
    expect(getByTestId('book').props.children).toBe('Test Book');
  });

  it('应选择章节', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    fireEvent.press(getByTestId('selectChapter'));
    expect(getByTestId('chapter').props.children).toBe('Test Chapter');
  });

  it('应添加角色', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    fireEvent.press(getByTestId('addChar'));
    expect(getByTestId('characters').props.children).toBe(1);
  });

  it('应移除角色', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    fireEvent.press(getByTestId('addChar'));
    fireEvent.press(getByTestId('removeChar'));
    expect(getByTestId('characters').props.children).toBe(0);
  });

  it('应开始游戏', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    fireEvent.press(getByTestId('startGame'));
    expect(getByTestId('gameState').props.children).toBe('playing');
  });

  it('应结束游戏', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    fireEvent.press(getByTestId('startGame'));
    fireEvent.press(getByTestId('endGame'));
    expect(getByTestId('gameState').props.children).toBe('ended');
  });

  it('应添加分数', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    fireEvent.press(getByTestId('addScore'));
    expect(getByTestId('score').props.children).toBe(10);
  });

  it('应记录正确答案', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    fireEvent.press(getByTestId('recordCorrect'));
    expect(getByTestId('score').props.children).toBe(10);
  });

  it('应重置游戏', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    fireEvent.press(getByTestId('addScore'));
    fireEvent.press(getByTestId('reset'));
    expect(getByTestId('score').props.children).toBe(0);
  });
});

describe('useGame', () => {
  it('在Provider外使用应抛出错误', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useGame must be used within a GameProvider');
  });
});
