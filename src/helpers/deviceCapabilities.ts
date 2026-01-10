import * as THREE from 'three';

export type QualityTier = 'low' | 'medium' | 'high' | 'ultra';

export interface GraphicsSettings {
  pixelRatio: number;
  shadowMapSize: number;
  antialias: boolean;
  planetSegments: number;
  planetTextureSize: number;
  enableBumpMap: boolean;
  enableAtmosphere: boolean;
  enableRings: boolean;
  enableMoons: boolean;
  enableBloom: boolean;
  enableSSAO: boolean;
  bloomIntensity: number;
  enableLensFlare: boolean;
  enableVolumetricLighting: boolean;
  starCount: number;
  asteroidCount: number;
  debrisCount: number;
  cometCount: number;
  shootingStarCount: number;
  enablePixelation: boolean;
  pixelationLevel: number;
  enableChromaticAberration: boolean;
  enableNoise: boolean;
  noiseIntensity: number;
  enableSmoothCamera: boolean;
  cameraLerpSpeed: number;
  enableParticleTrails: boolean;
  maxLodDistance: number;
  frustumCulling: boolean;
  instancedRendering: boolean;
}

export interface DeviceFeatures {
  webgl2: boolean;
  instancing: boolean;
  floatTextures: boolean;
  maxTextureSize: number;
}

export interface DisplayInfo {
  width: number;
  height: number;
  pixelRatio: number;
  isRetina: boolean;
  isMobile: boolean;
}

export interface DeviceCapabilities {
  tier: QualityTier;
  features: DeviceFeatures;
  display: DisplayInfo;
  settings: GraphicsSettings;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isMobileUserAgent() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
}

function safeDeviceMemoryGB(): number {
  const anyNav = navigator as any;
  const mem = typeof anyNav?.deviceMemory === 'number' ? anyNav.deviceMemory : 0;
  return mem;
}

function getWebGLCaps() {
  if (typeof document === 'undefined') {
    return {
      webgl2: false,
      instancing: false,
      floatTextures: false,
      maxTextureSize: 2048,
    } as DeviceFeatures;
  }

  const canvas = document.createElement('canvas');
  const gl2 = canvas.getContext('webgl2') as WebGL2RenderingContext | null;
  const gl = (gl2 ?? (canvas.getContext('webgl') as WebGLRenderingContext | null));

  if (!gl) {
    return {
      webgl2: false,
      instancing: false,
      floatTextures: false,
      maxTextureSize: 1024,
    } as DeviceFeatures;
  }

  const maxTextureSize = (gl.getParameter(gl.MAX_TEXTURE_SIZE) as number) || 2048;
  const webgl2 = !!gl2;
  const instancing = webgl2 || !!(gl as any).getExtension?.('ANGLE_instanced_arrays');
  const floatTextures = webgl2
    ? true
    : !!(gl as any).getExtension?.('OES_texture_float') || !!(gl as any).getExtension?.('OES_texture_half_float');

  return {
    webgl2,
    instancing,
    floatTextures,
    maxTextureSize,
  } as DeviceFeatures;
}

export function getSettingsForTier(tier: QualityTier, features: DeviceFeatures, display: DisplayInfo): GraphicsSettings {
  // Use pixel art first: keep resolution modest, then rely on pixelation/upscaling.
  // Cap DPR aggressively on mobile/low-tier.
  const dprCap = tier === 'ultra' ? 2 : tier === 'high' ? 1.75 : tier === 'medium' ? 1.35 : 1.1;
  const pixelRatio = clamp(display.pixelRatio, 1, dprCap);

  const maxTex = features.maxTextureSize;
  const texBase = tier === 'ultra' ? 512 : tier === 'high' ? 384 : tier === 'medium' ? 256 : 192;
  const planetTextureSize = Math.min(texBase, maxTex);

  const planetSegments = tier === 'ultra' ? 64 : tier === 'high' ? 56 : tier === 'medium' ? 44 : 32;

  const shadowMapSize = tier === 'ultra' ? 2048 : tier === 'high' ? 1024 : tier === 'medium' ? 512 : 256;

  const enableBloom = tier === 'ultra' || tier === 'high';

  return {
    pixelRatio,
    shadowMapSize,
    antialias: tier === 'ultra',
    planetSegments,
    planetTextureSize,
    enableBumpMap: tier === 'ultra' || tier === 'high',
    enableAtmosphere: true,
    enableRings: true,
    enableMoons: tier !== 'low',
    enableBloom,
    enableSSAO: false,
    bloomIntensity: enableBloom ? (tier === 'ultra' ? 0.85 : 0.65) : 0,
    enableLensFlare: false,
    enableVolumetricLighting: false,
    starCount: tier === 'ultra' ? 5000 : tier === 'high' ? 3800 : tier === 'medium' ? 2400 : 1400,
    asteroidCount: tier === 'ultra' ? 220 : tier === 'high' ? 140 : tier === 'medium' ? 85 : 50,
    debrisCount: tier === 'ultra' ? 90 : tier === 'high' ? 60 : tier === 'medium' ? 35 : 20,
    cometCount: tier === 'ultra' ? 5 : tier === 'high' ? 3 : tier === 'medium' ? 2 : 1,
    shootingStarCount: tier === 'ultra' ? 14 : tier === 'high' ? 10 : tier === 'medium' ? 6 : 4,
    enablePixelation: true,
    pixelationLevel: tier === 'ultra' ? 4 : tier === 'high' ? 5 : tier === 'medium' ? 6 : 7,
    enableChromaticAberration: tier !== 'low',
    enableNoise: tier !== 'low',
    noiseIntensity: tier === 'ultra' ? 0.045 : tier === 'high' ? 0.05 : tier === 'medium' ? 0.055 : 0,
    enableSmoothCamera: true,
    cameraLerpSpeed: tier === 'ultra' ? 0.07 : tier === 'high' ? 0.06 : tier === 'medium' ? 0.055 : 0.05,
    enableParticleTrails: tier === 'ultra' || tier === 'high',
    maxLodDistance: tier === 'ultra' ? 360 : tier === 'high' ? 320 : tier === 'medium' ? 280 : 240,
    frustumCulling: true,
    instancedRendering: features.instancing,
  };
}

