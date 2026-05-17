// Pattern coordinates measured from game UI (Seven Knights skill page)
// DO NOT CHANGE unless game UI updates
export const PATTERN_SETTINGS = {
  startX: 347,      // X position of first skill (top-left)
  startY: 365,      // Y position of first skill (first row)
  gapX: 173,        // Horizontal gap between skill centers
  gapY: 70,         // Vertical gap between rows
  skillSize: 70,    // Crop region size
  rows: 2,          // 2 rows of skills
  cols: 5,          // 5 columns of skills
} as const;

// Game mechanics - tier calculation
// Formula: (skill_count - 1) * 4
// Maximum: 70 tiers (hard cap from game)
export const MAX_TIER = 70;

// Export configuration
export const EXPORT_SETTINGS = {
  skillSize: 80,        // Size of skill icon in export
  padding: 15,          // Padding around skills
  maxCols: 9,           // Maximum skills per row in export
  backgroundColor: '#1a1a2e',  // Dark blue background
  textColor: '#ffd700',     // Gold text
  subtitleColor: '#ffffff', // White subtitle
  badgeColor: '#e74c3c',    // Red badge for numbering
} as const;

// Zoom limits
export const ZOOM_SETTINGS = {
  min: 0.5,
  max: 2.0,
  step: 0.1,
} as const;