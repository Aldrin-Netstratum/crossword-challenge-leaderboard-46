
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  completedAt: string | null;
};

type LeaderboardEntry = {
  username: string;
  time: number;
  completedAt: string;
};

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
  addToLeaderboard: (entry: LeaderboardEntry) => void;
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
      
      login: (username) => {
        const existingUser = get().leaderboard.find(
          entry => entry.username.toLowerCase() === username.toLowerCase()
        );
        
        const user: User = {
          username,
          bestTime: existingUser?.time || null,
          completedAt: existingUser?.completedAt || null
        };
        
        set({ currentUser: user });
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
      
      endGame: () => {
        const endTime = Date.now();
        const { startTime, currentUser, currentTime } = get();
        
        if (startTime && currentUser) {
          const completedAt = new Date().toISOString();
          
          const newEntry: LeaderboardEntry = {
            username: currentUser.username,
            time: currentTime,
            completedAt
          };
          
          let updatedLeaderboard = [...get().leaderboard];
          
          // Check if user already has an entry
          const existingEntryIndex = updatedLeaderboard.findIndex(
            entry => entry.username.toLowerCase() === currentUser.username.toLowerCase()
          );
          
          // If user exists and new time is better, update it
          if (existingEntryIndex !== -1) {
            if (updatedLeaderboard[existingEntryIndex].time > currentTime) {
              updatedLeaderboard[existingEntryIndex] = newEntry;
            }
          } else {
            // Add new entry
            updatedLeaderboard.push(newEntry);
          }
          
          // Sort by time
          updatedLeaderboard.sort((a, b) => a.time - b.time);
          
          set({ 
            gameState: 'completed', 
            endTime, 
            leaderboard: updatedLeaderboard,
            currentUser: {
              ...currentUser,
              bestTime: Math.min(currentTime, currentUser.bestTime || Infinity),
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
        
        // Auto-advance to next question if not on the last one
        const currentIndex = get().currentQuestionIndex;
        const totalQuestions = get().totalQuestions;
        
        if (currentIndex < totalQuestions - 1) {
          // Small delay before moving to next question
          setTimeout(() => {
            get().nextQuestion();
          }, 300);
        }
      },
      
      checkAllAnswers: () => {
        // End the game and calculate score
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
      
      addToLeaderboard: (entry) => {
        set(state => {
          const updatedLeaderboard = [...state.leaderboard, entry];
          updatedLeaderboard.sort((a, b) => a.time - b.time);
          return { leaderboard: updatedLeaderboard };
        });
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
