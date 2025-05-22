import React, { useState, useEffect } from 'react';
import ThreeFireEffect from './ThreeFireEffect';

/**
 * FireEffects component renders animated fire elements and floating embers
 * to create a dynamic, game-like fire-themed background with enhanced realism.
 * 
 * The component uses both CSS-based animations and optionally a Three.js
 * based fire simulation for devices with sufficient performance.
 * 
 * @returns {JSX.Element} The FireEffects component
 */
const FireEffects = () => {
  // State to track if we should use the 3D effect
  const [use3D, setUse3D] = useState(false);
  
  // Detect if device has enough performance for 3D effects
  useEffect(() => {
    // Simple performance detection
    // We could make this more sophisticated with actual FPS measurements
    const hasGoodPerformance = window.matchMedia('(min-width: 768px)').matches && 
                               !navigator.userAgent.includes('Mobile') &&
                               window.navigator.hardwareConcurrency > 2;
    
    setUse3D(hasGoodPerformance);
  }, []);
  
  // Generate larger number of varied embers for enhanced effect
  const emberCount = Math.floor(Math.random() * 20) + 35; // 35-55 embers
  
  // Create an array of ember elements with randomized properties
  const embers = Array.from({ length: emberCount }, (_, index) => {
    // Random position
    const left = `${Math.random() * 100}%`;
    const top = `${Math.random() * 100}%`;
    
    // Random animation delay and duration for natural look
    const animationDelay = `${Math.random() * 8}s`;
    const animationDuration = `${5 + Math.random() * 10}s`;
    
    // Random size between 2-8px
    const size = `${2 + Math.random() * 6}px`;
    
    // Random ember type
    const emberType = Math.random() > 0.6 
      ? 'ember' 
      : Math.random() > 0.5 
        ? 'ember red' 
        : 'ember yellow';
        
    // Random X and Z drift for 3D movement
    const xDrift = Math.random() * 60 - 30; // -30px to +30px
    const zDrift = Math.random() * 20 - 10; // -10px to +10px
    
    return (
      <div 
        key={`ember-${index}`}
        className={emberType}
        style={{
          left,
          top,
          width: size,
          height: size,
          animationDelay,
          animationDuration,
          '--x-drift': `${xDrift}px`,
          '--z-drift': `${zDrift}px`
        }}
      />
    );
  });
  
  // Generate smoke particles for additional realism
  const smokeCount = 15;
  const smokeParticles = Array.from({ length: smokeCount }, (_, index) => {
    const left = `${30 + Math.random() * 40}%`; // Centered more than embers
    const animationDelay = `${Math.random() * 5}s`;
    const animationDuration = `${6 + Math.random() * 6}s`;
    
    return (
      <div
        key={`smoke-${index}`}
        className="smoke"
        style={{
          left,
          animationDelay,
          animationDuration
        }}
      />
    );
  });

  return (
    <>
      {/* Render the Three.js effect if supported */}
      {use3D && <ThreeFireEffect width={400} height={400} />}
      
      {/* Always render the CSS fire as fallback or enhancement */}
      <div className="fire-container">
        <div className="flames-wrapper">
          {/* Main flames */}
          <div className="flame flame-main" />
          <div className="flame flame-core" />
          <div className="flame flame-secondary" />
          <div className="flame flame-tertiary" />
          
          {/* Small dancing flames */}
          <div className="flame flame-small one" />
          <div className="flame flame-small two" />
          <div className="flame flame-small three" />
          <div className="flame flame-small four" />
          
          {/* Glow effect */}
          <div className="flame flame-glow" />
        </div>
        
        {/* Ember particles floating up */}
        <div className="ember-container">
          {embers}
          {smokeParticles}
        </div>
      </div>
    </>
  );
};

export default FireEffects;
