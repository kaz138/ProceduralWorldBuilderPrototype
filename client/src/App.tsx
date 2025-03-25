import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import PromptInput from "./components/WorldGen/PromptInput";
import CameraControls from "./components/WorldGen/CameraControls";
import SceneRenderer from "./components/WorldGen/SceneRenderer";
import LoadingIndicator from "./components/WorldGen/LoadingIndicator";
import { useWorldGen } from "./lib/stores/useWorldGen";

function App() {
  const { isLoading, isGenerating } = useWorldGen();
  const [promptVisible, setPromptVisible] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative w-full h-full">
        {/* Three.js Canvas */}
        <Canvas
          shadows
          camera={{
            position: [0, 10, 20],
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "default"
          }}
        >
          {/* Grid background and lighting */}
          <color attach="background" args={["#111"]} />
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 10]} 
            intensity={1} 
            castShadow 
            shadow-mapSize={2048}
          />
          
          {/* Camera controls for scene exploration */}
          <CameraControls />
          
          {/* Render the scene graph with primitives */}
          <SceneRenderer />
        </Canvas>
        
        {/* Loading overlay */}
        {isLoading && <LoadingIndicator />}
        
        {/* Prompt input overlay */}
        {promptVisible && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
            <PromptInput onSubmit={() => setPromptVisible(false)} />
          </div>
        )}
        
        {/* World generation status indicator */}
        {!promptVisible && isGenerating && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white p-2 rounded-md z-10">
            Building world...
          </div>
        )}
        
        {/* Reset button (only show when a world is visible) */}
        {!promptVisible && !isGenerating && (
          <button 
            onClick={() => setPromptVisible(true)}
            className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-md z-10 hover:bg-black/90"
          >
            New World
          </button>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
