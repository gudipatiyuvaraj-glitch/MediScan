/**
 * MediScan DICOM Simulation & Windowing Engine
 * Implements clinical Hounsfield Unit (HU) window level (WL) and window width (WW) transformations.
 */

import { DicomWindowPreset } from '../types/medical';

export const DICOM_PRESETS: DicomWindowPreset[] = [
  {
    name: 'Default / Raw',
    windowWidth: 400,
    windowLevel: 50,
    description: 'Standard diagnostic linear gray-scale representation',
  },
  {
    name: 'Lung Window',
    windowWidth: 1500,
    windowLevel: -600,
    description: 'Optimized for pulmonary parenchyma, broncho-vascular markings & opacities',
  },
  {
    name: 'Mediastinum / Soft Tissue',
    windowWidth: 350,
    windowLevel: 40,
    description: 'Enhances cardiomediastinal contour, great vessels, and lymph nodes',
  },
  {
    name: 'Bone Window',
    windowWidth: 2000,
    windowLevel: 350,
    description: 'Highlights cortical ribs, clavicles, thoracic spine, and fractures',
  },
  {
    name: 'High-Contrast Edge',
    windowWidth: 180,
    windowLevel: 60,
    description: 'Accentuates sharp pathological boundaries and micro-calcifications',
  },
];

/**
 * Applies Hounsfield Unit Windowing transfer function to image pixel data:
 * Values below WL - WW/2 map to 0 (black).
 * Values above WL + WW/2 map to 255 (white).
 * Values in between map linearly.
 */
export function applyWindowLevel(
  sourceImageData: ImageData,
  targetCanvas: HTMLCanvasElement,
  windowWidth: number,
  windowLevel: number,
  invert: boolean = false
): void {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  const w = sourceImageData.width;
  const h = sourceImageData.height;
  targetCanvas.width = w;
  targetCanvas.height = h;

  const outputData = ctx.createImageData(w, h);
  const src = sourceImageData.data;
  const dst = outputData.data;

  // Window bounds
  const minVal = windowLevel - windowWidth / 2;
  const maxVal = windowLevel + windowWidth / 2;
  const range = Math.max(1, maxVal - minVal);

  for (let i = 0; i < src.length; i += 4) {
    // Luminance grayscale conversion (or channel average)
    const gray = 0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2];
    
    // Scale standard 0..255 pixel intensity to simulated HU range (-1000 to +1000)
    const simulatedHU = (gray / 255) * 2000 - 1000;

    // Apply window transfer function
    let normalized = (simulatedHU - minVal) / range;
    normalized = Math.max(0, Math.min(1, normalized));

    let pixelVal = Math.round(normalized * 255);
    if (invert) {
      pixelVal = 255 - pixelVal;
    }

    dst[i] = pixelVal;
    dst[i + 1] = pixelVal;
    dst[i + 2] = pixelVal;
    dst[i + 3] = src[i + 3]; // Preserve alpha
  }

  ctx.putImageData(outputData, 0, 0);
}
