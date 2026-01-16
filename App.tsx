import React, { useState } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { PeekScreen } from './components/PeekScreen';
import { GameLoop } from './components/GameLoop';
import { GameState, GamePhase, Player, Category } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { CATEGORIES } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.SETUP,
    players: [],
    currentPeekIndex: 0,
    secretWord: { term: '', definition: '' },
    selectedCategoryIds: []
  });

  const startGame = (players: Player[], categoryIds: string[], traitorCount: number) => {
    // 1. Aggregate words from all selected categories
    const selectedCategories = CATEGORIES.filter(c => categoryIds.includes(c.id));
    const allWords = selectedCategories.flatMap(c => c.words);

    // Deduplicate words based on term to handle "Mix" overlap
    const uniqueWordsMap = new Map();
    allWords.forEach(w => uniqueWordsMap.set(w.term, w));
    const pool = Array.from(uniqueWordsMap.values()) as any[];

    // If pool is somehow empty (shouldn't happen due to validation), fallback
    if (pool.length === 0) return;

    // 2. Select random word object
    const randomWordObj = pool[Math.floor(Math.random() * pool.length)];
    
    // 3. Select N random traitors using Fisher-Yates shuffle for unbiased distribution
    const playersForShuffle = [...players];
    for (let i = playersForShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playersForShuffle[i], playersForShuffle[j]] = [playersForShuffle[j], playersForShuffle[i]];
    }
    
    const traitorIds = new Set(playersForShuffle.slice(0, traitorCount).map(p => p.id));
    
    // 4. Update players, preserving original join order
    const playersWithRoles = players.map(p => ({
      ...p,
      isTraitor: traitorIds.has(p.id)
    }));

    setGameState({
      phase: GamePhase.PEEK,
      players: playersWithRoles,
      currentPeekIndex: 0,
      secretWord: randomWordObj,
      selectedCategoryIds: categoryIds
    });
  };

  const nextPeek = () => {
    if (gameState.currentPeekIndex < gameState.players.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentPeekIndex: prev.currentPeekIndex + 1
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        phase: GamePhase.PLAYING
      }));
    }
  };

  const resetGame = () => {
    setGameState(prev => ({
      phase: GamePhase.SETUP,
      players: prev.players.map(p => ({ ...p, isTraitor: false })), 
      currentPeekIndex: 0,
      secretWord: { term: '', definition: '' },
      selectedCategoryIds: prev.selectedCategoryIds
    }));
  };

  // Render logic based on phase
  let content;
  let key = 'setup';

  switch (gameState.phase) {
    case GamePhase.SETUP:
      key = 'setup';
      content = <SetupScreen onStartGame={startGame} savedPlayers={gameState.players} />;
      break;
    case GamePhase.PEEK:
      const currentPlayer = gameState.players[gameState.currentPeekIndex];
      const isLast = gameState.currentPeekIndex === gameState.players.length - 1;
      key = `peek-${currentPlayer.id}`; // Unique key triggers transition
      content = (
        <PeekScreen 
          key={currentPlayer.id}
          player={currentPlayer}
          secretWord={gameState.secretWord}
          onNext={nextPeek}
          isLastPlayer={isLast}
        />
      );
      break;
    case GamePhase.PLAYING:
    case GamePhase.REVEAL:
      key = 'playing';
      content = <GameLoop gameState={gameState} onReset={resetGame} />;
      break;
  }

  return (
    <div className="h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden font-sans select-none">
       <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {content}
          </motion.div>
       </AnimatePresence>
    </div>
  );
};

export default App;