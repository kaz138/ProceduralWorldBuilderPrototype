import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CharacterPreviewProps {
  headColor: [number, number, number];
  bodyColor: [number, number, number];
  limbColor: [number, number, number];
  height?: number;
  width?: number;
}

export function CharacterPreview({
  headColor,
  bodyColor,
  limbColor,
  height = 1.8,
  width = 1.0
}: CharacterPreviewProps) {
  return (
    <div className="w-full h-56 bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
      <Canvas
        shadows
        camera={{
          position: [0, 0, 5],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Character 
          headColor={headColor} 
          bodyColor={bodyColor} 
          limbColor={limbColor} 
          height={height}
          width={width}
        />
      </Canvas>
    </div>
  );
}

interface CharacterProps {
  headColor: [number, number, number];
  bodyColor: [number, number, number];
  limbColor: [number, number, number];
  height: number;
  width: number;
}

function Character({
  headColor,
  bodyColor,
  limbColor,
  height,
  width
}: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Rotate character slowly
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });
  
  // Materials
  const headMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(headColor[0], headColor[1], headColor[2]),
    roughness: 0.5,
    metalness: 0.1,
    emissive: new THREE.Color(headColor[0] * 0.2, headColor[1] * 0.2, headColor[2] * 0.2),
  });
  
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(bodyColor[0], bodyColor[1], bodyColor[2]),
    roughness: 0.6,
    metalness: 0.1,
    emissive: new THREE.Color(bodyColor[0] * 0.2, bodyColor[1] * 0.2, bodyColor[2] * 0.2),
  });
  
  const limbMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(limbColor[0], limbColor[1], limbColor[2]),
    roughness: 0.7,
    metalness: 0.1,
    emissive: new THREE.Color(limbColor[0] * 0.2, limbColor[1] * 0.2, limbColor[2] * 0.2),
  });
  
  // Scale factors
  const headScale = width * 0.8;
  const bodyScale = width;
  const limbScale = width * 0.4;
  const limbLength = height * 0.35;
  
  // Positions
  const headY = height * 0.35;
  const bodyY = 0;
  const bodyHeight = height * 0.5;
  const armY = height * 0.1;
  const legY = -height * 0.25;
  
  return (
    <group 
      ref={groupRef} 
      position={[0, -0.5, 0]}
    >
      {/* Head */}
      <mesh 
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

export default CharacterPreview;