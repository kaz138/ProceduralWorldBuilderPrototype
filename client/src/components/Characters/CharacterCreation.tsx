import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import { createDefaultCharacter, createDefaultCharacterAppearance } from '@/types/character';
import { useCharacters } from '@/lib/stores/useCharacters';
import { useGame } from '@/lib/stores/useGame';
import { useAudio } from '@/lib/stores/useAudio';
import CharacterColorPicker from './CharacterColorPicker';
import CharacterPreview from './CharacterPreview';

interface CharacterCreationProps {
  onComplete: () => void;
  onCancel?: () => void;
}

export function CharacterCreation({ onComplete, onCancel }: CharacterCreationProps) {
  const { addCharacter } = useCharacters();
  const { successSound } = useAudio();
  
  // New character state
  const [name, setName] = useState('New Character');
  const [description, setDescription] = useState('');
  const [headColor, setHeadColor] = useState<[number, number, number]>([0.9, 0.7, 0.5]);
  const [bodyColor, setBodyColor] = useState<[number, number, number]>([0.2, 0.4, 0.8]);
  const [limbColor, setLimbColor] = useState<[number, number, number]>([0.7, 0.7, 0.7]);
  const [height, setHeight] = useState(1.8);
  const [width, setWidth] = useState(1.0);
  
  const handleCreate = () => {
    // Create a new character with the specified properties
    const character = createDefaultCharacter(name);
    
    // Update character properties
    character.id = uuidv4();
    character.description = description;
    character.appearance = {
      headColor,
      bodyColor,
      limbColor,
      height,
      width
    };
    
    // Add to characters store
    addCharacter(character);
    
    // Play success sound
    if (successSound) {
      successSound.play();
    }
    
    // Call complete callback
    onComplete();
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black bg-opacity-80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Create Your Character</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {/* Character appearance preview */}
            <CharacterPreview 
              headColor={headColor}
              bodyColor={bodyColor}
              limbColor={limbColor}
              height={height}
              width={width}
            />
            
            {/* Character colors */}
            <div className="grid grid-cols-1 gap-2">
              <CharacterColorPicker 
                label="Head Color" 
                color={headColor} 
                onChange={setHeadColor}
              />
              <CharacterColorPicker 
                label="Body Color" 
                color={bodyColor} 
                onChange={setBodyColor}
              />
              <CharacterColorPicker 
                label="Limb Color" 
                color={limbColor} 
                onChange={setLimbColor}
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            {/* Character details */}
            <div className="mb-4">
              <label className="block text-white font-medium mb-2">Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={20}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-white font-medium mb-2">Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                maxLength={100}
                placeholder="Brief description of your character..."
              />
            </div>
            
            {/* Size adjustments */}
            <div className="mb-4">
              <label className="block text-white font-medium mb-2">Height: {height.toFixed(1)}</label>
              <input 
                type="range" 
                min="1.0" 
                max="2.5" 
                step="0.1" 
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-white font-medium mb-2">Width: {width.toFixed(1)}</label>
              <input 
                type="range" 
                min="0.6" 
                max="1.5" 
                step="0.1" 
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            {/* Character controls info */}
            <div className="mb-4 mt-auto">
              <p className="text-gray-400 text-sm">
                Characters can be controlled using WASD or arrow keys. Click on other characters to interact with them.
              </p>
            </div>
            
            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-auto">
              {onCancel && (
                <button 
                  onClick={onCancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button 
                onClick={handleCreate}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md hover:from-indigo-600 hover:to-purple-600 transition-colors"
              >
                Create Character
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CharacterCreation;