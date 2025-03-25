import React, { useRef, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCharacters } from '@/lib/stores/useCharacters';
import { CharacterModel } from './CharacterModel';
import { KeyboardControls, useKeyboardControls } from '@react-three/drei';
import { Character, CharacterPosition } from '@/types/character';

enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  interact = 'interact',
}

export function CharacterManager() {
  const characters = useCharacters(state => state.characters);
  const activeCharacterId = useCharacters(state => state.activeCharacterId);
  const updateCharacter = useCharacters(state => state.updateCharacter);
  const speakCharacter = useCharacters(state => state.speakCharacter);
  
  // Keep track of character models (for direct method access)
  const characterRefs = useRef<{ [id: string]: any }>({});
  
  // Get camera to follow active character
  const { camera } = useThree();
  
  useEffect(() => {
    // Set up keyboard controls for active character
    const keyMap = [
      { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
      { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
      { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
      { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
      { name: Controls.interact, keys: ['KeyE', 'Space'] },
    ];
    
    // Clean up function will be called when component unmounts
    return () => {
      // Any cleanup code
    };
  }, []);
  
  // Handle movement of actively controlled character
  useEffect(() => {
    if (!activeCharacterId) return;
    
    // Set up subscription to keyboard controls
    const handleKeyControls = () => {
      if (!activeCharacterId) return;

      const activeCharacter = characters.find(c => c.id === activeCharacterId);
      if (!activeCharacter || !activeCharacter.isControlled) return;
      
      // Code for handling keyboard controls would go here
      // This would involve checking key states and moving the character
    };
    
    // Set up interval for checking controls
    const intervalId = setInterval(handleKeyControls, 16); // ~60fps
    
    return () => {
      clearInterval(intervalId);
    };
  }, [activeCharacterId, characters]);
  
  // Camera follow logic
  useEffect(() => {
    if (!activeCharacterId) return;
    
    const activeCharacter = characters.find(c => c.id === activeCharacterId);
    if (!activeCharacter) return;
    
    // Position camera behind and above active character
    const updateCamera = () => {
      const pos = activeCharacter.position;
      
      // Set target position for camera (behind and above character)
      const targetCameraPos = new THREE.Vector3(
        pos.x - 5,
        pos.y + 5,
        pos.z + 5
      );
      
      // Smoothly move camera to target position
      camera.position.lerp(targetCameraPos, 0.1);
      
      // Look at character
      camera.lookAt(pos.x, pos.y + 1, pos.z);
    };
    
    const intervalId = setInterval(updateCamera, 16); // ~60fps
    
    return () => {
      clearInterval(intervalId);
    };
  }, [activeCharacterId, characters, camera]);
  
  // Handle character movement updates
  const handleCharacterMove = (id: string, newPosition: CharacterPosition) => {
    updateCharacter(id, { position: newPosition });
  };
  
  return (
    <>
      {characters.map(character => (
        <CharacterModel
          key={character.id}
          ref={(ref) => {
            if (ref) {
              characterRefs.current[character.id] = ref;
            }
          }}
          character={character}
          isActive={character.id === activeCharacterId}
          onMove={(newPos) => handleCharacterMove(character.id, newPos)}
        />
      ))}
    </>
  );
}