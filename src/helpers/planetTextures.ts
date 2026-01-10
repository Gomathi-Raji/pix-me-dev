import * as THREE from 'three';

export const PLANET_PALETTES: Record<
  string,
  {
    base: string[];
    atmosphere?: string;
    accent?: string[];
  }
> = {
  Sun: { base: ['#FDB813', '#FF8C00', '#FFD27D'], accent: ['#FFF2C1'] },
  Mercury: { base: ['#6E5C4A', '#8C7853', '#A08E79'] },
  Venus: { base: ['#E3C38B', '#FFC649', '#D9A441'], atmosphere: '#FBE0A3' },
  Earth: { base: ['#1E3A8A', '#2563EB', '#22C55E', '#14532D', '#F8FAFC'], atmosphere: '#7DD3FC' },
  Moon: { base: ['#A3A3A3', '#737373', '#D4D4D4'] },
  Mars: { base: ['#7F2D1D', '#CD5C5C', '#A43B2B'], atmosphere: '#FCA5A5' },
  Jupiter: { base: ['#D8CA9D', '#C9B483', '#A67C52', '#8B5E3C'], atmosphere: '#FDE68A' },
  Saturn: { base: ['#FAD5A5', '#E6C48A', '#D3A76F'], atmosphere: '#FCE7C5' },
  Uranus: { base: ['#4FD0E7', '#22D3EE', '#0EA5E9'], atmosphere: '#BAE6FD' },
  Neptune: { base: ['#1D4ED8', '#4B70DD', '#1E40AF'], atmosphere: '#93C5FD' },
  Pluto: { base: ['#A16207', '#C4A484', '#B45309'] },
};

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function createCanvas(size: number) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas unsupported');
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

function pick(arr: string[], i: number) {
  return arr[i % arr.length];
}

function rng(seed: number) {
  // xorshift32
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) % 10000) / 10000;
  };
}

function nameSeed(name: string) {
  let h = 2166136261;
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h | 0;
}

