import { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useWorldGen } from "@/lib/stores/useWorldGen";
import PrimitiveObject from "./PrimitiveObject";
import WorldCanvas from "./WorldCanvas";
import { animateObjectEntry } from "@/lib/animations/buildAnimation";

const SceneRenderer = () => {
  const { scene, isGenerating } = useWorldGen();
  const [visibleObjects, setVisibleObjects] = useState<string[]>([]);
  const [animationQueue, setAnimationQueue] = useState<string[]>([]);
  const [animationInProgress, setAnimationInProgress] = useState(false);
  
  // Set up the base world canvas
  useEffect(() => {
    // Reset the animation state when a new scene comes in
    if (scene) {
      setVisibleObjects([]);
      
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
  
  // Process the animation queue
  useFrame((_, delta) => {
    if (animationQueue.length > 0 && !animationInProgress && !isGenerating) {
      // Start animating the next object
      setAnimationInProgress(true);
      const nextObjectId = animationQueue[0];
      
      // After a small delay, mark the object as visible and remove from queue
      setTimeout(() => {
        setVisibleObjects(prev => [...prev, nextObjectId]);
        setAnimationQueue(prev => prev.slice(1));
        
        // Allow the next animation to start after a short delay
        setTimeout(() => {
          setAnimationInProgress(false);
        }, 100); // Small delay between animations
      }, 100);
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
    <>
      <WorldCanvas />
      {scene.children?.map((node: any) => renderNode(node))}
    </>
  );
};

export default SceneRenderer;
