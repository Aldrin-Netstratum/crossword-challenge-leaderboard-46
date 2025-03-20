
import { formatTime, useAppStore } from "@/lib/data";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, LogOut, Trophy, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserInfo = () => {
  const { currentUser, logout } = useAppStore();
  
  if (!currentUser) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="glass rounded-lg p-3 mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center">
            <UserIcon size={14} className="text-primary-foreground" />
          </div>
          <div className="text-sm">
            <span className="font-medium">{currentUser.username}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentUser.bestScore !== null && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle size={14} className="text-green-500" />
              <span>Best: {currentUser.bestScore}/{useAppStore.getState().totalQuestions}</span>
            </div>
          )}
          {currentUser.bestTime && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Trophy size={14} className="text-primary" />
              <span>{formatTime(currentUser.bestTime)}</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={logout}
            className="h-7 w-7"
          >
            <LogOut size={14} />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserInfo;
