import React, { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useCharacters } from '@/lib/stores/useCharacters';
import { KeyboardControls, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

// Define controls enum
enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  interact = 'interact',
}

// Keyboard controls mapping for the game
export function CharacterControlsProvider({ children }: { children: React.ReactNode }) {
  const keyMap = [
    { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
    { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
    { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
    { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
    { name: Controls.interact, keys: ['KeyE', 'Space'] },
  ];
  
  return (
    <KeyboardControls map={keyMap}>
      {children}
    </KeyboardControls>
  );
}

// Hook to handle character movement based on keyboard input
export function useCharacterControls() {
  const characters = useCharacters(state => state.characters);
  const activeCharacterId = useCharacters(state => state.activeCharacterId);
  const updateCharacter = useCharacters(state => state.updateCharacter);
  const speakCharacter = useCharacters(state => state.speakCharacter);
  
  // Get keyboard state without causing re-renders
  const [, getKeys] = useKeyboardControls<Controls>();
  
  // Movement speed
  const moveSpeed = 0.1;
  
  // Handle movement in the game loop
  useFrame(() => {
    if (!activeCharacterId) return;
    
    const activeCharacter = characters.find(c => c.id === activeCharacterId);
    if (!activeCharacter || !activeCharacter.isControlled) return;
    
    // Get current keyboard state
    const { forward, back, left, right, interact } = getKeys();
    
    // Handle interactions
    if (interact) {
      // Find nearest character to interact with
      const nearestCharacter = findNearestCharacter(
        activeCharacter, 
        characters.filter(c => c.id !== activeCharacterId)
      );
      
      if (nearestCharacter && calculateDistance(activeCharacter, nearestCharacter) < 5) {
        speakCharacter(activeCharacterId, `Hello ${nearestCharacter.name}!`);
      }
    }
    
    // Calculate movement direction
    let moveX = 0;
    let moveZ = 0;
    
    if (forward) moveZ -= moveSpeed;
    if (back) moveZ += moveSpeed;
    if (left) moveX -= moveSpeed;
    if (right) moveX += moveSpeed;
    
    // Only update if there's movement
    if (moveX !== 0 || moveZ !== 0) {
      // Calculate new position
      const newPos = {
        x: activeCharacter.position.x + moveX,
        y: activeCharacter.position.y,
        z: activeCharacter.position.z + moveZ,
      };
      
      // Update character position
      updateCharacter(activeCharacterId, { position: newPos });
    }
  });
  
  return null;
}

// Helper to find the nearest character
function findNearestCharacter(
  sourceCharacter: any, 
  otherCharacters: any[]
): any | null {
  if (otherCharacters.length === 0) return null;
  
  let nearest = otherCharacters[0];
  let minDistance = calculateDistance(sourceCharacter, nearest);
  
  for (let i = 1; i < otherCharacters.length; i++) {
    const distance = calculateDistance(sourceCharacter, otherCharacters[i]);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = otherCharacters[i];
    }
  }
  
  return nearest;
}

// Calculate distance between two characters
function calculateDistance(char1: any, char2: any): number {
  const dx = char1.position.x - char2.position.x;
  const dz = char1.position.z - char2.position.z;
  return Math.sqrt(dx * dx + dz * dz);
}

// Component to add to scene
export function CharacterControlsComponent() {
  useCharacterControls();
  return null;
}