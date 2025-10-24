import React, { useState, useEffect, useRef } from 'react';
import { CursorPosition, interpolateCursorPosition } from '../utils/cursorUtils';

interface CursorAvatarProps {
  cursor: CursorPosition;
  isCurrentUser?: boolean;
}

const CursorAvatar: React.FC<CursorAvatarProps> = ({ cursor, isCurrentUser = false }) => {
  const [displayPosition, setDisplayPosition] = useState<CursorPosition>(cursor);
  const animationRef = useRef<number>();
  const lastPositionRef = useRef<CursorPosition>(cursor);

  // Smooth interpolation between cursor positions
  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startTime = Date.now();
    const startPosition = lastPositionRef.current;
    const endPosition = cursor;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const duration = 150; // Animation duration in ms
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      const interpolated = interpolateCursorPosition(startPosition, endPosition, easeOutCubic);
      setDisplayPosition(interpolated);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        lastPositionRef.current = endPosition;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cursor]);

  // Don't render if this is the current user's cursor
  if (isCurrentUser) {
    return null;
  }

  return (
    <div
      className="absolute pointer-events-none z-50 transition-opacity duration-200"
      style={{
        left: displayPosition.x,
        top: displayPosition.y,
        transform: 'translate(-2px, -2px)', // Offset to align with actual cursor
      }}
    >
      {/* Cursor pointer */}
      <div
        className="w-4 h-4 relative"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        }}
      >
        {/* Cursor body */}
        <div
          className="absolute w-0 h-0 border-l-4 border-t-2 border-b-2 border-r-0"
          style={{
            borderLeftColor: cursor.color,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            transform: 'rotate(0deg)',
          }}
        />
        {/* Cursor tip */}
        <div
          className="absolute w-0 h-0 border-l-3 border-t-1 border-b-1 border-r-0"
          style={{
            borderLeftColor: '#ffffff',
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            left: '1px',
            top: '1px',
          }}
        />
      </div>

      {/* Username label */}
      <div
        className="absolute left-6 top-0 px-2 py-1 rounded text-xs font-semibold text-white whitespace-nowrap"
        style={{
          backgroundColor: cursor.color,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        {cursor.username}
      </div>

      {/* Subtle glow effect */}
      <div
        className="absolute w-8 h-8 rounded-full opacity-20 pointer-events-none"
        style={{
          backgroundColor: cursor.color,
          left: '-12px',
          top: '-12px',
          animation: 'pulse 2s infinite',
        }}
      />
    </div>
  );
};

export default CursorAvatar;

