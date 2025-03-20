
import React from 'react';
import { motion } from 'framer-motion';
import { getCurrentQuestion, useAppStore } from '@/lib/data';
import { HelpCircle } from 'lucide-react';

const QuizQuestion: React.FC = () => {
  const { currentQuestionIndex } = useAppStore();
  
  const currentQuestion = getCurrentQuestion(currentQuestionIndex);
  
  if (!currentQuestion) {
    return (
      <div className="h-16 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading questions...</p>
      </div>
    );
  }
  
  return (
    <motion.div 
      key={`question-${currentQuestionIndex}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/70 dark:to-indigo-950/30 rounded-lg border border-blue-100 dark:border-indigo-900/50 shadow-md backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-primary/20 dark:bg-primary/30 w-8 h-8 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-primary-foreground">{currentQuestionIndex + 1}</span>
        </div>
        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
          Question {currentQuestionIndex + 1} of {useAppStore.getState().totalQuestions}
        </span>
      </div>
      <div className="flex items-start gap-2">
        <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-foreground font-medium">{currentQuestion.question}</p>
      </div>
    </motion.div>
  );
};

export default QuizQuestion;
