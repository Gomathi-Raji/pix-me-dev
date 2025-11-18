'use client';

import React, { useRef, useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  ScrollControls, 
  useScroll, 
  Html, 
  Stars, 
  OrbitControls,
  Sphere,
  Text,
  PositionalAudio
} from '@react-three/drei';
import { 
  EffectComposer, 
  Pixelation,
  ChromaticAberration,
  Glitch,
  Noise
} from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import solarProjects from '../data/solarProjects.json';

// Audio system for 8-bit sounds
class AudioSystem {
  private context: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);
      this.gainNode.gain.value = 0.3;
      this.isInitialized = true;
    } catch (error) {
      console.warn('Audio context initialization failed:', error);
    }
  }

  // Generate 8-bit style beep
  playBeep(frequency: number = 440, duration: number = 0.2, type: OscillatorType = 'square') {
    if (!this.context || !this.gainNode) return;
    
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    
    oscillator.connect(envelope);
    envelope.connect(this.gainNode);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
    
    envelope.gain.setValueAtTime(0.3, this.context.currentTime);
    envelope.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
    
    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + duration);
  }

  // Planet visit sound
  playPlanetSound() {
    this.playBeep(523.25, 0.3, 'square'); // C5
    setTimeout(() => this.playBeep(659.25, 0.2, 'square'), 150); // E5
  }

  // Launch sequence sound
  playLaunchSound() {
    const frequencies = [261.63, 329.63, 392.00, 523.25, 659.25]; // C-E-G-C-E
    frequencies.forEach((freq, i) => {
      setTimeout(() => this.playBeep(freq, 0.15, 'sawtooth'), i * 100);
    });
  }

  // Warp speed sound
  playWarpSound() {
    if (!this.context || !this.gainNode) return;
    
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    
    oscillator.connect(envelope);
    envelope.connect(this.gainNode);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, this.context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1000, this.context.currentTime + 2);
    
    envelope.gain.setValueAtTime(0.2, this.context.currentTime);
    envelope.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 2);
    
    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + 2);
  }
}

const audioSystem = new AudioSystem();

// Types
interface Planet {
  name: string;
  position: THREE.Vector3;
  scale: number;
  color: string;
  info: string;
}

interface SpaceshipProps {
  scroll: any;
  path: THREE.CatmullRomCurve3;
}

interface SpaceshipRef {
  ref?: React.Ref<THREE.Group>;
  scroll: any;
  path: THREE.CatmullRomCurve3;
}

// Enhanced planetary data with horizontal scrolling layout (Sun -> Complete Solar System -> Earth finale)
const PLANETS: Planet[] = [
  { name: 'Sun', position: new THREE.Vector3(0, 0, 0), scale: 12, color: '#FDB813', info: '⭐ My Core Passion - AI & Machine Learning powers everything I create!' },
  { name: 'Mercury', position: new THREE.Vector3(60, 0, 0), scale: 2, color: '#8C7853', info: '🚀 Quick Learner - Like Mercury\'s fast orbit, I rapidly adapt to new technologies' },
  { name: 'Venus', position: new THREE.Vector3(100, 0, 0), scale: 2.5, color: '#FFC649', info: '🔥 Data Science Passion - Hot with enthusiasm for analyzing complex datasets' },
  { name: 'Earth', position: new THREE.Vector3(140, 0, 0), scale: 2.8, color: '#6B93D6', info: '🌍 My Home Base - B.Tech in AI & Data Science, DMI College (GPA: 8.5)' },
  { name: 'Mars', position: new THREE.Vector3(180, 0, 0), scale: 2.2, color: '#CD5C5C', info: '🎯 Future Goals - Exploring AI in Healthcare, Education & Gaming frontiers' },
  { name: 'Jupiter', position: new THREE.Vector3(240, 0, 0), scale: 8, color: '#D8CA9D', info: '💪 Massive Skillset - Deep Learning, ML algorithms, and advanced AI techniques' },
  { name: 'Saturn', position: new THREE.Vector3(300, 0, 0), scale: 7, color: '#FAD5A5', info: '🎮 Well-Rounded - Pro Free Fire gamer with a ring of creative hobbies' },
  { name: 'Uranus', position: new THREE.Vector3(360, 0, 0), scale: 4, color: '#4FD0E7', info: '💡 Unique Perspective - Thinking differently about AI-powered space exploration' },
  { name: 'Neptune', position: new THREE.Vector3(420, 0, 0), scale: 4, color: '#4B70DD', info: '🌊 Deep Diver - Immersed in Python, JavaScript, TypeScript & data analysis' },
  { name: 'Pluto', position: new THREE.Vector3(480, 0, 0), scale: 1.5, color: '#C4A484', info: '🤝 Always Growing - Open to collaborations, internships & open-source projects!' }
];

