import { create } from "zustand";
import { apiRequest } from "../queryClient";
import { SceneNode, SceneGraph } from "@/types/sceneGraph";

interface WorldGenState {
  prompt: string;
  scene: SceneGraph | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  
  // Actions
  generateWorld: (prompt: string) => Promise<void>;
  clearScene: () => void;
  setError: (error: string | null) => void;
}

export const useWorldGen = create<WorldGenState>((set, get) => ({
  prompt: "",
  scene: null,
  isLoading: false,
  isGenerating: false,
  error: null,
  
  generateWorld: async (prompt: string) => {
    set({ isLoading: true, prompt, error: null });
    
    try {
      // Request world generation from backend
      const response = await apiRequest("POST", "/api/generate-world", { prompt });
      
      // Get the initial response
      const data = await response.json();
      
      // Start progressive generation
      set({ 
        isLoading: false, 
        isGenerating: true, 
        scene: {
          id: "world",
          children: []
        }
      });
      
      // Simulate progressive loading with the terrain first
      // In a real implementation, we would stream updates from the server
      
      // Add the base terrain
      if (data.scene) {
        // In a real implementation, we would stream updates
        // Here we're just using setTimeout to simulate progressive loading
        setTimeout(() => {
          set({ scene: data.scene, isGenerating: false });
        }, 1000);
      } else {
        throw new Error("Invalid scene data received from server");
      }
    } catch (err) {
      console.error("World generation failed:", err);
      set({ 
        isLoading: false, 
        isGenerating: false,
        error: err instanceof Error ? err.message : "Unknown error occurred"
      });
    }
  },
  
  clearScene: () => {
    set({ scene: null, prompt: "" });
  },
  
  setError: (error) => {
    set({ error });
  }
}));
