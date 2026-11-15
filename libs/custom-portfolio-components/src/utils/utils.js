// utils.js

// Import necessary modules
import React, { useRef, useEffect } from 'react';

// Utility function to handle cursor movement
const handleCursorMovement = (event, characterRef) => {
  const { clientX, clientY } = event;
  const character = characterRef.current;
  if (character) {
    const centerX = character.offsetWidth / 2;
    const centerY = character.offsetHeight / 2;
    const mouseX = clientX - character.offsetLeft - centerX;
    const mouseY = clientY - character.offsetTop - centerY;
    character.style.transform = `rotateX(${mouseY / 50}deg) rotateY(${mouseX / 50}deg)`;
  }
};

// Utility function to handle theme changes
const handleThemeChange = (theme) => {
  document.body.setAttribute('data-theme', theme);
};

// Export utility functions
export { handleCursorMovement, handleThemeChange };
