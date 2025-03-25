import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const WorldCanvas = () => {
  const { scene } = useThree();
  
  // Set up the initial scene with a grid
  useEffect(() => {
    // Create a grid helper as a visual reference
    const gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x222222);
    // Rotate grid 90 degrees counterclockwise around Y axis
    gridHelper.rotation.y = Math.PI / 2;
    scene.add(gridHelper);
    
    // Add a simple ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x222222,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Clean up function to remove objects when component unmounts
    return () => {
      scene.remove(gridHelper);
      scene.remove(ground);
    };
  }, [scene]);
  
  return null; // This component only affects the scene but doesn't render anything itself
};

export default WorldCanvas;
