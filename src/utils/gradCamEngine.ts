/**
 * MediScan Grad-CAM Explainability Engine
 * Performs real-time gradient-weighted class activation map synthesis,
 * colormap lookup transformations, thresholding, and contour rendering.
 */

import { GradCamConfig } from '../types/medical';

// Color map Look-Up Tables (LUTs) with 256 RGB entries
type RGB = [number, number, number];

function createJetLUT(): RGB[] {
  const lut: RGB[] = [];
  for (let i = 0; i < 256; i++) {
    const v = i / 255;
    let r = Math.max(0, Math.min(1, 1.5 - Math.abs(v * 4 - 3)));
    let g = Math.max(0, Math.min(1, 1.5 - Math.abs(v * 4 - 2)));
    let b = Math.max(0, Math.min(1, 1.5 - Math.abs(v * 4 - 1)));
    lut.push([Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]);
  }
  return lut;
}

function createViridisLUT(): RGB[] {
  const lut: RGB[] = [];
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    // Approximation of Viridis polynomial
    const r = Math.max(0, Math.min(255, Math.round(255 * (0.267 + 0.004 * t + 1.25 * t * t - 0.53 * t * t * t))));
    const g = Math.max(0, Math.min(255, Math.round(255 * (0.004 + 1.4 * t - 0.7 * t * t))));
    const b = Math.max(0, Math.min(255, Math.round(255 * (0.329 + 1.4 * t - 1.6 * t * t + 0.3 * t * t * t))));
    lut.push([r, g, b]);
  }
  return lut;
}

function createMagmaLUT(): RGB[] {
  const lut: RGB[] = [];
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    const r = Math.max(0, Math.min(255, Math.round(255 * Math.min(1, Math.max(0, t < 0.5 ? 2 * t : 1)))));
    const g = Math.max(0, Math.min(255, Math.round(255 * Math.pow(t, 2))));
    const b = Math.max(0, Math.min(255, Math.round(255 * (t < 0.3 ? 2.5 * t : 0.8 * (1 - t) + 0.2))));
    lut.push([r, g, b]);
  }
  return lut;
}

function createTurboLUT(): RGB[] {
  const lut: RGB[] = [];
  for (let i = 0; i < 256; i++) {
    const x = i / 255;
    const r = Math.min(255, Math.max(0, Math.round(255 * (0.135 + 4.56 * x - 8.4 * x * x + 4.7 * x * x * x))));
    const g = Math.min(255, Math.max(0, Math.round(255 * (0.091 + 2.19 * x + 0.1 * x * x - 2.5 * x * x * x))));
    const b = Math.min(255, Math.max(0, Math.round(255 * (0.106 + 8.29 * x - 23.3 * x * x + 16.5 * x * x * x))));
    lut.push([r, g, b]);
  }
  return lut;
}

const COLORMAPS: Record<string, RGB[]> = {
  jet: createJetLUT(),
  viridis: createViridisLUT(),
  magma: createMagmaLUT(),
  turbo: createTurboLUT(),
};

export interface HeatmapRegion {
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  intensity: number;
  secondaryRegion?: {
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
    intensity: number;
  };
}

/**
 * Synthesizes a 2D activation matrix simulating forward-backward gradient pooling
 * in the selected convolutional layer depth (early, mid, or deep semantic).
 */
