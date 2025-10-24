/**
 * Utilities for real-time cursor system
 */

export interface CursorPosition {
  x: number;
  y: number;
  userId: string;
  username: string;
  color: string;
  timestamp: number;
}

export interface CursorState {
  [userId: string]: CursorPosition;
}

// Predefined cursor colors for users
const CURSOR_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6366F1', // Indigo
];

/**
 * Assigns a unique color to a user based on their ID
 */
export function assignCursorColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CURSOR_COLORS.length;
  return CURSOR_COLORS[index];
}

/**
 * Interpolates between two cursor positions for smooth animation
 */
export function interpolateCursorPosition(
  from: CursorPosition,
  to: CursorPosition,
  progress: number
): CursorPosition {
  return {
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
    userId: to.userId,
    username: to.username,
    color: to.color,
    timestamp: to.timestamp,
  };
}

/**
 * Throttles cursor updates to prevent excessive broadcasts
 */
export function throttleCursorUpdates(
  callback: (position: { x: number; y: number }) => void,
  delay: number = 50 // ~20 FPS
) {
  let lastCall = 0;
  return (position: { x: number; y: number }) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback(position);
    }
  };
}

/**
 * Clamps cursor position to viewport bounds
 */
export function clampCursorPosition(
  x: number,
  y: number,
  maxX: number,
  maxY: number
): { x: number; y: number } {
  return {
    x: Math.max(0, Math.min(x, maxX)),
    y: Math.max(0, Math.min(y, maxY)),
  };
}

/**
 * Generates a unique cursor ID for tracking
 */
export function generateCursorId(): string {
  return `cursor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

