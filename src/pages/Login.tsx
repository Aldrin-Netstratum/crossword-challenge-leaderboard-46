
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { currentUser, login } = useAppStore();
  
  // Redirect if already logged in
  if (currentUser) {
    return <Navigate to="/quiz" />;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    login(username.trim());
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4 inline-block"
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4">
              <div className="relative flex">
                <div className="absolute inset-0 bg-powerbi rotate-45"></div>
                <div className="relative z-10 font-bold text-2xl text-black">P</div>
              </div>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold mb-1 tracking-tight">PowerBI Quiz</h1>
          <p className="text-muted-foreground">Test your knowledge and race against the clock</p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-card/50 backdrop-blur-sm p-6 rounded-lg shadow-subtle border border-border"
        >
          <h2 className="text-xl font-semibold mb-4">Enter Your Username</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="Username"
                  className="w-full"
                  autoFocus
                />
                {error && <p className="text-destructive text-sm mt-1">{error}</p>}
              </div>
              
              <Button type="submit" className="w-full bg-powerbi hover:bg-powerbi/90">
                Start Quiz
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>No account needed, just enter a username to get started!</p>
          </div>
        </motion.div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Challenge yourself with our PowerBI quiz and compete for the fastest time!</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
