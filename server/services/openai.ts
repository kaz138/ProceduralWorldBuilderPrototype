import { worldGenSystemPrompt, generateWorldPrompt } from "../../client/src/lib/prompts/worldGenPrompt";
import { SceneGraph } from "../../client/src/types/sceneGraph";

// This function would normally communicate with the OpenAI API
// but for now, we're using a mock response to simplify development
export async function generateWorldScene(prompt: string): Promise<SceneGraph> {
  console.log(`Generating world from prompt: "${prompt}" (using mock data)`);
  
  // We'll create slightly different scenes based on keywords in the prompt
  // to simulate different responses
  return getMockScene(prompt);
}

// Create mock scenes based on keywords in the prompt
function getMockScene(prompt: string): SceneGraph {
  const promptLower = prompt.toLowerCase();
  
  // Scene variants based on keywords
  if (promptLower.includes("village") || promptLower.includes("town")) {
    return getVillageScene();
  } else if (promptLower.includes("mountain") || promptLower.includes("hill")) {
    return getMountainScene();
  } else if (promptLower.includes("coastal") || promptLower.includes("beach") || promptLower.includes("ocean")) {
    return getCoastalScene();
  } else if (promptLower.includes("forest") || promptLower.includes("woods")) {
    return getForestScene();
  } else if (promptLower.includes("city") || promptLower.includes("urban")) {
    return getCityScene();
  } else {
    // Default scene for other prompts
    return getDefaultScene();
  }
}

// Default scene with varied elements
function getDefaultScene(): SceneGraph {
  return {
    id: "world",
    children: [
      {
        id: "terrain",
        type: "box",
        position: [0, -0.5, 0],
        scale: [100, 1, 100],
        color: [0.3, 0.6, 0.2],
        children: []
      },
      {
        id: "central_building",
        type: "box",
        position: [0, 2, 0],
        scale: [6, 4, 6],
        color: [0.8, 0.8, 0.8],
        children: [
          {
            id: "roof",
            type: "cone",
            position: [0, 3, 0],
            scale: [6, 2, 6],
            color: [0.7, 0.3, 0.3]
          }
        ]
      },
      {
        id: "tree_1",
        type: "tree",
        position: [-10, 0, 5],
        scale: [1, 3, 1],
        color: [0.1, 0.5, 0.1]
      },
      {
        id: "tree_2",
        type: "tree",
        position: [-12, 0, 8],
        scale: [1.2, 3.5, 1.2],
        color: [0.1, 0.6, 0.1]
      },
      {
        id: "tree_3",
        type: "tree",
        position: [-8, 0, 10],
        scale: [0.8, 2.5, 0.8],
        color: [0.1, 0.5, 0.1]
      },
      {
        id: "sphere_landmark",
        type: "sphere",
        position: [12, 2, -5],
        scale: [4, 4, 4],
        color: [0.7, 0.7, 0.9]
      }
    ]
  };
}

// Village scene with houses, trees, and a central plaza
function getVillageScene(): SceneGraph {
  return {
    id: "world",
    children: [
      {
        id: "terrain",
        type: "box",
        position: [0, -0.5, 0],
        scale: [100, 1, 100],
        color: [0.4, 0.6, 0.3],
        children: []
      },
      // Village houses
      {
        id: "house_1",
        type: "house",
        position: [-8, 0, -5],
        scale: [2, 2, 2],
        color: [0.9, 0.8, 0.7]
      },
      {
        id: "house_2",
        type: "house",
        position: [-12, 0, 0],
        scale: [2.2, 2, 2.2],
        color: [0.85, 0.8, 0.7]
      },
      {
        id: "house_3",
        type: "house",
        position: [-5, 0, 4],
        scale: [2, 2, 2],
        color: [0.9, 0.85, 0.8]
      },
      {
        id: "house_4",
        type: "house",
        position: [5, 0, -8],
        scale: [2.5, 2.2, 2.5],
        color: [0.8, 0.7, 0.6]
      },
      {
        id: "large_house",
        type: "house",
        position: [8, 0, 5],
        scale: [3, 2.5, 3],
        color: [0.7, 0.65, 0.6]
      },
      // Central plaza
      {
        id: "plaza",
        type: "cylinder",
        position: [0, -0.4, 0],
        scale: [8, 0.2, 8],
        color: [0.7, 0.7, 0.7]
      },
      // Trees around the village
      {
        id: "tree_group_1",
        type: "tree",
        position: [-15, 0, -15],
        scale: [1.5, 3, 1.5],
        color: [0.1, 0.5, 0.1]
      },
      {
        id: "tree_group_2",
        type: "tree",
        position: [15, 0, 15],
        scale: [1.3, 2.8, 1.3],
        color: [0.1, 0.55, 0.1]
      },
      {
        id: "tree_group_3",
        type: "tree",
        position: [18, 0, -10],
        scale: [1.2, 2.5, 1.2],
        color: [0.15, 0.6, 0.15]
      },
      // Central well
      {
        id: "well",
        type: "cylinder",
        position: [0, 0.5, 0],
        scale: [1.5, 1, 1.5],
        color: [0.6, 0.6, 0.6]
      }
    ]
  };
}