export function detectDeviceCapabilities(): DeviceCapabilities {
  const features = getWebGLCaps();

  const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const height = typeof window !== 'undefined' ? window.innerHeight : 720;
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const isRetina = pixelRatio > 1;
  const isMobile = typeof window !== 'undefined' ? isMobileUserAgent() || width < 768 : false;

  const memGB = typeof navigator !== 'undefined' ? safeDeviceMemoryGB() : 0;
  const cores = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4;

  // Simple tier heuristic: favor stability over peak quality.
  let tier: QualityTier = 'medium';

  if (isMobile) tier = 'low';
  if (!features.webgl2) tier = 'low';

  if (!isMobile && features.webgl2 && cores >= 8) tier = 'high';
  if (!isMobile && features.webgl2 && cores >= 10 && (memGB >= 8 || memGB === 0) && features.maxTextureSize >= 4096) tier = 'ultra';
  if (memGB > 0 && memGB <= 4) tier = 'low';

  const display: DisplayInfo = {
    width,
    height,
    pixelRatio,
    isRetina,
    isMobile,
  };

  const settings = getSettingsForTier(tier, features, display);

  return { tier, features, display, settings };
}

export class PerformanceMonitor {
  private readonly windowMs = 4000;
  private readonly sample: Array<{ t: number; dt: number }> = [];
  private lastFrameTime = 0;
  private currentTier: QualityTier;
  private readonly onTierChange: (tier: QualityTier) => void;

  // hysteresis
  private lastChangeAt = 0;
  private readonly minChangeIntervalMs = 9000;

  constructor(initialTier: QualityTier, onTierChange: (tier: QualityTier) => void) {
    this.currentTier = initialTier;
    this.onTierChange = onTierChange;
  }

  recordFrame(nowMs: number) {
    if (!this.lastFrameTime) {
      this.lastFrameTime = nowMs;
      return;
    }

    const dt = nowMs - this.lastFrameTime;
    this.lastFrameTime = nowMs;

    this.sample.push({ t: nowMs, dt });

    // keep window
    const cutoff = nowMs - this.windowMs;
    while (this.sample.length && this.sample[0].t < cutoff) this.sample.shift();

    if (nowMs - this.lastChangeAt < this.minChangeIntervalMs) return;

    const avgDt = this.sample.reduce((acc, s) => acc + s.dt, 0) / Math.max(1, this.sample.length);
    const fps = avgDt > 0 ? 1000 / avgDt : 60;

    // Conservative thresholds; prefer not to oscillate.
    if (fps < 38 && (this.currentTier === 'ultra' || this.currentTier === 'high')) {
      this.setTier(this.currentTier === 'ultra' ? 'high' : 'medium', nowMs);
      return;
    }

    if (fps < 30 && this.currentTier === 'medium') {
      this.setTier('low', nowMs);
      return;
    }

    if (fps > 56 && this.currentTier === 'medium') {
      this.setTier('high', nowMs);
      return;
    }

    if (fps > 58 && this.currentTier === 'high') {
      this.setTier('ultra', nowMs);
      return;
    }
  }

  private setTier(next: QualityTier, nowMs: number) {
    if (next === this.currentTier) return;
    this.currentTier = next;
    this.lastChangeAt = nowMs;
    this.onTierChange(next);
  }
}

// Ensure module side effects don't tree-shake away three in some builds
void THREE;
