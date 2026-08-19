/**
 * CanvasRenderer.ts
 * Implements high-performance, ultra-smooth rendering onto a HTMLCanvasElement using Three.js.
 * Features:
 * - Linear interpolation (lerp) for buttery scroll feel (Apple product style).
 * - High-DPI support (Retina scaling) using devicePixelRatio.
 * - Perfect responsive "object-fit: cover" centering algorithm inside WebGL.
 * - Decoupled rendering loop running at screen refresh rate (60Hz to 120Hz+).
 */

import * as THREE from 'three';

export interface CanvasRendererConfig {
  canvas: HTMLCanvasElement;
  totalFrames: number;
  getImage: (index: number) => HTMLImageElement | null;
  onFrameRendered?: (frameIndex: number) => void;
}

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private material: THREE.MeshBasicMaterial;
  private mesh: THREE.Mesh;
  private totalFrames: number;
  private getImage: (index: number) => HTMLImageElement | null;
  private onFrameRenderedCallback?: (frameIndex: number) => void;

  private textureCache: Map<HTMLImageElement, THREE.Texture> = new Map();

  // Easing & Animation progress tracking
  private targetProgress = 0;
  private currentProgress = 0;
  private lastRenderedProgress = -1;
  private isRunning = false;
  private rafId: number | null = null;

  constructor(config: CanvasRendererConfig) {
    this.canvas = config.canvas;
    this.totalFrames = config.totalFrames;
    this.getImage = config.getImage;
    this.onFrameRenderedCallback = config.onFrameRendered;

    // 1. Initialize Three.js WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    
    // Configure renderer
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);

    // 2. Initialize Scene & Orthographic Camera (makes full-screen plane rendering simple)
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 3. Create material & full-screen Plane Mesh
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      toneMapped: false,
    });
    
    const geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);

    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  /**
   * Sets the target scroll progress fraction (0 to 1).
   * The renderer will smoothly ease/interpolate towards this target.
   */
  public setProgress(progress: number): void {
    this.targetProgress = Math.max(0, Math.min(1, progress));
    
    // Start rendering loop if not already running
    if (!this.isRunning) {
      this.isRunning = true;
      this.tick();
    }
  }

  /**
   * Instant snap to a specific progress (e.g. on load) without easing.
   */
  public snapToProgress(progress: number): void {
    const validProgress = Math.max(0, Math.min(1, progress));
    this.targetProgress = validProgress;
    this.currentProgress = validProgress;
    this.renderCurrentFrame();
  }

  private handleResize = (): void => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.renderCurrentFrame();
  };

  /**
   * Linear Interpolation (lerp) ticker function.
   */
  private tick = (): void => {
    if (!this.isRunning) return;

    // Apple-style smooth easing alpha (reduced by 20% for buttery, fluid scroll dampening)
    const lerpAlpha = 0.068;
    const delta = this.targetProgress - this.currentProgress;

    // Update current progress smoothly
    if (Math.abs(delta) > 0.0001) {
      this.currentProgress += delta * lerpAlpha;
    } else {
      this.currentProgress = this.targetProgress;
      this.isRunning = false; // Pause rendering loop if we have caught up completely
    }

    this.renderCurrentFrame();

    if (this.isRunning) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };

  /**
   * Logic to draw the image frame corresponding to the current scroll fraction.
   */
  private renderCurrentFrame(): void {
    // Convert 0-1 progress to 1-based frame index
    const frameIndex = Math.max(1, Math.min(this.totalFrames, Math.round(this.currentProgress * (this.totalFrames - 1)) + 1));
    
    const img = this.getImage(frameIndex);
    if (!img || !img.complete) return;

    // Avoid drawing if frame matches the previously drawn one to keep GPU activity minimal
    if (this.currentProgress === this.lastRenderedProgress && frameIndex === Math.round(this.lastRenderedProgress * (this.totalFrames - 1)) + 1) {
      return;
    }

    this.lastRenderedProgress = this.currentProgress;

    // Get or create cached texture
    let texture = this.textureCache.get(img);
    if (!texture) {
      texture = new THREE.Texture(img);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      this.textureCache.set(img, texture);
    }

    // CSS object-fit: cover replication in Three.js
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const imgWidth = img.width;
    const imgHeight = img.height;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    if (canvasRatio > imgRatio) {
      // Canvas is wider than image aspect ratio (crop vertical top/bottom)
      texture.repeat.set(1, imgRatio / canvasRatio);
      texture.offset.set(0, (1 - imgRatio / canvasRatio) / 2);
    } else {
      // Canvas is narrower than image aspect ratio (crop horizontal left/right)
      texture.repeat.set(canvasRatio / imgRatio, 1);
      texture.offset.set((1 - canvasRatio / imgRatio) / 2, 0);
    }

    // Set texture as map and render
    this.material.map = texture;
    this.material.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);

    if (this.onFrameRenderedCallback) {
      this.onFrameRenderedCallback(frameIndex);
    }
  }

  public getProgress(): number {
    return this.currentProgress;
  }

  public destroy(): void {
    this.isRunning = false;
    window.removeEventListener('resize', this.handleResize);
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    // Dispose Three.js objects
    this.mesh.geometry.dispose();
    this.material.dispose();
    
    this.textureCache.forEach((texture) => {
      texture.dispose();
    });
    this.textureCache.clear();
    
    this.renderer.dispose();
  }
}
