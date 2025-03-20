
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HomeIcon } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <span className="text-3xl font-bold text-muted-foreground">?</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Oops! We couldn't find that page
          </p>
        </div>
        
        <Link to="/">
          <Button className="bg-powerbi hover:bg-powerbi/90">
            <HomeIcon className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
