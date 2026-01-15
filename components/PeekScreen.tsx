import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, useMotionValueEvent } from 'framer-motion';
import { Player, Word } from '../types';
import { Button } from './Button';
import { ChevronUp } from 'lucide-react';

interface PeekScreenProps {
  player: Player;
  secretWord: Word;
  onNext: () => void;
  isLastPlayer: boolean;
}

export const PeekScreen: React.FC<PeekScreenProps> = ({ 
  player, 
  secretWord, 
  onNext,
  isLastPlayer 
}) => {
  const [hasPeeked, setHasPeeked] = useState(false);
  const [shakeInstruction, setShakeInstruction] = useState(false);
  
  const controls = useAnimation();
  const y = useMotionValue(0);
  
  const contentOpacity = useTransform(y, [0, -100], [0, 1]);

  useMotionValueEvent(y, "change", (latest) => {
    if (latest < -100 && !hasPeeked) {
      setHasPeeked(true);
    }
  });

  const handleDragEnd = (_: any, info: any) => {
    controls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } });
  };

  const handleNextClick = () => {
    if (!hasPeeked) {
      setShakeInstruction(true);
      setTimeout(() => setShakeInstruction(false), 500);
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-slate-900 relative">
      
      {/* BACKGROUND LAYER (The Secret) - Fixed Position at Bottom */}
      <div className="absolute inset-0 flex flex-col justify-end items-center pb-40 z-0 bg-indigo-950">
        <motion.div 
          style={{ opacity: contentOpacity }}
          className="flex flex-col items-center justify-center p-8 text-center"
        >
           <p className="text-slate-400 font-medium mb-4 uppercase tracking-widest text-xs">
            Твоя роль
          </p>
         
          <h2 className={`text-4xl font-black mb-2 uppercase ${player.isTraitor ? 'text-red-400/60' : 'text-white'}`}>
            {player.isTraitor ? "ПРЕДАТЕЛЬ" : secretWord.term}
          </h2>

          {!player.isTraitor && (
             <p className="text-indigo-300 font-medium text-sm mb-4 bg-indigo-900/40 px-3 py-1 rounded-full">
               {secretWord.definition}
             </p>
          )}

          <p className="text-slate-400 font-medium text-lg border-t border-slate-700/50 pt-4 px-8">
             {player.isTraitor ? "Не выдавай себя" : "Запомни это слово"}
          </p>
        </motion.div>
      </div>

      {/* FOREGROUND LAYER (The Curtain) - Draggable */}
      <motion.div 
        drag="y"
        dragConstraints={{ top: -400, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ y }}
        className="absolute inset-0 bg-slate-800 z-10 rounded-b-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center"
      >
        {/* Top Content: Player Name (No Avatar) */}
        <div className="absolute top-24 left-0 right-0 flex flex-col items-center space-y-6">
          <div className="text-center px-4">
            <h2 className="text-6xl font-black text-white mb-4 leading-tight break-words tracking-tight">{player.name}</h2>
            <p className="text-slate-500 text-xl font-medium uppercase tracking-widest">Твой ход</p>
          </div>
        </div>

        {/* Center/Bottom Content: Instruction */}
        <motion.div 
          animate={shakeInstruction ? { x: [-10, 10, -10, 10, 0], color: "#ef4444" } : { y: [0, -10, 0], color: "#818cf8" }}
          transition={shakeInstruction ? { duration: 0.4 } : { repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className={`flex flex-col items-center absolute bottom-40 ${shakeInstruction ? 'text-red-500' : 'text-indigo-400'}`}
        >
            <ChevronUp size={48} strokeWidth={3} />
            <span className="text-lg font-bold uppercase tracking-wider mt-2">Тяни вверх</span>
            <span className="text-sm text-slate-500 mt-1">чтобы увидеть роль</span>
        </motion.div>
        
        {/* Handle Bar */}
        <div className="absolute bottom-8 w-24 h-1.5 bg-slate-600 rounded-full opacity-50" />
      </motion.div>

      {/* FOOTER CONTROLS */}
      <motion.div 
        className="absolute bottom-8 left-0 right-0 px-6 z-20 pointer-events-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
         <Button 
          fullWidth 
          onClick={handleNextClick}
          style={{ 
             opacity: hasPeeked ? 1 : 0.5, 
             filter: hasPeeked ? 'none' : 'grayscale(1)',
             transform: hasPeeked ? 'scale(1)' : 'scale(0.98)'
          }}
          className={`shadow-xl transition-all duration-300 ${hasPeeked ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}
        >
          {isLastPlayer ? "Начать игру 🚀" : "Я запомнил, следующий 👉"}
        </Button>
      </motion.div>

    </div>
  );
};