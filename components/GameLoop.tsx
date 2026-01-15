import React, { useState } from 'react';
import { GameState, GamePhase } from '../types';
import { Button } from './Button';
import { RefreshCw, Users, AlertTriangle } from 'lucide-react';

interface GameLoopProps {
  gameState: GameState;
  onReset: () => void;
}

export const GameLoop: React.FC<GameLoopProps> = ({ gameState, onReset }) => {
  const [revealed, setRevealed] = useState(false);

  const traitors = gameState.players.filter(p => p.isTraitor);

  return (
    <div className="flex flex-col h-full p-6 space-y-6 text-center">
      
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        {!revealed ? (
          <>
            <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center animate-pulse">
              <Users size={48} className="text-indigo-400" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Игра началась!</h2>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
                <p className="text-lg leading-relaxed text-slate-300">
                  По очереди называйте ассоциации к вашему слову.
                </p>
                <div className="h-px bg-slate-700 w-full" />
                <p className="text-sm text-slate-400">
                  <span className="text-red-400 font-bold">Предатель</span> не знает слова и должен угадать его или не выдать себя.
                  <br/>
                  <span className="text-emerald-400 font-bold">Мирные</span> должны найти предателя.
                </p>
              </div>
            </div>

            <div className="pt-8">
               <p className="text-slate-500 text-sm mb-4">Когда обсуждение закончится:</p>
               <Button onClick={() => setRevealed(true)} variant="danger" className="w-full max-w-xs">
                 Показать предателя
               </Button>
            </div>
          </>
        ) : (
          <div className="space-y-8 animate-in zoom-in duration-300 w-full max-w-sm">
             <div className="flex flex-col items-center space-y-2">
                <AlertTriangle size={64} className="text-red-500 mb-4" />
                <h3 className="text-slate-400 uppercase tracking-widest text-sm">Слово было</h3>
                <h1 className="text-4xl font-black text-white bg-slate-800 px-6 py-2 rounded-xl border border-slate-700">
                  {gameState.secretWord.term}
                </h1>
                <p className="text-slate-500 text-sm">{gameState.secretWord.definition}</p>
             </div>

             <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20 w-full flex flex-col items-center">
               <h3 className="text-red-400 uppercase tracking-widest text-sm mb-4">
                 {traitors.length > 1 ? "Предатели" : "Предатель"}
               </h3>
               
               <div className="space-y-2">
                 {traitors.map(t => (
                   <p key={t.id} className="text-4xl font-black text-white leading-tight">
                     {t.name}
                   </p>
                 ))}
               </div>
             </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button onClick={onReset} variant="secondary" fullWidth className="flex items-center justify-center gap-2">
          <RefreshCw size={20} />
          {revealed ? "Новая игра" : "Закончить игру"}
        </Button>
      </div>
    </div>
  );
};