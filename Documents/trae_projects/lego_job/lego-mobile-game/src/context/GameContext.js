import React, { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [currentBook, setCurrentBook] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [adventureProgress, setAdventureProgress] = useState({
    completed: 0,
    total: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const selectBook = useCallback((book) => {
    setCurrentBook(book);
    setCurrentChapter(null);
    setSelectedCharacters([]);
  }, []);

  const selectChapter = useCallback((chapter) => {
    setCurrentChapter(chapter);
  }, []);

  const addCharacter = useCallback((character) => {
    setSelectedCharacters(prev => {
      if (prev.find(c => c.id === character.id)) {
        return prev;
      }
      return [...prev, character];
    });
  }, []);

  const removeCharacter = useCallback((characterId) => {
    setSelectedCharacters(prev => prev.filter(c => c.id !== characterId));
  }, []);

  const clearCharacters = useCallback(() => {
    setSelectedCharacters([]);
  }, []);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setAdventureProgress({
      completed: 0,
      total: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
    });
  }, []);

  const endGame = useCallback(() => {
    setGameState('ended');
  }, []);

  const pauseGame = useCallback(() => {
    setGameState('paused');
  }, []);

  const resumeGame = useCallback(() => {
    setGameState('playing');
  }, []);

  const addScore = useCallback((points) => {
    setScore(prev => prev + points);
  }, []);

  const recordAnswer = useCallback((isCorrect) => {
    setAdventureProgress(prev => ({
      ...prev,
      completed: prev.completed + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: prev.wrongAnswers + (isCorrect ? 0 : 1),
    }));
    if (isCorrect) {
      addScore(10);
    }
  }, [addScore]);

  const resetGame = useCallback(() => {
    setCurrentBook(null);
    setCurrentChapter(null);
    setSelectedCharacters([]);
    setGameState('idle');
    setScore(0);
    setAdventureProgress({
      completed: 0,
      total: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
    });
  }, []);

  const value = {
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
    clearCharacters,
    startGame,
    endGame,
    pauseGame,
    resumeGame,
    addScore,
    recordAnswer,
    resetGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext;