// Mountain scene with peaks, rocks, and a valley
function getMountainScene(): SceneGraph {
  return {
    id: "world",
    children: [
      // Base terrain
      {
        id: "terrain",
        type: "box",
        position: [0, -0.5, 0],
        scale: [100, 1, 100],
        color: [0.4, 0.6, 0.3],
        children: []
      },
      // Large mountain
      {
        id: "mountain_main",
        type: "cone",
        position: [0, 10, -20],
        scale: [20, 20, 20],
        color: [0.5, 0.5, 0.5]
      },
      // Smaller peaks
      {
        id: "mountain_peak_1",
        type: "cone",
        position: [-15, 8, -15],
        scale: [10, 16, 10],
        color: [0.55, 0.5, 0.45]
      },
      {
        id: "mountain_peak_2",
        type: "cone",
        position: [20, 6, -25],
        scale: [12, 12, 12],
        color: [0.6, 0.55, 0.5]
      },
      // Rocky outcroppings
      {
        id: "rock_1",
        type: "box",
        position: [5, 1, -5],
        scale: [3, 2, 2],
        color: [0.5, 0.45, 0.4]
      },
      {
        id: "rock_2",
        type: "box",
        position: [-8, 1, 2],
        scale: [2, 1.5, 3],
        color: [0.45, 0.4, 0.35]
      },
      {
        id: "rock_3",
        type: "box",
        position: [12, 1.5, 8],
        scale: [4, 3, 2.5],
        color: [0.55, 0.5, 0.45]
      },
      // Trees in valley
      {
        id: "tree_valley_1",
        type: "tree",
        position: [-5, 0, 10],
        scale: [1, 2, 1],
        color: [0.1, 0.4, 0.1]
      },
      {
        id: "tree_valley_2",
        type: "tree",
        position: [0, 0, 8],
        scale: [1.2, 2.2, 1.2],
        color: [0.1, 0.45, 0.1]
      },
      {
        id: "tree_valley_3",
        type: "tree",
        position: [6, 0, 12],
        scale: [1.1, 2.3, 1.1],
        color: [0.15, 0.5, 0.15]
      }
    ]
  };
}

