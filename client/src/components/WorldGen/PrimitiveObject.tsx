import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { isPrefabType } from "@/types/prefabs";
import Prefabs from "./Prefabs";
import { animateObjectEntry } from "@/lib/animations/buildAnimation";

interface PrimitiveObjectProps {
  id: string;
  type: string; 
  position: [number, number, number];
  scale?: [number, number, number];
  color?: [number, number, number];
  children?: React.ReactNode;
  animate?: boolean;
  onAnimationComplete?: () => void;
}

const PrimitiveObject = ({
  id,
  type,
  position,
  scale = [1, 1, 1],
  color = [1, 1, 1],
  children,
  animate = true,
  onAnimationComplete
}: PrimitiveObjectProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const labelRef = useRef<any>(null);
  const animationRef = useRef({
    started: false,
    completed: false,
    progress: 0,
  });
  
  // Animation effect
  useEffect(() => {
    if (groupRef.current && animate) {
      // Set initial state for animation
      const group = groupRef.current;
      group.scale.set(0.001, 0.001, 0.001);
      group.position.set(position[0], position[1] - 2, position[2]);
      animationRef.current.started = true;
    }
  }, [position, animate]);
  
  // Run animation each frame
  useFrame((_, delta) => {
    if (groupRef.current && animationRef.current.started && !animationRef.current.completed) {
      const result = animateObjectEntry(groupRef.current, {
        targetPosition: new THREE.Vector3(position[0], position[1], position[2]),
        targetScale: new THREE.Vector3(scale[0], scale[1], scale[2]),
        progress: animationRef.current.progress,
        delta
      });
      
      animationRef.current.progress = result.progress;
      
      // Check if animation is complete
      if (result.completed) {
        animationRef.current.completed = true;
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    }
    
    // Update label position to always face camera
    if (labelRef.current) {
      labelRef.current.lookAt(labelRef.current.camera.position);
    }
  });
  
  // Create material based on color
  const material = (
    <meshStandardMaterial 
      color={new THREE.Color(color[0], color[1], color[2])}
      roughness={0.7}
      metalness={0.2}
    />
  );
  
  // Get the object name from the ID (last part after dots)
  const objectName = id.split('.').pop() || id;
  
  // Render based on primitive type
  const renderPrimitive = () => {
    // Check if this is a prefab
    if (isPrefabType(type)) {
      return <Prefabs type={type} scale={scale} color={color} />;
    }
    
    // Otherwise render primitive shapes
    switch (type) {
      case 'box':
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            {material}
          </mesh>
        );
      case 'sphere':
        return (
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            {material}
          </mesh>
        );
      case 'cylinder':
        return (
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
            {material}
          </mesh>
        );
      case 'cone':
        return (
          <mesh castShadow receiveShadow>
            <coneGeometry args={[0.5, 1, 32]} />
            {material}
          </mesh>
        );
      case 'plane':
        return (
          <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1, 1]} />
            {material}
          </mesh>
        );
      default:
        // Default to box if type is not recognized
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            {material}
          </mesh>
        );
    }
  };
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      {renderPrimitive()}
      
      {/* Label with object name (only visible when close) */}
      <Text
        ref={labelRef}
        position={[0, 1.2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        depthTest={false}
        outlineWidth={0.02}
        outlineColor="#000000"
        visible={false} // Initially hidden, could be toggled by proximity
      >
        {objectName}
      </Text>
      
      {children}
    </group>
  );
};

export default PrimitiveObject;
