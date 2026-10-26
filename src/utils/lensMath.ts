/**
 * Lens Mathematics & Coordinate Mapping Utilities
 * Pure functions governing proportional image containment, pointer-to-natural mapping,
 * non-stretching background zoom coordinates, and resolution-honest magnification boundaries.
 */

export interface RenderedRect {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface PreviewBackgroundResult {
  backgroundSize: string;
  backgroundPosition: string;
  bgX: number;
  bgY: number;
  bgWidth: number;
  bgHeight: number;
}

/**
 * Calculates the exact rendered dimensions and offsets for an image rendered with object-fit: contain.
 */
export function getContainRect(
  containerW: number,
  containerH: number,
  naturalW: number,
  naturalH: number
): RenderedRect {
  if (containerW <= 0 || containerH <= 0 || naturalW <= 0 || naturalH <= 0) {
    return { width: 0, height: 0, x: 0, y: 0 };
  }

  const imageAspect = naturalW / naturalH;
  const containerAspect = containerW / containerH;

  if (imageAspect > containerAspect) {
    const width = containerW;
    const height = containerW / imageAspect;
    const x = 0;
    const y = (containerH - height) / 2;
    return { width, height, x, y };
  } else {
    const height = containerH;
    const width = containerH * imageAspect;
    const x = (containerW - width) / 2;
    const y = 0;
    return { width, height, x, y };
  }
}

/**
 * Maps a pointer location (relative to container) to natural pixel coordinates within the image.
 * Returns null if the pointer lies in the container letterbox/pillarbox outside the rendered image rect.
 */
export function pointerToImage(
  px: number,
  py: number,
  rect: RenderedRect,
  naturalW: number,
  naturalH: number
): Point | null {
  if (
    rect.width <= 0 ||
    rect.height <= 0 ||
    naturalW <= 0 ||
    naturalH <= 0 ||
    px < rect.x ||
    px > rect.x + rect.width ||
    py < rect.y ||
    py > rect.y + rect.height
  ) {
    return null;
  }

  const relX = px - rect.x;
  const relY = py - rect.y;
  const scaleX = naturalW / rect.width;
  const scaleY = naturalH / rect.height;

  return {
    x: Math.min(naturalW, Math.max(0, relX * scaleX)),
    y: Math.min(naturalH, Math.max(0, relY * scaleY)),
  };
}

/**
 * Computes maximum honest zoom without digital upscaling (1:1 pixel rendering).
 */
export function maxZoom(naturalW: number, renderedW: number): number {
  if (renderedW <= 0 || naturalW <= 0) return 1;
  return naturalW / renderedW;
}

/**
 * Calculates effective magnification cap, clamped at targetZoom (default 3.5×) or 1:1 natural limit.
 */
export function calculateEffectiveZoom(
  naturalW: number,
  renderedW: number,
  targetZoom = 3.5
): number {
  const cap = maxZoom(naturalW, renderedW);
  return Math.min(targetZoom, Math.max(1, cap));
}

/**
 * Magnification is disabled if the available zoom is less than 1.3× (insufficient detail gain).
 */
export function isMagnificationEnabled(effectiveZoom: number): boolean {
  return effectiveZoom >= 1.3;
}

/**
 * Calculates background-size and background-position for preview windows to avoid aspect distortion
 * and prevent sampling empty space outside the image perimeter.
 */
export function previewBackground(
  pointerInRect: Point,
  rect: RenderedRect,
  zoom: number,
  previewSize: number
): PreviewBackgroundResult {
  const bgWidth = rect.width * zoom;
  const bgHeight = rect.height * zoom;

  // Center the sampled point in the preview viewport
  const rawBgX = -(pointerInRect.x * zoom - previewSize / 2);
  const rawBgY = -(pointerInRect.y * zoom - previewSize / 2);

  let bgX: number;
  if (bgWidth > previewSize) {
    const minX = -(bgWidth - previewSize);
    bgX = Math.min(0, Math.max(minX, rawBgX));
  } else {
    bgX = (previewSize - bgWidth) / 2;
  }

  let bgY: number;
  if (bgHeight > previewSize) {
    const minY = -(bgHeight - previewSize);
    bgY = Math.min(0, Math.max(minY, rawBgY));
  } else {
    bgY = (previewSize - bgHeight) / 2;
  }

  return {
    backgroundSize: `${bgWidth}px ${bgHeight}px`,
    backgroundPosition: `${bgX}px ${bgY}px`,
    bgX,
    bgY,
    bgWidth,
    bgHeight,
  };
}
