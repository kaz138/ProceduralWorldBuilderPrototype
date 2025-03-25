import * as THREE from "three";

interface AnimationParams {
  targetPosition: THREE.Vector3;
  targetScale: THREE.Vector3;
  progress: number;
  delta: number;
}

interface AnimationResult {
  progress: number;
  completed: boolean;
}

// Animation speed constants
const ANIMATION_SPEED = 2.0;
const POSITION_SPEED = 2.5;
const SCALE_SPEED = 2.0;

// Animate the entry of an object into the scene
export function animateObjectEntry(
  object: THREE.Object3D,
  params: AnimationParams
): AnimationResult {
  const { targetPosition, targetScale, progress, delta } = params;
  
  // Calculate new progress
  const newProgress = Math.min(progress + delta * ANIMATION_SPEED, 1);
  const completed = newProgress >= 1;
  
  // Use easing function for smoother animation
  const easedProgress = easeOutCubic(newProgress);
  
  // Animate position (move up from below)
  const currentPos = object.position;
  const targetPos = targetPosition;
  
  currentPos.x = THREE.MathUtils.lerp(currentPos.x, targetPos.x, delta * POSITION_SPEED);
  currentPos.y = THREE.MathUtils.lerp(currentPos.y, targetPos.y, delta * POSITION_SPEED);
  currentPos.z = THREE.MathUtils.lerp(currentPos.z, targetPos.z, delta * POSITION_SPEED);
  
  // Animate scale (grow from zero)
  const currentScale = object.scale;
  
  currentScale.x = THREE.MathUtils.lerp(currentScale.x, targetScale.x, delta * SCALE_SPEED);
  currentScale.y = THREE.MathUtils.lerp(currentScale.y, targetScale.y, delta * SCALE_SPEED);
  currentScale.z = THREE.MathUtils.lerp(currentScale.z, targetScale.z, delta * SCALE_SPEED);
  
  return {
    progress: newProgress,
    completed
  };
}

// Easing function for smooth animations
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

// Animation for rotating objects slightly
export function animateObjectIdle(
  object: THREE.Object3D,
  time: number,
  amplitude: number = 0.01,
  speed: number = 0.5
): void {
  // Subtle floating motion
  object.position.y += Math.sin(time * speed) * amplitude;
  
  // Subtle rotation
  object.rotation.y = Math.sin(time * speed * 0.2) * 0.05;
}
