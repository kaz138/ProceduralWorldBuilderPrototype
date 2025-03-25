import { SceneGraph, SceneNode } from "../../client/src/types/sceneGraph";
import { isPrefabType } from "../../client/src/types/prefabs";

// Allowed primitive types
const VALID_PRIMITIVE_TYPES = [
  'box', 
  'sphere', 
  'cylinder', 
  'cone', 
  'plane'
];

// Validate and clean up the scene graph
export function validateSceneGraph(sceneGraph: any): SceneGraph {
  // Ensure the scene has the required root structure
  if (!sceneGraph || !sceneGraph.id || !Array.isArray(sceneGraph.children)) {
    // Create a minimal valid scene
    return {
      id: "world",
      children: []
    };
  }
  
  // Recursively validate all nodes in the scene
  const validatedChildren = sceneGraph.children.map(validateNode);
  
  // Filter out any null results (invalid nodes)
  const filteredChildren = validatedChildren.filter(Boolean) as SceneNode[];
  
  // Ensure we have at least a terrain if the scene is otherwise empty
  if (filteredChildren.length === 0) {
    filteredChildren.push({
      id: "terrain",
      type: "box",
      position: [0, -0.5, 0],
      scale: [100, 1, 100],
      color: [0.3, 0.6, 0.2]
    });
  }
  
  return {
    id: sceneGraph.id || "world",
    children: filteredChildren
  };
}

// Validate a single node and its children
function validateNode(node: any, depth: number = 0): SceneNode | null {
  // Skip if we've gone too deep (prevent infinite recursion)
  if (depth > 10) {
    return null;
  }
  
  // Skip if missing essential properties
  if (!node || !node.id || !node.type || !Array.isArray(node.position)) {
    return null;
  }
  
  // Validate type (must be a valid primitive or prefab)
  const isValidType = 
    VALID_PRIMITIVE_TYPES.includes(node.type) || 
    isPrefabType(node.type);
  
  if (!isValidType) {
    // Default to box if type is invalid
    node.type = 'box';
  }
  
  // Ensure position has 3 elements
  if (node.position.length !== 3) {
    node.position = [0, 0, 0];
  }
  
  // Validate position values (must be numbers)
  const position: [number, number, number] = [
    Number(node.position[0]) || 0,
    Number(node.position[1]) || 0,
    Number(node.position[2]) || 0
  ];
  
  // Validate scale (default if missing or invalid)
  let scale: [number, number, number] = [1, 1, 1];
  if (node.scale && Array.isArray(node.scale) && node.scale.length === 3) {
    scale = [
      Number(node.scale[0]) || 1,
      Number(node.scale[1]) || 1,
      Number(node.scale[2]) || 1
    ];
  }
  
  // Validate color (default if missing or invalid)
  let color: [number, number, number] = [1, 1, 1];
  if (node.color && Array.isArray(node.color) && node.color.length === 3) {
    // Ensure color values are between 0 and 1
    color = [
      Math.max(0, Math.min(1, Number(node.color[0]) || 1)),
      Math.max(0, Math.min(1, Number(node.color[1]) || 1)),
      Math.max(0, Math.min(1, Number(node.color[2]) || 1))
    ];
  }
  
  // Recursively validate children
  const children = node.children && Array.isArray(node.children)
    ? node.children
        .map((child: any) => validateNode(child, depth + 1))
        .filter(Boolean) // Remove nulls
    : undefined;
  
  // Return the validated node
  return {
    id: String(node.id),
    type: node.type,
    position,
    scale,
    color,
    ...(children && children.length > 0 ? { children } : {})
  };
}
