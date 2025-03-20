
import React from 'react';
import { motion } from 'framer-motion';
import { 
  getCurrentQuestion,
  useAppStore 
} from '@/lib/data';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const QuizOptions: React.FC = () => {
  const { 
    currentQuestionIndex, 
    userAnswers,
    updateAnswer,
    gameState
  } = useAppStore();
  
  const currentQuestion = getCurrentQuestion(currentQuestionIndex);
  
  if (!currentQuestion) return null;
  
  const handleSelectOption = (value: string) => {
    if (gameState !== 'in-progress') return;
    updateAnswer(currentQuestionIndex, value);
  };
  
  const isCorrectAnswer = (option: string) => {
    return gameState === 'completed' && option === currentQuestion.correctAnswer;
  };
  
  const isIncorrectSelected = (option: string) => {
    return gameState === 'completed' && 
           option === userAnswers[currentQuestionIndex] && 
           option !== currentQuestion.correctAnswer;
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="w-full max-w-md mx-auto mt-4"
    >
      <RadioGroup
        value={userAnswers[currentQuestionIndex] || ''}
        onValueChange={handleSelectOption}
        className="space-y-3"
        disabled={gameState === 'completed'}
      >
        {currentQuestion.options.map((option, index) => (
          <label
            key={`option-${index}`}
            className={cn(
              "flex items-center justify-between w-full p-4 rounded-lg border transition-all cursor-pointer",
              userAnswers[currentQuestionIndex] === option && gameState === 'in-progress' 
                ? "border-primary bg-primary/5" 
                : "border-muted bg-card hover:bg-accent/5",
              isCorrectAnswer(option) && "border-green-500 bg-green-50 dark:bg-green-900/20",
              isIncorrectSelected(option) && "border-red-500 bg-red-50 dark:bg-red-900/20"
            )}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem 
                value={option} 
                id={`option-${index}`} 
                className={cn(
                  isCorrectAnswer(option) && "border-green-500 text-green-500",
                  isIncorrectSelected(option) && "border-red-500 text-red-500"
                )}
              />
              <span className="text-base">{option}</span>
            </div>
            
            {gameState === 'completed' && (
              <>
                {isCorrectAnswer(option) && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {isIncorrectSelected(option) && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </>
            )}
          </label>
        ))}
      </RadioGroup>
    </motion.div>
  );
};

export default QuizOptions;
