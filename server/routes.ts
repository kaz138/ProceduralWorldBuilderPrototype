import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateWorldScene } from "./services/openai";
import { validateSceneGraph } from "./services/sceneGraph";

export async function registerRoutes(app: Express): Promise<Server> {
  // World generation endpoint
  app.post("/api/generate-world", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({
          error: "Missing or invalid prompt"
        });
      }
      
      // Generate world using OpenAI
      const sceneGraph = await generateWorldScene(prompt);
      
      // Validate the scene graph
      const validatedScene = validateSceneGraph(sceneGraph);
      
      // Return the generated scene
      return res.json({
        scene: validatedScene
      });
    } catch (error) {
      console.error("Error generating world:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
