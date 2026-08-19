/**
 * AssetLoader.ts
 * Manages premium priority and progressive loading of WebP frames.
 * Keeps memory overhead minimal, tracks load percentages, and provides 
 * seamless nearest-frame fallback to prevent visual gaps during fast scrolling.
 */

export interface AssetLoaderConfig {
  totalFrames: number;
  framePathPattern: (index: number) => string;
  priorityInterval?: number; // Load every Nth frame first (e.g., 5)
  onPriorityComplete?: () => void;
  onProgress?: (loadedCount: number, totalCount: number, progressPercent: number) => void;
  onAllComplete?: () => void;
}

export class AssetLoader {
  private config: AssetLoaderConfig;
  private imageCache: Map<number, HTMLImageElement> = new Map();
  private loadedIndices: Set<number> = new Set();
  private isPriorityLoaded = false;
  private isFullyLoaded = false;

  constructor(config: AssetLoaderConfig) {
    this.config = {
      priorityInterval: 4, // Default to loading every 4th frame for instant preview coverage
      ...config,
    };
  }

  /**
   * Starts the multi-stage progressive preloading system.
   */
  public startLoading(): void {
    const total = this.config.totalFrames;
    const interval = this.config.priorityInterval || 4;

    // Phase 1: Determine Priority Indices (evenly spaced across the timeline)
    const priorityIndices: number[] = [];
    // Ensure frame 1 and the final frame are always prioritized
    priorityIndices.push(1);
    
    for (let i = 2; i < total; i++) {
      if ((i - 1) % interval === 0) {
        priorityIndices.push(i);
      }
    }
    if (!priorityIndices.includes(total)) {
      priorityIndices.push(total);
    }

    // Phase 2: Load priority frames first
    let priorityLoadedCount = 0;
    const totalPriority = priorityIndices.length;

    const loadPriorityFrame = (index: number) => {
      const img = new Image();
      img.onload = () => {
        this.imageCache.set(index, img);
        this.loadedIndices.add(index);
        priorityLoadedCount++;

        this.triggerProgress();

        if (priorityLoadedCount === totalPriority && !this.isPriorityLoaded) {
          this.isPriorityLoaded = true;
          if (this.config.onPriorityComplete) {
            this.config.onPriorityComplete();
          }
          // Proceed to Phase 3: Load all remaining frames progressively in the background
          this.loadRemainingFrames(priorityIndices);
        }
      };

      img.onerror = () => {
        console.warn(`Failed to preload priority frame ${index}`);
        priorityLoadedCount++;
        if (priorityLoadedCount === totalPriority && !this.isPriorityLoaded) {
          this.isPriorityLoaded = true;
          if (this.config.onPriorityComplete) {
            this.config.onPriorityComplete();
          }
          this.loadRemainingFrames(priorityIndices);
        }
      };

      img.src = this.config.framePathPattern(index);
    };

    priorityIndices.forEach(index => loadPriorityFrame(index));
  }

  /**
   * Phase 3: Background thread simulation to cache all remaining frames.
   */
  private loadRemainingFrames(priorityIndices: number[]): void {
    const total = this.config.totalFrames;
    const prioritySet = new Set(priorityIndices);
    const remainingIndices: number[] = [];

    for (let i = 1; i <= total; i++) {
      if (!prioritySet.has(i)) {
        remainingIndices.push(i);
      }
    }

    let remainingLoadedCount = 0;
    const totalRemaining = remainingIndices.length;

    if (totalRemaining === 0) {
      this.isFullyLoaded = true;
      if (this.config.onAllComplete) {
        this.config.onAllComplete();
      }
      return;
    }

    // Process remaining frames sequentially/batched in chunks of 4 to prevent network throttling
    const chunkSize = 4;
    let nextIndexToLoad = 0;

    const loadNextChunk = () => {
      const end = Math.min(nextIndexToLoad + chunkSize, totalRemaining);
      let chunkCompleted = 0;
      const currentChunkSize = end - nextIndexToLoad;

      if (currentChunkSize <= 0) {
        this.isFullyLoaded = true;
        if (this.config.onAllComplete) {
          this.config.onAllComplete();
        }
        return;
      }

      for (let i = nextIndexToLoad; i < end; i++) {
        const index = remainingIndices[i];
        const img = new Image();

        img.onload = () => {
          this.imageCache.set(index, img);
          this.loadedIndices.add(index);
          remainingLoadedCount++;
          chunkCompleted++;

          this.triggerProgress();

          if (chunkCompleted === currentChunkSize) {
            nextIndexToLoad += currentChunkSize;
            // Delay next chunk slightly to yield to main UI thread
            setTimeout(loadNextChunk, 16);
          }
        };

        img.onerror = () => {
          chunkCompleted++;
          remainingLoadedCount++;
          if (chunkCompleted === currentChunkSize) {
            nextIndexToLoad += currentChunkSize;
            setTimeout(loadNextChunk, 16);
          }
        };

        img.src = this.config.framePathPattern(index);
      }
    };

    loadNextChunk();
  }

  /**
   * Helper to dispatch aggregate progress to callbacks
   */
  private triggerProgress(): void {
    const loaded = this.loadedIndices.size;
    const total = this.config.totalFrames;
    const percent = Math.round((loaded / total) * 100);

    if (this.config.onProgress) {
      this.config.onProgress(loaded, total, percent);
    }
  }

  /**
   * Retrieval API with Nearest-Frame fallback mechanism.
   * If a frame at the exact index has not loaded yet, find the closest available cached frame.
   */
  public getImage(index: number): HTMLImageElement | null {
    const exact = this.imageCache.get(index);
    if (exact) return exact;

    if (this.loadedIndices.size === 0) return null;

    // Binary search/scan to find nearest loaded index
    let nearestIndex = 1;
    let minDiff = Infinity;

    for (const loadedIdx of this.loadedIndices) {
      const diff = Math.abs(loadedIdx - index);
      if (diff < minDiff) {
        minDiff = diff;
        nearestIndex = loadedIdx;
      }
    }

    return this.imageCache.get(nearestIndex) || null;
  }

  public getLoadedCount(): number {
    return this.loadedIndices.size;
  }

  public getProgressPercent(): number {
    return Math.round((this.loadedIndices.size / this.config.totalFrames) * 100);
  }

  public isPriorityDone(): boolean {
    return this.isPriorityLoaded;
  }

  public isDone(): boolean {
    return this.isFullyLoaded;
  }

  public destroy(): void {
    this.imageCache.clear();
    this.loadedIndices.clear();
  }
}
