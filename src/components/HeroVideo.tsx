import React, { useState, useEffect, useRef } from 'react';
import { AssetLoader } from '../cinematic/AssetLoader';
import { ScrollController } from '../cinematic/ScrollController';
import { SceneManager } from '../cinematic/SceneManager';
import { CanvasRenderer } from '../cinematic/CanvasRenderer';
import ScrollToBeginHeader from './ScrollToBeginHeader';

const newFrames0Glob = import.meta.glob('../newframes/frames0/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
const newFF1Glob = import.meta.glob('../newframes/ff1/*.webp', { eager: true, import: 'default' }) as Record<string, string>;

const frameMap: Record<string, string> = {};

Object.entries(newFrames0Glob).forEach(([path, url]) => {
  const filename = path.split('/').pop();
  if (filename) frameMap[filename] = url;
});

Object.entries(newFF1Glob).forEach(([path, url]) => {
  const filename = path.split('/').pop();
  if (filename) frameMap[filename] = url;
});

interface HeroVideoProps {
  setActiveTab?: (tab: 'home' | 'about' | 'products' | 'approvals' | 'clients' | 'contact') => void;
  onVideoLoaded?: () => void;
  onAnimationFinishedChange?: (finished: boolean) => void;
}

export default function HeroVideo({ setActiveTab, onVideoLoaded, onAnimationFinishedChange }: HeroVideoProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [priorityLoaded, setPriorityLoaded] = useState(false);
  const [fadeLoader, setFadeLoader] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Engine references to prevent re-instantiation on React re-renders
  const assetLoaderRef = useRef<AssetLoader | null>(null);
  const scrollControllerRef = useRef<ScrollController | null>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const canvasRendererRef = useRef<CanvasRenderer | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Instantiate the Asset Loader for total frames (185 frames0 + 150 ff1 = 335 frames total)
    const SET1_FRAMES = 185;
    const SET2_FRAMES = 150;
    const totalFrames = SET1_FRAMES + SET2_FRAMES; // 335 total frames

    const loader = new AssetLoader({
      totalFrames,
      framePathPattern: (index) => {
        if (index <= SET1_FRAMES) {
          const paddedIndex = String(index).padStart(4, '0');
          const filename = `frame_${paddedIndex}.webp`;
          return frameMap[filename] || '';
        } else {
          const ff1Index = index - SET1_FRAMES;
          const paddedFf1Index = String(ff1Index).padStart(4, '0');
          const filename = `ff2_${paddedFf1Index}.webp`;
          return frameMap[filename] || '';
        }
      },
      priorityInterval: 4, // Preloads every 4th frame first for instant scrub availability
      onProgress: (loaded, total, percent) => {
        setLoadingProgress(percent);
      },
      onPriorityComplete: () => {
        setPriorityLoaded(true);
        // Clean fade out animation for loading screen
        setTimeout(() => {
          setFadeLoader(true);
          setTimeout(() => {
            onVideoLoaded?.();
          }, 800);
        }, 300);
      },
    });
    assetLoaderRef.current = loader;

    // 2. Instantiate the Canvas Renderer
    const renderer = new CanvasRenderer({
      canvas,
      totalFrames,
      getImage: (index) => loader.getImage(index),
    });
    canvasRendererRef.current = renderer;

    // 3. Instantiate the Scene Manager
    const sceneManager = new SceneManager();
    sceneManagerRef.current = sceneManager;

    // Register Scene 01: Core factory image sequence
    sceneManager.addScene({
      id: 'factory-sequence',
      startProgress: 0,
      endProgress: 1.0,
      onEnter: () => {
        // Triggered when scroll entering the scene boundary
      },
      onUpdate: (localProgress) => {
        // Feed the localized scene progress directly to the lerped canvas renderer
        renderer.setProgress(localProgress);
      },
      onExit: () => {
        // Triggered when exiting the scene boundary
      }
    });

    // 4. Instantiate the Scroll Controller to drive the Scene Manager
    const handleProgressUpdate = (progress: number) => {
      setScrollProgress(progress);
      const finished = progress >= 0.92;
      onAnimationFinishedChange?.(finished);
    };

    const scrollController = new ScrollController({
      container,
      onScroll: (progress) => {
        sceneManager.update(progress);
        handleProgressUpdate(progress);
      },
    });
    scrollControllerRef.current = scrollController;

    // Start fetching frame assets
    loader.startLoading();

    // Trigger initial drawing matching scroll offset once priority is done
    const checkPriority = setInterval(() => {
      if (loader.isPriorityDone()) {
        const initialProg = scrollController.getProgress();
        renderer.snapToProgress(initialProg);
        sceneManager.update(initialProg);
        handleProgressUpdate(initialProg);
        clearInterval(checkPriority);
      }
    }, 50);

    // Clean up all core engine cycles on unmount
    return () => {
      clearInterval(checkPriority);
      loader.destroy();
      renderer.destroy();
      scrollController.destroy();
      sceneManager.clear();
    };
  }, [onVideoLoaded]);

  // The film itself travels LIGHT → INDUSTRIAL DARK → FIRE → FLASH.
  // Mirror that onto the global theme once the foundry interior begins.
  useEffect(() => {
    document.documentElement.dataset.uiTheme =
      scrollProgress > 0.52 ? 'dark' : 'light';
  }, [scrollProgress > 0.52]);

  return (
    <div
      ref={containerRef}
      id="hero-cinematic-scroll-container"
      data-theme={scrollProgress > 0.52 ? 'dark' : 'light'}
      className="relative w-full h-[360vh] bg-graphite-2"
    >
      {/*
        Editorial preloader — graphite end-card until priority frames exist.
      */}
      {!fadeLoader && (
        <div
          className={`fixed inset-0 bg-graphite-2 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700 ease-out ${
            priorityLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="flex flex-col items-center gap-7 max-w-sm px-6 text-center">
            {/* Slow rotating industrial ring */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-ivory/15" />
              <div
                className="absolute inset-0 rounded-full border border-transparent border-t-copper vm-spin-slow"
              />
              <div className="w-1.5 h-1.5 rotate-45 bg-champagne" />
            </div>

            <div className="space-y-3">
              <h3 className="font-sans font-bold text-ivory text-[13px] tracking-[0.32em] uppercase">
                Varaha Metaliks
              </h3>
              <p className="label-tech text-steel">
                Initializing Cinematic Scrub Engine
              </p>
            </div>

            {/* Percentage + hairline load rule */}
            <div className="w-56">
              <div className="flex items-baseline justify-center mb-3">
                <span className="font-display text-3xl font-light text-champagne tabular-nums">
                  {loadingProgress}
                  <span className="text-base text-steel">%</span>
                </span>
              </div>
              <div className="h-px bg-ivory/10 overflow-hidden">
                <div
                  className="h-full bg-copper transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
        STICKY VIEWPORT CANVAS 
        Stays fixed on screen throughout the scroll space.
      */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Scroll-To-Begin Header Overlay */}
        <ScrollToBeginHeader scrollProgress={scrollProgress} />

        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover z-10"
        />

        {/* 
          3D GRAPHICS EXTENSION PORT
        */}
        <div 
          id="hero-3d-scene-port" 
          className="absolute inset-0 z-30 pointer-events-none" 
        />
      </div>
    </div>
  );
}