// Coastal scene with water, beach, and buildings
function getCoastalScene(): SceneGraph {
  return {
    id: "world",
    children: [
      // Land terrain
      {
        id: "terrain",
        type: "box",
        position: [0, -0.5, -20],
        scale: [100, 1, 60],
        color: [0.4, 0.6, 0.3],
        children: []
      },
      // Water/ocean
      {
        id: "water",
        type: "box",
        position: [0, -0.8, 30],
        scale: [100, 0.4, 40],
        color: [0.1, 0.4, 0.8],
        children: []
      },
      // Sandy beach
      {
        id: "beach",
        type: "box",
        position: [0, -0.45, 0],
        scale: [100, 0.1, 10],
        color: [0.9, 0.8, 0.6],
        children: []
      },
      // Lighthouse
      {
        id: "lighthouse_base",
        type: "cylinder",
        position: [20, 2, -5],
        scale: [3, 4, 3],
        color: [0.9, 0.9, 0.9],
        children: [
          {
            id: "lighthouse_top",
            type: "cylinder",
            position: [0, 3, 0],
            scale: [2, 2, 2],
            color: [0.9, 0.2, 0.2]
          }
        ]
      },
      // Beach houses
      {
        id: "beach_house_1",
        type: "house",
        position: [-15, 0, -8],
        scale: [2.5, 2, 2.5],
        color: [0.9, 0.85, 0.8]
      },
      {
        id: "beach_house_2",
        type: "house",
        position: [-8, 0, -10],
        scale: [2.2, 2, 2.2],
        color: [0.85, 0.8, 0.75]
      },
      {
        id: "beach_house_3",
        type: "house",
        position: [0, 0, -12],
        scale: [2.5, 2, 2.5],
        color: [0.8, 0.75, 0.7]
      },
      // Palm trees
      {
        id: "palm_1",
        type: "tree",
        position: [-10, 0, -2],
        scale: [1, 3, 1],
        color: [0.2, 0.6, 0.3]
      },
      {
        id: "palm_2",
        type: "tree",
        position: [10, 0, -3],
        scale: [1.2, 3.5, 1.2],
        color: [0.2, 0.65, 0.3]
      },
      // Boats in water
      {
        id: "boat_1",
        type: "box",
        position: [5, 0, 8],
        scale: [2, 1, 4],
        color: [0.6, 0.5, 0.4]
      },
      {
        id: "boat_2",
        type: "box",
        position: [-12, 0, 12],
        scale: [2.5, 1.2, 5],
        color: [0.7, 0.6, 0.5]
      }
    ]
  };
}

// Forest scene with dense trees and a clearing
function getForestScene(): SceneGraph {
  return {
    id: "world",
    children: [
      // Ground
      {
        id: "terrain",
        type: "box",
        position: [0, -0.5, 0],
        scale: [100, 1, 100],
        color: [0.3, 0.5, 0.2],
        children: []
      },
      // Dense trees
      {
        id: "tree_1",
        type: "tree",
        position: [-20, 0, -15],
        scale: [1.5, 4, 1.5],
        color: [0.1, 0.4, 0.1]
      },
      {
        id: "tree_2",
        type: "tree",
        position: [-15, 0, -10],
        scale: [1.7, 4.5, 1.7],
        color: [0.1, 0.45, 0.1]
      },
      {
        id: "tree_3",
        type: "tree",
        position: [-12, 0, -18],
        scale: [1.4, 3.8, 1.4],
        color: [0.15, 0.5, 0.15]
      },
      {
        id: "tree_4",
        type: "tree",
        position: [-8, 0, -5],
        scale: [1.6, 4.2, 1.6],
        color: [0.1, 0.4, 0.1]
      },
      {
        id: "tree_5",
        type: "tree",
        position: [-5, 0, -15],
        scale: [1.3, 3.6, 1.3],
        color: [0.1, 0.45, 0.1]
      },
      {
        id: "tree_6",
        type: "tree",
        position: [5, 0, -20],
        scale: [1.8, 4.8, 1.8],
        color: [0.1, 0.4, 0.1]
      },
      {
        id: "tree_7",
        type: "tree",
        position: [10, 0, -15],
        scale: [1.5, 4, 1.5],
        color: [0.1, 0.5, 0.1]
      },
      {
        id: "tree_8",
        type: "tree",
        position: [15, 0, -10],
        scale: [1.6, 4.3, 1.6],
        color: [0.15, 0.45, 0.15]
      },
      {
        id: "tree_9",
        type: "tree",
        position: [20, 0, -5],
        scale: [1.4, 3.9, 1.4],
        color: [0.1, 0.4, 0.1]
      },
      {
        id: "tree_10",
        type: "tree",
        position: [-18, 0, 0],
        scale: [1.7, 4.5, 1.7],
        color: [0.1, 0.5, 0.1]
      },
      {
        id: "tree_11",
        type: "tree",
        position: [-12, 0, 5],
        scale: [1.5, 4, 1.5],
        color: [0.15, 0.45, 0.15]
      },
      {
        id: "tree_12",
        type: "tree",
        position: [-20, 0, 10],
        scale: [1.6, 4.2, 1.6],
        color: [0.1, 0.4, 0.1]
      },
      {
        id: "tree_13",
        type: "tree",
        position: [-15, 0, 15],
        scale: [1.4, 3.8, 1.4],
        color: [0.1, 0.5, 0.1]
      },
      {
        id: "tree_14",
        type: "tree",
        position: [-5, 0, 20],
        scale: [1.8, 4.6, 1.8],
        color: [0.15, 0.45, 0.15]
      },
      {
        id: "tree_15",
        type: "tree",
        position: [5, 0, 15],
        scale: [1.5, 4, 1.5],
        color: [0.1, 0.5, 0.1]
      },
      {
        id: "tree_16",
        type: "tree",
        position: [10, 0, 20],
        scale: [1.7, 4.4, 1.7],
        color: [0.1, 0.4, 0.1]
      },
      {
        id: "tree_17",
        type: "tree",
        position: [15, 0, 10],
        scale: [1.6, 4.2, 1.6],
        color: [0.15, 0.5, 0.15]
      },
      {
        id: "tree_18",
        type: "tree",
        position: [20, 0, 5],
        scale: [1.4, 3.8, 1.4],
        color: [0.1, 0.45, 0.1]
      },
      // Central clearing
      {
        id: "clearing",
        type: "cylinder",
        position: [0, -0.4, 0],
        scale: [10, 0.2, 10],
        color: [0.4, 0.6, 0.3]
      },
      // Small cabin in clearing
      {
        id: "cabin",
        type: "house",
        position: [0, 0, 0],
        scale: [2, 2, 2],
        color: [0.6, 0.4, 0.2]
      }
    ]
  };
}

