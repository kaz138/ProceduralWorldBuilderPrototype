import { useState, useEffect } from "react";
import { useWorldGen } from "../../lib/stores/useWorldGen";
import { useTheme } from "../../lib/stores/useTheme";
import { 
  HelpCircle, 
  Lightbulb, 
  Sparkles, 
  Mountain, 
  Palmtree, 
  Building, 
  Anchor 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PromptInputProps {
  onSubmit: () => void;
}

// World suggestion presets
interface WorldPreset {
  name: string;
  theme: "mountain" | "forest" | "city" | "coastal" | "default";
  icon: React.ReactNode;
  description: string;
  prompt: string;
  bgGradient: string;
}

const PromptInput = ({ onSubmit }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  const [showTips, setShowTips] = useState(false);
  const [showPresets, setShowPresets] = useState(true);
  const { generateWorld } = useWorldGen();
  const { setCurrent } = useTheme();
  
  // World preset suggestions
  const worldPresets: WorldPreset[] = [
    {
      name: "Mountain Village",
      theme: "mountain",
      icon: <Mountain className="w-6 h-6" />,
      description: "A peaceful mountain village with wooden cabins and waterfalls",
      prompt: "A serene mountain village with wooden cabins, pine trees, a waterfall, and snow-capped peaks in the background",
      bgGradient: "from-indigo-800 to-purple-900"
    },
    {
      name: "Enchanted Forest",
      theme: "forest",
      icon: <Palmtree className="w-6 h-6" />,
      description: "A mystical forest with glowing plants and ancient trees",
      prompt: "An enchanted forest with massive ancient trees, glowing mushrooms, hanging vines, and a small clearing with a mystical pond",
      bgGradient: "from-emerald-800 to-green-900"
    },
    {
      name: "Futuristic City",
      theme: "city",
      icon: <Building className="w-6 h-6" />,
      description: "A high-tech city with skyscrapers and flying vehicles",
      prompt: "A futuristic city with towering skyscrapers, floating platforms, neon lights, holographic billboards, and flying vehicles",
      bgGradient: "from-slate-800 to-gray-900"
    },
    {
      name: "Coastal Town",
      theme: "coastal",
      icon: <Anchor className="w-6 h-6" />,
      description: "A picturesque coastal town with a lighthouse and harbor",
      prompt: "A coastal fishing town with a tall lighthouse, wooden piers, colorful boats in the harbor, and beach houses along the shore",
      bgGradient: "from-blue-800 to-cyan-900"
    }
  ];
  
  // Hide presets when user starts typing
  useEffect(() => {
    if (prompt.length > 0) {
      setShowPresets(false);
    } else if (prompt.length === 0 && !showTips) {
      setShowPresets(true);
    }
  }, [prompt, showTips]);
  
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

  const selectPreset = (preset: WorldPreset) => {
    setPrompt(preset.prompt);
    setCurrent(preset.theme);
    setShowPresets(false);
  };

  const examples = [
    "A medieval castle on a hill surrounded by a moat and forest",
    "An alien planet with crystal formations and strange vegetation",
    "A desert oasis with palm trees, sandstone buildings, and a central pool"
  ];

  const insertExample = (example: string) => {
    setPrompt(example);
    setShowPresets(false);
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
          onClick={() => {
            setShowTips(!showTips);
            setShowPresets(showTips && prompt.length === 0);
          }}
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
          
          {prompt.length === 0 && !showTips && !showPresets && (
            <div className="absolute bottom-3 right-3">
              <button 
                type="button"
                onClick={() => setShowPresets(true)}
                className="text-white/50 hover:text-white/80 transition-colors text-sm flex items-center"
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                Show suggestions
              </button>
            </div>
          )}
        </div>
        
        {/* World preset suggestions */}
        <AnimatePresence>
          {showPresets && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-white font-medium mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-indigo-300" />
                Choose a world to get started
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {worldPresets.map((preset) => (
                  <motion.button
                    key={preset.name}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => selectPreset(preset)}
                    className={`flex flex-col items-center justify-center text-white bg-gradient-to-br ${preset.bgGradient} rounded-lg p-5 shadow-lg text-center h-full transition-all hover:shadow-xl border border-white/10`}
                  >
                    <div className="bg-white/20 p-3 rounded-full mb-3">
                      {preset.icon}
                    </div>
                    <h4 className="font-bold text-lg mb-1">{preset.name}</h4>
                    <p className="text-white/80 text-sm">{preset.description}</p>
                  </motion.button>
                ))}
              </div>
              
              <div className="flex justify-center mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPresets(false);
                    setShowTips(true);
                  }}
                  className="text-indigo-300 hover:text-indigo-200 text-sm flex items-center mt-2"
                >
                  <span>Or create your own custom world</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tips & Examples section */}
        <AnimatePresence>
          {showTips && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
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
        </AnimatePresence>
        
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
