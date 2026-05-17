// Core skill types for 7K Skill Planner

export interface Skill {
  id: number;
  image: string;        // data URL of skill icon
  name: string;         // "สกิล 1", "สกิล 2", etc.
}

export interface DetectedSkill extends Skill {
  position: number;     // 0-9 index in 2x5 grid
}

export interface CapturedImage {
  dataUrl: string;      // full screenshot data URL
  width: number;
  height: number;
  scaleX: number;      // applied zoom scale X
  scaleY: number;      // applied zoom scale Y
}

// Planner state managed by useReducer
export interface PlannerState {
  detectedSkills: DetectedSkill[] | null;
  selectedSkills: Skill[];
  characterName: string;
  capturedImage: CapturedImage | null;
  zoom: number;
}

// Action types for reducer
export type PlannerAction =
  | { type: 'SET_DETECTED'; skills: DetectedSkill[] }
  | { type: 'ADD_SKILL'; skill: Skill }
  | { type: 'REMOVE_SKILL'; id: number }
  | { type: 'REORDER_SKILLS'; skills: Skill[] }
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_CAPTURED'; image: CapturedImage | null }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'RESET' };