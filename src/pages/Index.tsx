
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/data";
import { Clock, Brain, LogIn, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const { currentUser } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-powerbi rotate-45"></div>
            <div className="relative z-10 w-8 h-8 flex items-center justify-center text-black font-bold">
              P
            </div>
          </div>
          <span className="font-bold text-xl">PowerBI Quiz</span>
        </motion.div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md w-full mb-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              Sidharth Sham Lal's PowerBI Challenge
            </h1>
            <p className="text-xl text-muted-foreground max-w-xs mx-auto">
              Part of the "Wikipeedika" talk session
            </p>
            <p className="text-md text-muted-foreground mt-2 max-w-xs mx-auto">
              Test your knowledge and compete for the fastest time
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="space-y-4"
          >
            {currentUser ? (
              <Link to="/quiz" className="block">
                <Button size="lg" className="w-full bg-powerbi hover:bg-powerbi/90">
                  <Brain className="mr-2 h-5 w-5" />
                  Start Quiz
                </Button>
              </Link>
            ) : (
              <Link to="/login" className="block">
                <Button size="lg" className="w-full bg-powerbi hover:bg-powerbi/90">
                  <LogIn className="mr-2 h-5 w-5" />
                  Login to Play
                </Button>
              </Link>
            )}

            <Link to="/leaderboard" className="block">
              <Button size="lg" variant="outline" className="w-full">
                <Trophy className="mr-2 h-5 w-5" />
                View Leaderboard
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full"
        >
          <FeatureCard
            icon={<Brain className="h-6 w-6 text-powerbi" />}
            title="PowerBI Theme"
            description="Test your knowledge of PowerBI concepts and features"
          />
          <FeatureCard
            icon={<Clock className="h-6 w-6 text-powerbi" />}
            title="Race Against Time"
            description="Complete the quiz as fast as you can"
          />
          <FeatureCard
            icon={<Trophy className="h-6 w-6 text-powerbi" />}
            title="Compete"
            description="See how you rank on the global leaderboard"
          />
        </motion.div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Sidharth Sham Lal's PowerBI Challenge &copy; {new Date().getFullYear()}</p>
        <p className="text-xs mt-1">A Wikipeedika Production</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="glass rounded-lg p-6 text-center">
    <div className="flex justify-center mb-3">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Index;
