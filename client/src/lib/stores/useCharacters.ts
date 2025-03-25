import { create } from 'zustand';
import { 
  Character, 
  CharacterType,
  createDefaultCharacter, 
  CharacterAction, 
  MoveToAction, 
  SpeakAction,
  CharacterPosition
} from '@/types/character';

interface CharactersState {
  characters: Character[];
  activeCharacterId: string | null;
  pendingActions: CharacterAction[];
  
  // Character management
  addCharacter: (character: Partial<Character>) => Character;
  removeCharacter: (id: string) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  
  // Character control
  setActiveCharacter: (id: string | null) => void;
  controlCharacter: (id: string) => void;
  releaseCharacter: (id: string) => void;
  
  // Character actions
  moveCharacter: (id: string, destination: CharacterPosition) => void;
  speakCharacter: (id: string, message: string) => void;
  
  // Mock AI behaviors
  simulateAIResponse: (targetId: string, message: string) => void;
}

export const useCharacters = create<CharactersState>((set, get) => ({
  characters: [],
  activeCharacterId: null,
  pendingActions: [],
  
  // Character management
  addCharacter: (characterData) => {
    const character = {
      ...createDefaultCharacter(),
      ...characterData
    };
    
    set(state => ({
      characters: [...state.characters, character]
    }));
    
    return character;
  },
  
  removeCharacter: (id) => {
    set(state => ({
      characters: state.characters.filter(char => char.id !== id),
      activeCharacterId: state.activeCharacterId === id ? null : state.activeCharacterId
    }));
  },
  
  updateCharacter: (id, updates) => {
    set(state => ({
      characters: state.characters.map(char => 
        char.id === id ? { ...char, ...updates } : char
      )
    }));
  },
  
  // Character control
  setActiveCharacter: (id) => {
    set({ activeCharacterId: id });
  },
  
  controlCharacter: (id) => {
    // Release any previously controlled character
    const currentActiveId = get().activeCharacterId;
    if (currentActiveId) {
      get().releaseCharacter(currentActiveId);
    }
    
    // Set this character as controlled
    set(state => ({
      characters: state.characters.map(char => 
        char.id === id ? { ...char, isControlled: true, type: CharacterType.PLAYER } : char
      ),
      activeCharacterId: id
    }));
  },
  
  releaseCharacter: (id) => {
    set(state => ({
      characters: state.characters.map(char => 
        char.id === id ? { ...char, isControlled: false } : char
      ),
      activeCharacterId: state.activeCharacterId === id ? null : state.activeCharacterId
    }));
  },
  
  // Character actions
  moveCharacter: (id, destination) => {
    const action: MoveToAction = {
      type: 'moveTo',
      characterId: id,
      payload: { destination }
    };
    
    set(state => ({
      pendingActions: [...state.pendingActions, action]
    }));
    
    // Directly update the character position to simulate immediate movement
    // In a real implementation, we'd have animation and physics
    set(state => ({
      characters: state.characters.map(char => 
        char.id === id ? { ...char, position: destination } : char
      )
    }));
  },
  
  speakCharacter: (id, message) => {
    const action: SpeakAction = {
      type: 'speak',
      characterId: id,
      payload: { message }
    };
    
    set(state => ({
      pendingActions: [...state.pendingActions, action]
    }));
    
    // Auto-respond with AI characters
    const { characters } = get();
    const speakingCharacter = characters.find(char => char.id === id);
    
    if (speakingCharacter && speakingCharacter.type === CharacterType.PLAYER) {
      // Find nearby AI characters to respond
      const aiCharacters = characters.filter(char => 
        char.type === CharacterType.AI && char.id !== id
      );
      
      if (aiCharacters.length > 0) {
        // Have first AI character respond
        setTimeout(() => {
          get().simulateAIResponse(aiCharacters[0].id, message);
        }, 1000);
      }
    }
  },
  
  // Mock AI behaviors
  simulateAIResponse: (targetId, triggerMessage) => {
    const { characters } = get();
    const aiCharacter = characters.find(char => char.id === targetId);
    
    if (!aiCharacter) return;
    
    // Mock responses based on character personality
    const responses = [
      `Hello there! I'm ${aiCharacter.name}.`,
      `Welcome to this world!`,
      `Interesting point about "${triggerMessage.slice(0, 10)}..."`,
      `I was just exploring this area.`,
      `What brings you here?`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const action: SpeakAction = {
      type: 'speak',
      characterId: targetId,
      payload: { message: randomResponse }
    };
    
    set(state => ({
      pendingActions: [...state.pendingActions, action]
    }));
  }
}));