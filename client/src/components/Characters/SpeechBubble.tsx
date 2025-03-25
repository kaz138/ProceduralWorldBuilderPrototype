import React, { useRef, useEffect } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpeechBubbleProps {
  text: string;
  position: [number, number, number];
  duration?: number;
  onComplete?: () => void;
}

export function SpeechBubble({ 
  text, 
  position,
  duration = 5,
  onComplete
}: SpeechBubbleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<any>(null);
  const fadeRef = useRef({ value: 1 });
  const timer = useRef<number>(0);
  
  // Ensure the speech bubble faces the camera
  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
    
    // Update timer
    timer.current += 0.016; // Roughly 60fps
    
    // Start fading out after 75% of duration
    if (timer.current > duration * 0.75) {
      fadeRef.current.value = Math.max(0, 1 - ((timer.current - (duration * 0.75)) / (duration * 0.25)));
      
      if (textRef.current) {
        textRef.current.material.opacity = fadeRef.current.value;
      }
    }
    
    // Remove when duration is reached
    if (timer.current >= duration && onComplete) {
      onComplete();
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.5, 1.2]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
      
      <Text
        ref={textRef}
        position={[0, 0, 0.01]}
        fontSize={0.15}
        maxWidth={2}
        lineHeight={1.2}
        color="black"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#000000"
        opacity={1}
      >
        {text}
      </Text>
      
      {/* Triangle for speech bubble pointer */}
      <mesh position={[0, -0.7, 0]} rotation={[0, 0, Math.PI]}>
        <cylinderGeometry args={[0.2, 0, 0.3, 3]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}