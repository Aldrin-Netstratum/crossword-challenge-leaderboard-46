
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore, formatTime } from '@/lib/data';
import { Button } from '@/components/ui/button';
import UserInfo from '@/components/UserInfo';
import { ArrowLeft, Award, CheckCircle, Clock, Medal, Trophy, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard: React.FC = () => {
  const { leaderboard, currentUser, totalQuestions } = useAppStore();
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getMedalColor = (index: number) => {
    switch(index) {
      case 0: return 'text-yellow-500';
      case 1: return 'text-gray-400';
      case 2: return 'text-amber-600';
      default: return 'text-gray-300';
    }
  };
  
  const getMedalIcon = (index: number) => {
    switch(index) {
      case 0: return <Trophy className={`h-5 w-5 ${getMedalColor(index)}`} />;
      case 1: return <Medal className={`h-5 w-5 ${getMedalColor(index)}`} />;
      case 2: return <Award className={`h-5 w-5 ${getMedalColor(index)}`} />;
      default: return null;
    }
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="min-h-screen px-4 py-6 md:py-12">
      <div className="max-w-md mx-auto">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              <span>Home</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/quiz')}
            >
              Play Quiz
            </Button>
          </div>
          
          <UserInfo />
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-lg p-6 mb-6"
          >
            <h1 className="text-2xl font-bold mb-6 text-center">Leaderboard</h1>
            
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-10 w-10 mx-auto mb-4 opacity-20" />
                <p>No completed quizzes yet!</p>
                <p className="text-sm mt-2">Be the first to take the quiz</p>
              </div>
            ) : (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-2"
              >
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = currentUser && 
                    entry.username.toLowerCase() === currentUser.username.toLowerCase();
                  
                  return (
                    <motion.div
                      key={`${entry.username}-${index}`}
                      variants={item}
                      className={`flex items-center justify-between p-3 rounded-md ${
                        isCurrentUser 
                          ? 'bg-primary/10 dark:bg-primary/20 border border-primary/20' 
                          : 'bg-card/50 border border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8">
                          {index < 3 
                            ? getMedalIcon(index)
                            : <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                          }
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                            <User size={14} />
                          </div>
                          
                          <span className={`text-sm font-medium ${
                            isCurrentUser ? 'text-primary-foreground' : ''
                          }`}>
                            {entry.username}
                            {isCurrentUser && <span className="ml-1 text-xs">(you)</span>}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-sm">
                          <CheckCircle size={14} className="text-green-500" />
                          <span className="font-medium">{entry.score}/{totalQuestions}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} />
                          <span>{formatTime(entry.time)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(entry.completedAt)}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
