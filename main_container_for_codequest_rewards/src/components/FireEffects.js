import React from 'react';

/**
 * FireEffects component renders animated fire elements and floating embers
 * to create a dynamic, game-like fire-themed background.
 * 
 * @returns {JSX.Element} The FireEffects component
 */
const FireEffects = () => {
  // Generate random number of embers (between 20-30)
  const emberCount = Math.floor(Math.random() * 10) + 20;
  
  // Create an array of ember elements with random properties
  const embers = Array.from({ length: emberCount }, (_, index) => {
    // Random position
    const left = `${Math.random() * 100}%`;
    const top = `${Math.random() * 100}%`;
    
    // Random animation delay and duration for natural look
    const animationDelay = `${Math.random() * 5}s`;
    const animationDuration = `${5 + Math.random() * 7}s`;
    
    // Random size between 3-8px
    const size = `${3 + Math.random() * 5}px`;
    
    return (
      <div 
        key={`ember-${index}`}
        className="ember"
        style={{
          left,
          top,
          width: size,
          height: size,
          animationDelay,
          animationDuration
        }}
      />
    );
  });

  return (
    <div className="fire-container">
      <div className="flames-wrapper">
        <div className="flame flame-main" />
        <div className="flame flame-secondary" />
        <div className="flame flame-tertiary" />
        <div className="flame flame-glow" />
      </div>
      
      {/* Ember particles floating up */}
      <div className="ember-container">
        {embers}
      </div>
    </div>
  );
};

export default FireEffects;
