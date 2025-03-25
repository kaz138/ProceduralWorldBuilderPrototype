export interface SceneNode {
  id: string;
  type: string;
  position: [number, number, number];
  scale?: [number, number, number];
  color?: [number, number, number];
  children?: SceneNode[];
}

export interface SceneGraph {
  id: string;
  children: SceneNode[];
}

// Helper functions for managing scene graphs

// Create a new empty scene graph
export function createEmptyScene(): SceneGraph {
  return {
    id: "world",
    children: []
  };
}

// Add a node to the scene graph
export function addNodeToScene(scene: SceneGraph, node: SceneNode): SceneGraph {
  return {
    ...scene,
    children: [...scene.children, node]
  };
}

// Find a node by ID in the scene graph
export function findNodeById(scene: SceneGraph, id: string): SceneNode | null {
  // Helper function to search recursively
  function search(nodes: SceneNode[]): SceneNode | null {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      
      if (node.children && node.children.length > 0) {
        const found = search(node.children);
        if (found) {
          return found;
        }
      }
    }
    
    return null;
  }
  
  return search(scene.children);
}

// Update a node in the scene graph
export function updateNode(
  scene: SceneGraph, 
  nodeId: string, 
  updates: Partial<SceneNode>
): SceneGraph {
  // Helper function to update a node recursively
  function updateNodeRecursive(nodes: SceneNode[]): SceneNode[] {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, ...updates };
      }
      
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: updateNodeRecursive(node.children)
        };
      }
      
      return node;
    });
  }
  
  return {
    ...scene,
    children: updateNodeRecursive(scene.children)
  };
}
