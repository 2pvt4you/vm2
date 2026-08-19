/**
 * ScrollController.ts
 * Manages zero-reflow, high-performance scroll tracking.
 * Reads element dimensions once during initialization and caches them on resize/orientation changes.
 * Avoids getBoundingClientRect inside scroll handlers to completely prevent layout thrashing.
 */

export interface ScrollControllerConfig {
  container: HTMLDivElement;
  onScroll?: (progress: number) => void;
}

export class ScrollController {
  private container: HTMLDivElement;
  private onScrollCallback?: (progress: number) => void;

  private cachedScrollHeight = 0;
  private cachedTopOffset = 0;
  private currentProgress = 0;

  constructor(config: ScrollControllerConfig) {
    this.container = config.container;
    this.onScrollCallback = config.onScroll;
    
    this.recalculateDimensions();
    this.setupListeners();
  }

  /**
   * Caches positions and dimensions to prevent layout reads during frame rendering.
   */
  public recalculateDimensions = (): void => {
    if (!this.container) return;

    const viewportHeight = window.innerHeight;
    const rect = this.container.getBoundingClientRect();
    
    // Absolute position of the container relative to document top
    this.cachedTopOffset = rect.top + window.scrollY;
    
    // Scrollable range is container's height minus the viewport height
    this.cachedScrollHeight = rect.height - viewportHeight;

    // Immediately trigger progress update based on current page scroll
    this.updateProgress();
  };

  private setupListeners(): void {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.recalculateDimensions, { passive: true });
    window.addEventListener('orientationchange', this.recalculateDimensions, { passive: true });
  }

  private handleScroll = (): void => {
    this.updateProgress();
  };

  private updateProgress(): void {
    if (this.cachedScrollHeight <= 0) return;

    const scrollY = window.scrollY;
    
    // Calculate how far we've scrolled inside the container's scrollable range
    const relativeScroll = scrollY - this.cachedTopOffset;
    
    // Normalize to [0, 1]
    const progress = Math.max(0, Math.min(1, relativeScroll / this.cachedScrollHeight));
    
    this.currentProgress = progress;

    if (this.onScrollCallback) {
      this.onScrollCallback(progress);
    }
  }

  public getProgress(): number {
    return this.currentProgress;
  }

  public destroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.recalculateDimensions);
    window.removeEventListener('orientationchange', this.recalculateDimensions);
  }
}
