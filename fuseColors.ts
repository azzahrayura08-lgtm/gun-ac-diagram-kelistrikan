// Fuse color lookup according to standard ISO 8820 automotive blade fuse colors
export const FUSE_COLORS: Record<number, string> = {
  3: '#bfdbfe',   // Violet/Light Blue
  5: '#c29b6e',   // Tan / Light Brown
  7.5: '#92400e', // Brown
  10: '#ef4444',  // Red
  15: '#3b82f6',  // Blue
  20: '#eab308',  // Yellow
  25: '#f8fafc',  // Natural / Clear White
  30: '#22c55e',  // Green
  40: '#f97316',  // Amber / Orange
  50: '#b91c1c',  // Deep Red / Maxi
  60: '#a16207',  // Gold / Maxi
  80: '#334155',  // Black / Maxi
  100: '#0284c7', // Blue Maxi
  120: '#15803d', // Green Maxi
  140: '#7e22ce', // Purple Maxi
};
