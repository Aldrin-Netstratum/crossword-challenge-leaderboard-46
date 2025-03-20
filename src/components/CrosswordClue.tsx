
import React from 'react';
import { motion } from 'framer-motion';
import { getCurrentClue, useAppStore } from '@/lib/data';
import { Lightbulb } from 'lucide-react';

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
      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/70 dark:to-indigo-950/30 rounded-lg border border-blue-100 dark:border-indigo-900/50 shadow-md backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-primary/20 dark:bg-primary/30 w-7 h-7 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-primary-foreground">{currentClue.number}</span>
        </div>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {direction === 'across' ? '→ Across' : '↓ Down'}
        </span>
      </div>
      <div className="flex items-start gap-2">
        <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
        <p className="text-foreground font-medium">{currentClue.clue}</p>
      </div>
    </motion.div>
  );
};

export default CrosswordClue;
