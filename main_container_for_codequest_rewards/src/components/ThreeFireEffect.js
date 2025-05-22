import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import Stats from 'stats.js';

/**
 * ThreeFireEffect component creates a realistic 3D fire effect using Three.js
 * with particle systems and custom shaders for a dynamic, immersive fire animation.
 * 
 * @returns {JSX.Element} The ThreeFireEffect component
 */
const ThreeFireEffect = ({ width = 300, height = 300 }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const statsRef = useRef(null);
  const particlesRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const fireParticleTextureRef = useRef(null); // Store texture to prevent recreating it
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Capture the container ref value for cleanup
    const container = containerRef.current;
    
    // Setup performance monitoring
    statsRef.current = new Stats();
    statsRef.current.showPanel(0); // 0: fps, 1: ms, 2: mb
    statsRef.current.dom.style.position = 'absolute';
    statsRef.current.dom.style.top = '0px';
    statsRef.current.dom.style.zIndex = '1000';
    statsRef.current.dom.style.opacity = '0.5';
    statsRef.current.dom.style.display = 'none'; // Hide stats by default
    container.appendChild(statsRef.current.dom);
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.z = 20;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create fire particles
    createFireParticles();
    
    // Animation loop with cleanup handling
    let animationFrameId;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (statsRef.current) statsRef.current.begin();
      
      const delta = clockRef.current.getDelta();
      updateFireParticles(delta);
      
      renderer.render(scene, camera);
      if (statsRef.current) statsRef.current.end();
    };
    
    animate();
    
    // Cleanup
    return () => {
      // Cancel any pending animation frame
      cancelAnimationFrame(animationFrameId);
      
      // Clean up DOM elements
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      
      if (container && statsRef.current && statsRef.current.dom) {
        container.removeChild(statsRef.current.dom);
      }
      
      // Clean up Three.js resources
      if (particlesRef.current) {
        scene.remove(particlesRef.current);
        particlesRef.current.geometry.dispose();
        if (particlesRef.current.material) {
          if (particlesRef.current.material.uniforms && 
              particlesRef.current.material.uniforms.pointTexture && 
              particlesRef.current.material.uniforms.pointTexture.value) {
            particlesRef.current.material.uniforms.pointTexture.value.dispose();
          }
          particlesRef.current.material.dispose();
        }
      }
      
      // Dispose of the cached texture
      if (fireParticleTextureRef.current) {
        fireParticleTextureRef.current.dispose();
        fireParticleTextureRef.current = null;
      }
      
      renderer.dispose();
    };
  }, [width, height, createFireParticles, updateFireParticles]);
  
  // Create fire particles with custom shader - use useCallback to ensure it's properly included in the dependency array
  const createFireParticles = React.useCallback(() => {
    // Remove previous particles if they exist
    if (particlesRef.current) {
      sceneRef.current.remove(particlesRef.current);
      particlesRef.current.geometry.dispose();
      particlesRef.current.material.dispose();
    }
    
    const particleCount = 3000;
    const geometry = new THREE.BufferGeometry();
    
    // Create position vertices for particles
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);
    
    const fireBaseWidth = 10;
    const fireBaseHeight = 0.5;
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position particles in a fire-like shape
      positions[i3] = (Math.random() - 0.5) * fireBaseWidth;
      positions[i3 + 1] = Math.random() * fireBaseHeight;
      positions[i3 + 2] = (Math.random() - 0.5) * fireBaseWidth;
      
      // Random velocity mostly upward
      velocities[i3] = (Math.random() - 0.5) * 2;
      velocities[i3 + 1] = 6 + Math.random() * 4;
      velocities[i3 + 2] = (Math.random() - 0.5) * 2;
      
      // Fire colors: from yellow to orange to red
      const fireStage = Math.random();
      if (fireStage > 0.7) {
        // Yellow (top of flame)
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.85; 
        colors[i3 + 2] = 0.1;
      } else if (fireStage > 0.3) {
        // Orange (middle of flame)
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.5;
        colors[i3 + 2] = 0.0;
      } else {
        // Red (base of flame)
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.3;
        colors[i3 + 2] = 0.0;
      }
      
      // Random sizes
      sizes[i] = 3 + Math.random() * 3;
      
      // Random lifetime
      lifetimes[i] = 1.0;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
    
    // Create or reuse texture for the fire particles
    if (!fireParticleTextureRef.current) {
      const textureDataUrl = createFireParticleTexture();
      fireParticleTextureRef.current = new THREE.TextureLoader().load(textureDataUrl);
    }
    
    // Custom shader material for fire effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pointTexture: { value: fireParticleTextureRef.current }
      },
      vertexShader: `
        attribute vec3 velocity;
        attribute float size;
        attribute float lifetime;
        
        varying vec3 vColor;
        varying float vLifetime;
        
        uniform float time;
        
        void main() {
          vColor = color;
          vLifetime = lifetime;
          
          // Update position based on velocity and time
          vec3 newPosition = position + velocity * time;
          
          // Add some turbulence
          float turbulence = sin(position.x * 10.0 + time * 2.0) * 0.1 +
                            cos(position.z * 8.0 + time * 3.0) * 0.1;
          newPosition.x += turbulence;
          newPosition.z += turbulence;
          
          // Apply perspective
          vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
          gl_PointSize = size * (30.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        
        varying vec3 vColor;
        varying float vLifetime;
        
        void main() {
          // Apply particle texture
          vec4 texColor = texture2D(pointTexture, gl_PointCoord);
          
          // Apply color based on lifetime and texture
          gl_FragColor = vec4(vColor, texColor.r * vLifetime);
          
          // Discard transparent pixels
          if (gl_FragColor.a < 0.1) discard;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });
    
    // Create particle system
    const particles = new THREE.Points(geometry, material);
    sceneRef.current.add(particles);
    particlesRef.current = particles;
  };
  
  // Create a circular gradient texture for fire particles
  const createFireParticleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    
    const context = canvas.getContext('2d');
    
    // Create gradient for fire particle
    const gradient = context.createRadialGradient(
      32, 32, 0,
      32, 32, 32
    );
    
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.7, 'rgba(255, 120, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    
    return canvas.toDataURL();
  };
  
  // Update fire particles for animation - use useCallback to ensure proper cleanup
  const updateFireParticles = React.useCallback((delta) => {
    if (!particlesRef.current) return;
    
    const particles = particlesRef.current;
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.geometry.attributes.velocity.array;
    const lifetimes = particles.geometry.attributes.lifetime.array;
    const particleCount = positions.length / 3;
    
    // Update material time uniform
    particles.material.uniforms.time.value += delta * 0.5;
    
    // Update each particle
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Move particle based on velocity
      positions[i3] += velocities[i3] * delta * 0.5;
      positions[i3 + 1] += velocities[i3 + 1] * delta * 0.5;
      positions[i3 + 2] += velocities[i3 + 2] * delta * 0.5;
      
      // Reduce lifetime
      lifetimes[i] -= delta * 0.2;
      
      // Reset particles that have expired
      if (lifetimes[i] <= 0 || positions[i3 + 1] > 20) {
        // Reset position
        positions[i3] = (Math.random() - 0.5) * 10;
        positions[i3 + 1] = Math.random() * 0.5;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;
        
        // Reset velocity
        velocities[i3] = (Math.random() - 0.5) * 2;
        velocities[i3 + 1] = 6 + Math.random() * 4;
        velocities[i3 + 2] = (Math.random() - 0.5) * 2;
        
        // Reset lifetime
        lifetimes[i] = 1.0;
      }
    }
    
    // Update geometry attributes
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.lifetime.needsUpdate = true;
  };
  
  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: `${width}px`, 
        height: `${height}px`, 
        position: 'absolute',
        left: '50%',
        bottom: '-80px',
        transform: 'translateX(-50%)',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default ThreeFireEffect;
