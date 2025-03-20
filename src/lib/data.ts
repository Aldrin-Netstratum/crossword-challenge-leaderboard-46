
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// PowerBI related crossword data
const crosswordData = {
  grid: [
    ['D', 'A', 'X', '', 'P', 'B', 'I'],
    ['A', '', 'S', 'L', 'I', 'C', 'E'],
    ['T', 'A', 'B', 'L', 'E', '', 'M'],
    ['A', '', 'I', '', '', 'D', 'E'],
    ['', 'M', 'Z', '', 'K', 'A', 'A'],
    ['M', 'E', 'A', 'S', 'U', 'R', 'E'],
    ['D', 'A', 'X', '', 'P', 'I', '']
  ],
  clues: {
    across: [
      { number: 1, clue: "PowerBI data expression language", answer: "DAX", row: 0, col: 0 },
      { number: 5, clue: "PowerBI's main product abbreviation", answer: "PBI", row: 0, col: 4 },
      { number: 6, clue: "A filter applied to data", answer: "SLICE", row: 1, col: 2 },
      { number: 7, clue: "Data organized in rows and columns", answer: "TABLE", row: 2, col: 0 },
      { number: 10, clue: "An M function for importing data", answer: "MZ", row: 4, col: 1 },
      { number: 11, clue: "A calculation used in visualizations", answer: "MEASURE", row: 5, col: 0 }
    ],
    down: [
      { number: 1, clue: "Where data is stored", answer: "DATA", row: 0, col: 0 },
      { number: 2, clue: "Programming language for PowerBI", answer: "M", row: 0, col: 1 },
      { number: 3, clue: "Visual element that shows data values", answer: "AXIS", row: 0, col: 2 },
      { number: 4, clue: "Interactive element to filter data", answer: "SLICER", row: 1, col: 3 },
      { number: 8, clue: "Business Intelligence abbreviation", answer: "BI", row: 2, col: 2 },
      { number: 9, clue: "Key ____ Indicator, common metric", answer: "PERFORMANCE", row: 0, col: 4 }
    ]
  }
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
  activeCellRow: number | null;
  activeCellCol: number | null;
  userAnswers: string[][];
  direction: 'across' | 'down';
  
  login: (username: string) => void;
  logout: () => void;
  startGame: () => void;
  endGame: () => void;
  updateCurrentTime: (time: number) => void;
  setActiveCell: (row: number, col: number) => void;
  updateCell: (row: number, col: number, value: string) => void;
  toggleDirection: () => void;
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
      activeCellRow: null,
      activeCellCol: null,
      userAnswers: Array(crosswordData.grid.length)
        .fill([])
        .map((_, i) => 
          Array(crosswordData.grid[i].length).fill('')
        ),
      direction: 'across',
      
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
          userAnswers: Array(crosswordData.grid.length)
            .fill([])
            .map((_, i) => 
              Array(crosswordData.grid[i].length).fill('')
            )
        });
      },
      
      startGame: () => {
        set({ 
          gameState: 'in-progress', 
          startTime: Date.now(),
          activeCellRow: 0,
          activeCellCol: 0
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
      
      setActiveCell: (row, col) => {
        // Only set if it's a valid cell (not empty in the grid)
        if (row >= 0 && row < crosswordData.grid.length && 
            col >= 0 && col < crosswordData.grid[row].length &&
            crosswordData.grid[row][col] !== '') {
          set({ activeCellRow: row, activeCellCol: col });
        }
      },
      
      updateCell: (row, col, value) => {
        const { userAnswers, direction, activeCellRow, activeCellCol } = get();
        const updatedAnswers = [...userAnswers];
        updatedAnswers[row][col] = value.toUpperCase();
        
        set({ userAnswers: updatedAnswers });
        
        // Move to next cell if input provided
        if (value && activeCellRow !== null && activeCellCol !== null) {
          let nextRow = activeCellRow;
          let nextCol = activeCellCol;
          
          if (direction === 'across') {
            nextCol += 1;
            // Find next valid cell
            while (nextCol < crosswordData.grid[nextRow].length && 
                  crosswordData.grid[nextRow][nextCol] === '') {
              nextCol += 1;
            }
            
            if (nextCol >= crosswordData.grid[nextRow].length) {
              // Move to next row if at the end
              nextCol = 0;
              nextRow = (nextRow + 1) % crosswordData.grid.length;
            }
          } else {
            nextRow += 1;
            // Find next valid cell
            while (nextRow < crosswordData.grid.length && 
                  (nextCol >= crosswordData.grid[nextRow].length || 
                   crosswordData.grid[nextRow][nextCol] === '')) {
              nextRow += 1;
            }
            
            if (nextRow >= crosswordData.grid.length) {
              // Move to next column if at the bottom
              nextRow = 0;
              nextCol = (nextCol + 1) % crosswordData.grid[0].length;
            }
          }
          
          // Check if we found a valid cell
          if (nextRow < crosswordData.grid.length && 
              nextCol < crosswordData.grid[nextRow].length &&
              crosswordData.grid[nextRow][nextCol] !== '') {
            set({ activeCellRow: nextRow, activeCellCol: nextCol });
          }
        }
        
        // Check if crossword is completed
        let completed = true;
        for (let r = 0; r < crosswordData.grid.length; r++) {
          for (let c = 0; c < crosswordData.grid[r].length; c++) {
            if (crosswordData.grid[r][c] !== '' && 
                updatedAnswers[r][c] !== crosswordData.grid[r][c]) {
              completed = false;
              break;
            }
          }
          if (!completed) break;
        }
        
        if (completed && get().gameState === 'in-progress') {
          get().endGame();
        }
      },
      
      toggleDirection: () => {
        set(state => ({ 
          direction: state.direction === 'across' ? 'down' : 'across' 
        }));
      },
      
      resetGame: () => {
        set({ 
          gameState: 'not-started',
          startTime: null,
          endTime: null,
          currentTime: 0,
          activeCellRow: null,
          activeCellCol: null,
          userAnswers: Array(crosswordData.grid.length)
            .fill([])
            .map((_, i) => 
              Array(crosswordData.grid[i].length).fill('')
            ),
          direction: 'across'
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
      name: 'powerbi-crossword-storage'
    }
  )
);

export const getCrosswordData = () => crosswordData;

export const isEmptyCell = (row: number, col: number): boolean => {
  if (row >= 0 && row < crosswordData.grid.length &&
      col >= 0 && col < crosswordData.grid[row].length) {
    return crosswordData.grid[row][col] === '';
  }
  return true;
};

export const getClueNumberForCell = (row: number, col: number): number | null => {
  const acrossClue = crosswordData.clues.across.find(
    clue => clue.row === row && clue.col === col
  );
  
  const downClue = crosswordData.clues.down.find(
    clue => clue.row === row && clue.col === col
  );
  
  return acrossClue?.number || downClue?.number || null;
};

export const getCurrentClue = (row: number | null, col: number | null, direction: 'across' | 'down'): { clue: string, number: number } | null => {
  if (row === null || col === null) return null;
  
  const clues = direction === 'across' ? crosswordData.clues.across : crosswordData.clues.down;
  
  if (direction === 'across') {
    // Find the across clue that contains this cell
    let startCol = col;
    while (startCol > 0 && crosswordData.grid[row][startCol - 1] !== '') {
      startCol--;
    }
    
    const clue = clues.find(c => c.row === row && c.col === startCol);
    return clue ? { clue: clue.clue, number: clue.number } : null;
  } else {
    // Find the down clue that contains this cell
    let startRow = row;
    while (startRow > 0 && startRow - 1 < crosswordData.grid.length && 
           col < crosswordData.grid[startRow - 1].length && 
           crosswordData.grid[startRow - 1][col] !== '') {
      startRow--;
    }
    
    const clue = clues.find(c => c.row === startRow && c.col === col);
    return clue ? { clue: clue.clue, number: clue.number } : null;
  }
};

export const getCellsForCurrentClue = (row: number | null, col: number | null, direction: 'across' | 'down'): { row: number, col: number }[] => {
  if (row === null || col === null) return [];
  
  const cells: { row: number, col: number }[] = [];
  
  if (direction === 'across') {
    // Find start of word
    let startCol = col;
    while (startCol > 0 && crosswordData.grid[row][startCol - 1] !== '') {
      startCol--;
    }
    
    // Add all cells in the word
    let c = startCol;
    while (c < crosswordData.grid[row].length && crosswordData.grid[row][c] !== '') {
      cells.push({ row, col: c });
      c++;
    }
  } else {
    // Find start of word
    let startRow = row;
    while (startRow > 0 && 
           col < crosswordData.grid[startRow - 1].length && 
           crosswordData.grid[startRow - 1][col] !== '') {
      startRow--;
    }
    
    // Add all cells in the word
    let r = startRow;
    while (r < crosswordData.grid.length && 
           col < crosswordData.grid[r].length && 
           crosswordData.grid[r][col] !== '') {
      cells.push({ row: r, col });
      r++;
    }
  }
  
  return cells;
};

export const formatTime = (timeInMs: number): string => {
  const totalSeconds = Math.floor(timeInMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
