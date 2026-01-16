import React, { useState } from 'react';
import { GameState, GamePhase } from '../types';
import { Button } from './Button';
import { RefreshCw, Users, AlertTriangle, RotateCw, Info } from 'lucide-react';

interface GameLoopProps {
  gameState: GameState;
  onReset: () => void;
}

export const GameLoop: React.FC<GameLoopProps> = ({ gameState, onReset }) => {
  const [revealed, setRevealed] = useState(false);
  
  // Select random starting player once on mount
  // We explicitly select from the full list of players to ensure it can be anyone (traitor or innocent)
  const [startingPlayer] = useState(() => {
    const players = gameState.players;
    if (!players || players.length === 0) return { id: 'err', name: '?', isTraitor: false };
    
    // Pick a random index from 0 to length-1
    const idx = Math.floor(Math.random() * players.length);
    return players[idx];
  });

  const traitors = gameState.players.filter(p => p.isTraitor);

  return (
    <div className="flex flex-col h-full p-6 space-y-6 text-center">
      
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        {!revealed ? (
          <>
            <div className="text-center space-y-4">
               <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest">
                 <RotateCw size={14} />
                 <span>Ход по часовой стрелке</span>
               </div>
               
               <div>
                 <p className="text-slate-500 text-sm mb-1">Первым начинает</p>
                 <h2 className="text-4xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                   {startingPlayer.name}
                 </h2>
               </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 text-left w-full backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={20} className="text-indigo-400" />
                  <h3 className="font-bold text-white">Правила игры</h3>
                </div>
                
                <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-400 mt-0.5">1</span>
                    <span>Каждый игрок называет <strong>одну ассоциацию</strong> к своему слову.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-400 mt-0.5">2</span>
                    <span><span className="text-red-400 font-bold">Предатель</span> не знает слово. Его цель — понять слово и сказать его в свой ход.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-400 mt-0.5">3</span>
                    <span>Голосуйте кто предатель в любой ход</span>
                  </li>
                </ul>
            </div>

            <div className="pt-4 w-full">
               <Button onClick={() => setRevealed(true)} variant="danger" fullWidth>
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