import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Character } from '@/types/character';
import { Text } from '@react-three/drei';
import { useKeyboardControls } from '@react-three/drei';

interface CharacterModelProps {
  character: Character;
  isActive?: boolean;
  onMove?: (position: { x: number, y: number, z: number }) => void;
}

export function CharacterModel({ 
  character, 
  isActive = false,
  onMove 
}: CharacterModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<any>(null);
  const headRef = useRef<THREE.Mesh>(null);
  
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [speechText, setSpeechText] = useState('');
  
  const { appearance, position } = character;
  
  // For movement
  const [moveTarget, setMoveTarget] = useState<THREE.Vector3 | null>(null);
  const movementSpeed = 2; // units per second
  
  // Handle key controls if character is being controlled by player
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Always make text face camera
    if (textRef.current) {
      textRef.current.lookAt(state.camera.position);
    }
    
    // Handle move to target position (for AI characters or when clicking to move)
    if (moveTarget && !character.isControlled) {
      const currentPos = groupRef.current.position;
      const direction = new THREE.Vector3(
        moveTarget.x - currentPos.x,
        moveTarget.y - currentPos.y,
        moveTarget.z - currentPos.z
      );
      
      const distance = direction.length();
      
      if (distance > 0.1) {
        direction.normalize();
        const moveAmount = Math.min(movementSpeed * delta, distance);
        
        groupRef.current.position.x += direction.x * moveAmount;
        groupRef.current.position.y += direction.y * moveAmount;
        groupRef.current.position.z += direction.z * moveAmount;
        
        // Rotate character to face movement direction
        if (direction.x !== 0 || direction.z !== 0) {
          const angle = Math.atan2(direction.x, direction.z);
          groupRef.current.rotation.y = angle;
        }
        
        if (onMove) {
          onMove({
            x: groupRef.current.position.x,
            y: groupRef.current.position.y,
            z: groupRef.current.position.z
          });
        }
      } else {
        setMoveTarget(null);
      }
    }
    
    // If character is controlled by player, check keyboard input
    if (character.isControlled) {
      // Simple bobbing animation for head when controlled
      if (headRef.current) {
        headRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05 + appearance.height * 0.35;
      }
    }
  });
  
  // Set up speech bubble display
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);
  
  // Display speech bubble with text
  const speak = (text: string) => {
    setSpeechText(text);
    setShowSpeechBubble(true);
    
    // Hide after a few seconds
    setTimeout(() => {
      setShowSpeechBubble(false);
    }, 5000);
  };
  
  // Move character to position
  const moveTo = (x: number, y: number, z: number) => {
    setMoveTarget(new THREE.Vector3(x, y, z));
  };
  
  // We'll handle this without imperative handles for now
  // since we're passing the necessary callbacks through props
  
  // Materials
  const headMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(appearance.headColor[0], appearance.headColor[1], appearance.headColor[2]),
    roughness: 0.5,
    metalness: 0.1,
    emissive: new THREE.Color(appearance.headColor[0] * 0.2, appearance.headColor[1] * 0.2, appearance.headColor[2] * 0.2),
  });
  
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(appearance.bodyColor[0], appearance.bodyColor[1], appearance.bodyColor[2]),
    roughness: 0.6,
    metalness: 0.1,
    emissive: new THREE.Color(appearance.bodyColor[0] * 0.2, appearance.bodyColor[1] * 0.2, appearance.bodyColor[2] * 0.2),
  });
  
  const limbMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(appearance.limbColor[0], appearance.limbColor[1], appearance.limbColor[2]),
    roughness: 0.7,
    metalness: 0.1,
    emissive: new THREE.Color(appearance.limbColor[0] * 0.2, appearance.limbColor[1] * 0.2, appearance.limbColor[2] * 0.2),
  });
  
  // Make active character have a highlight/glow
  if (isActive) {
    headMaterial.emissive = new THREE.Color(0.5, 0.5, 0);
    bodyMaterial.emissive = new THREE.Color(0.3, 0.3, 0);
  }
  
  // Scale factors
  const headScale = appearance.width * 0.8;
  const bodyScale = appearance.width;
  const limbScale = appearance.width * 0.4;
  const limbLength = appearance.height * 0.35;
  
  // Positions
  const headY = appearance.height * 0.35;
  const bodyY = 0;
  const bodyHeight = appearance.height * 0.5;
  const armY = appearance.height * 0.1;
  const legY = -appearance.height * 0.25;
  
  return (
    <group 
      ref={groupRef} 
      position={[position.x, position.y, position.z]}
      onClick={(e) => {
        e.stopPropagation();
        if (character.isControlled) return;
        
        // Example of AI chat response when clicked
        speak("Hello! I'm " + character.name);
      }}
    >
      {/* Character name */}
      <Text
        ref={textRef}
        position={[0, appearance.height + 0.5, 0]}
        fontSize={0.3}
        color={isActive ? "yellow" : "white"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {character.name}
      </Text>
      
      {/* Speech bubble */}
      {showSpeechBubble && (
        <group position={[0, appearance.height + 1, 0]}>
          <mesh>
            <planeGeometry args={[2.2, 0.8]} />
            <meshStandardMaterial color="white" transparent opacity={0.9} />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.2}
            maxWidth={2}
            color="black"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {speechText}
          </Text>
        </group>
      )}
      
      {/* Head */}
      <mesh 
        ref={headRef} 
        position={[0, headY, 0]} 
        material={headMaterial}
      >
        <boxGeometry args={[headScale, headScale, headScale]} />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, bodyY, 0]} material={bodyMaterial}>
        <boxGeometry args={[bodyScale, bodyHeight, bodyScale * 0.6]} />
      </mesh>
      
      {/* Left Arm */}
      <mesh 
        position={[-(bodyScale * 0.5 + limbScale * 0.5), armY, 0]} 
        material={limbMaterial}
      >
        <boxGeometry args={[limbScale, limbLength, limbScale]} />
      </mesh>
      
      {/* Right Arm */}
      <mesh 
        position={[bodyScale * 0.5 + limbScale * 0.5, armY, 0]} 
        material={limbMaterial}
      >
        <boxGeometry args={[limbScale, limbLength, limbScale]} />
      </mesh>
      
      {/* Left Leg */}
      <mesh 
        position={[-(bodyScale * 0.3), legY, 0]} 
        material={limbMaterial}
      >
        <boxGeometry args={[limbScale, limbLength, limbScale]} />
      </mesh>
      
      {/* Right Leg */}
      <mesh 
        position={[bodyScale * 0.3, legY, 0]} 
        material={limbMaterial}
      >
        <boxGeometry args={[limbScale, limbLength, limbScale]} />
      </mesh>
    </group>
  );
}