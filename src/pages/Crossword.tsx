
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppStore, formatTime } from '@/lib/data';
import { Button } from '@/components/ui/button';
import CrosswordGrid from '@/components/CrosswordGrid';
import CrosswordClue from '@/components/CrosswordClue';
import Timer from '@/components/Timer';
import UserInfo from '@/components/UserInfo';
import { ArrowLeft, CornerDownLeft, LayoutGrid, RotateCcw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Crossword: React.FC = () => {
  const {
    currentUser,
    gameState,
    startGame,
    resetGame,
    currentTime,
    toggleDirection,
    direction
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
  
  const handleToggleDirection = () => {
    toggleDirection();
  };
  
  const handleReset = () => {
    resetGame();
    startGame();
  };
  
  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };
  
  return (
    <div className="min-h-screen px-4 py-6 md:py-12">
      <div className="max-w-md mx-auto">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-1"
            >
              <ArrowLeft size={16} />
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
                className="bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800/30 rounded-lg p-6 text-center shadow-subtle mb-6"
              >
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-800/20 mb-2">
                    <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-800 dark:text-green-400">Completed!</h2>
                </div>
                
                <div className="mb-6">
                  <p className="text-green-700 dark:text-green-300 mb-2">You completed the crossword in:</p>
                  <div className="text-3xl font-bold text-green-800 dark:text-green-400">
                    {formatTime(currentTime)}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button onClick={handleReset} variant="outline" className="border-green-300 dark:border-green-700">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Play Again
                  </Button>
                  <Button onClick={handleViewLeaderboard} variant="default" className="bg-powerbi hover:bg-powerbi/90">
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
                className="space-y-4"
              >
                <div className="flex flex-col space-y-4">
                  <CrosswordClue />
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleToggleDirection}
                      className="text-xs flex items-center gap-1"
                    >
                      {direction === 'across' ? (
                        <>
                          <CornerDownLeft size={14} className="rotate-90" />
                          <span>Across</span>
                        </>
                      ) : (
                        <>
                          <CornerDownLeft size={14} />
                          <span>Down</span>
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleReset}
                      className="text-xs flex items-center gap-1"
                    >
                      <RotateCcw size={14} />
                      <span>Reset</span>
                    </Button>
                  </div>
                </div>
                
                <CrosswordGrid />
                
                <div className="text-center mt-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleViewLeaderboard}
                    className="text-xs flex items-center gap-1"
                  >
                    <Trophy size={14} />
                    <span>View Leaderboard</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Crossword;
