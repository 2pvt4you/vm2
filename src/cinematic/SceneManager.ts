/**
 * SceneManager.ts
 * Coordinates multiple scenes based on global scroll progress.
 * Manages handoffs, transition boundaries, and triggers life-cycle hooks (enter, update, exit)
 * for each registered scene, making it simple to append future 3D/Canvas modules.
 */

export interface CinematicScene {
  id: string;
  startProgress: number; // 0 to 1 range
  endProgress: number;   // 0 to 1 range
  onEnter?: () => void;
  onUpdate: (localProgress: number, globalProgress: number) => void;
  onExit?: () => void;
}

export class SceneManager {
  private scenes: CinematicScene[] = [];
  private activeSceneIds: Set<string> = new Set();
  private lastGlobalProgress = -1;

  /**
   * Registers a scene into the scroll engine.
   */
  public addScene(scene: CinematicScene): void {
    this.scenes.push(scene);
    // Keep scenes sorted by startProgress for optimal evaluation
    this.scenes.sort((a, b) => a.startProgress - b.startProgress);
  }

  /**
   * Updates all scenes based on the global scroll progress fraction (0 to 1).
   */
  public update(globalProgress: number): void {
    if (globalProgress === this.lastGlobalProgress) return;
    this.lastGlobalProgress = globalProgress;

    for (const scene of this.scenes) {
      const isActive = globalProgress >= scene.startProgress && globalProgress <= scene.endProgress;
      
      // Compute localized progress for this scene specifically (mapped 0 to 1)
      const range = scene.endProgress - scene.startProgress;
      const localProgress = range > 0 
        ? Math.max(0, Math.min(1, (globalProgress - scene.startProgress) / range))
        : globalProgress >= scene.startProgress ? 1 : 0;

      if (isActive) {
        if (!this.activeSceneIds.has(scene.id)) {
          this.activeSceneIds.add(scene.id);
          if (scene.onEnter) scene.onEnter();
        }
        scene.onUpdate(localProgress, globalProgress);
      } else {
        if (this.activeSceneIds.has(scene.id)) {
          this.activeSceneIds.delete(scene.id);
          if (scene.onExit) scene.onExit();
          
          // Force edge completion updates on exit to prevent rounding issues
          if (globalProgress < scene.startProgress) {
            scene.onUpdate(0, globalProgress);
          } else if (globalProgress > scene.endProgress) {
            scene.onUpdate(1, globalProgress);
          }
        }
      }
    }
  }

  public getScenes(): CinematicScene[] {
    return this.scenes;
  }

  public clear(): void {
    this.scenes = [];
    this.activeSceneIds.clear();
    this.lastGlobalProgress = -1;
  }
}