function setNearest(tex: THREE.Texture) {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestMipmapNearestFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = 1;
  (tex as any).colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function toLinearGray(ctx: CanvasRenderingContext2D, size: number) {
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = d[i];
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
}

function drawPixelNoise(ctx: CanvasRenderingContext2D, size: number, palette: string[], block: number, random: () => number) {
  for (let y = 0; y < size; y += block) {
    for (let x = 0; x < size; x += block) {
      const c = palette[Math.floor(random() * palette.length)];
      ctx.fillStyle = c;
      ctx.fillRect(x, y, block, block);
    }
  }
}

function drawBands(ctx: CanvasRenderingContext2D, size: number, palette: string[], bandHeight: number, jitter: number, random: () => number) {
  for (let y = 0; y < size; y += bandHeight) {
    const c = palette[Math.floor(random() * palette.length)];
    const offset = Math.floor((random() - 0.5) * jitter);
    ctx.fillStyle = c;
    ctx.fillRect(0, y + offset, size, bandHeight);
  }
}

function drawCraters(ctx: CanvasRenderingContext2D, size: number, random: () => number) {
  const count = Math.floor(size / 10);
  for (let i = 0; i < count; i++) {
    const r = Math.floor(2 + random() * 6);
    const x = Math.floor(random() * size);
    const y = Math.floor(random() * size);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.arc(x - 1, y - 1, Math.max(1, r - 2), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawEarthLike(ctx: CanvasRenderingContext2D, size: number, palette: string[], random: () => number) {
  // Base ocean
  ctx.fillStyle = '#1E3A8A';
  ctx.fillRect(0, 0, size, size);

  // Continents (blocky cellular noise)
  const block = Math.max(2, Math.floor(size / 64));
  for (let y = 0; y < size; y += block) {
    for (let x = 0; x < size; x += block) {
      const v = random();
      if (v > 0.62) {
        ctx.fillStyle = v > 0.84 ? '#14532D' : '#22C55E';
        ctx.fillRect(x, y, block, block);
      }
    }
  }

  // Ice caps
  ctx.fillStyle = 'rgba(248,250,252,0.9)';
  const cap = Math.floor(size * 0.08);
  ctx.fillRect(0, 0, size, cap);
  ctx.fillRect(0, size - cap, size, cap);

  // Thin cloud streaks
  ctx.fillStyle = 'rgba(248,250,252,0.12)';
  for (let i = 0; i < 18; i++) {
    const y = Math.floor(random() * size);
    const w = Math.floor(size * (0.2 + random() * 0.5));
    const x = Math.floor(random() * (size - w));
    const h = Math.max(1, Math.floor(size / 128));
    ctx.fillRect(x, y, w, h);
  }
}

function drawSun(ctx: CanvasRenderingContext2D, size: number, random: () => number) {
  // A hot, animated-looking cell texture (static, but lively)
  const colors = PLANET_PALETTES.Sun.base;
  const block = Math.max(2, Math.floor(size / 48));
  drawPixelNoise(ctx, size, colors, block, random);

  // Add brighter filaments
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  for (let i = 0; i < 80; i++) {
    const x = Math.floor(random() * size);
    const y = Math.floor(random() * size);
    const w = Math.max(1, Math.floor(block * (1 + random() * 3)));
    const h = Math.max(1, Math.floor(block * (1 + random() * 2)));
    ctx.fillRect(x, y, w, h);
  }
}

export function generatePlanetTextures(
  planetName: string,
  size: number,
  enableBumpMap: boolean
): { diffuse: THREE.Texture; bump?: THREE.Texture; emissive?: THREE.Texture; specular?: THREE.Texture } {
  if (typeof document === 'undefined') {
    // SSR-safe fallback; will be replaced client-side.
    const data = new Uint8Array([255, 255, 255, 255]);
    const tex = new THREE.DataTexture(data, 1, 1);
    tex.needsUpdate = true;
    (tex as any).colorSpace = THREE.SRGBColorSpace;
    return { diffuse: tex };
  }

  const palette = PLANET_PALETTES[planetName]?.base ?? ['#888888', '#AAAAAA', '#666666'];
  const random = rng(nameSeed(planetName));

  const { canvas: cDiffuse, ctx: d } = createCanvas(size);

  if (planetName === 'Earth') {
    drawEarthLike(d, size, palette, random);
  } else if (planetName === 'Jupiter' || planetName === 'Saturn') {
    d.fillStyle = pick(palette, 0);
    d.fillRect(0, 0, size, size);
    drawBands(d, size, palette, Math.max(3, Math.floor(size / 24)), Math.max(2, Math.floor(size / 28)), random);
  } else if (planetName === 'Moon' || planetName === 'Mercury') {
    drawPixelNoise(d, size, palette, Math.max(2, Math.floor(size / 56)), random);
    drawCraters(d, size, random);
  } else if (planetName === 'Sun') {
    drawSun(d, size, random);
  } else {
    drawPixelNoise(d, size, palette, Math.max(2, Math.floor(size / 52)), random);
  }

  const diffuse = setNearest(new THREE.CanvasTexture(cDiffuse));
  diffuse.needsUpdate = true;

  let bump: THREE.Texture | undefined;
  if (enableBumpMap) {
    const { canvas: cBump, ctx: b } = createCanvas(size);
    // grayscale height-ish map derived from coarse noise
    b.fillStyle = '#7f7f7f';
    b.fillRect(0, 0, size, size);
    drawPixelNoise(b, size, ['#4a4a4a', '#7a7a7a', '#a0a0a0', '#d0d0d0'], Math.max(2, Math.floor(size / 52)), random);
    toLinearGray(b, size);

    bump = new THREE.CanvasTexture(cBump);
    bump.wrapS = THREE.RepeatWrapping;
    bump.wrapT = THREE.RepeatWrapping;
    bump.magFilter = THREE.NearestFilter;
    bump.minFilter = THREE.NearestMipmapNearestFilter;
    bump.generateMipmaps = true;
    bump.anisotropy = 1;
    bump.needsUpdate = true;
  }

  // Emissive: only meaningful for Sun (and a tiny bit for Earth for city lights)
  let emissive: THREE.Texture | undefined;
  if (planetName === 'Sun' || planetName === 'Earth') {
    const { canvas: cE, ctx: e } = createCanvas(size);
    e.fillStyle = '#000000';
    e.fillRect(0, 0, size, size);

    if (planetName === 'Sun') {
      // brighter cells
      e.fillStyle = 'rgba(255,255,255,0.9)';
      const block = Math.max(2, Math.floor(size / 52));
      for (let y = 0; y < size; y += block) {
        for (let x = 0; x < size; x += block) {
          const v = random();
          if (v > 0.72) e.fillRect(x, y, block, block);
        }
      }
    } else {
      // sparse city lights
      e.fillStyle = 'rgba(255,230,160,0.5)';
      const block = Math.max(1, Math.floor(size / 96));
      for (let i = 0; i < Math.floor(size * 0.8); i++) {
        const x = Math.floor(random() * size);
        const y = Math.floor(random() * size);
        if (random() > 0.92) e.fillRect(x, y, block, block);
      }
    }

    emissive = setNearest(new THREE.CanvasTexture(cE));
    emissive.needsUpdate = true;
  }

  // Specular-ish map: used as a roughnessMap surrogate in the scene (pixel aesthetic)
  let specular: THREE.Texture | undefined;
  {
    const { canvas: cS, ctx: s } = createCanvas(size);
    s.fillStyle = '#808080';
    s.fillRect(0, 0, size, size);

    if (planetName === 'Earth') {
      // Water lower roughness (brighter specular)
      s.fillStyle = 'rgba(220,220,220,1)';
      s.fillRect(0, 0, size, size);
      // Land rougher (darker)
      s.fillStyle = 'rgba(120,120,120,1)';
      const block = Math.max(2, Math.floor(size / 64));
      for (let y = 0; y < size; y += block) {
        for (let x = 0; x < size; x += block) {
          const v = random();
          if (v > 0.62) s.fillRect(x, y, block, block);
        }
      }
    } else {
      // General subtle variance
      drawPixelNoise(s, size, ['#6a6a6a', '#8a8a8a', '#9a9a9a'], Math.max(2, Math.floor(size / 56)), random);
      toLinearGray(s, size);
    }

    specular = new THREE.CanvasTexture(cS);
    specular.wrapS = THREE.RepeatWrapping;
    specular.wrapT = THREE.RepeatWrapping;
    specular.magFilter = THREE.NearestFilter;
    specular.minFilter = THREE.NearestMipmapNearestFilter;
    specular.generateMipmaps = true;
    specular.anisotropy = 1;
    specular.needsUpdate = true;
  }

  return { diffuse, bump, emissive, specular };
}

export function generateRingTexture(size: number) {
  if (typeof document === 'undefined') {
    const data = new Uint8Array([255, 255, 255, 255]);
    const tex = new THREE.DataTexture(data, 1, 1);
    tex.needsUpdate = true;
    return tex;
  }

  const { canvas, ctx } = createCanvas(size);

  // Transparent base
  ctx.clearRect(0, 0, size, size);

  // Radial stripes (pixelated)
  const center = size / 2;
  const ringWidth = Math.max(1, Math.floor(size / 40));

  for (let r = 0; r < center; r += ringWidth) {
    const t = r / center;
    const a = clamp01(1 - t);
    const stripe = Math.floor(t * 12) % 2;
    const alpha = stripe ? 0.35 * a : 0.15 * a;
    ctx.strokeStyle = `rgba(250,213,165,${alpha})`;
    ctx.lineWidth = ringWidth;
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const tex = setNearest(new THREE.CanvasTexture(canvas));
  tex.needsUpdate = true;
  return tex;
}

export function generateAsteroidTexture(size: number) {
  if (typeof document === 'undefined') {
    const data = new Uint8Array([255, 255, 255, 255]);
    const tex = new THREE.DataTexture(data, 1, 1);
    tex.needsUpdate = true;
    return tex;
  }

  const { canvas, ctx } = createCanvas(size);
  const random = rng(1337);

  drawPixelNoise(ctx, size, ['#3f3f46', '#52525b', '#71717a', '#27272a'], Math.max(2, Math.floor(size / 18)), random);
  drawCraters(ctx, size, random);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestMipmapNearestFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = 1;
  tex.needsUpdate = true;
  return tex;
}