// Spaceship component with horizontal path following and audio
const Spaceship = React.forwardRef<THREE.Group, SpaceshipProps>(({ scroll, path }, ref) => {
  const shipRef = useRef<THREE.Group>(null);
  const groupRef = ref as React.RefObject<THREE.Group> || shipRef;
  const [currentPosition, setCurrentPosition] = useState(new THREE.Vector3());
  const [lastPlanetIndex, setLastPlanetIndex] = useState(-1);
  const [isWarping, setIsWarping] = useState(false);
  
  useFrame((state) => {
    if (!groupRef.current || !path) return;
    
    const progress = scroll.offset;
    
    // Safety check for path operations
    try {
      const point = path.getPointAt(progress);
      if (!point) return;
      
      const tangent = path.getTangentAt(progress);
      if (!tangent) return;
      
      // Smooth movement with lerp
      currentPosition.lerp(point, 0.08);
      groupRef.current.position.copy(currentPosition);
      
      // Orient spaceship along path
      const lookAtPoint = point.clone().add(tangent);
      groupRef.current.lookAt(lookAtPoint);
    } catch (error) {
      // Silently handle any path calculation errors
      return;
    }
    
    // Check for planet visits and trigger sounds + UI updates
    // Use smoother calculation to detect planets earlier
    const currentPlanetIndex = Math.round(progress * PLANETS.length);
    const clampedIndex = Math.min(currentPlanetIndex, PLANETS.length - 1);
    
    if (clampedIndex !== lastPlanetIndex && clampedIndex >= 0) {
      setLastPlanetIndex(clampedIndex);
      if (clampedIndex < PLANETS.length) {
        audioSystem.playPlanetSound();
        
        // Update UI elements
        const planet = PLANETS[clampedIndex];
        const planetName = document.getElementById('planet-name');
        const planetInfo = document.getElementById('planet-info');
        const progressDisplay = document.getElementById('progress-display');
        const speedDisplay = document.getElementById('speed-display');
        
        if (planetName && planet) {
          planetName.textContent = `${planet.name}`;
        }
        
        if (planetInfo && planet) {
          planetInfo.textContent = planet.info;
        }
        
        if (progressDisplay) {
          progressDisplay.textContent = `${Math.round(progress * 100)}%`;
        }
        
        if (speedDisplay) {
          const speed = Math.round(progress * 50000); // Simulated speed
          speedDisplay.textContent = `${speed.toLocaleString()} km/s`;
        }
      }
    }
    
    // Warp speed effect detection
    const warpProgress = Math.max(0, (progress - 0.85) * 6.67);
    const shouldWarp = warpProgress > 0;
    if (shouldWarp && !isWarping) {
      setIsWarping(true);
      audioSystem.playWarpSound();
    } else if (!shouldWarp && isWarping) {
      setIsWarping(false);
    }
    
    // Engine particle effect
    if (groupRef.current) {
      const engineIntensity = shouldWarp ? 2 : 1;
      groupRef.current.children.forEach((child, index) => {
        if (index === 3) { // Engine glow
          (child as THREE.Mesh).scale.setScalar(engineIntensity);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Enhanced spaceship body */}
      <mesh castShadow>
        <boxGeometry args={[3, 1, 7]} />
        <meshStandardMaterial 
          color="#F5F5F5" 
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      
      {/* Spaceship wings with gradient effect */}
      <mesh position={[2.2, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.4, 4]} />
        <meshStandardMaterial 
          color="#D0D0D0" 
          roughness={0.3} 
          metalness={0.7}
        />
      </mesh>
      <mesh position={[-2.2, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.4, 4]} />
        <meshStandardMaterial 
          color="#D0D0D0" 
          roughness={0.3} 
          metalness={0.7}
        />
      </mesh>
      
      {/* Enhanced Cockpit */}
      <mesh position={[0, 0.6, -2]} castShadow>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshStandardMaterial 
          color="#4A90E2" 
          roughness={0.1} 
          metalness={0.9}
          transparent
          opacity={0.85}
        />
      </mesh>
      
      {/* Cockpit base */}
      <mesh position={[0, 0.3, -1.5]}>
        <boxGeometry args={[1.8, 0.6, 2.5]} />
        <meshStandardMaterial 
          color="#E0E0E0" 
          roughness={0.3} 
          metalness={0.7}
        />
      </mesh>
      
      {/* Enhanced Engine glow */}
      <mesh position={[0, 0, 4]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial 
          color="#00DDFF" 
          emissive="#00DDFF"
          emissiveIntensity={2.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Main engine trail */}
      <mesh position={[0, 0, 5.2]}>
        <coneGeometry args={[0.5, 2.8, 12]} />
        <meshStandardMaterial 
          color="#FF8800"
          emissive="#FF8800"
          emissiveIntensity={1.8}
          transparent
          opacity={0.75}
        />
      </mesh>
      
      {/* Engine glow halo */}
      <mesh position={[0, 0, 4.5]}>
        <sphereGeometry args={[0.9, 12, 12]} />
        <meshBasicMaterial 
          color="#FFD700"
          transparent
          opacity={0.25}
        />
      </mesh>
      
      {/* Side thrusters */}
      <mesh position={[1.8, 0, 2.5]}>
        <cylinderGeometry args={[0.2, 0.15, 0.6, 8]} />
        <meshStandardMaterial 
          color="#808080" 
          roughness={0.4} 
          metalness={0.8}
        />
      </mesh>
      <mesh position={[-1.8, 0, 2.5]}>
        <cylinderGeometry args={[0.2, 0.15, 0.6, 8]} />
        <meshStandardMaterial 
          color="#808080" 
          roughness={0.4} 
          metalness={0.8}
        />
      </mesh>
    </group>
  );
});

Spaceship.displayName = 'Spaceship';

// Chase camera that follows spaceship
function ChaseCamera({ target }: { target: React.RefObject<THREE.Group | null> }) {
  const { camera } = useThree();
  const idealPosition = useRef(new THREE.Vector3());
  const idealLookAt = useRef(new THREE.Vector3());
  
  useFrame(() => {
    if (!target.current) return;
    
    const shipPosition = target.current.position;
    
    // Calculate ideal camera position (behind and above ship)
    const offset = new THREE.Vector3(0, 8, 15);
    idealPosition.current.copy(shipPosition).add(offset);
    
    // Find nearest planet to look at
    let nearestPlanet = PLANETS[0];
    let minDistance = Infinity;
    
    PLANETS.forEach(planet => {
      const distance = shipPosition.distanceTo(planet.position);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPlanet = planet;
      }
    });
    
    // Look at the nearest planet position
    idealLookAt.current.copy(nearestPlanet.position);
    
    // Smooth camera movement
    camera.position.lerp(idealPosition.current, 0.08);
    camera.lookAt(idealLookAt.current);
  });
  
  return null;
}

// Individual planet component with enhanced animations
function Planet({ planet, scroll, planetIndex }: { planet: Planet; scroll: any; planetIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [texture] = useState(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    
    // Create pixelated planet texture
    const imageData = ctx.createImageData(64, 64);
    const color = new THREE.Color(planet.color);
    
    for (let i = 0; i < imageData.data.length; i += 4) {
      const variation = (Math.random() - 0.5) * 0.3;
      imageData.data[i] = Math.floor((color.r + variation) * 255);
      imageData.data[i + 1] = Math.floor((color.g + variation) * 255);
      imageData.data[i + 2] = Math.floor((color.b + variation) * 255);
      imageData.data[i + 3] = 255;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    
    return tex;
  });
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const scrollProgress = scroll.offset;
    
    // Enhanced rotation with varying speeds
    const rotationSpeed = planet.name === 'Sun' ? 0.008 : 0.012 + (planetIndex * 0.002);
    meshRef.current.rotation.y += rotationSpeed;
    meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.05;
    
    // Dynamic orbital movement
    const wobble = Math.sin(time * 0.5 + planetIndex) * 0.4;
    const pulse = Math.sin(time * 2 + planetIndex) * 0.1;
    meshRef.current.position.y = planet.position.y + wobble;
    
    // Pulsing glow effect
    if (glowRef.current) {
      const glowIntensity = 1 + Math.sin(time * 3 + planetIndex) * 0.3;
      glowRef.current.scale.setScalar(glowIntensity);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(time * 2) * 0.2;
    }
    
    // Scale effect when approaching
    const currentPlanetProgress = planetIndex / PLANETS.length;
    const distanceToShip = Math.abs(scrollProgress - currentPlanetProgress);
    const scaleBoost = Math.max(0, 1 - distanceToShip * 10) * 0.3;
    meshRef.current.scale.setScalar(1 + scaleBoost);
  });

  return (
    <group position={planet.position}>
      {/* Atmospheric glow layer */}
      <Sphere ref={glowRef} args={[planet.scale * 1.15, 32, 32]}>
        <meshBasicMaterial 
          color={planet.color}
          transparent
          opacity={planet.name === 'Sun' ? 0.4 : 0.15}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Extra glow for Sun */}
      {planet.name === 'Sun' && (
        <Sphere args={[planet.scale * 1.4, 32, 32]}>
          <meshBasicMaterial 
            color="#FDB813"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
      
      {/* Main planet */}
      <Sphere 
        ref={meshRef} 
        args={[planet.scale, 48, 48]}
        onPointerEnter={() => console.log(`Approaching ${planet.name}`)}
        onPointerLeave={() => console.log(`Leaving ${planet.name}`)}
      >
        <meshStandardMaterial 
          map={texture}
          roughness={planet.name === 'Sun' ? 0.7 : 0.95}
          metalness={planet.name === 'Sun' ? 0 : 0.1}
          emissive={planet.name === 'Sun' ? planet.color : '#000000'}
          emissiveIntensity={planet.name === 'Sun' ? 0.6 : 0}
        />
      </Sphere>
      
      {/* Enhanced Saturn rings */}
      {planet.name === 'Saturn' && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[planet.scale * 1.3, planet.scale * 1.8, 32]} />
            <meshStandardMaterial 
              color="#FAD5A5" 
              transparent 
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[planet.scale * 2.0, planet.scale * 2.4, 32]} />
            <meshStandardMaterial 
              color="#E6C48A" 
              transparent 
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
      
      {/* Earth's moon */}
      {planet.name === 'Earth' && (
        <Sphere args={[0.8, 16, 16]} position={[planet.scale * 2, 0, 0]}>
          <meshStandardMaterial color="#C0C0C0" roughness={1} metalness={0} />
        </Sphere>
      )}
    </group>
  );
}

// Shooting stars for dynamic effects
function ShootingStars() {
  const starsRef = useRef<THREE.Group>(null);
  const [stars] = useState(() => {
    const starData = [];
    for (let i = 0; i < 5; i++) {
      starData.push({
        startPos: new THREE.Vector3(
          Math.random() * 200,
          Math.random() * 40 - 20,
          Math.random() * 40 - 20
        ),
        speed: Math.random() * 2 + 1,
        resetTime: Math.random() * 10
      });
    }
    return starData;
  });

  useFrame((state) => {
    if (!starsRef.current) return;
    
    starsRef.current.children.forEach((child, i) => {
      const star = stars[i];
      const time = state.clock.elapsedTime;
      
      // Move shooting star
      child.position.x -= star.speed;
      child.position.y += star.speed * 0.3;
      
      // Reset when out of view
      if (child.position.x < -100 || (time % 10) < 0.1) {
        child.position.copy(star.startPos);
      }
      
      // Fade in/out
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      const fadeDistance = Math.abs(child.position.x - star.startPos.x);
      material.opacity = Math.min(1, fadeDistance / 20) * Math.max(0, 1 - fadeDistance / 80);
    });
  });

  return (
    <group ref={starsRef}>
      {stars.map((star, i) => (
        <mesh key={i} position={star.startPos}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial 
            color="#FFFFFF"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// 8-bit pixelated starfield background optimized for horizontal scrolling
function Starfield({ scroll }: { scroll: any }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [starPositions] = useState(() => {
    const positions = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      // More even distribution across the journey
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * 150;
      
      positions[i * 3] = (Math.random() - 0.5) * 600 + (i / 2000) * 200; // X spread along path
      positions[i * 3 + 1] = Math.cos(angle) * radius; // Y spread
      positions[i * 3 + 2] = Math.sin(angle) * radius; // Z spread
    }
    return positions;
  });

  useFrame(() => {
    if (!pointsRef.current) return;
    
    // Gentle twinkling effect
    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = 0.6 + Math.sin(Date.now() * 0.0008) * 0.15;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starPositions.length / 3}
          array={starPositions}
          itemSize={3}
          args={[starPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#FFFFFF" 
        size={1.2}
        sizeAttenuation={true}
        transparent
        opacity={0.7}
        alphaTest={0.01}
        depthWrite={false}
      />
    </points>
  );
}

// Floating space debris for atmosphere
function SpaceDebris({ scroll }: { scroll: any }) {
  const debrisRef = useRef<THREE.Group>(null);
  const [debris] = useState(() => {
    const items = [];
    for (let i = 0; i < 50; i++) {
      items.push({
        position: new THREE.Vector3(
          Math.random() * 500 - 50,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        scale: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.02 + 0.01
      });
    }
    return items;
  });

  useFrame((state) => {
    if (!debrisRef.current) return;
    
    debrisRef.current.children.forEach((child, i) => {
      const item = debris[i];
      child.rotation.x += item.speed;
      child.rotation.y += item.speed * 0.5;
      child.rotation.z += item.speed * 0.3;
    });
  });

  return (
    <group ref={debrisRef}>
      {debris.map((item, i) => (
        <mesh key={i} position={item.position} rotation={item.rotation} scale={item.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color="#666666" 
            roughness={0.8}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// Warp speed star streaks
function WarpStars({ scroll }: { scroll: any }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [starPositions] = useState(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      // Cylinder distribution for cleaner warp effect
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * 40;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    return positions;
  });

  useFrame(() => {
    if (!pointsRef.current) return;
    
    const warpProgress = Math.max(0, (scroll.offset - 0.9) * 10);
    const geometry = pointsRef.current.geometry;
    const positions = geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] -= warpProgress * 3;
      if (positions[i + 2] < -100) {
        positions[i + 2] = 100;
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
  });

  const warpIntensity = Math.max(0, (scroll.offset - 0.9) * 10);
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starPositions.length / 3}
          array={starPositions}
          itemSize={3}
          args={[starPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#AADDFF" 
        size={warpIntensity > 0 ? 2 : 0.8}
        sizeAttenuation={true}
        transparent
        opacity={warpIntensity > 0 ? 0.9 : 0.5}
        alphaTest={0.01}
        depthWrite={false}
      />
    </points>
  );
}

// Cosmic dust clouds for nebula effects
function CosmicClouds({ scroll }: { scroll: any }) {
  const cloudsRef = useRef<THREE.Group>(null);
  const [clouds] = useState(() => {
    const cloudData = [];
    for (let i = 0; i < 20; i++) {
      cloudData.push({
        position: new THREE.Vector3(
          Math.random() * 400 + 50,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60
        ),
        scale: Math.random() * 15 + 10,
        color: i % 3 === 0 ? '#FF69B4' : i % 3 === 1 ? '#9B59B6' : '#3498DB',
        speed: Math.random() * 0.001 + 0.0005
      });
    }
    return cloudData;
  });

  useFrame((state) => {
    if (!cloudsRef.current) return;
    
    cloudsRef.current.children.forEach((child, i) => {
      const cloud = clouds[i];
      child.rotation.z += cloud.speed;
      const pulse = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.2 + 1;
      child.scale.setScalar(cloud.scale * pulse);
    });
  });

  return (
    <group ref={cloudsRef}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial 
            color={cloud.color}
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main 3D scene with horizontal scrolling
function Scene() {
  const scroll = useScroll();
  const shipRef = useRef<THREE.Group | null>(null);
  const { camera } = useThree();
  
  // Create horizontal spline path through all planets
  const [path] = useState(() => {
    const points = [
      new THREE.Vector3(-20, 5, 15), // Starting position behind Sun
      ...PLANETS.map((p, i) => {
        // Create a smooth horizontal path with slight variations
        const basePos = p.position.clone();
        const variation = Math.sin(i * 0.5) * 3; // Slight vertical variation
        return new THREE.Vector3(basePos.x, variation + 3, 10); // Path above planets
      }),
      new THREE.Vector3(400, 8, 15) // Final position past Earth
    ];
    return new THREE.CatmullRomCurve3(points);
  });
  
  // Enhanced camera effects for warp speed and smooth following
  useFrame(() => {
    const warpProgress = Math.max(0, (scroll.offset - 0.85) * 6.67);
    
    // Warp speed camera zoom and shake
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 75 + warpProgress * 40;
      camera.updateProjectionMatrix();
    }
    
    // Camera shake during warp
    if (warpProgress > 0) {
      camera.position.x += (Math.random() - 0.5) * warpProgress * 0.5;
      camera.position.y += (Math.random() - 0.5) * warpProgress * 0.3;
    }
  });
  
  // Initialize audio on first interaction
  useEffect(() => {
    const initAudio = () => {
      audioSystem.initialize();
      document.removeEventListener('click', initAudio);
      document.removeEventListener('scroll', initAudio);
    };
    
    document.addEventListener('click', initAudio);
    document.addEventListener('scroll', initAudio);
    
    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('scroll', initAudio);
    };
  }, []);

  return (
    <>
      {/* Enhanced Lighting setup */}
      <ambientLight intensity={0.2} />
      
      {/* Pulsating sun light */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={3 + Math.sin(Date.now() * 0.001) * 0.5} 
        color="#FDB813" 
        distance={200} 
        decay={0.5} 
      />
      
      <directionalLight position={[100, 100, 100]} intensity={0.8} color="#ffffff" />
      <spotLight 
        position={[0, 50, 0]} 
        angle={Math.PI / 4} 
        penumbra={0.5} 
        intensity={0.5}
        color="#4A90E2"
        castShadow
      />
      
      {/* Background starfield */}
      <Starfield scroll={scroll} />
      
      {/* Shooting stars */}
      <ShootingStars />
      
      {/* Warp speed stars for final sequence */}
      <WarpStars scroll={scroll} />
      
      {/* Floating space debris */}
      <SpaceDebris scroll={scroll} />
      
      {/* Spaceship */}
      <Spaceship scroll={scroll} path={path} ref={shipRef} />
      
      {/* Chase camera */}
      <ChaseCamera target={shipRef} />
      
      {/* Orbital Paths */}
      {PLANETS.slice(1).map((planet, index) => (
        <mesh key={`orbit-${planet.name}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.position.x - 0.5, planet.position.x + 0.5, 64]} />
          <meshBasicMaterial 
            color="#4A90E2" 
            transparent 
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Planets */}
      {PLANETS.map((planet, index) => (
        <Planet key={planet.name} planet={planet} scroll={scroll} planetIndex={index} />
      ))}
      
      {/* Distance markers */}
      {PLANETS.map((planet, index) => 
        index > 0 ? (
          <Text
            key={`marker-${planet.name}`}
            position={[planet.position.x, -15, 0]}
            fontSize={2}
            color="#4A90E2"
            anchorX="center"
            anchorY="middle"
          >
            {(planet.position.x / 10).toFixed(0)} AU
          </Text>
        ) : null
      )}
      
      {/* Portfolio content overlays */}
      {PLANETS.slice(1).map((planet, index) => {
        const planetData = solarProjects.find(p => p.planet === planet.name);
        const isVisible = scroll.range(index * 0.1 + 0.1, 0.08) > 0;
        
        return (
          <Html
            key={`overlay-${planet.name}`}
            position={planet.position.clone().add(new THREE.Vector3(planet.scale + 8, 0, 0))}
            transform
            occlude
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.8
              }}
              className="nes-container is-rounded w-80 pixel-text bg-black bg-opacity-90"
            >
              <h3 className="nes-text is-primary text-lg mb-2">🌟 {planet.name} Station</h3>
              {planetData && (
                <>
                  <h4 className="nes-text is-success text-sm mb-2">{planetData.title}</h4>
                  <p className="text-xs mb-3 text-gray-300">{planetData.description}</p>
                  <div className="space-y-2">
                    {planetData.projects.slice(0, 2).map((project, idx) => (
                      <div key={idx} className="nes-container is-rounded p-2 bg-gray-800">
                        <h5 className="text-white text-xs font-bold">{project.name}</h5>
                        <p className="text-xs text-gray-400 mb-1">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.tech.slice(0, 3).map((tech, techIdx) => (
                            <span key={techIdx} className="nes-badge">
                              <span className="is-warning text-xs">{tech}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="nes-btn is-primary text-xs mt-3 w-full">
                    🚀 Explore All Projects
                  </button>
                </>
              )}
            </motion.div>
          </Html>
        );
      })}
    </>
  );
}

// Loading screen component
function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center pixel-text">
        <div className="nes-container is-rounded">
          <h2 className="nes-text is-primary text-2xl mb-4">LOADING SOLAR SYSTEM</h2>
          <div className="nes-progress">
            <progress className="nes-progress is-primary" value="100" max="100"></progress>
          </div>
          <p className="text-sm mt-2">Calibrating warp drive...</p>
        </div>
      </div>
    </div>
  );
}

// Main component
export default function SolarSystemSimulation() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden solar-system-container">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 5, 20], fov: 75 }}
        gl={{ 
          antialias: false, // Disable for pixelated look
          powerPreference: "high-performance" 
        }}
        style={{ background: '#000' }}
      >
        <Suspense fallback={null}>
          <ScrollControls pages={10} damping={0.2} enabled={true}>
            <Scene />
          </ScrollControls>
          
          {/* Enhanced post-processing for 8-bit aesthetic */}
          <EffectComposer>
            <Pixelation granularity={6} />
            <ChromaticAberration offset={[0.001, 0.001]} />
            <Noise opacity={0.05} />
          </EffectComposer>
        </Suspense>
      </Canvas>
      
      {/* Minimal UI Container - Bottom center */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
        <motion.div 
          className="bg-black bg-opacity-70 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500 border-opacity-40 shadow-lg"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div id="current-planet-info" className="text-center">
            <div className="mb-2">
              <p className="text-cyan-300 text-base font-bold" id="planet-name">🚀 Starting Journey</p>
              <p className="text-gray-300 text-xs mt-1 leading-relaxed max-w-md mx-auto" id="planet-info">Scroll down to explore the solar system</p>
            </div>
            <div className="flex items-center justify-center gap-3 text-xs border-t border-gray-700 pt-2">
              <span className="text-green-400" id="progress-display">0%</span>
              <span className="text-gray-500">•</span>
              <span className="text-orange-400" id="speed-display">0 km/s</span>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}