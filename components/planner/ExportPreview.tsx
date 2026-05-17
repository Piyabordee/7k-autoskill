"use client";

import { useState } from "react";
import type { Skill } from "@/lib/types";
import { EXPORT_SETTINGS, MAX_TIER } from "@/lib/constants";
import { generateFileName, calculateUsedTier } from "@/lib/utils";

interface ExportPreviewProps {
  skills: Skill[];
  characterName: string;
}

export function ExportPreview({ skills, characterName }: ExportPreviewProps) {
  const [copied, setCopied] = useState(false);

  const displayName = characterName || "ไม่ระบุชื่อ";
  const usedTier = calculateUsedTier(skills.length);

  const generateExportImage = async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement("canvas");
    const { skillSize, padding, maxCols, backgroundColor, textColor, subtitleColor, badgeColor } = EXPORT_SETTINGS;

    const cols = Math.min(skills.length, maxCols);
    const rows = Math.ceil(skills.length / cols);

    canvas.width = padding * 2 + cols * (skillSize + padding);
    canvas.height = padding * 3 + rows * (skillSize + padding) + 55;

    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    // Background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = textColor;
    ctx.font = "bold 24px Kanit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`7K Skill Order: ${displayName}`, canvas.width / 2, 35);

    // Subtitle
    ctx.fillStyle = subtitleColor;
    ctx.font = "16px Kanit, sans-serif";
    ctx.fillText(`${skills.length} Skills - จบ ${usedTier}/${MAX_TIER} เทิร์น`, canvas.width / 2, 55);

    // Skills
    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = padding + col * (skillSize + padding);
      const y = padding + row * (skillSize + padding) + 55;

      const img = new Image();
      await new Promise<void>((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, x, y, skillSize, skillSize);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = skill.image;
      });

      // Badge
      ctx.beginPath();
      ctx.arc(x + skillSize - 12, y + 12, 10, 0, Math.PI * 2);
      ctx.fillStyle = badgeColor;
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(i + 1), x + skillSize - 12, y + 12);
    }

    return canvas;
  };

  const handleDownload = async () => {
    if (skills.length === 0) {
      alert("กรุณาเลือกสกิลอย่างน้อย 1 ตัว");
      return;
    }

    const canvas = await generateExportImage();
    const link = document.createElement("a");
    link.download = generateFileName(displayName, usedTier);
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleCopy = async () => {
    try {
      const canvas = await generateExportImage();
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, "image/png");
      });

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      alert("ไม่สามารถคัดลอกไปคลิปบอร์ดได้ กรุณาลองใหม่");
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleDownload}
        className="w-full bg-[#64d2ff] text-[#1a1a2e] font-bold text-lg px-6 py-4 rounded-xl
                   hover:bg-[#7dd8ff] hover:scale-[1.02] transition-all duration-200
                   focus-visible:outline-none flex items-center justify-center gap-2"
        aria-label="ดาวน์โหลดรูป build"
      >
        📥 ดาวน์โหลดรูป
      </button>
      <button
        onClick={handleCopy}
        className={`w-full font-bold text-lg px-6 py-4 rounded-xl
                   transition-all duration-200 focus-visible:outline-none
                   flex items-center justify-center gap-2
                   ${copied
                     ? 'bg-green-500 text-white'
                     : 'bg-[#4ecdc4] text-[#1a1a2e] hover:bg-[#6ee7de]'}`}
        aria-label="คัดลอกรูปไปคลิปบอร์ด"
      >
        {copied ? '✅ คัดลอกแล้ว' : '📋 คัดลอกรูป'}
      </button>
    </div>
  );
}