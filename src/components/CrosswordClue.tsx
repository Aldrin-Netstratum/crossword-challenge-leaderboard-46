
import React from 'react';
import { motion } from 'framer-motion';
import { getCurrentClue, useAppStore } from '@/lib/data';

const CrosswordClue: React.FC = () => {
  const { activeCellRow, activeCellCol, direction } = useAppStore();
  
  const currentClue = getCurrentClue(activeCellRow, activeCellCol, direction);
  
  if (!currentClue) {
    return (
      <div className="h-16 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Select a cell to see the clue</p>
      </div>
    );
  }
  
  return (
    <motion.div 
      key={`${currentClue.number}-${direction}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-border shadow-subtle backdrop-blur-sm"
    >
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-sm font-semibold text-primary">{currentClue.number} {direction === 'across' ? 'Across' : 'Down'}</span>
      </div>
      <p className="text-foreground">{currentClue.clue}</p>
    </motion.div>
  );
};

export default CrosswordClue;
