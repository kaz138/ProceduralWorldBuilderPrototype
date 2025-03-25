import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme, ThemeType } from "../../lib/stores/useTheme";
import { PerspectiveCamera } from "@react-three/drei";

// Animated background scene for the welcome screen
const BackgroundScene = () => {
  // Grid and camera refs for animation
  const gridRef = useRef<THREE.GridHelper>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const theme = useTheme((state: { current: ThemeType }) => state.current);
  
  // Create animated particles
  const particles = useMemo(() => {
    const temp = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 80;
      
      temp.push({ 
        position: [x, y, z],
        size: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.02 + 0.01,
        rotationSpeed: Math.random() * 0.02 - 0.01,
        yOffset: Math.random() * Math.PI * 2
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
          particleColor: new THREE.Color("#7cbe7c"),
          ambientIntensity: 0.3,
          fogColor: new THREE.Color("#0a1f0a"),
          fogDensity: 0.02
        };
      case "mountain":
        return {
          gridColor: new THREE.Color("#4a4a5e"),
          secondaryColor: new THREE.Color("#2a2a33"),
          particleColor: new THREE.Color("#a0a0bb"),
          ambientIntensity: 0.25,
          fogColor: new THREE.Color("#1a1a22"),
          fogDensity: 0.015
        };
      case "city":
        return {
          gridColor: new THREE.Color("#333544"),
          secondaryColor: new THREE.Color("#20212c"),
          particleColor: new THREE.Color("#5d5e8a"),
          ambientIntensity: 0.2,
          fogColor: new THREE.Color("#151620"),
          fogDensity: 0.025
        };
      case "coastal":
        return {
          gridColor: new THREE.Color("#2a5d8a"),
          secondaryColor: new THREE.Color("#1a3355"),
          particleColor: new THREE.Color("#7caed3"),
          ambientIntensity: 0.35,
          fogColor: new THREE.Color("#0a1f2d"),
          fogDensity: 0.01
        };
      default:
        return {
          gridColor: new THREE.Color("#303055"),
          secondaryColor: new THREE.Color("#20203a"),
          particleColor: new THREE.Color("#8080bb"),
          ambientIntensity: 0.3,
          fogColor: new THREE.Color("#12121e"),
          fogDensity: 0.02
        };
    }
  }, [theme]);

  // Set the scene fog based on theme
  const { scene } = useThree();
  scene.fog = new THREE.FogExp2(colors.fogColor, colors.fogDensity);
  
  // For smooth theme transition
  const lastThemeRef = useRef(theme);
  const transitionTimeRef = useRef(0);
  
  if (lastThemeRef.current !== theme) {
    transitionTimeRef.current = 0;
    lastThemeRef.current = theme;
  }

  // Animation loop
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const t = time * 0.2; // Base animation time
    transitionTimeRef.current = Math.min(transitionTimeRef.current + 0.016, 1);
    
    // Animate camera - slow panning motion
    if (cameraRef.current) {
      // Smooth orbital camera movement
      const cameraRadius = 30;
      const cameraSpeed = 0.03;
      const cameraHeight = 15 + Math.sin(t * 0.15) * 2;
      
      const cameraX = Math.sin(time * cameraSpeed) * cameraRadius;
      const cameraZ = Math.cos(time * cameraSpeed) * cameraRadius;
      
      cameraRef.current.position.set(cameraX, cameraHeight, cameraZ);
      // Look slightly down at the grid
      cameraRef.current.lookAt(0, -4, 0);
    }
    
    // Animate grid
    if (gridRef.current) {
      gridRef.current.position.y = Math.sin(t) * 0.2 - 2;
      // Rotate the grid counterclockwise by 90 degrees (Math.PI/2 radians)
      gridRef.current.rotation.x = Math.PI / 2; // Keep it horizontal
      gridRef.current.rotation.y = -Math.PI / 2; // Rotate 90 degrees counterclockwise
      gridRef.current.rotation.z = Math.sin(t * 0.3) * 0.03; // Gentler wave effect
    }
    
    // Animate particles
    particles.forEach((particle, i) => {
      const meshObject = scene.getObjectByName(`particle-${i}`);
      if (meshObject) {
        // Floating motion
        const yMovement = Math.sin(time + particle.yOffset) * 0.5;
        meshObject.position.y += (yMovement - meshObject.position.y) * 0.01;
        
        // Slow rotation
        meshObject.rotation.y += particle.rotationSpeed;
        meshObject.rotation.x += particle.rotationSpeed * 0.5;
      }
    });
  });

  return (
    <>
      {/* Custom camera with animation */}
      <PerspectiveCamera 
        ref={cameraRef}
        makeDefault
        position={[0, 10, 25]} 
        fov={60}
        near={0.1}
        far={1000}
      />
    
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={colors.ambientIntensity} />
      
      {/* Key light */}
      <pointLight 
        position={[15, 15, 15]} 
        intensity={0.8} 
        color={colors.gridColor} 
        castShadow
      />
      
      {/* Fill light */}
      <pointLight 
        position={[-15, 8, -15]} 
        intensity={0.5}
        color={colors.secondaryColor} 
      />
      
      {/* Animated grid floor */}
      <gridHelper 
        ref={gridRef}
        args={[100, 100, colors.gridColor, colors.secondaryColor]}
        position={[0, -2, 0]}
      />
      
      {/* Particles */}
      {particles.map((particle, i) => (
        <mesh 
          key={i}
          name={`particle-${i}`}
          position={new THREE.Vector3(...particle.position)}
          castShadow
        >
          <sphereGeometry args={[particle.size, 16, 16]} />
          <meshStandardMaterial 
            color={colors.particleColor} 
            emissive={colors.particleColor}
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </>
  );
};

export default BackgroundScene;