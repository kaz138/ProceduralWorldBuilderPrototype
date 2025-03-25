import React from 'react';
import { motion } from 'framer-motion';
import { useCharacters } from '@/lib/stores/useCharacters';
import { Character } from '@/types/character';

interface CharacterListProps {
  onAddNewClick: () => void;
}

export function CharacterList({ onAddNewClick }: CharacterListProps) {
  const { 
    characters, 
    activeCharacterId, 
    setActiveCharacter, 
    controlCharacter, 
    releaseCharacter,
    removeCharacter 
  } = useCharacters();
  
  // Check if we have any characters
  const hasCharacters = characters.length > 0;

  return (
    <motion.div 
      className="absolute top-20 left-4 z-10 w-64 bg-gray-800 bg-opacity-90 rounded-lg shadow-lg p-3"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', damping: 20 }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-bold">Characters</h3>
        
        <button 
          onClick={onAddNewClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-2 py-1 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New
        </button>
      </div>
      
      {!hasCharacters && (
        <div className="text-center py-4 text-gray-400 text-sm">
          <p>No characters yet.</p>
          <p>Create one to start exploring!</p>
        </div>
      )}
      
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {characters.map((character) => (
          <CharacterListItem 
            key={character.id}
            character={character}
            isActive={character.id === activeCharacterId}
            onSelect={() => setActiveCharacter(character.id)}
            onControl={() => {
              if (character.isControlled) {
                releaseCharacter(character.id);
              } else {
                controlCharacter(character.id);
              }
            }}
            onRemove={() => removeCharacter(character.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface CharacterListItemProps {
  character: Character;
  isActive: boolean;
  onSelect: () => void;
  onControl: () => void;
  onRemove: () => void;
}

function CharacterListItem({ 
  character, 
  isActive, 
  onSelect, 
  onControl, 
  onRemove 
}: CharacterListItemProps) {
  // Convert RGB to CSS color
  const getColorStyle = (color: [number, number, number]) => {
    return `rgb(${Math.floor(color[0] * 255)}, ${Math.floor(color[1] * 255)}, ${Math.floor(color[2] * 255)})`;
  };
  
  return (
    <div 
      className={`p-2 rounded-md cursor-pointer transition-all ${
        isActive ? 'bg-indigo-900 bg-opacity-60' : 'hover:bg-gray-700'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center">
        {/* Character color preview */}
        <div className="w-8 h-8 mr-2 rounded-md overflow-hidden flex-shrink-0" style={{ 
          background: getColorStyle(character.appearance.bodyColor)
        }}>
          <div className="w-full h-1/3 mt-1" style={{ 
            background: getColorStyle(character.appearance.headColor)
          }}></div>
        </div>
        
        {/* Character info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-white font-medium truncate">{character.name}</p>
            
            {/* Control toggle */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onControl();
              }}
              className={`ml-1 p-1 rounded-full ${
                character.isControlled 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              title={character.isControlled ? "Release Control" : "Take Control"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </button>
            
            {/* Delete button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="ml-1 p-1 rounded-full bg-red-600 hover:bg-red-700"
              title="Remove Character"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Character type */}
          <p className="text-xs text-gray-400 truncate">
            {character.type === 'player' ? 'Player Character' : 'AI Character'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CharacterList;