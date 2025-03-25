import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme, ThemeType } from "../../lib/stores/useTheme";

// Animated background scene for the welcome screen
const BackgroundScene = () => {
  // Grid refs for animation
  const gridRef = useRef<THREE.GridHelper>(null);
  const theme = useTheme((state: { current: ThemeType }) => state.current);
  
  // Create animated particles
  const particles = useMemo(() => {
    const temp = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 50;
      
      temp.push({ 
        position: [x, y, z],
        size: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.02 + 0.01
      });
    }
    
    return temp;
  }, []);
  
  // Generate color schemes based on theme
  const colors = useMemo(() => {
    switch (theme) {
      case "forest":
        return {
          gridColor: new THREE.Color("#2a5d2a"),
          secondaryColor: new THREE.Color("#1a331a"),
          particleColor: new THREE.Color("#7cbe7c")
        };
      case "mountain":
        return {
          gridColor: new THREE.Color("#4a4a5e"),
          secondaryColor: new THREE.Color("#2a2a33"),
          particleColor: new THREE.Color("#a0a0bb")
        };
      case "city":
        return {
          gridColor: new THREE.Color("#333544"),
          secondaryColor: new THREE.Color("#20212c"),
          particleColor: new THREE.Color("#5d5e8a")
        };
      case "coastal":
        return {
          gridColor: new THREE.Color("#2a5d8a"),
          secondaryColor: new THREE.Color("#1a3355"),
          particleColor: new THREE.Color("#7caed3")
        };
      default:
        return {
          gridColor: new THREE.Color("#303055"),
          secondaryColor: new THREE.Color("#20203a"),
          particleColor: new THREE.Color("#8080bb")
        };
    }
  }, [theme]);

  // Animation loop
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.2;
    
    // Animate grid
    if (gridRef.current) {
      gridRef.current.position.y = Math.sin(t) * 0.2 - 2;
      gridRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.3} />
      
      {/* Key light */}
      <pointLight 
        position={[10, 10, 10]} 
        intensity={0.8} 
        color={colors.gridColor} 
      />
      
      {/* Fill light */}
      <pointLight 
        position={[-10, 5, -10]} 
        intensity={0.5}
        color={colors.secondaryColor} 
      />
      
      {/* Animated grid floor */}
      <gridHelper 
        ref={gridRef}
        args={[100, 100, colors.gridColor, colors.secondaryColor]}
        position={[0, -2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      
      {/* Particles */}
      {particles.map((particle, i) => (
        <mesh 
          key={i} 
          position={new THREE.Vector3(...particle.position)}
        >
          <sphereGeometry args={[particle.size, 16, 16]} />
          <meshStandardMaterial 
            color={colors.particleColor} 
            emissive={colors.particleColor}
            emissiveIntensity={0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </>
  );
};

export default BackgroundScene;