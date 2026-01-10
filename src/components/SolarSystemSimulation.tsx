'use client';

import React, { useMemo, useRef, useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
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
  Noise,
  Bloom
} from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { MdSkipNext } from 'react-icons/md';
import { gsap } from 'gsap';
import solarProjects from '../data/solarProjects.json';

import {
  detectDeviceCapabilities,
  getSettingsForTier,
  PerformanceMonitor,
  type DeviceCapabilities,
  type GraphicsSettings,
} from '../helpers/deviceCapabilities';

import {
  generatePlanetTextures,
  generateRingTexture,
  generateAsteroidTexture,
  PLANET_PALETTES,
} from '../helpers/planetTextures';

function InvalidateLoop({ active, fps }: { active: boolean; fps: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const frameMs = Math.max(16, Math.floor(1000 / Math.max(1, fps)));

    const tick = (t: number) => {
      if (!activeRef.current) return;
      if (t - last >= frameMs) {
        last = t;
        invalidate();
      }
      raf = requestAnimationFrame(tick);
    };

    if (active) raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active, fps, invalidate]);

  return null;
}

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

  // Landing sound
  playLandingSound() {
    const frequencies = [659.25, 523.25, 392.00, 329.63, 261.63]; // E-C-G-E-C (descending)
    frequencies.forEach((freq, i) => {
      setTimeout(() => this.playBeep(freq, 0.2, 'sine'), i * 150);
    });
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
function ChaseCamera({ target, isReturning }: { target: React.RefObject<THREE.Group | null>; isReturning: boolean }) {
  const { camera } = useThree();
  const idealPosition = useRef(new THREE.Vector3());
  const idealLookAt = useRef(new THREE.Vector3());
  
  useFrame(() => {
    if (!target.current || isReturning) return; // Disable during return
    
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
function Planet({ planet, scroll, planetIndex, quality }: { planet: Planet; scroll: any; planetIndex: number; quality: GraphicsSettings }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const textures = useMemo(() => {
    return generatePlanetTextures(planet.name, quality.planetTextureSize, quality.enableBumpMap);
  }, [planet.name, quality.planetTextureSize, quality.enableBumpMap]);

  const ringTexture = useMemo(() => {
    if (!quality.enableRings) return null;
    const size = Math.max(128, Math.min(512, quality.planetTextureSize));
    return generateRingTexture(size);
  }, [quality.enableRings, quality.planetTextureSize]);

  const moonTexture = useMemo(() => {
    if (!quality.enableMoons || planet.name !== 'Earth') return null;
    const size = Math.max(64, Math.min(256, Math.floor(quality.planetTextureSize / 2)));
    return generatePlanetTextures('Moon', size, false).diffuse;
  }, [planet.name, quality.enableMoons, quality.planetTextureSize]);

  useEffect(() => {
    return () => {
      textures.diffuse.dispose();
      textures.bump?.dispose();
      textures.emissive?.dispose();
      textures.specular?.dispose();
      ringTexture?.dispose();
      moonTexture?.dispose();
    };
  }, [textures, ringTexture, moonTexture]);
  
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
      <Sphere
        ref={glowRef}
        args={[
          planet.scale * 1.15,
          Math.max(16, Math.floor(quality.planetSegments / 2)),
          Math.max(16, Math.floor(quality.planetSegments / 2)),
        ]}
      >
        <meshBasicMaterial 
          color={planet.color}
          transparent
          opacity={planet.name === 'Sun' ? 0.4 : 0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Subtle atmosphere shell (pixel aesthetic, more realistic depth) */}
      {quality.enableAtmosphere && PLANET_PALETTES[planet.name]?.atmosphere && planet.name !== 'Sun' && (
        <Sphere
          args={[
            planet.scale * 1.06,
            Math.max(16, Math.floor(quality.planetSegments / 2)),
            Math.max(16, Math.floor(quality.planetSegments / 2)),
          ]}
        >
          <meshBasicMaterial
            color={PLANET_PALETTES[planet.name].atmosphere}
            transparent
            opacity={0.08}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </Sphere>
      )}
      
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
        args={[planet.scale, quality.planetSegments, quality.planetSegments]}
      >
        <meshPhysicalMaterial 
          map={textures.diffuse}
          bumpMap={quality.enableBumpMap ? textures.bump : undefined}
          bumpScale={quality.enableBumpMap ? (planet.name === 'Earth' ? 0.22 : 0.18) : 0}
          roughnessMap={textures.specular}
          roughness={planet.name === 'Sun' ? 0.8 : planet.name === 'Earth' ? 0.86 : 0.92}
          metalness={planet.name === 'Sun' ? 0 : 0.02}
          clearcoat={planet.name === 'Earth' ? 0.35 : 0.05}
          clearcoatRoughness={planet.name === 'Earth' ? 0.22 : 0.8}
          emissive={planet.name === 'Sun' ? planet.color : '#000000'}
          emissiveMap={planet.name === 'Sun' ? textures.emissive : undefined}
          emissiveIntensity={planet.name === 'Sun' ? 1.15 : 0}
        />
      </Sphere>
      
      {/* Enhanced Saturn rings */}
      {planet.name === 'Saturn' && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[planet.scale * 1.3, planet.scale * 1.8, 32]} />
            <meshStandardMaterial 
              color="#FAD5A5" 
              map={ringTexture ?? undefined}
              transparent 
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[planet.scale * 2.0, planet.scale * 2.4, 32]} />
            <meshStandardMaterial 
              color="#E6C48A" 
              map={ringTexture ?? undefined}
              transparent 
              opacity={0.45}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
      
      {/* Earth's moon */}
      {quality.enableMoons && planet.name === 'Earth' && (
        <Sphere args={[0.8, 16, 16]} position={[planet.scale * 2, 0, 0]}>
          <meshStandardMaterial
            map={moonTexture ?? undefined}
            roughness={0.98}
            metalness={0}
          />
        </Sphere>
      )}
    </group>
  );
}

function AsteroidBelt({ quality }: { quality: GraphicsSettings }) {
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const texture = useMemo(() => generateAsteroidTexture(64), []);

  const count = Math.max(0, quality.asteroidCount);

  const beltData = useMemo(() => {
    const items: Array<{ angle: number; radius: number; y: number; scale: number; rot: THREE.Euler; speed: number }> = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 210 + (Math.random() - 0.5) * 35;
      const y = (Math.random() - 0.5) * 8;
      const scale = 0.35 + Math.random() * 1.25;
      const rot = new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const speed = 0.0006 + Math.random() * 0.0012;
      items.push({ angle, radius, y, scale, rot, speed });
    }
    return items;
  }, [count]);

  useEffect(() => {
    if (!instancedRef.current) return;
    for (let i = 0; i < beltData.length; i++) {
      const d = beltData[i];
      const x = Math.cos(d.angle) * d.radius;
      const z = Math.sin(d.angle) * d.radius;
      dummy.position.set(x, d.y, z);
      dummy.rotation.copy(d.rot);
      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(i, dummy.matrix);
    }
    instancedRef.current.instanceMatrix.needsUpdate = true;
  }, [beltData, dummy]);

  useFrame(() => {
    if (!instancedRef.current) return;
    const t = performance.now();
    for (let i = 0; i < beltData.length; i++) {
      const d = beltData[i];
      const angle = d.angle + t * d.speed;
      const x = Math.cos(angle) * d.radius;
      const z = Math.sin(angle) * d.radius;
      dummy.position.set(x, d.y, z);
      dummy.rotation.set(d.rot.x + t * 0.0002, d.rot.y + t * 0.0003, d.rot.z);
      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(i, dummy.matrix);
    }
    instancedRef.current.instanceMatrix.needsUpdate = true;
  });

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  if (count <= 0) return null;

  return (
    <instancedMesh ref={instancedRef} args={[undefined as any, undefined as any, count]} frustumCulled={quality.frustumCulling}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial map={texture} roughness={0.95} metalness={0.05} />
    </instancedMesh>
  );
}

// Shooting stars for dynamic effects
function ShootingStars({ count = 5 }: { count?: number }) {
  const starsRef = useRef<THREE.Group>(null);
  const [stars] = useState(() => {
    const starData = [];
    for (let i = 0; i < count; i++) {
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
function Starfield({ scroll, count = 2000 }: { scroll: any; count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [starPositions] = useState(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // More even distribution across the journey
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * 150;
      
      positions[i * 3] = (Math.random() - 0.5) * 600 + (i / Math.max(1, count)) * 200; // X spread along path
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
function SpaceDebris({ scroll, count = 50 }: { scroll: any; count?: number }) {
  const debrisRef = useRef<THREE.Group>(null);
  const [debris] = useState(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
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
function WarpStars({ scroll, count = 1000 }: { scroll: any; count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [starPositions] = useState(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
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

// Landing Animation Overlay
function LandingOverlay({ onComplete }: { onComplete: () => void }) {
  const [showPortal, setShowPortal] = useState(false);
  
  useEffect(() => {
    // Show portal after 2.5 seconds (after landing animation)
    const portalTimer = setTimeout(() => setShowPortal(true), 2500);
    // Complete and redirect after 5.5 seconds total
    const completeTimer = setTimeout(onComplete, 5500);
    
    return () => {
      clearTimeout(portalTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Gentle landing fade overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-cyan-500/40 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0.3, 0] }}
        transition={{ duration: 2.5, times: [0, 0.4, 0.7, 1] }}
      />

      {/* Welcome Home text - appears after landing */}
      {!showPortal && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center p-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.h1
            className="mx-4 px-2 text-center text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white pixel-text drop-shadow-2xl leading-tight"
            animate={{
              textShadow: [
                '0 0 20px rgba(59,130,246,0.8)',
                '0 0 40px rgba(6,182,212,0.6)',
                '0 0 20px rgba(59,130,246,0.8)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            >
            Welcome Home!
          </motion.h1>
        </motion.div>
      )}
      
      {/* Portal Animation */}
      <AnimatePresence>
        {showPortal && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Portal vortex background */}
            <motion.div
              className="absolute w-96 h-96 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, rgba(59,130,246,0.6) 30%, rgba(147,51,234,0.4) 60%, transparent 100%)'
              }}
              animate={{
                scale: [0.5, 1.5, 0.5],
                rotate: [0, 360]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Inner portal ring */}
            <motion.div
              className="absolute w-64 h-64 rounded-full border-4 border-cyan-400"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
                rotate: [0, -360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Outer portal ring */}
            <motion.div
              className="absolute w-80 h-80 rounded-full border-2 border-purple-500"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.8, 0.4],
                rotate: [0, 360]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Portal particles */}
            {[...Array(30)].map((_, i) => {
              const angle = (i / 30) * Math.PI * 2;
              const radius = 150;
              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-cyan-300 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [0, Math.cos(angle) * radius, 0],
                    y: [0, Math.sin(angle) * radius, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.05,
                    ease: "easeOut"
                  }}
                />
              );
            })}
            
            {/* Portal center glow */}
            <motion.div
              className="absolute w-32 h-32 rounded-full bg-white"
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Portal text */}
            <motion.div
              className="absolute text-center z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-4xl font-bold text-white pixel-text mb-2">
                🌀 PORTAL ACTIVATED
              </h2>
              <p className="text-xl text-cyan-300 pixel-text">
                Returning to Home Base...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Main 3D scene with horizontal scrolling
function Scene({
  onReturnComplete,
  quality,
}: {
  onReturnComplete: () => void;
  quality: { tier: DeviceCapabilities['tier']; settings: GraphicsSettings };
}) {
  const scroll = useScroll();
  const shipRef = useRef<THREE.Group | null>(null);
  const { camera } = useThree();
  const sunLightRef = useRef<THREE.PointLight>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [returnProgress, setReturnProgress] = useState(0);
  const [canReturn, setCanReturn] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Prevent immediate return on mount (in case of scroll restoration)
    // and try to reset scroll
    if (scroll.el) {
      scroll.el.scrollTop = 0;
    }
    
    const timer = setTimeout(() => {
      setCanReturn(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [scroll.el]);
  
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
  useFrame((state, delta) => {
    // Subtle solar flicker (keeps pixel vibe but feels more alive)
    if (sunLightRef.current) {
      const t = state.clock.elapsedTime;
      sunLightRef.current.intensity = 2.8 + Math.sin(t * 0.7) * 0.25;
    }

    const scrollProgress = scroll.offset;

    // Mark as started when user is at the beginning
    if (!hasStarted && scrollProgress < 0.1) {
      setHasStarted(true);
    }
    
    // Detect when user reaches Pluto (95% of journey)
    // Only trigger if we've started from the beginning (prevents loop on refresh)
    if (canReturn && hasStarted && scrollProgress > 0.85 && !isReturning) {
      setIsReturning(true);
      audioSystem.playWarpSound();
      
      // Update UI to show return journey
      const planetName = document.getElementById('planet-name');
      const planetInfo = document.getElementById('planet-info');
      if (planetName) planetName.textContent = '🔄 Returning to Earth';
      if (planetInfo) planetInfo.textContent = 'Initiating return sequence...';
    }
    
    // Handle return journey
    if (isReturning) {
      setReturnProgress(prev => {
        const newProgress = prev + delta * 0.08; // Slower, smoother return speed
        
        if (newProgress >= 1) {
          // Landing sequence complete
          audioSystem.playLandingSound();
          setTimeout(() => {
            onReturnComplete();
          }, 500);
          return 1;
        }
        
        return newProgress;
      });
      
      // Animate ship returning to Earth
      if (shipRef.current) {
        const earthPos = PLANETS.find(p => p.name === 'Earth')?.position || new THREE.Vector3(140, 0, 0);
        const startPos = PLANETS[PLANETS.length - 1].position;
        const t = returnProgress;
        
        // Smooth interpolation back to Earth with arc trajectory
        const currentX = startPos.x + (earthPos.x - startPos.x) * t;
        const currentY = 3 + Math.sin(t * Math.PI) * 12; // Higher arc trajectory
        const currentZ = 10 + (2 - 10) * t; // Move closer to Earth
        
        shipRef.current.position.set(currentX, currentY, currentZ);
        
        // Rotate ship to face Earth during return
        shipRef.current.lookAt(earthPos);
        
        // Camera follows ship throughout entire return journey with close POV
        if (t < 0.5) {
          // Phase 1: Close follow behind ship (first-person travel view)
          const offset = new THREE.Vector3(-6, 3, 0); // Closer behind ship
          const shipRotation = shipRef.current.quaternion;
          offset.applyQuaternion(shipRotation);
          
          const cameraTarget = new THREE.Vector3().copy(shipRef.current.position).add(offset);
          camera.position.lerp(cameraTarget, 0.08);
          camera.lookAt(shipRef.current.position);
          
          // Slightly wider FOV for travel feel
          if (camera instanceof THREE.PerspectiveCamera) {
            camera.fov = THREE.MathUtils.lerp(camera.fov, 80, 0.05);
            camera.updateProjectionMatrix();
          }
        } else if (t < 0.75) {
          // Phase 2: Close side-follow as Earth approaches
          const followT = (t - 0.5) / 0.25;
          const offset = new THREE.Vector3(
            -5 - followT * 2, // Move slightly to side
            3 + followT * 2,  // Move up slightly
            8 - followT * 2   // Move closer
          );
          
          const shipRotation = shipRef.current.quaternion;
          offset.applyQuaternion(shipRotation);
          
          const cameraTarget = new THREE.Vector3().copy(shipRef.current.position).add(offset);
          camera.position.lerp(cameraTarget, 0.06);
          
          // Look at Earth as it comes into view
          const lookTarget = new THREE.Vector3().lerpVectors(
            shipRef.current.position,
            earthPos,
            followT
          );
          camera.lookAt(lookTarget);
        } else {
          // Phase 3: Dramatic landing approach (very close POV)
          const landingT = (t - 0.75) / 0.25;
          
          // Camera gets very close to Earth surface
          const closeUpPos = new THREE.Vector3(
            earthPos.x,
            earthPos.y + 25 * (1 - landingT * 0.85), // Descend close to surface
            earthPos.z + 30 * (1 - landingT * 0.92)  // Zoom in very close
          );
          camera.position.lerp(closeUpPos, 0.12);
          camera.lookAt(earthPos);
          
          // Gradually increase FOV for immersive landing effect
          if (camera instanceof THREE.PerspectiveCamera) {
            camera.fov = THREE.MathUtils.lerp(camera.fov, 85 + landingT * 15, 0.1);
            camera.updateProjectionMatrix();
          }
        }
        
        // Update speed display
        const speedDisplay = document.getElementById('speed-display');
        if (speedDisplay) {
          const speed = Math.round((1 - t) * 45000);
          speedDisplay.textContent = `${speed.toLocaleString()} km/s`;
        }
        
        const progressDisplay = document.getElementById('progress-display');
        if (progressDisplay) {
          progressDisplay.textContent = `Return: ${Math.round(t * 100)}%`;
        }
      }
      
      return; // Skip normal scroll behavior during return
    }
    
    const warpProgress = Math.max(0, (scrollProgress - 0.85) * 6.67);
    
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
      <ambientLight intensity={0.05} />

      <hemisphereLight
        intensity={0.18}
        color={new THREE.Color('#bfe7ff')}
        groundColor={new THREE.Color('#0b1020')}
      />
      
      {/* Pulsating sun light */}
      <pointLight 
        ref={sunLightRef}
        position={[0, 0, 0]} 
        intensity={3.4} 
        color="#FDB813" 
        distance={300} 
        decay={2} 
      />
      
      <directionalLight
        position={[120, 100, 80]}
        intensity={0.85}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={quality.settings.shadowMapSize}
        shadow-mapSize-height={quality.settings.shadowMapSize}
        shadow-camera-near={1}
        shadow-camera-far={600}
        shadow-camera-left={-300}
        shadow-camera-right={300}
        shadow-camera-top={300}
        shadow-camera-bottom={-300}
      />
      <spotLight 
        position={[0, 50, 0]} 
        angle={Math.PI / 4} 
        penumbra={0.5} 
        intensity={0.5}
        color="#4A90E2"
        castShadow
        shadow-mapSize-width={Math.max(256, Math.floor(quality.settings.shadowMapSize / 2))}
        shadow-mapSize-height={Math.max(256, Math.floor(quality.settings.shadowMapSize / 2))}
      />
      
      {/* Background starfield */}
      <Starfield scroll={scroll} count={quality.settings.starCount} />
      
      {/* Shooting stars */}
      <ShootingStars count={quality.settings.shootingStarCount} />
      
      {/* Warp speed stars for final sequence */}
      <WarpStars scroll={scroll} count={Math.max(300, Math.floor(quality.settings.starCount / 4))} />
      
      {/* Floating space debris */}
      <SpaceDebris scroll={scroll} count={quality.settings.debrisCount} />

      {/* Asteroid belt */}
      <AsteroidBelt quality={quality.settings} />
      
      {/* Spaceship */}
      <Spaceship scroll={scroll} path={path} ref={shipRef} />
      
      {/* Chase camera */}
      <ChaseCamera target={shipRef} isReturning={isReturning} />
      
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
        <Planet key={planet.name} planet={planet} scroll={scroll} planetIndex={index} quality={quality.settings} />
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

function PerformanceController({ monitor }: { monitor: React.MutableRefObject<PerformanceMonitor | null> }) {
  useFrame(() => {
    if (!monitor.current) return;
    monitor.current.recordFrame(performance.now());
  });
  return null;
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
  const [isLanding, setIsLanding] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState<boolean>(typeof window !== 'undefined' ? localStorage.getItem('musicPlaying') === 'true' : false);
  const router = useRouter();
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null);
  const [qualityTier, setQualityTier] = useState<DeviceCapabilities['tier']>('medium');
  const [qualitySettings, setQualitySettings] = useState<GraphicsSettings>(() => {
    try {
      return detectDeviceCapabilities().settings;
    } catch {
      // Very safe fallback (keeps the scene usable)
      return {
        pixelRatio: 1,
        shadowMapSize: 512,
        antialias: false,
        planetSegments: 48,
        planetTextureSize: 256,
        enableBumpMap: false,
        enableAtmosphere: true,
        enableRings: true,
        enableMoons: true,
        enableBloom: false,
        enableSSAO: false,
        bloomIntensity: 0,
        enableLensFlare: false,
        enableVolumetricLighting: false,
        starCount: 2000,
        asteroidCount: 50,
        debrisCount: 25,
        cometCount: 2,
        shootingStarCount: 5,
        enablePixelation: true,
        pixelationLevel: 6,
        enableChromaticAberration: true,
        enableNoise: true,
        noiseIntensity: 0.05,
        enableSmoothCamera: true,
        cameraLerpSpeed: 0.06,
        enableParticleTrails: false,
        maxLodDistance: 300,
        frustumCulling: true,
        instancedRendering: true,
      };
    }
  });

  const perfMonitorRef = useRef<PerformanceMonitor | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOnScreen, setIsOnScreen] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const onVis = () => setIsTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    onVis();

    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return;

    const el = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsOnScreen(!!entry?.isIntersecting);
      },
      { root: null, threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const caps = detectDeviceCapabilities();
    setCapabilities(caps);
    setQualityTier(caps.tier);
    setQualitySettings(caps.settings);

    perfMonitorRef.current = new PerformanceMonitor(caps.tier, (newTier) => {
      setQualityTier(newTier);
      setCapabilities((prev) => {
        if (!prev) return prev;
        const nextSettings = getSettingsForTier(newTier, prev.features, prev.display);
        setQualitySettings(nextSettings);
        return { ...prev, tier: newTier, settings: nextSettings };
      });
    });

    const onResize = () => {
      setCapabilities((prev) => {
        if (!prev) {
          const nextCaps = detectDeviceCapabilities();
          setQualityTier(nextCaps.tier);
          setQualitySettings(nextCaps.settings);
          return nextCaps;
        }

        const nextDisplay = {
          ...prev.display,
          width: window.innerWidth,
          height: window.innerHeight,
          pixelRatio: window.devicePixelRatio || 1,
          isRetina: (window.devicePixelRatio || 1) > 1,
        };
        const nextSettings = getSettingsForTier(prev.tier, prev.features, nextDisplay);
        setQualitySettings(nextSettings);
        return { ...prev, display: nextDisplay, settings: nextSettings };
      });
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const toggleMusic = useCallback(() => {
    if (typeof window === 'undefined') return;

    const audioEl = document.getElementById('global-audio') as HTMLAudioElement | null;
    const currentlyPlaying = localStorage.getItem('musicPlaying') === 'true';

    if (!audioEl) {
      // nothing to control
      return;
    }

    if (currentlyPlaying) {
      audioEl.pause();
      localStorage.setItem('musicPlaying', 'false');
      setIsMusicOn(false);
    } else {
      audioEl.play().catch(() => {
        // play may fail; still update state
      });
      localStorage.setItem('musicPlaying', 'true');
      setIsMusicOn(true);
    }
  }, []);

  // will be defined later once handleLandingComplete is in scope

  // Ensure background audio continues when entering /solar-system
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audioEl = document.getElementById('global-audio') as HTMLAudioElement | null;
      if (audioEl && localStorage.getItem('musicPlaying') === 'true') {
        // If audio has no source, choose a day/night track
        if (!audioEl.src) {
          const lightModeTrack = '/Attack on Titan 8-bit.mp3';
          const darkModeTrack = '/Kamado Tanjiro 8bit.mp3';
          const hour = new Date().getHours();
          const isDay = hour >= 6 && hour < 18;
          audioEl.src = isDay ? lightModeTrack : darkModeTrack;
          audioEl.loop = true;
        }

        audioEl.play().catch(() => {
          // ignore playback errors, possibly blocked by browser; user gesture required
        });
      }
    }
  }, []);

  const handleReturnComplete = useCallback(() => {
    setIsLanding(true);
  }, []);

  const handleLandingComplete = useCallback(() => {
    // After completing the voyage, hide the portal for the next 30 minutes.
    if (typeof window !== 'undefined') {
      const CACHE_DURATION = 30 * 60 * 1000;
      const hideUntil = Date.now() + CACHE_DURATION;
      localStorage.setItem('hidePortalUntil', hideUntil.toString());
      // Keep a record of portal enter time in session storage for other logic
      localStorage.setItem('portalEnterTime', Date.now().toString());
    }
    // Navigate back to home so home can control the single redirect to /portal
    router.push('/');
  }, [router]);

  const handleSkip = useCallback(() => {
    // Immediately complete the landing & redirect back to home
    handleLandingComplete();
  }, [handleLandingComplete]);

  if (loading) {
    return <LoadingScreen />;
  }

  const isMobile = capabilities?.display.isMobile ?? false;
  const tier = capabilities?.tier ?? qualityTier;
  const settings = qualitySettings;

  // Keep the same UX, but scale render cost automatically
  const scrollPages = isMobile ? 6 : 10;
  const pixelation = settings.pixelationLevel;
  const enablePostProcessing = settings.enablePixelation || settings.enableBloom || settings.enableChromaticAberration || settings.enableNoise;
  const powerPreference = tier === 'ultra' || tier === 'high' ? 'high-performance' : 'low-power';

  const isActive = isOnScreen && isTabVisible;
  const targetFps = tier === 'ultra' ? 60 : tier === 'high' ? 45 : tier === 'medium' ? 30 : 24;

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden solar-system-container">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 5, 20], fov: 75 }}
        gl={{ 
          antialias: settings.antialias,
          powerPreference,
        }}
        dpr={settings.pixelRatio}
        shadows={settings.shadowMapSize >= 256}
        frameloop="demand"
        style={{ background: '#000' }}
        onCreated={({ gl }) => {
          // Three r15x+ uses `useLegacyLights`; disable to get physically-correct lighting.
          if ('useLegacyLights' in gl) {
            (gl as any).useLegacyLights = false;
          }
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = tier === 'ultra' ? 1.1 : tier === 'high' ? 1.05 : 1.0;
          gl.shadowMap.enabled = settings.shadowMapSize >= 256;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Suspense fallback={null}>
          <InvalidateLoop active={isActive} fps={targetFps} />
          <ScrollControls pages={scrollPages} damping={isMobile ? 0.35 : 0.2} enabled={!isLanding}>
            <Scene onReturnComplete={handleReturnComplete} quality={{ tier, settings }} />
          </ScrollControls>

          <PerformanceController monitor={perfMonitorRef} />
          
          {/* Enhanced post-processing for 8-bit aesthetic */}
          {enablePostProcessing && (
            <EffectComposer>
              <Pixelation granularity={settings.enablePixelation ? pixelation : 1} />
              <Bloom
                intensity={settings.enableBloom ? settings.bloomIntensity : 0}
                luminanceThreshold={0.35}
                luminanceSmoothing={0.2}
              />
              <ChromaticAberration offset={settings.enableChromaticAberration ? [0.001, 0.001] : [0, 0]} />
              <Noise opacity={settings.enableNoise ? settings.noiseIntensity : 0} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
      
      {/* Minimal UI Container - Bottom center */}
      <div className="fixed bottom-6 md:left-1/2 md:transform md:-translate-x-1/2 z-[9999] pointer-events-auto solar-system-controls">
        <motion.div 
          className="w-full sm:w-auto bg-black bg-opacity-70 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg border border-cyan-500 border-opacity-40 shadow-lg pointer-events-auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div id="current-planet-info" className="text-center flex flex-col sm:flex-row sm:items-center items-center gap-2 sm:gap-3">
            <div className="mb-2">
              <p className="text-cyan-300 font-bold text-sm sm:text-base" id="planet-name">🚀 Starting Journey</p>
              <p className="text-gray-300 text-xs mt-1 leading-relaxed max-w-full sm:max-w-md mx-auto" id="planet-info">Scroll down to explore the solar system</p>
            </div>
            <div className="flex items-center justify-center gap-3 text-xs border-t border-gray-700 pt-2">
              <span className="text-green-400" id="progress-display">0%</span>
              <span className="text-gray-500">•</span>
              <span className="text-orange-400" id="speed-display">0 km/s</span>
              <span className="text-gray-500">•</span>
              <button
                aria-label={isMusicOn ? 'Mute audio' : 'Unmute audio'}
                title={isMusicOn ? 'Mute audio' : 'Unmute audio'}
                onClick={toggleMusic}
                className="nes-btn is-small bg-transparent px-2 py-1"
              >
                {isMusicOn ? <HiVolumeUp size={16} /> : <HiVolumeOff size={16} />}
              </button>
              <button
                aria-label="Skip journey"
                title="Skip the journey"
                onClick={handleSkip}
                className="nes-btn is-error is-small bg-transparent px-2 py-1"
              >
                <MdSkipNext size={16} />
              </button>
              {/* on mobile, show skip as large icon to the right */}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Landing animation overlay */}
      <AnimatePresence>
        {isLanding && <LandingOverlay onComplete={handleLandingComplete} />}
      </AnimatePresence>

    </div>
  );
}