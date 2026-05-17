"use client";

import { useEffect, useRef, useState } from "react";
import { PATTERN_SETTINGS } from "@/lib/constants";

interface CaptureCanvasProps {
  imageDataUrl: string;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onSkillSelect?: (skill: { row: number; col: number; imageDataUrl: string; x: number; y: number; size: number }) => void;
}

export function CaptureCanvas({
  imageDataUrl,
  zoom,
  onZoomChange,
  onSkillSelect,
}: CaptureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttons, setButtons] = useState<Array<{ row: number; col: number; x: number; y: number; originalX: number; originalY: number }>>([]);

  useEffect(() => {
    if (!imageDataUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const newWidth = img.width * zoom;
      const newHeight = img.height * zoom;

      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Calculate overlay buttons
      const overlayButtons: typeof buttons = [];
      const { startX, startY, gapX, gapY, rows, cols, skillSize } = PATTERN_SETTINGS;

      // Calculate scale: image is drawn at img.width * zoom, but PATTERN_SETTINGS are in original coordinates
      // We need to scale button positions to match the drawn image
      const canvasScaleX = newWidth / img.width;  // = zoom
      const canvasScaleY = newHeight / img.height; // = zoom

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const originalX = startX + col * gapX;
          const originalY = startY + row * gapY;
          const buttonX = originalX * canvasScaleX;
          const buttonY = originalY * canvasScaleY;

          overlayButtons.push({ row, col, x: buttonX, y: buttonY, originalX, originalY });
        }
      }

      setButtons(overlayButtons);
    };
    img.src = imageDataUrl;
  }, [imageDataUrl, zoom]);

  const handleSkillSelect = (btn: typeof buttons[0]) => {
    if (onSkillSelect) {
      onSkillSelect({
        row: btn.row,
        col: btn.col,
        imageDataUrl,
        x: btn.originalX,
        y: btn.originalY,
        size: PATTERN_SETTINGS.skillSize,
      });
    }
  };

  if (!imageDataUrl) {
    return null;
  }

  return (
    <div className="mb-6">
      {/* Zoom controls */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
          disabled={zoom <= 0.5}
          className="px-4 py-2 bg-[#16213e] text-white rounded-lg
                     hover:bg-[#0f3460] disabled:opacity-50 disabled:cursor-not-allowed
                     focus-visible:outline-none"
          aria-label="ซูมออก"
        >
          -
        </button>
        <span className="px-4 py-2 bg-[#16213e] text-white rounded-lg min-w-[80px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => onZoomChange(Math.min(2.0, zoom + 0.1))}
          disabled={zoom >= 2.0}
          className="px-4 py-2 bg-[#16213e] text-white rounded-lg
                     hover:bg-[#0f3460] disabled:opacity-50 disabled:cursor-not-allowed
                     focus-visible:outline-none"
          aria-label="ซูมเข้า"
        >
          +
        </button>
      </div>

      {/* Canvas with overlay buttons */}
      <div
        ref={containerRef}
        className="relative inline-block overflow-hidden rounded-xl border-2 border-[#0f3460]"
      >
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto"
          aria-label="ภาพจับหน้าจอพร้อมการตรวจจับสกิล"
        />
        {/* Overlay buttons */}
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={() => handleSkillSelect(btn)}
            className="absolute w-[30px] h-[30px] bg-[#ffd700] text-[#1a1a2e] rounded-full
                       font-bold text-sm hover:bg-[#ffea00] hover:scale-110
                       transition-transform duration-150 focus-visible:outline-none"
            style={{
              left: `${btn.x}px`,
              top: `${btn.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            aria-label={`เลือกสกิล แถว ${btn.row + 1} คอลัมน์ ${btn.col + 1}`}
          >
            {btn.row * PATTERN_SETTINGS.cols + btn.col + 1}
          </button>
        ))}
      </div>
    </div>
  );
}