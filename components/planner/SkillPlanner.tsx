"use client";

import { useReducer } from "react";
import { NameInput } from "./NameInput";
import { ScreenCapture } from "./ScreenCapture";
import { CaptureCanvas } from "./CaptureCanvas";
import { SkillSelection } from "./SkillSelection";
import { ExportPreview } from "./ExportPreview";
import type { Skill } from "@/lib/types";
import { cropSkillFromImage } from "@/lib/utils";

interface State {
  capturedImage: string | null;
  selectedSkills: Skill[];
  characterName: string;
  zoom: number;
}

type Action =
  | { type: "SET_IMAGE"; image: string }
  | { type: "ADD_SKILL"; skill: Skill }
  | { type: "REMOVE_SKILL"; id: number }
  | { type: "SET_NAME"; name: string }
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_IMAGE":
      return { ...state, capturedImage: action.image };
    case "ADD_SKILL":
      return { ...state, selectedSkills: [...state.selectedSkills, action.skill] };
    case "REMOVE_SKILL":
      return { ...state, selectedSkills: state.selectedSkills.filter((s) => s.id !== action.id) };
    case "SET_NAME":
      return { ...state, characterName: action.name };
    case "SET_ZOOM":
      return { ...state, zoom: action.zoom };
    case "RESET":
      return { capturedImage: null, selectedSkills: [], characterName: "", zoom: 1 };
    default:
      return state;
  }
}

export function SkillPlanner() {
  const [state, dispatch] = useReducer(reducer, {
    capturedImage: null,
    selectedSkills: [],
    characterName: "",
    zoom: 1,
  });

  const handleCapture = (image: string) => {
    dispatch({ type: "SET_IMAGE", image });
  };

  const handleSkillSelect = async (data: { row: number; col: number; imageDataUrl: string; x: number; y: number; size: number }) => {
    const { row, col, imageDataUrl, x, y, size } = data;
    const position = row * 5 + col; // 5 columns

    // Crop the skill image from the captured screenshot
    const croppedImage = await cropSkillFromImage(imageDataUrl, x, y, size);

    const skill: Skill = {
      id: Date.now(),
      image: croppedImage,
      name: `สกิล ${state.selectedSkills.length + 1}`,
    };
    dispatch({ type: "ADD_SKILL", skill });
  };

  const handleRemove = (id: number) => {
    dispatch({ type: "REMOVE_SKILL", id });
  };

  const handleClear = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-[#ffd700]">
        7K Skill Planner
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left column: Capture */}
        <div className="space-y-6">
          <div className="bg-[#16213e] p-6 rounded-xl border-2 border-[#0f3460]">
            <h2 className="text-2xl font-bold text-[#ffd700] mb-4">จับภาพและเลือกสกิล</h2>

            {!state.capturedImage ? (
              <ScreenCapture onCapture={handleCapture} />
            ) : (
              <>
                <CaptureCanvas
                  imageDataUrl={state.capturedImage}
                  zoom={state.zoom}
                  onZoomChange={(zoom) => dispatch({ type: "SET_ZOOM", zoom })}
                  onSkillSelect={handleSkillSelect}
                />

                <button
                  onClick={() => dispatch({ type: "RESET" })}
                  className="w-full mt-4 px-6 py-3 bg-[#666] text-white rounded-lg
                             hover:bg-[#888] transition-colors focus-visible:outline-none"
                >
                  🔄 จับภาพใหม่
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right column: Selection and Export */}
        <div className="space-y-6">
          <div className="bg-[#16213e] p-6 rounded-xl border-2 border-[#0f3460]">
            <h2 className="text-2xl font-bold text-[#ffd700] mb-4">ตั้งค่าและส่งออก</h2>

            <NameInput
              value={state.characterName}
              onChange={(name) => dispatch({ type: "SET_NAME", name })}
            />

            {state.selectedSkills.length > 0 && (
              <ExportPreview
                skills={state.selectedSkills}
                characterName={state.characterName}
              />
            )}
          </div>

          {state.selectedSkills.length > 0 && (
            <SkillSelection
              skills={state.selectedSkills}
              onRemove={handleRemove}
              onClear={handleClear}
            />
          )}
        </div>
      </div>
    </div>
  );
}