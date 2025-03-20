import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  getCrosswordData, 
  isEmptyCell, 
  getClueNumberForCell,
  getCellsForCurrentClue, 
  useAppStore 
} from '@/lib/data';

const CrosswordGrid: React.FC = () => {
  const { 
    userAnswers, 
    activeCellRow, 
    activeCellCol, 
    direction, 
    setActiveCell, 
    updateCell,
    toggleDirection,
    gameState
  } = useAppStore();
  
  const gridRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);
  
  const crosswordData = getCrosswordData();
  const grid = crosswordData.grid;
  
  // Initialize input refs
  useEffect(() => {
    inputRefs.current = Array(grid.length)
      .fill(null)
      .map(() => Array(grid[0].length).fill(null));
  }, [grid]);
  
  // Focus active cell
  useEffect(() => {
    if (activeCellRow !== null && activeCellCol !== null && gameState === 'in-progress') {
      const input = inputRefs.current[activeCellRow][activeCellCol];
      if (input) {
        input.focus();
      }
    }
  }, [activeCellRow, activeCellCol, gameState]);
  
  const handleCellClick = (row: number, col: number) => {
    if (isEmptyCell(row, col) || gameState !== 'in-progress') return;
    
    if (row === activeCellRow && col === activeCellCol) {
      // If clicking on already active cell, toggle direction
      toggleDirection();
    } else {
      setActiveCell(row, col);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    if (gameState !== 'in-progress') return;
    
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      moveToNextCell(row, col, 0, 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moveToNextCell(row, col, 0, -1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveToNextCell(row, col, 1, 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveToNextCell(row, col, -1, 0);
    } else if (e.key === 'Backspace' && !userAnswers[row][col]) {
      e.preventDefault();
      // Move to previous cell if current cell is empty
      if (direction === 'across') {
        moveToNextCell(row, col, 0, -1);
      } else {
        moveToNextCell(row, col, -1, 0);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Toggle direction
      toggleDirection();
    }
  };
  
  const moveToNextCell = (row: number, col: number, rowDelta: number, colDelta: number) => {
    let nextRow = row + rowDelta;
    let nextCol = col + colDelta;
    
    // Keep moving in the specified direction until a valid cell is found
    while (
      nextRow >= 0 && 
      nextRow < grid.length && 
      nextCol >= 0 && 
      nextCol < grid[0].length
    ) {
      if (!isEmptyCell(nextRow, nextCol)) {
        setActiveCell(nextRow, nextCol);
        return;
      }
      nextRow += rowDelta;
      nextCol += colDelta;
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    if (gameState !== 'in-progress') return;
    
    const value = e.target.value;
    if (value.length <= 1) {
      const validChar = value.replace(/[^A-Za-z]/g, '');
      updateCell(row, col, validChar);
    }
  };
  
  // Get cells that belong to the current active clue
  const highlightedCells = activeCellRow !== null && activeCellCol !== null
    ? getCellsForCurrentClue(activeCellRow, activeCellCol, direction)
    : [];
  
  const isHighlighted = (row: number, col: number) => {
    return highlightedCells.some(cell => cell.row === row && cell.col === col);
  };
  
  const isActive = (row: number, col: number) => {
    return row === activeCellRow && col === activeCellCol;
  };
  
  const isCorrect = (row: number, col: number) => {
    return userAnswers[row][col] !== '' && 
           userAnswers[row][col].toUpperCase() === grid[row][col];
  };
  
  const isIncorrect = (row: number, col: number) => {
    return userAnswers[row][col] !== '' && 
           userAnswers[row][col].toUpperCase() !== grid[row][col];
  };
  
  const getCellClassName = (row: number, col: number) => {
    if (isEmptyCell(row, col)) return 'crossword-cell empty';
    
    let className = 'crossword-cell filled relative';
    
    if (isActive(row, col)) {
      className += ' active';
    } else if (isHighlighted(row, col)) {
      className += ' highlighted';
    }
    
    if (gameState === 'completed') {
      if (isCorrect(row, col)) {
        className += ' correct';
      } else if (isIncorrect(row, col)) {
        className += ' incorrect';
      }
    }
    
    return className;
  };
  
  return (
    <motion.div 
      ref={gridRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto"
    >
      <div 
        className="grid gap-0.5 mx-auto border-2 border-gray-300 rounded-lg p-1.5 bg-gray-100 dark:bg-gray-800 shadow-subtle"
        style={{ 
          gridTemplateRows: `repeat(${grid.length}, minmax(0, 1fr))`,
          width: 'min(95vw, 500px)',
          height: 'min(95vw, 500px)',
        }}
      >
        {grid.map((row, rowIndex) => (
          <div 
            key={`row-${rowIndex}`} 
            className="grid grid-flow-col gap-0.5"
            style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}
          >
            {row.map((cell, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={getCellClassName(rowIndex, colIndex)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {!isEmptyCell(rowIndex, colIndex) && (
                  <>
                    {getClueNumberForCell(rowIndex, colIndex) && (
                      <span className="crossword-number">{getClueNumberForCell(rowIndex, colIndex)}</span>
                    )}
                    <input
                      ref={el => {
                        if (inputRefs.current[rowIndex]) {
                          inputRefs.current[rowIndex][colIndex] = el;
                        }
                      }}
                      type="text"
                      maxLength={1}
                      value={userAnswers[rowIndex][colIndex]}
                      onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                      disabled={gameState === 'completed'}
                      className="crossword-cell-input"
                      autoComplete="off"
                      aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}`}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CrosswordGrid;
