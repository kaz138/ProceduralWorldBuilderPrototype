import { v4 as uuidv4 } from 'uuid';

export interface CharacterPosition {
  x: number;
  y: number;
  z: number;
}

export interface CharacterAppearance {
  headColor: [number, number, number];
  bodyColor: [number, number, number];
  limbColor: [number, number, number];
  height: number;
  width: number;
}

export enum CharacterType {
  AI = 'ai',
  PLAYER = 'player'
}

export interface Character {
  id: string;
  name: string;
  description: string;
  position: CharacterPosition;
  appearance: CharacterAppearance;
  type: CharacterType;
  isControlled: boolean;
  personality?: string;
}

export interface CharacterAction {
  type: 'moveTo' | 'speak';
  characterId: string;
  payload: any;
}

export interface MoveToAction extends CharacterAction {
  type: 'moveTo';
  payload: {
    destination: CharacterPosition;
  };
}

export interface SpeakAction extends CharacterAction {
  type: 'speak';
  payload: {
    message: string;
  };
}

export const createDefaultCharacterAppearance = (): CharacterAppearance => ({
  headColor: [0.8, 0.5, 0.5],
  bodyColor: [0.3, 0.6, 0.8],
  limbColor: [0.3, 0.6, 0.8],
  height: 2,
  width: 1
});

export const createDefaultCharacter = (name = 'New Character'): Character => ({
  id: uuidv4(),
  name,
  description: 'A mysterious character',
  position: { x: 0, y: 0, z: 0 },
  appearance: createDefaultCharacterAppearance(),
  type: CharacterType.AI,
  isControlled: false
});