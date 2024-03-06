'use client'
import React, { useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export default function MovableDiv() {
  const [originalX, setOriginalX] = useState(0);
  const x = useMotionValue(0);

  const handleTouchStart = (event: any) => {
    // Store the initial touch position
    setOriginalX(event.touches[0].clientX);
  };

  const handleTouchMove = (event: any) => {
    // Calculate the new x position based on touch movement
    const newX = event.touches[0].clientX - originalX;

    // Limit movement to 60px to the left
    if (newX < -60) {
      x.set(-60);
    } else if (newX > 0) {
      x.set(0);
    } else {
      x.set(newX);
    }
  };

  const handleTouchEnd = () => {
    // Animate back to the original position
    x.set(0);
  };

  return (
    <motion.div
      className='h-10 bg-neutral-600/40 py-2 px-4 duration-200'
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ x }}
    >
      MovableDiv
    </motion.div>
  );
}
