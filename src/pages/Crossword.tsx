
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppStore, formatTime } from '@/lib/data';
import { Button } from '@/components/ui/button';
import QuizOptions from '@/components/CrosswordGrid';
import QuizQuestion from '@/components/CrosswordClue';
import Timer from '@/components/Timer';
import UserInfo from '@/components/UserInfo';
import { ArrowLeft, ArrowRight, Check, Home, RotateCcw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Quiz: React.FC = () => {
  const {
    currentUser,
    gameState,
    startGame,
    resetGame,
    currentTime,
    currentQuestionIndex,
    totalQuestions,
    nextQuestion,
    prevQuestion,
    checkAllAnswers,
    userAnswers
  } = useAppStore();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Auto-start game when component mounts if not already started or completed
  useEffect(() => {
    if (gameState === 'not-started') {
      startGame();
    }
  }, [gameState, startGame]);
  
  const handlePrevQuestion = () => {
    prevQuestion();
  };
  
  const handleNextQuestion = () => {
    nextQuestion();
  };
  
  const handleSubmitQuiz = () => {
    checkAllAnswers();
  };
  
  const handleReset = () => {
    resetGame();
    startGame();
  };
  
  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };
  
  const isCurrentQuestionAnswered = () => {
    return !!userAnswers[currentQuestionIndex];
  };
  
  const areAllQuestionsAnswered = () => {
    return userAnswers.filter(answer => !!answer).length === totalQuestions;
  };
  
  return (
    <div className="min-h-screen px-4 py-6 md:py-12 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950/30">
      <div className="max-w-md mx-auto">
        <div className="flex flex-col space-y-5">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-1 hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
            >
              <Home size={16} />
              <span>Home</span>
            </Button>
            
            <Timer />
          </div>
          
          <UserInfo />
          
          <AnimatePresence mode="wait">
            {gameState === 'completed' ? (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border border-green-200 dark:border-green-800/30 rounded-lg p-6 text-center shadow-md mb-6"
              >
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-800/20 mb-4">
                    <Trophy className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-800 dark:text-green-400">Quiz Completed!</h2>
                </div>
                
                <div className="mb-6">
                  <p className="text-green-700 dark:text-green-300 mb-2">You completed the quiz in:</p>
                  <div className="text-3xl font-bold text-green-800 dark:text-green-400">
                    {formatTime(currentTime)}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button onClick={handleReset} variant="outline" className="border-green-300 dark:border-green-700 font-medium">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button onClick={handleViewLeaderboard} variant="default" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 font-medium">
                    <Trophy className="mr-2 h-4 w-4" />
                    View Leaderboard
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="in-progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="flex flex-col space-y-5">
                  <QuizQuestion />
                  
                  <QuizOptions />
                  
                  <div className="flex items-center justify-between gap-3 mt-6">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="text-sm flex items-center gap-2 font-medium"
                    >
                      <ArrowLeft size={14} />
                      <span>Previous</span>
                    </Button>
                    
                    {currentQuestionIndex < totalQuestions - 1 ? (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleNextQuestion}
                        disabled={!isCurrentQuestionAnswered()}
                        className="text-sm flex items-center gap-2 font-medium"
                      >
                        <span>Next</span>
                        <ArrowRight size={14} />
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleSubmitQuiz}
                        disabled={!areAllQuestionsAnswered()}
                        className="text-sm flex items-center gap-2 font-medium bg-green-600 hover:bg-green-700"
                      >
                        <span>Finish Quiz</span>
                        <Check size={14} />
                      </Button>
                    )}
                  </div>
                </div>
                
                <motion.div 
                  className="text-center mt-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button 
                    variant="ghost" 
                    onClick={handleViewLeaderboard}
                    className="text-sm flex items-center gap-2 hover:bg-white/50 dark:hover:bg-white/10"
                  >
                    <Trophy size={16} />
                    <span>View Leaderboard</span>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
