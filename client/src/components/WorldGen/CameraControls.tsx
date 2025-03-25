import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useWorldGen } from "@/lib/stores/useWorldGen";

const CameraControls = () => {
  const controlsRef = useRef<any>(null);
  const { camera, gl } = useThree();
  const { scene, isGenerating } = useWorldGen();
  
  // Reset camera position when a new scene is loaded
  useEffect(() => {
    if (scene && !isGenerating && controlsRef.current) {
      // Find the bounding box of the entire scene
      const sceneBounds = calculateSceneBounds(scene);
      
      if (sceneBounds) {
        // Reset the camera to view the full scene
        const center = new THREE.Vector3();
        sceneBounds.getCenter(center);
        
        // Position camera to get a good view of the scene
        const size = sceneBounds.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim * 1.5; // Add some padding
        
        // Position camera at an angle
        camera.position.set(
          center.x + distance * 0.8,
          center.y + distance * 0.6,
          center.z + distance * 0.8
        );
        
        // Make camera look at center of scene
        camera.lookAt(center);
        
        // Update orbit controls target
        if (controlsRef.current) {
          controlsRef.current.target.copy(center);
          controlsRef.current.update();
        }
      }
    }
  }, [scene, isGenerating, camera]);
  
  // Calculate bounding box for entire scene
  const calculateSceneBounds = (sceneData: any) => {
    if (!sceneData || !sceneData.children || sceneData.children.length === 0) {
      return null;
    }
    
    const bbox = new THREE.Box3();
    
    // Recursively gather all positions from the scene graph
    const processObject = (obj: any) => {
      if (obj.position && obj.scale) {
        const pos = new THREE.Vector3(obj.position[0], obj.position[1], obj.position[2]);
        const scale = new THREE.Vector3(obj.scale[0], obj.scale[1], obj.scale[2]);
        
        // Create a small box around this point
        const objectBox = new THREE.Box3();
        objectBox.min.set(pos.x - scale.x/2, pos.y - scale.y/2, pos.z - scale.z/2);
        objectBox.max.set(pos.x + scale.x/2, pos.y + scale.y/2, pos.z + scale.z/2);
        
        // Expand main bounding box
        bbox.union(objectBox);
      }
      
      // Process children recursively
      if (obj.children) {
        obj.children.forEach((child: any) => processObject(child));
      }
    };
    
    sceneData.children.forEach(processObject);
    
    // If box is still empty, return null
    if (bbox.isEmpty()) {
      return null;
    }
    
    return bbox;
  };
  
  return (
    <OrbitControls 
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.1}
      rotateSpeed={0.5}
      maxPolarAngle={Math.PI / 2 * 0.95} // Prevent going below the ground
      minDistance={1}
      maxDistance={200}
      target={[0, 0, 0]}
      makeDefault
    />
  );
};

// Add THREE import here to avoid TypeScript errors
import * as THREE from "three";

export default CameraControls;
