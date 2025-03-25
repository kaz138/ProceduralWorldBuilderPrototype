import { useState } from "react";
import { useWorldGen } from "@/lib/stores/useWorldGen";

interface PromptInputProps {
  onSubmit: () => void;
}

const PromptInput = ({ onSubmit }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
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

  return (
    <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg max-w-2xl w-full mx-4">
      <h1 className="text-3xl font-bold text-white mb-2">Procedural World Generator</h1>
      <p className="text-white/80 mb-6">
        Enter a text prompt to generate a unique 3D world. Be descriptive about the
        landscape, structures, and features you want to see.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the world you want to create... (e.g., 'A small coastal village with fishing huts, a lighthouse on a cliff, and boats in the harbor')"
            className="w-full p-3 rounded-md bg-black/30 text-white border border-white/20 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-white text-black px-6 py-2 rounded-md font-medium hover:bg-white/90 transition-colors"
            disabled={prompt.trim().length === 0}
          >
            Generate World
          </button>
        </div>
        
        <div className="text-white/60 text-sm pt-4">
          <p>Tips:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Include terrain details (mountains, water, fields)</li>
            <li>Describe structures and their relationships</li>
            <li>Specify colors and sizes where important</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default PromptInput;
