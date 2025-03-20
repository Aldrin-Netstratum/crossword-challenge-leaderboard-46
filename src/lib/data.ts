import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLeaderboard, updateLeaderboard, LeaderboardEntry as SupabaseLeaderboardEntry } from './supabase';
import { toast } from '@/components/ui/use-toast';

// Power BI quiz data
const quizData = {
  questions: [
    {
      question: "What does DAX stand for in Power BI?",
      options: ["Data Analysis Expressions", "Dynamic Array XML", "Data Access Extension", "Development Analysis XML"],
      correctAnswer: "Data Analysis Expressions"
    },
    {
      question: "Which of these is NOT a type of visual in Power BI?",
      options: ["Line chart", "Pie chart", "Neural network", "Scatter plot"],
      correctAnswer: "Neural network"
    },
    {
      question: "What language is used for data transformation in Power Query?",
      options: ["SQL", "M", "R", "Python"],
      correctAnswer: "M"
    },
    {
      question: "Which of these is a Power BI file extension?",
      options: [".pbi", ".pbix", ".pwbi", ".pobi"],
      correctAnswer: ".pbix"
    },
    {
      question: "What is a measure in Power BI?",
      options: [
        "A column in a table", 
        "A calculation that uses DAX expressions",
        "A type of chart", 
        "A unit of data size"
      ],
      correctAnswer: "A calculation that uses DAX expressions"
    },
    {
      question: "What is Power BI Desktop primarily used for?",
      options: [
        "Viewing reports", 
        "Creating reports and data models", 
        "Sharing reports", 
        "Managing user access"
      ],
      correctAnswer: "Creating reports and data models"
    },
    {
      question: "Which of these is a benefit of using Power BI?",
      options: [
        "It requires extensive coding knowledge",
        "It can only connect to Microsoft data sources",
        "It provides interactive data visualizations",
        "It's exclusively for financial reporting"
      ],
      correctAnswer: "It provides interactive data visualizations"
    }
  ]
};

export type User = {
  username: string;
  bestTime: number | null;
  bestScore: number | null;
  completedAt: string | null;
};

type LeaderboardEntry = SupabaseLeaderboardEntry;

type GameState = 'not-started' | 'in-progress' | 'completed';

interface AppState {
  currentUser: User | null;
  leaderboard: LeaderboardEntry[];
  gameState: GameState;
  startTime: number | null;
  endTime: number | null;
  currentTime: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  userAnswers: string[];
  isLeaderboardLoading: boolean;
  
  login: (username: string) => void;
  logout: () => void;
  startGame: () => void;
  endGame: () => void;
  updateCurrentTime: (time: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  updateAnswer: (questionIndex: number, answer: string) => void;
  checkAllAnswers: () => void;
  resetGame: () => void;
  fetchLeaderboard: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      leaderboard: [],
      gameState: 'not-started',
      startTime: null,
      endTime: null,
      currentTime: 0,
      currentQuestionIndex: 0,
      totalQuestions: quizData.questions.length,
      userAnswers: Array(quizData.questions.length).fill(''),
      isLeaderboardLoading: false,
      
      login: (username) => {
        const existingUser = get().leaderboard.find(
          entry => entry.username.toLowerCase() === username.toLowerCase()
        );
        
        const user: User = {
          username,
          bestTime: existingUser?.time || null,
          bestScore: existingUser?.score || null,
          completedAt: existingUser?.completedAt || null
        };
        
        set({ currentUser: user });
        get().fetchLeaderboard();
      },
      
      logout: () => {
        set({ 
          currentUser: null,
          gameState: 'not-started',
          startTime: null,
          endTime: null,
          currentTime: 0,
          currentQuestionIndex: 0,
          userAnswers: Array(quizData.questions.length).fill('')
        });
      },
      
      startGame: () => {
        set({ 
          gameState: 'in-progress', 
          startTime: Date.now(),
          currentQuestionIndex: 0,
          userAnswers: Array(quizData.questions.length).fill('')
        });
      },
      
      endGame: async () => {
        const endTime = Date.now();
        const { startTime, currentUser, currentTime, userAnswers } = get();
        
        if (startTime && currentUser) {
          const completedAt = new Date().toISOString();
          
          // Calculate score (number of correct answers)
          const score = userAnswers.reduce((total, answer, index) => {
            const question = quizData.questions[index];
            return total + (answer === question.correctAnswer ? 1 : 0);
          }, 0);
          
          const newEntry: LeaderboardEntry = {
            username: currentUser.username,
            time: currentTime,
            score,
            completedAt
          };

          try {
            const success = await updateLeaderboard(newEntry);
            if (success) {
              await get().fetchLeaderboard();
            } else {
              toast({
                title: "Error updating leaderboard",
                description: "Your score couldn't be saved to the global leaderboard",
                variant: "destructive"
              });
            }
          } catch (error) {
            console.error("Error updating leaderboard:", error);
            toast({
              title: "Error updating leaderboard",
              description: "Your score couldn't be saved to the global leaderboard",
              variant: "destructive"
            });
          }
          
          set({ 
            gameState: 'completed', 
            endTime, 
            currentUser: {
              ...currentUser,
              bestTime: score === get().totalQuestions 
                ? Math.min(currentTime, currentUser.bestTime || Infinity)
                : currentUser.bestTime,
              bestScore: Math.max(score, currentUser.bestScore || 0),
              completedAt
            }
          });
        }
      },
      
      updateCurrentTime: (time) => {
        set({ currentTime: time });
      },
      
      nextQuestion: () => {
        const currentIndex = get().currentQuestionIndex;
        const totalQuestions = get().totalQuestions;
        
        if (currentIndex < totalQuestions - 1) {
          set({ currentQuestionIndex: currentIndex + 1 });
        }
      },
      
      prevQuestion: () => {
        const currentIndex = get().currentQuestionIndex;
        
        if (currentIndex > 0) {
          set({ currentQuestionIndex: currentIndex - 1 });
        }
      },
      
      updateAnswer: (questionIndex, answer) => {
        const { userAnswers } = get();
        const updatedAnswers = [...userAnswers];
        updatedAnswers[questionIndex] = answer;
        
        set({ userAnswers: updatedAnswers });
        
        const currentIndex = get().currentQuestionIndex;
        const totalQuestions = get().totalQuestions;
        
        if (currentIndex < totalQuestions - 1) {
          setTimeout(() => {
            get().nextQuestion();
          }, 300);
        }
      },
      
      checkAllAnswers: () => {
        get().endGame();
      },
      
      resetGame: () => {
        set({ 
          gameState: 'not-started',
          startTime: null,
          endTime: null,
          currentTime: 0,
          currentQuestionIndex: 0,
          userAnswers: Array(quizData.questions.length).fill('')
        });
      },
      
      fetchLeaderboard: async () => {
        set({ isLeaderboardLoading: true });
        try {
          const leaderboardData = await getLeaderboard();
          set({ leaderboard: leaderboardData, isLeaderboardLoading: false });
        } catch (error) {
          console.error("Error fetching leaderboard:", error);
          toast({
            title: "Error fetching leaderboard",
            description: "Couldn't retrieve the global leaderboard data",
            variant: "destructive"
          });
          set({ isLeaderboardLoading: false });
        }
      }
    }),
    {
      name: 'powerbi-quiz-storage'
    }
  )
);

export const getQuizData = () => quizData;

export const getCurrentQuestion = (index: number) => {
  if (index >= 0 && index < quizData.questions.length) {
    return quizData.questions[index];
  }
  return null;
};

export const formatTime = (timeInMs: number): string => {
  const totalSeconds = Math.floor(timeInMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
