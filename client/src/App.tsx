import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { Stars } from "@react-three/drei";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import PromptInput from "./components/WorldGen/PromptInput";
import CameraControls from "./components/WorldGen/CameraControls";
import SceneRenderer from "./components/WorldGen/SceneRenderer";
import BackgroundScene from "./components/WorldGen/BackgroundScene";
import LoadingIndicator from "./components/WorldGen/LoadingIndicator";
import { useWorldGen } from "./lib/stores/useWorldGen";
import { useTheme } from "./lib/stores/useTheme";

function App() {
  const { isLoading, isGenerating } = useWorldGen();
  const [promptVisible, setPromptVisible] = useState(true);
  const { cycleTheme } = useTheme();
  
  // Auto cycle through themes on the welcome screen
  useEffect(() => {
    if (!promptVisible) return;
    
    const interval = setInterval(() => {
      cycleTheme();
    }, 8000); // Change theme every 8 seconds
    
    return () => clearInterval(interval);
  }, [promptVisible, cycleTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative w-full h-full">
        {/* Three.js Canvas */}
        <Canvas
          shadows
          camera={{
            position: [0, 8, 15], // Closer starting position
            fov: 60, // Wider field of view (was 50)
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "default"
          }}
        >
          {/* Background color and lighting */}
          <color attach="background" args={["#0a0a1a"]} />
          
          {/* Render different content based on mode */}
          {promptVisible ? (
            // Animated background scene for welcome screen
            <>
              <Stars 
                radius={100} 
                depth={50} 
                count={5000} 
                factor={4} 
                saturation={0.5} 
                fade 
                speed={0.5} 
              />
              <BackgroundScene />
            </>
          ) : (
            // Regular 3D world rendering with enhanced lighting
            <>
              {/* Increase ambient light intensity for better overall visibility */}
              <ambientLight intensity={0.7} />
              
              {/* Main directional light - brighter */}
              <directionalLight 
                position={[10, 10, 10]} 
                intensity={1.2} 
                castShadow 
                shadow-mapSize={2048}
              />
              
              {/* Add fill light from opposite direction */}
              <directionalLight 
                position={[-5, 8, -10]} 
                intensity={0.6} 
                color="#b0c4de"
              />
              
              {/* Add subtle ground-bounce light */}
              <hemisphereLight 
                args={["#ffffff", "#303030", 0.5]}
              />
              
              {/* Camera controls for scene exploration */}
              <CameraControls />
              
              {/* Render the scene graph with primitives */}
              <SceneRenderer />
            </>
          )}
        </Canvas>
        
        {/* Loading overlay */}
        {isLoading && <LoadingIndicator />}
        
        {/* Prompt input overlay */}
        {promptVisible && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <PromptInput onSubmit={() => setPromptVisible(false)} />
          </div>
        )}
        
        {/* World generation status indicator */}
        {!promptVisible && isGenerating && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 right-4 bg-black/70 text-white p-3 rounded-lg z-10 flex items-center shadow-lg"
          >
            <div className="mr-3 bg-indigo-500 h-3 w-3 rounded-full animate-pulse"></div>
            Building world...
          </motion.div>
        )}
        
        {/* Reset button (only show when a world is visible) */}
        {!promptVisible && !isGenerating && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => setPromptVisible(true)}
            className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg z-10 hover:from-indigo-600 hover:to-purple-600 shadow-lg transition-all"
          >
            New World
          </motion.button>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
