// Define all available prefab types
export type PrefabType = 
  | 'chair' 
  | 'table' 
  | 'tree' 
  | 'lamp' 
  | 'house'
  | 'car'
  | 'bench';

// Check if a string is a valid prefab type
export function isPrefabType(type: string): type is PrefabType {
  return [
    'chair', 
    'table', 
    'tree', 
    'lamp', 
    'house',
    'car',
    'bench'
  ].includes(type);
}

// Prefab metadata definitions (for LLM reference)
export interface PrefabDefinition {
  type: PrefabType;
  description: string;
  defaultScale: [number, number, number];
  defaultColor: [number, number, number];
}

export const prefabDefinitions: PrefabDefinition[] = [
  {
    type: 'chair',
    description: 'A simple chair with four legs and a back',
    defaultScale: [1, 1, 1],
    defaultColor: [0.6, 0.4, 0.2] // Brown
  },
  {
    type: 'table',
    description: 'A simple table with four legs',
    defaultScale: [1.5, 1, 1.5],
    defaultColor: [0.6, 0.4, 0.2] // Brown
  },
  {
    type: 'tree',
    description: 'A basic tree with a trunk and foliage',
    defaultScale: [1, 2, 1],
    defaultColor: [0.2, 0.6, 0.2] // Green
  },
  {
    type: 'lamp',
    description: 'A standing lamp with a base, pole and lamp shade',
    defaultScale: [1, 1.5, 1],
    defaultColor: [0.8, 0.8, 0.8] // Light gray
  },
  {
    type: 'house',
    description: 'A simple house with walls and a pitched roof',
    defaultScale: [3, 2, 4],
    defaultColor: [0.9, 0.9, 0.9] // White/light gray
  },
  {
    type: 'car',
    description: 'A basic car with a body and wheels',
    defaultScale: [1.5, 1, 3],
    defaultColor: [0.2, 0.2, 0.7] // Blue
  },
  {
    type: 'bench',
    description: 'A park bench with a seat and backrest',
    defaultScale: [2, 1, 0.8],
    defaultColor: [0.4, 0.3, 0.2] // Dark brown
  }
];