// City scene with tall buildings
function getCityScene(): SceneGraph {
  return {
    id: "world",
    children: [
      // Ground
      {
        id: "terrain",
        type: "box",
        position: [0, -0.5, 0],
        scale: [100, 1, 100],
        color: [0.5, 0.5, 0.5],
        children: []
      },
      // Central skyscraper
      {
        id: "skyscraper_center",
        type: "box",
        position: [0, 10, 0],
        scale: [8, 20, 8],
        color: [0.7, 0.7, 0.8],
        children: []
      },
      // Surrounding buildings
      {
        id: "building_1",
        type: "box",
        position: [-15, 6, -15],
        scale: [6, 12, 6],
        color: [0.6, 0.6, 0.7]
      },
      {
        id: "building_2",
        type: "box",
        position: [-15, 4, 0],
        scale: [6, 8, 6],
        color: [0.65, 0.65, 0.7]
      },
      {
        id: "building_3",
        type: "box",
        position: [-15, 7, 15],
        scale: [6, 14, 6],
        color: [0.7, 0.7, 0.8]
      },
      {
        id: "building_4",
        type: "box",
        position: [0, 5, -15],
        scale: [6, 10, 6],
        color: [0.75, 0.75, 0.85]
      },
      {
        id: "building_5",
        type: "box",
        position: [0, 8, 15],
        scale: [6, 16, 6],
        color: [0.8, 0.8, 0.9]
      },
      {
        id: "building_6",
        type: "box",
        position: [15, 9, -15],
        scale: [6, 18, 6],
        color: [0.7, 0.7, 0.8]
      },
      {
        id: "building_7",
        type: "box",
        position: [15, 6, 0],
        scale: [6, 12, 6],
        color: [0.75, 0.75, 0.85]
      },
      {
        id: "building_8",
        type: "box",
        position: [15, 7, 15],
        scale: [6, 14, 6],
        color: [0.8, 0.8, 0.9]
      },
      // Roads
      {
        id: "road_x",
        type: "box",
        position: [0, -0.4, 0],
        scale: [50, 0.2, 4],
        color: [0.2, 0.2, 0.2]
      },
      {
        id: "road_z",
        type: "box",
        position: [0, -0.4, 0],
        scale: [4, 0.2, 50],
        color: [0.2, 0.2, 0.2]
      },
      // Cars
      {
        id: "car_1",
        type: "car",
        position: [8, 0, 0],
        scale: [1, 1, 1],
        color: [0.8, 0.2, 0.2]
      },
      {
        id: "car_2",
        type: "car",
        position: [-8, 0, 0],
        scale: [1, 1, 1],
        color: [0.2, 0.2, 0.8]
      },
      {
        id: "car_3",
        type: "car",
        position: [0, 0, 8],
        scale: [1, 1, 1],
        color: [0.8, 0.8, 0.2]
      },
      {
        id: "car_4",
        type: "car",
        position: [0, 0, -8],
        scale: [1, 1, 1],
        color: [0.2, 0.8, 0.2]
      }
    ]
  };
}
