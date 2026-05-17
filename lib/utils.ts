import type { DetectedSkill, Skill } from './types';
import { PATTERN_SETTINGS, MAX_TIER } from './constants';

// XSS prevention: escape HTML entities
export function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Calculate used tier from skill count
export function calculateUsedTier(skillCount: number): number {
  return Math.min((skillCount - 1) * 4, MAX_TIER);
}

// Calculate skill position in grid
export function calculateSkillPosition(row: number, col: number): { x: number; y: number } {
  const { startX, startY, gapX, gapY } = PATTERN_SETTINGS;
  return {
    x: startX + col * gapX,
    y: startY + row * gapY,
  };
}

// Validate grid position
export function isValidSkillPosition(row: number, col: number): boolean {
  return row >= 0 && row < PATTERN_SETTINGS.rows && col >= 0 && col < PATTERN_SETTINGS.cols;
}

// Check if skills array has items
export function hasSelectedSkills(skills: Skill[]): boolean {
  return skills.length > 0;
}

// Generate export filename
export function generateFileName(displayName: string, usedTier: number): string {
  const sanitizedName = displayName.trim().replace(/[^a-zA-Z0-9ก-๙\s]/g, '_');
  return `${sanitizedName}_จบ${usedTier}_${MAX_TIER}.png`;
}

// Crop skill icon from captured image
export function cropSkillFromImage(
  imageDataUrl: string,
  x: number,
  y: number,
  size: number = PATTERN_SETTINGS.skillSize
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve('');
        return;
      }
      ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = imageDataUrl;
  });
}

// Auto-detect skills from captured screenshot
export function autoDetectSkills(imageDataUrl: string): Promise<DetectedSkill[]> {
  const { startX, startY, gapX, gapY, skillSize, rows, cols } = PATTERN_SETTINGS;

  return new Promise((resolve) => {
    const img = new Image();
    const skills: DetectedSkill[] = [];

    img.onload = () => {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = startX + col * gapX;
          const y = startY + row * gapY;

          const canvas = document.createElement('canvas');
          canvas.width = skillSize;
          canvas.height = skillSize;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;

          ctx.drawImage(img, x, y, skillSize, skillSize, 0, 0, skillSize, skillSize);

          const position = row * cols + col;
          skills.push({
            id: position + 1,
            image: canvas.toDataURL('image/png'),
            name: `สกิล ${position + 1}`,
            position,
          });
        }
      }
      resolve(skills);
    };
    img.src = imageDataUrl;
  });
}