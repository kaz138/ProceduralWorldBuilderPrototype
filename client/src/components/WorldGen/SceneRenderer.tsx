import { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useWorldGen } from "@/lib/stores/useWorldGen";
import { useGame } from "@/lib/stores/useGame";
import PrimitiveObject from "./PrimitiveObject";
import WorldCanvas from "./WorldCanvas";
import { 
  CharacterManager, 
  CharacterControlsComponent, 
  CharacterControlsProvider 
} from "@/components/Characters";

const SceneRenderer = () => {
  const { scene, isGenerating } = useWorldGen();
  const { phase } = useGame();
  const [visibleObjects, setVisibleObjects] = useState<string[]>([]);
  const [animationQueue, setAnimationQueue] = useState<string[]>([]);
  const [animationInProgress, setAnimationInProgress] = useState(false);
  const [worldBuildComplete, setWorldBuildComplete] = useState(false);
  
  // Set up the base world canvas
  useEffect(() => {
    // Reset the animation state when a new scene comes in
    if (scene) {
      setVisibleObjects([]);
      setWorldBuildComplete(false);
      
      // Gather all objects to animate
      const objectIds: string[] = [];
      
      const gatherObjectIds = (obj: any, parentId?: string) => {
        const fullId = parentId ? `${parentId}.${obj.id}` : obj.id;
        objectIds.push(fullId);
        
        if (obj.children) {
          obj.children.forEach((child: any) => {
            gatherObjectIds(child, fullId);
          });
        }
      };
      
      // Process all top-level objects
      if (scene.children) {
        scene.children.forEach((child: any) => {
          gatherObjectIds(child);
        });
      }
      
      // Sort objects by size (larger objects first)
      // This is a simplified approach - in reality you might want to sort by hierarchy
      setAnimationQueue(objectIds);
    }
  }, [scene]);
  
  // Process the animation queue - with faster processing
  useFrame((_, delta) => {
    if (animationQueue.length > 0 && !animationInProgress && !isGenerating) {
      // Start animating the next object
      setAnimationInProgress(true);
      
      // Process multiple objects at once for faster scene building
      const batchSize = Math.min(3, animationQueue.length); // Process up to 3 objects at once
      const objectsToProcess = animationQueue.slice(0, batchSize);
      
      // Mark objects as visible immediately and remove from queue
      setTimeout(() => {
        setVisibleObjects(prev => [...prev, ...objectsToProcess]);
        setAnimationQueue(prev => prev.slice(batchSize));
        
        // Allow the next animation batch to start after a shorter delay
        setTimeout(() => {
          setAnimationInProgress(false);
        }, 50); // Reduced delay between animations (was 100)
      }, 50); // Reduced initial delay (was 100)
    }
    
    // Check if world building is complete
    if (animationQueue.length === 0 && !animationInProgress && !isGenerating && !worldBuildComplete) {
      setWorldBuildComplete(true);
    }
  });
  
  // If there's no scene data, just render the base world canvas
  if (!scene) {
    return <WorldCanvas />;
  }
  
  // Recursive function to render a node and all its children
  const renderNode = (node: any, parentId?: string) => {
    const fullId = parentId ? `${parentId}.${node.id}` : node.id;
    const isVisible = visibleObjects.includes(fullId);
    
    if (!isVisible) {
      return null;
    }
    
    return (
      <PrimitiveObject
        key={fullId}
        id={fullId}
        type={node.type}
        position={node.position}
        scale={node.scale || [1, 1, 1]}
        color={node.color || [1, 1, 1]}
        onAnimationComplete={() => {}}
        animate={true}
      >
        {node.children?.map((child: any) => renderNode(child, fullId))}
      </PrimitiveObject>
    );
  };
  
  return (
    <CharacterControlsProvider>
      <WorldCanvas />
      {scene.children?.map((node: any) => renderNode(node))}
      
      {/* Add character system once world is built */}
      {worldBuildComplete && phase === "playing" && (
        <>
          <CharacterManager />
          <CharacterControlsComponent />
        </>
      )}
    </CharacterControlsProvider>
  );
};

export default SceneRenderer;
