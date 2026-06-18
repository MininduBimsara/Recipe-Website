'use client';

import { useState, useRef, MouseEvent } from 'react';

/**
 * React hook to generate gorgeous interactive Card parallax 3D tilts 
 * based on real-time hover vector displacements.
 * 
 * @param maxRotation - Maximum rotation angle allowed in degrees. Defaults to 12.
 * @returns Ref matching element, current rotation values, mouse events and transition inline matrix style object.
 */
export function useTilt(maxRotation = 12) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate normalized cursor position from center (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    // X axis rotation is driven by Y coordinate displacement, and vice versa
    setRotateX(-relativeY * maxRotation);
    setRotateY(relativeX * maxRotation);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return {
    ref,
    rotateX,
    rotateY,
    handleMouseMove,
    handleMouseLeave,
    style: {
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: rotateX === 0 && rotateY === 0 ? 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.1s ease-out'
    }
  };
}
