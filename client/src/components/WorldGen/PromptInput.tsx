import { useState } from "react";
import { useWorldGen } from "../../lib/stores/useWorldGen";
import { HelpCircle, Lightbulb, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface PromptInputProps {
  onSubmit: () => void;
}

const PromptInput = ({ onSubmit }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  const [showTips, setShowTips] = useState(false);
  const { generateWorld } = useWorldGen();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (prompt.trim().length === 0) return;
    
    try {
      // Start world generation process
      generateWorld(prompt);
      onSubmit();
    } catch (error) {
      console.error("Failed to generate world:", error);
    }
  };

  const examples = [
    "A serene mountain village with wooden cabins, pine trees, and a flowing river",
    "A futuristic city with towering skyscrapers, floating platforms, and neon lights",
    "A coastal fishing town with a lighthouse, piers, and colorful boats in the harbor"
  ];

  const insertExample = (example: string) => {
    setPrompt(example);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black/40 backdrop-blur-xl p-8 rounded-xl max-w-2xl w-full mx-4 border border-white/10 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-indigo-300" />
          </div>
          <h1 className="text-3xl font-bold text-white">World Generator</h1>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTips(!showTips)}
          className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Show Tips"
        >
          <HelpCircle className="w-5 h-5 text-white/80" />
        </motion.button>
      </div>

      <p className="text-white/80 mb-6 text-lg">
        Describe your dream world and watch it come to life in 3D.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the world you want to create..."
            className="w-full p-4 rounded-lg bg-black/30 text-white border border-white/20 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-lg"
          />
          
          {prompt.length === 0 && (
            <div className="absolute bottom-3 right-3">
              <button 
                type="button"
                onClick={() => setShowTips(!showTips)}
                className="text-white/50 hover:text-white/80 transition-colors text-sm flex items-center"
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                Need ideas?
              </button>
            </div>
          )}
        </div>
        
        {/* Examples section */}
        {showTips && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 rounded-lg p-4 border border-white/10"
          >
            <h3 className="text-white font-medium mb-2 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-yellow-300" />
              Tips & Examples
            </h3>
            
            <div className="space-y-3 text-white/80 text-sm mt-3">
              <p className="font-medium text-indigo-300">Try these examples:</p>
              
              <div className="space-y-2">
                {examples.map((example, index) => (
                  <motion.button 
                    key={index}
                    whileHover={{ x: 5 }}
                    onClick={() => insertExample(example)}
                    type="button"
                    className="block text-left text-white/70 hover:text-white transition-colors w-full px-2 py-1 rounded hover:bg-white/10"
                  >
                    "{example}"
                  </motion.button>
                ))}
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <p className="font-medium text-indigo-300 mb-1">For better results:</p>
                <ul className="list-disc pl-5 space-y-1 text-white/70">
                  <li>Include terrain details (mountains, water, fields)</li>
                  <li>Describe structures and their relationships</li>
                  <li>Specify colors and sizes where important</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="flex justify-end">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={prompt.trim().length === 0}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg disabled:opacity-50 disabled:pointer-events-none"
          >
            Generate World
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default PromptInput;