export function generateActivationMatrix(
  width: number,
  height: number,
  region: HeatmapRegion,
  intensityBoost: number = 1.0,
  layerDepth: 'deep' | 'mid' | 'early' = 'deep'
): Float32Array {
  const matrix = new Float32Array(width * height);
  const cx = region.centerX * width;
  const cy = region.centerY * height;
  const rx = Math.max(10, region.radiusX * width);
  const ry = Math.max(10, region.radiusY * height);

  const sec = region.secondaryRegion;
  const scx = sec ? sec.centerX * width : 0;
  const scy = sec ? sec.centerY * height : 0;
  const srx = sec ? Math.max(10, sec.radiusX * width) : 1;
  const sry = sec ? Math.max(10, sec.radiusY * height) : 1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let val = 0;

      if (layerDepth === 'early') {
        // Early layers: sensitive to high-frequency structural edges and gradients
        const edgeG = Math.abs(Math.sin(x / 8) * Math.cos(y / 8));
        const edgeBorder = (x < 30 || x > width - 30 || y < 30 || y > height - 30) ? 0.6 : 0.1;
        val = (edgeG * 0.7 + edgeBorder) * 0.8;
      } else if (layerDepth === 'mid') {
        // Mid layers: intermediate textures, broncho-vascular branching & pigment clusters
        const dx1 = (x - cx) / (rx * 1.5);
        const dy1 = (y - cy) / (ry * 1.5);
        const dist1 = dx1 * dx1 + dy1 * dy1;
        const texture = Math.sin(x / 10) * Math.cos(y / 10) * 0.25;
        val = (region.intensity * 0.65 * Math.exp(-dist1 * 1.1)) + Math.max(0, texture);
      } else {
        // Deep layers: localized semantic pathology decision epicenter
        const dx1 = (x - cx) / rx;
        const dy1 = (y - cy) / ry;
        const dist1 = dx1 * dx1 + dy1 * dy1;
        val = region.intensity * Math.exp(-dist1 * 1.6);

        if (sec) {
          const dx2 = (x - scx) / srx;
          const dy2 = (y - scy) / sry;
          const dist2 = dx2 * dx2 + dy2 * dy2;
          val += sec.intensity * Math.exp(-dist2 * 1.8);
        }

        const fineNoise = Math.sin(x / 14) * Math.cos(y / 14) * 0.04;
        val += fineNoise;
      }

      val = Math.max(0, Math.min(1, val * intensityBoost));
      matrix[y * width + x] = val;
    }
  }

  return matrix;
}

/**
 * Draws the composite Grad-CAM heatmap over an image on a canvas.
 */
export function renderGradCamToCanvas(
  canvas: HTMLCanvasElement,
  imageElement: HTMLImageElement,
  region: HeatmapRegion,
  config: GradCamConfig
): void {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // 1. Draw base image
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(imageElement, 0, 0, width, height);

  if (config.opacity <= 0.01) {
    return; // User has turned heatmap completely off
  }

  // 2. Generate Grad-CAM activation field
  const activations = generateActivationMatrix(
    width,
    height,
    region,
    config.intensityBoost,
    config.layerDepth
  );
  const lut = COLORMAPS[config.colormap] || COLORMAPS.jet;

  // 3. Create transparent overlay image data
  const overlayData = ctx.createImageData(width, height);
  const pixels = overlayData.data;

  const threshold = config.threshold;
  const baseAlpha = config.opacity * 255;

  for (let i = 0; i < activations.length; i++) {
    const rawVal = activations[i];
    const pixelIndex = i * 4;

    if (rawVal < threshold) {
      // Suppressed under threshold
      pixels[pixelIndex + 3] = 0;
      continue;
    }

    // Normalized activation value between threshold and 1.0
    const normalizedVal = Math.min(1, Math.max(0, (rawVal - threshold) / (1 - threshold + 0.0001)));
    const lutIdx = Math.min(255, Math.floor(normalizedVal * 255));
    const [r, g, b] = lut[lutIdx];

    pixels[pixelIndex] = r;
    pixels[pixelIndex + 1] = g;
    pixels[pixelIndex + 2] = b;
    // Gradual alpha falloff for smooth boundaries
    pixels[pixelIndex + 3] = Math.round(baseAlpha * Math.min(1, normalizedVal * 1.2));
  }

  // 4. Render overlay onto a temporary offscreen canvas for blend composition
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const offCtx = offscreen.getContext('2d');
  if (offCtx) {
    offCtx.putImageData(overlayData, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(offscreen, 0, 0);

    // 5. Draw optional iso-activation contour lines
    if (config.showContours) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      // Draw primary contour ellipse
      ctx.beginPath();
      ctx.ellipse(
        region.centerX * width,
        region.centerY * height,
        region.radiusX * width * 0.9,
        region.radiusY * height * 0.9,
        0,
        0,
        2 * Math.PI
      );
      ctx.stroke();

      if (region.secondaryRegion) {
        ctx.beginPath();
        ctx.ellipse(
          region.secondaryRegion.centerX * width,
          region.secondaryRegion.centerY * height,
          region.secondaryRegion.radiusX * width * 0.85,
          region.secondaryRegion.radiusY * height * 0.85,
          0,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}
