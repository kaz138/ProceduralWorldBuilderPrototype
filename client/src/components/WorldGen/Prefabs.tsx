import { useMemo } from "react";
import * as THREE from "three";
import { PrefabType } from "@/types/prefabs";

interface PrefabProps {
  type: PrefabType;
  scale?: [number, number, number];
  color?: [number, number, number];
}

const Prefabs = ({ type, scale = [1, 1, 1], color = [1, 1, 1] }: PrefabProps) => {
  // Create a material with the specified color
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: new THREE.Color(color[0], color[1], color[2]),
      roughness: 0.7,
      metalness: 0.2,
    }),
    [color]
  );
  
  // Render different prefabs based on the type
  switch (type) {
    case 'tree':
      return (
        <group scale={scale}>
          {/* Tree trunk */}
          <mesh 
            castShadow 
            receiveShadow 
            position={[0, 0.8, 0]}
          >
            <cylinderGeometry args={[0.2, 0.2, 1.6, 8]} />
            <meshStandardMaterial color="#8B4513" roughness={0.8} />
          </mesh>
          
          {/* Tree foliage */}
          <mesh 
            castShadow 
            receiveShadow 
            position={[0, 2, 0]}
          >
            <coneGeometry args={[0.8, 2, 8]} />
            <meshStandardMaterial color="#006400" roughness={0.8} />
          </mesh>
        </group>
      );
      
    case 'house':
      return (
        <group scale={scale}>
          {/* House main structure */}
          <mesh 
            castShadow 
            receiveShadow 
            position={[0, 0.5, 0]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <primitive object={material} attach="material" />
          </mesh>
          
          {/* House roof */}
          <mesh 
            castShadow 
            receiveShadow 
            position={[0, 1.25, 0]}
            rotation={[0, Math.PI / 4, 0]}
          >
            <coneGeometry args={[0.85, 0.5, 4]} />
            <meshStandardMaterial color={new THREE.Color(0.8, 0.4, 0.2)} roughness={0.7} />
          </mesh>

          {/* Door */}
          <mesh
            castShadow
            receiveShadow
            position={[0, 0.3, 0.501]}
          >
            <boxGeometry args={[0.3, 0.6, 0.02]} />
            <meshStandardMaterial color={new THREE.Color(0.4, 0.2, 0.1)} roughness={0.8} />
          </mesh>

          {/* Windows */}
          <mesh
            castShadow
            receiveShadow
            position={[0.3, 0.5, 0.501]}
          >
            <boxGeometry args={[0.2, 0.2, 0.02]} />
            <meshStandardMaterial color={new THREE.Color(0.7, 0.8, 0.9)} metalness={0.2} />
          </mesh>

          <mesh
            castShadow
            receiveShadow
            position={[-0.3, 0.5, 0.501]}
          >
            <boxGeometry args={[0.2, 0.2, 0.02]} />
            <meshStandardMaterial color={new THREE.Color(0.7, 0.8, 0.9)} metalness={0.2} />
          </mesh>
        </group>
      );
      
    case 'chair':
      return (
        <group scale={scale}>
          {/* Chair seat */}
          <mesh 
            castShadow 
            receiveShadow 
            position={[0, 0.25, 0]}
          >
            <boxGeometry args={[0.6, 0.1, 0.6]} />
            <primitive object={material} attach="material" />
          </mesh>
          
          {/* Chair back */}
          <mesh 
            castShadow 
            receiveShadow 
            position={[0, 0.7, -0.25]}
          >
            <boxGeometry args={[0.6, 0.8, 0.1]} />
            <primitive object={material} attach="material" />
          </mesh>
          
          {/* Chair legs */}
          {[
            [-0.25, 0, 0.25],
            [0.25, 0, 0.25],
            [-0.25, 0, -0.25],
            [0.25, 0, -0.25]
          ].map((pos, i) => (
            <mesh 
              key={i} 
              castShadow 
              receiveShadow 
              position={pos}
            >
              <boxGeometry args={[0.05, 0.5, 0.05]} />
              <primitive object={material} attach="material" />
            </mesh>
          ))}
        </group>
      );
      
    case 'table':
      return (
        <group scale={scale}>
          {/* Table top */}
          <mesh 
            castShadow 
            receiveShadow 
            position={[0, 0.4, 0]}
          >
            <boxGeometry args={[1, 0.1, 1]} />
            <primitive object={material} attach="material" />
          </mesh>
          
          {/* Table legs */}
          {[
            [-0.4, 0, 0.4],
            [0.4, 0, 0.4],
            [-0.4, 0, -0.4],
            [0.4, 0, -0.4]
          ].map((pos, i) => (
            <mesh 
              key={i} 
              castShadow 
              receiveShadow 
              position={pos}
            >
              <boxGeometry args={[0.1, 0.8, 0.1]} />
              <primitive object={material} attach="material" />
            </mesh>
          ))}
        </group>
      );
    
    case 'car':
      return (
        <group scale={scale}>
          {/* Car body */}
          <mesh 
            castShadow 
            receiveShadow 
            position={[0, 0.2, 0]}
          >
            <boxGeometry args={[1, 0.4, 2]} />
            <primitive object={material} attach="material" />
          </mesh>
          
          {/* Car top/cabin */}
          <mesh 
            castShadow 
            receiveShadow 
            position={[0, 0.6, -0.1]}
          >
            <boxGeometry args={[0.8, 0.4, 0.9]} />
            <primitive object={material} attach="material" />
          </mesh>
          
          {/* Wheels */}
          {[
            [-0.5, 0, 0.7],  // front left
            [0.5, 0, 0.7],   // front right
            [-0.5, 0, -0.7], // back left
            [0.5, 0, -0.7]   // back right
          ].map((pos, i) => (
            <mesh 
              key={i} 
              castShadow 
              receiveShadow 
              position={pos}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
              <meshStandardMaterial color="#111111" roughness={0.9} />
            </mesh>
          ))}
        </group>
      );
    
    case 'lamp':
      return (
        <group scale={scale}>
          {/* Lamp base */}
          <mesh 
            castShadow 
            receiveShadow
            position={[0, 0.1, 0]}
          >
            <cylinderGeometry args={[0.2, 0.3, 0.2, 16]} />
            <primitive object={material} attach="material" />
          </mesh>
          
          {/* Lamp pole */}
          <mesh 
            castShadow 
            receiveShadow
            position={[0, 0.6, 0]}
          >
            <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
            <primitive object={material} attach="material" />
          </mesh>
          
          {/* Lamp shade */}
          <mesh 
            castShadow 
            receiveShadow
            position={[0, 1.1, 0]}
          >
            <coneGeometry args={[0.25, 0.3, 16, 1, true]} />
            <meshStandardMaterial color="#f5f5dc" roughness={0.5} metalness={0.1} side={THREE.DoubleSide} />
          </mesh>
          
          {/* Light bulb (emissive) */}
          <mesh 
            position={[0, 1, 0]}
          >
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
          </mesh>
        </group>
      );
      
    case 'bench':
      return (
        <group scale={scale}>
          {/* Bench seat */}
          <mesh 
            castShadow 
            receiveShadow 
            position={[0, 0.25, 0]}
          >
            <boxGeometry args={[1.5, 0.1, 0.5]} />
            <primitive object={material} attach="material" />
          </mesh>
          
          {/* Bench back */}
          <mesh 
            castShadow 
            receiveShadow 
            position={[0, 0.65, -0.2]}
          >
            <boxGeometry args={[1.5, 0.7, 0.1]} />
            <primitive object={material} attach="material" />
          </mesh>
          
          {/* Bench legs */}
          {[
            [-0.6, 0, 0.15],
            [0.6, 0, 0.15],
            [-0.6, 0, -0.15],
            [0.6, 0, -0.15]
          ].map((pos, i) => (
            <mesh 
              key={i} 
              castShadow 
              receiveShadow 
              position={pos}
            >
              <boxGeometry args={[0.08, 0.5, 0.08]} />
              <primitive object={material} attach="material" />
            </mesh>
          ))}
        </group>
      );
      
    default:
      // Fallback to simple box for unimplemented prefabs
      return (
        <mesh castShadow receiveShadow scale={scale}>
          <boxGeometry args={[1, 1, 1]} />
          <primitive object={material} attach="material" />
        </mesh>
      );
  }
};

export default Prefabs;
