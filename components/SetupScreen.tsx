import React, { useState, useEffect } from 'react';
import { CATEGORIES, MIN_PLAYERS } from '../constants';
import { Button } from './Button';
import { Player } from '../types';
import { Plus, X, Users, CheckCircle2, Circle, Minus, Skull } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence, motion } from 'framer-motion';

interface SetupScreenProps {
  onStartGame: (players: Player[], categoryIds: string[], traitorCount: number) => void;
  savedPlayers: Player[];
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame, savedPlayers }) => {
  const [players, setPlayers] = useState<Player[]>(savedPlayers);
  const [inputValue, setInputValue] = useState('');
  
  // Default to just the first category (Mix)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set([CATEGORIES[0].id]));
  const [traitorCount, setTraitorCount] = useState(1);

  // Update traitor count if it exceeds player count - 1
  useEffect(() => {
    if (players.length > 0 && traitorCount >= players.length) {
      setTraitorCount(Math.max(1, players.length - 1));
    }
  }, [players.length, traitorCount]);

  const handleAddPlayer = () => {
    if (inputValue.trim()) {
      const newName = inputValue.trim();
      setInputValue('');
      
      const newPlayer: Player = {
        id: uuidv4(),
        name: newName,
        isTraitor: false
      };
      
      setPlayers(prev => [...prev, newPlayer]);
    }
  };

  const handleRemovePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddPlayer();
  };

  const toggleCategory = (id: string) => {
    const mixId = CATEGORIES[0].id;
    const allIds = CATEGORIES.map(c => c.id);
    
    let newSet = new Set(selectedCategoryIds);

    if (id === mixId) {
        // If Mix is currently selected, clear all
        if (newSet.has(mixId)) {
            newSet.clear();
        } else {
            // Select all
            allIds.forEach(i => newSet.add(i));
        }
    } else {
        // Toggle specific category
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }

        // Logic: If all regular categories are selected, select Mix. Otherwise deselect Mix.
        const regularIds = allIds.filter(i => i !== mixId);
        const allRegularsSelected = regularIds.every(i => newSet.has(i));

        if (allRegularsSelected) {
            newSet.add(mixId);
        } else {
            newSet.delete(mixId);
        }
    }
    
    setSelectedCategoryIds(newSet);
  };

  const handleStart = () => {
    if (players.length < MIN_PLAYERS) return;
    if (selectedCategoryIds.size === 0) return;
    
    onStartGame(players, Array.from(selectedCategoryIds), traitorCount);
  };

  const getRecommendedTraitors = () => {
    if (players.length < 7) return 1;
    if (players.length < 12) return 2;
    return 3;
  };

  const getButtonLabel = () => {
    if (players.length < MIN_PLAYERS) {
      return `Ещё ${Math.max(0, MIN_PLAYERS - players.length)} игрока`;
    }
    if (selectedCategoryIds.size === 0) {
      return 'Выбери категорию';
    }
    return 'Начать игру';
  };

  const recommended = getRecommendedTraitors();
  const isValid = players.length >= MIN_PLAYERS && selectedCategoryIds.size > 0;

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-4 space-y-6 overflow-y-auto pb-32">
      <div className="text-center space-y-2 mt-4">
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
          Тайный Агент
        </h1>
        <p className="text-slate-400 text-sm">Кто предатель?</p>
      </div>

      {/* Players Section */}
      <div className="space-y-3 bg-slate-800/50 p-4 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-indigo-300 font-bold justify-between">
          <div className="flex items-center gap-2">
            <Users size={20} />
            <h2>Игроки ({players.length})</h2>
          </div>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Имя игрока"
            className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button 
            onClick={handleAddPlayer}
            disabled={!inputValue.trim()}
            className="shrink-0 bg-indigo-600 p-3 rounded-xl text-white disabled:opacity-50 active:scale-95 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-2 mt-2 min-h-[50px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {players.map((player) => (
              <motion.div 
                key={player.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="flex items-center justify-between bg-slate-700/50 px-4 py-3 rounded-xl border border-slate-600"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-600 flex-shrink-0 flex items-center justify-center border border-slate-500">
                      <span className="text-xs font-bold text-slate-300">
                        {player.name.charAt(0).toUpperCase()}
                      </span>
                  </div>
                  <span className="font-bold text-lg text-white truncate">{player.name}</span>
                </div>
                <button onClick={() => handleRemovePlayer(player.id)} className="text-slate-400 hover:text-red-400 p-2 shrink-0">
                  <X size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {players.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center w-full text-slate-500 text-sm py-4 border-2 border-dashed border-slate-700 rounded-xl"
            >
              Добавьте хотя бы {MIN_PLAYERS} игроков
            </motion.div>
          )}
        </div>
      </div>

      {/* Traitor Settings */}
      <div className="bg-slate-800/50 p-4 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
           <div className="flex items-center gap-2 text-red-400 font-bold">
              <Skull size={20} />
              <h2>Предатели</h2>
           </div>
           <span className="text-xs text-slate-500">
             Рекомендуется: <span className="text-white font-bold">{recommended}</span>
           </span>
        </div>
        
        <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded-xl border border-slate-700">
           <button 
             onClick={() => setTraitorCount(Math.max(1, traitorCount - 1))}
             disabled={traitorCount <= 1}
             className="w-10 h-10 flex items-center justify-center bg-slate-700 rounded-lg text-white disabled:opacity-30 active:scale-95 transition-all"
           >
             <Minus size={20} />
           </button>
           
           <span className="text-2xl font-bold text-white w-12 text-center">{traitorCount}</span>
           
           <button 
             onClick={() => setTraitorCount(Math.min(players.length - 1, traitorCount + 1))}
             disabled={players.length < 3 || traitorCount >= players.length - 1}
             className="w-10 h-10 flex items-center justify-center bg-slate-700 rounded-lg text-white disabled:opacity-30 active:scale-95 transition-all"
           >
             <Plus size={20} />
           </button>
        </div>
      </div>

      {/* Categories Section - List Style */}
      <div className="space-y-3">
        <h2 className="text-indigo-300 font-bold px-1">Категории (можно несколько)</h2>
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
          {CATEGORIES.map((cat) => {
             const Icon = cat.icon;
             const isSelected = selectedCategoryIds.has(cat.id);
             return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`relative p-3 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-900/20'
                    : 'bg-slate-800/50 border-transparent hover:bg-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex flex-col items-start">
                     <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {cat.name}
                    </span>
                    <span className="text-xs text-slate-500">{cat.words.length} слов</span>
                  </div>
                </div>
                
                {isSelected ? (
                  <CheckCircle2 size={20} className="text-indigo-400" />
                ) : (
                  <Circle size={20} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-6 left-6 right-6 max-w-md mx-auto z-10">
        <Button 
          fullWidth 
          onClick={handleStart} 
          disabled={!isValid}
          className="text-lg py-4 shadow-xl shadow-indigo-900/50 flex items-center justify-center gap-2"
        >
          {getButtonLabel()}
        </Button>
      </div>
    </div>
  );
};