
import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/data";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

const Timer = () => {
  const { gameState, startTime, updateCurrentTime, currentTime } = useAppStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (gameState === 'in-progress' && startTime) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Set up new interval
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        updateCurrentTime(elapsed);
      }, 1000); // Update every second
    } else if (gameState !== 'in-progress' && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState, startTime, updateCurrentTime]);

  const minutes = Math.floor(currentTime / 60000);
  const seconds = Math.floor((currentTime % 60000) / 1000);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-sm font-medium"
    >
      <Clock size={14} className={gameState === 'in-progress' ? 'text-primary animate-pulse-subtle' : ''} />
      <span>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
    </motion.div>
  );
};

export default Timer;
