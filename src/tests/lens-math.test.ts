import { describe, it, expect } from 'vitest';
import {
  getContainRect,
  pointerToImage,
  maxZoom,
  calculateEffectiveZoom,
  isMagnificationEnabled,
  previewBackground,
} from '../utils/lensMath.ts';

describe('UT-LENS-01: Lens Mathematics & Coordinate Geometry Suite', () => {
  describe('getContainRect', () => {
    it('centers landscape image within portrait/square container (pillarbox)', () => {
      // Container 1000x1000, Landscape image 1536x1024 (aspect 1.5)
      const rect = getContainRect(1000, 1000, 1536, 1024);
      expect(rect.width).toBe(1000);
      expect(rect.height).toBeCloseTo(1000 / 1.5, 2); // 666.67
      expect(rect.x).toBe(0);
      expect(rect.y).toBeCloseTo((1000 - 666.67) / 2, 1); // 166.67
    });

    it('centers portrait image within landscape container (letterbox)', () => {
      // Container 1000x500 (aspect 2.0), Portrait image 1122x1402 (aspect 0.8)
      const rect = getContainRect(1000, 500, 1122, 1402);
      expect(rect.height).toBe(500);
      expect(rect.width).toBeCloseTo(500 * (1122 / 1402), 2); // 400.14
      expect(rect.y).toBe(0);
      expect(rect.x).toBeCloseTo((1000 - 400.14) / 2, 1);
    });

    it('handles zero or negative dimensions safely', () => {
      expect(getContainRect(0, 500, 1536, 1024)).toEqual({ width: 0, height: 0, x: 0, y: 0 });
      expect(getContainRect(500, 0, 1536, 1024)).toEqual({ width: 0, height: 0, x: 0, y: 0 });
      expect(getContainRect(500, 500, 0, 1024)).toEqual({ width: 0, height: 0, x: 0, y: 0 });
    });
  });

  describe('pointerToImage', () => {
    it('returns natural coordinates when pointer is inside contain rect', () => {
      const rect = { width: 800, height: 600, x: 100, y: 50 };
      const naturalW = 1600;
      const naturalH = 1200;

      // Pointer at center of image: px = 100 + 400 = 500, py = 50 + 300 = 350
      const point = pointerToImage(500, 350, rect, naturalW, naturalH);
      expect(point).not.toBeNull();
      expect(point!.x).toBe(800);
      expect(point!.y).toBe(600);
    });

    it('returns null when pointer is outside contain rect (in letterbox/pillarbox padding)', () => {
      const rect = { width: 800, height: 600, x: 100, y: 50 };
      const naturalW = 1600;
      const naturalH = 1200;

      // Pointer in top letterbox
      expect(pointerToImage(500, 20, rect, naturalW, naturalH)).toBeNull();
      // Pointer in left pillarbox
      expect(pointerToImage(50, 350, rect, naturalW, naturalH)).toBeNull();
      // Pointer past right boundary
      expect(pointerToImage(950, 350, rect, naturalW, naturalH)).toBeNull();
    });
  });

  describe('maxZoom and calculateEffectiveZoom', () => {
    it('computes honest maxZoom without digital upscaling', () => {
      expect(maxZoom(3000, 600)).toBe(5.0);
      expect(maxZoom(1536, 1024)).toBe(1.5);
      expect(maxZoom(0, 500)).toBe(1);
    });

    it('caps zoom at 3.5x when high resolution permits', () => {
      // Natural 3000px, Rendered 600px -> maxZoom = 5.0 -> effectiveZoom = 3.5
      expect(calculateEffectiveZoom(3000, 600)).toBe(3.5);
    });

    it('caps zoom at natural resolution when maxZoom is less than 3.5x', () => {
      // Natural 1536px, Rendered 878px -> maxZoom = 1.749 -> effectiveZoom = 1.749
      const zoom = calculateEffectiveZoom(1536, 878);
      expect(zoom).toBeCloseTo(1536 / 878, 3);
      expect(zoom).toBeLessThan(3.5);
    });

    it('disables magnification when effectiveZoom is less than 1.3x', () => {
      const zoom = calculateEffectiveZoom(1000, 900); // 1.11x
      expect(isMagnificationEnabled(zoom)).toBe(false);

      const viableZoom = calculateEffectiveZoom(1536, 1000); // 1.536x
      expect(isMagnificationEnabled(viableZoom)).toBe(true);
    });
  });

  describe('previewBackground', () => {
    it('maintains exact image aspect ratio and clamps offsets within image bounds', () => {
      const rect = { width: 800, height: 600, x: 0, y: 0 };
      const zoom = 2.0;
      const previewSize = 400; // 400x400 square preview pane

      // Sample at corner (0, 0)
      const resCorner = previewBackground({ x: 0, y: 0 }, rect, zoom, previewSize);
      expect(resCorner.backgroundSize).toBe('1600px 1200px');
      expect(resCorner.bgX).toBe(0); // Clamped so no white space on left
      expect(resCorner.bgY).toBe(0); // Clamped so no white space on top

      // Sample at center (400, 300)
      const resCenter = previewBackground({ x: 400, y: 300 }, rect, zoom, previewSize);
      // Expected raw center offset: -(400 * 2 - 200) = -600
      expect(resCenter.bgX).toBe(-600);
      // Expected raw center offset: -(300 * 2 - 200) = -400
      expect(resCenter.bgY).toBe(-400);

      // Sample at far bottom-right (800, 600)
      const resFar = previewBackground({ x: 800, y: 600 }, rect, zoom, previewSize);
      // minX = -(1600 - 400) = -1200
      expect(resFar.bgX).toBe(-1200);
      // minY = -(1200 - 400) = -800
      expect(resFar.bgY).toBe(-800);
    });

    it('positions reticle precisely at center when in interior, and tracks to edges/corners at boundaries', () => {
      const rect = { width: 800, height: 600, x: 0, y: 0 };
      const zoom = 2.0;
      const previewSize = 200; // 200x200 circular loupe

      // Interior center: (400, 300)
      const resCenter = previewBackground({ x: 400, y: 300 }, rect, zoom, previewSize);
      expect(resCenter.reticleX).toBe(100); // 200 / 2
      expect(resCenter.reticleY).toBe(100); // 200 / 2

      // Left edge: (0, 300)
      const resLeft = previewBackground({ x: 0, y: 300 }, rect, zoom, previewSize);
      expect(resLeft.bgX).toBe(0);
      expect(resLeft.reticleX).toBe(3); // guarded edge margin
      expect(resLeft.reticleY).toBe(100);

      // Right edge: (800, 300)
      const resRight = previewBackground({ x: 800, y: 300 }, rect, zoom, previewSize);
      expect(resRight.bgX).toBe(-(800 * 2 - 200)); // -1400
      expect(resRight.reticleX).toBe(197); // 200 - 3 margin
      expect(resRight.reticleY).toBe(100);

      // Top edge: (400, 0)
      const resTop = previewBackground({ x: 400, y: 0 }, rect, zoom, previewSize);
      expect(resTop.bgY).toBe(0);
      expect(resTop.reticleX).toBe(100);
      expect(resTop.reticleY).toBe(3);

      // Bottom edge: (400, 600)
      const resBottom = previewBackground({ x: 400, y: 600 }, rect, zoom, previewSize);
      expect(resBottom.bgY).toBe(-(600 * 2 - 200)); // -1000
      expect(resBottom.reticleX).toBe(100);
      expect(resBottom.reticleY).toBe(197);

      // All 4 corners
      const resTL = previewBackground({ x: 0, y: 0 }, rect, zoom, previewSize);
      expect(resTL.reticleX).toBe(3);
      expect(resTL.reticleY).toBe(3);

      const resTR = previewBackground({ x: 800, y: 0 }, rect, zoom, previewSize);
      expect(resTR.reticleX).toBe(197);
      expect(resTR.reticleY).toBe(3);

      const resBL = previewBackground({ x: 0, y: 600 }, rect, zoom, previewSize);
      expect(resBL.reticleX).toBe(3);
      expect(resBL.reticleY).toBe(197);

      const resBR = previewBackground({ x: 800, y: 600 }, rect, zoom, previewSize);
      expect(resBR.reticleX).toBe(197);
      expect(resBR.reticleY).toBe(197);
    });

    it('accurately handles portrait and square images under object-fit contain without distortion', () => {
      // Portrait image (1024x1536) in 878x522 container -> contain rect: w=348, h=522
      const portraitRect = { width: 348, height: 522, x: 265, y: 0 };
      const zoom = 2.5;
      const previewSize = 200;

      const center = previewBackground({ x: 174, y: 261 }, portraitRect, zoom, previewSize);
      expect(center.reticleX).toBe(100);
      expect(center.reticleY).toBe(100);

      // Sample portrait bottom edge
      const bottom = previewBackground({ x: 174, y: 522 }, portraitRect, zoom, previewSize);
      expect(bottom.reticleX).toBe(100);
      expect(bottom.reticleY).toBe(197);
      expect(bottom.bgY).toBe(-(522 * 2.5 - 200)); // -1105
    });

    it('clamps loupe center so the physical glass stays entirely within rendered image bounds', () => {
      const rect = { width: 800, height: 600, x: 0, y: 0 };
      const zoom = 3.5;
      const previewSize = 240; // radius = 120

      // Near top-left corner
      const tl = previewBackground({ x: 10, y: 20 }, rect, zoom, previewSize);
      expect(tl.loupeCenterX).toBe(120); // Clamped to radius
      expect(tl.loupeCenterY).toBe(120);

      // Near bottom-right corner
      const br = previewBackground({ x: 790, y: 590 }, rect, zoom, previewSize);
      expect(br.loupeCenterX).toBe(680); // 800 - 120
      expect(br.loupeCenterY).toBe(480); // 600 - 120

      // In interior
      const mid = previewBackground({ x: 350, y: 400 }, rect, zoom, previewSize);
      expect(mid.loupeCenterX).toBe(350);
      expect(mid.loupeCenterY).toBe(400);
    });
  });
});
