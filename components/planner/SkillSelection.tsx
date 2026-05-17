"use client";

import { useState } from "react";
import type { Skill } from "@/lib/types";
import { calculateUsedTier } from "@/lib/utils";

interface SkillSelectionProps {
  skills: Skill[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export function SkillSelection({ skills, onRemove, onClear }: SkillSelectionProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const usedTier = calculateUsedTier(skills.length);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    setDraggedIndex(null);
    // Note: For actual reordering, we'd need to lift state to parent
    // This is a simplified version showing the UI
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (skills.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">ยังไม่ได้เลือกสกิล</p>
        <p className="text-sm mt-2">จับภาพหน้าจอแล้วคลิกตัวเลขเพื่อเลือกสกิล</p>
      </div>
    );
  }

  return (
    <div className="bg-[#16213e] p-6 rounded-xl border-2 border-[#0f3460]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#ffd700]">
            สกิลที่เลือก: {skills.length}
          </h2>
          <p className="text-sm text-gray-300">
            จบ {usedTier}/70 เทิร์น
          </p>
        </div>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-[#e74c3c] text-white rounded-lg
                     hover:bg-[#ff6b6b] transition-colors
                     focus-visible:outline-none"
          aria-label="ล้างสกิลทั้งหมด"
        >
          🗑️ ล้างทั้งหมด
        </button>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {skills.map((skill, index) => (
          <div
            key={skill.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={`relative group cursor-grab active:cursor-grabbing
                        ${draggedIndex === index ? 'opacity-50' : ''}
                        transition-opacity`}
          >
            {/* Skill image */}
            <img
              src={skill.image}
              alt={skill.name}
              className="w-full aspect-square object-cover rounded-lg border-2
                         border-[#0f3460] group-hover:border-[#ffd700]
                         transition-colors"
            />

            {/* Order badge */}
            <div className="absolute top-1 left-1 w-6 h-6 bg-[#e74c3c] rounded-full
                        flex items-center justify-center text-white text-xs font-bold">
              {index + 1}
            </div>

            {/* Remove button */}
            <button
              onClick={() => onRemove(skill.id)}
              className="absolute top-1 right-1 w-6 h-6 bg-[#e74c3c] rounded-full
                         flex items-center justify-center text-white text-xs font-bold
                         opacity-0 group-hover:opacity-100 transition-opacity
                         hover:bg-[#ff6b6b] focus-visible:opacity-100 focus-visible:outline-none"
              aria-label={`ลบสกิล ${skill.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}