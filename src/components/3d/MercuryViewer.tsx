import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCw, RefreshCcw, Move3d } from 'lucide-react';
import { useDeviceProfile, useInViewport } from '../../hooks/useDeviceProfile';

interface MercuryViewerProps {
  modelUrl?: string;
  productName?: string;
  className?: string;
}

/* ==========================================================================
   MATERIALS
   The sand-cast normal map is generated per-pixel, which is the single most
   expensive thing this component does at start-up. It is cached at module
   scope (one texture is shared by every viewer instance and every model) and
   generated at a smaller resolution on constrained devices.
   ========================================================================== */

let cachedNormalMap: THREE.CanvasTexture | null = null;
let cachedNormalMapSize = 0;

function getDuctileIronNormalTexture(size: number): THREE.CanvasTexture | null {
  if (cachedNormalMap && cachedNormalMapSize >= size) return cachedNormalMap;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const n1 = (Math.random() * 2 - 1) * 0.42;
      const n2 = Math.sin(x * 0.35) * Math.cos(y * 0.35) * 0.22;
      const val = n1 + n2;

      data[idx] = Math.min(255, Math.max(0, Math.floor((val * 0.35 + 0.5) * 255)));
      data[idx + 1] = Math.min(
        255,
        Math.max(0, Math.floor(((Math.random() * 2 - 1) * 0.3 + 0.5) * 255))
      );
      data[idx + 2] = 215;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 24);

  cachedNormalMap?.dispose();
  cachedNormalMap = texture;
  cachedNormalMapSize = size;

  return texture;
}

/** Foundry-grade ductile iron — dark graphite charcoal, sand-cast roughness. */
function createDiMaterial(normalMap: THREE.Texture | null): THREE.MeshPhysicalMaterial {
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x34383a),
    metalness: 0.85,
    roughness: 0.62,
    envMapIntensity: 0.65,
    ior: 7.9,
    reflectivity: 0.55,
    clearcoat: 0.04,
    clearcoatRoughness: 0.6,
    side: THREE.DoubleSide,
  });

  if (normalMap) {
    mat.normalMap = normalMap;
    mat.normalScale = new THREE.Vector2(0.18, 0.18);
  }

  return mat;
}

/** Frees every geometry and material under an object, then detaches it. */
function disposeSubtree(root: THREE.Object3D) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) material.forEach((m) => m.dispose());
    else material?.dispose();
  });
  root.removeFromParent();
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type SwapPhase = 'idle' | 'out' | 'in';

export default function MercuryViewer({
  modelUrl = '/glbmodel/a_v.glb',
  productName = 'Product Model',
  className = '',
}: MercuryViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [retryToken, setRetryToken] = useState(0);

  const { isTouch, isLowPower, dprCap, prefersReducedMotion } = useDeviceProfile();
  const inView = useInViewport(hostRef, '250px');

  // --- three.js handles (refs only: none of this should re-render React) ---
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const envTextureRef = useRef<THREE.Texture | null>(null);
  const frameRef = useRef<number | null>(null);
  const clockRef = useRef(new THREE.Clock());

  const isInteractingRef = useRef(false);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeUrlRef = useRef(modelUrl);

  // Live values the render loop reads without being re-created.
  const autoRotateRef = useRef(true);
  const runningRef = useRef(true);
  const reducedMotionRef = useRef(false);

  // Model swap animation state.
  const swapRef = useRef<{ phase: SwapPhase; t: number }>({ phase: 'idle', t: 1 });
  const pendingLoadRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    autoRotateRef.current = autoRotate && !prefersReducedMotion;
  }, [autoRotate, prefersReducedMotion]);

  useEffect(() => {
    reducedMotionRef.current = prefersReducedMotion;
  }, [prefersReducedMotion]);

  const cameraDistance = useCallback(
    () => (window.innerWidth < 768 ? 5.0 : 4.0),
    []
  );

  /* ======================================================================
     SCENE — created once
     ====================================================================== */
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 1000);
    camera.position.set(0, 0.45, width < 768 ? 5.0 : 4.0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      // Antialiasing is the wrong trade on fill-rate limited devices; the
      // pixel-ratio cap does more for perceived quality there.
      antialias: !isLowPower,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = isLowPower
      ? THREE.PCFShadowMap
      : THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    // Environment
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTexture = pmrem.fromScene(roomEnv).texture;
    scene.environment = envTexture;
    envTextureRef.current = envTexture;
    roomEnv.dispose();
    pmrem.dispose();

    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    /* ---------------- Lighting ---------------- */
    scene.add(new THREE.AmbientLight(0xffffff, 1.6));

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 1.15);
    keyLight.position.set(-5, 7, 4);
    keyLight.castShadow = true;
    const shadowSize = isLowPower ? 1024 : 2048;
    keyLight.shadow.mapSize.width = shadowSize;
    keyLight.shadow.mapSize.height = shadowSize;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdce8f2, 0.28);
    fillLight.position.set(-6, 3, -4);
    scene.add(fillLight);

    const topLight = new THREE.DirectionalLight(0xffe9cf, 0.42);
    topLight.position.set(0, 8, 1);
    scene.add(topLight);

    const rimLight = new THREE.PointLight(0xffb45c, 2.0, 8, 2);
    rimLight.position.set(-2.5, 2.5, -3.5);
    scene.add(rimLight);

    // Two extra shaping lights are dropped on constrained devices — they are
    // the least visible and the most expensive per fragment.
    if (!isLowPower) {
      const edgeLight = new THREE.DirectionalLight(0xffc875, 0.65);
      edgeLight.position.set(-3, 4, -6);
      scene.add(edgeLight);

      const frontFill = new THREE.PointLight(0xffffff, 0.7, 7, 2);
      frontFill.position.set(2, 1, 4);
      scene.add(frontFill);
    }

    /* ---------------- Controls ---------------- */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 6.5;
    controls.minDistance = 1.4;
    controls.autoRotate = false;
    controls.enablePan = false;
    controls.enableZoom = !isTouch;
    controls.target.set(0, 0.12, 0);

    // Touch is enabled (it used to be switched off below 768px). One finger
    // rotates; because touch-action stays `pan-y`, a vertical drag is still
    // handed to the page so the model can never trap the scroll.
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_ROTATE,
    };
    renderer.domElement.style.touchAction = 'pan-y';

    const onInteractStart = () => {
      isInteractingRef.current = true;
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };

    const onInteractEnd = () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        isInteractingRef.current = false;
      }, 1500);
    };

    controls.addEventListener('start', onInteractStart);
    controls.addEventListener('end', onInteractEnd);
    controlsRef.current = controls;

    /* ---------------- Model group + shadow catcher ---------------- */
    const modelGroup = new THREE.Group();
    modelGroup.position.y = -0.28;
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    const shadowFloorGeo = new THREE.PlaneGeometry(4, 4);
    const shadowFloorMat = new THREE.ShadowMaterial({
      color: 0x000000,
      opacity: 0.22,
    });
    const shadowFloor = new THREE.Mesh(shadowFloorGeo, shadowFloorMat);
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -0.95;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    /* ---------------- Render loop ---------------- */
    const clock = clockRef.current;

    const renderFrame = () => {
      frameRef.current = requestAnimationFrame(renderFrame);

      // Suspended while off-screen or on a hidden tab: no GPU work at all.
      if (!runningRef.current) return;

      const delta = Math.min(clock.getDelta(), 0.05);
      const group = modelGroupRef.current;
      const swap = swapRef.current;

      // --- model swap choreography ---
      if (group && swap.phase !== 'idle') {
        const speed = swap.phase === 'out' ? 4.2 : 2.6;
        swap.t = Math.min(1, swap.t + delta * speed);
        const e = easeOutCubic(swap.t);

        if (swap.phase === 'out') {
          const k = 1 - e;
          group.scale.setScalar(0.86 + 0.14 * k);
          setGroupOpacity(group, k);

          if (swap.t >= 1) {
            swap.phase = 'idle';
            const run = pendingLoadRef.current;
            pendingLoadRef.current = null;
            run?.();
          }
        } else {
          group.scale.setScalar(0.9 + 0.1 * e);
          setGroupOpacity(group, e);
          if (swap.t >= 1) {
            swap.phase = 'idle';
            group.scale.setScalar(1);
            setGroupOpacity(group, 1, true);
          }
        }
      }

      if (
        group &&
        swap.phase === 'idle' &&
        !isInteractingRef.current &&
        autoRotateRef.current
      ) {
        // Frame-rate independent turntable.
        group.rotation.y += delta * 0.24;
      }

      controlsRef.current?.update();
      renderer.render(scene, camera);
    };

    renderFrame();

    /* ---------------- Resize ---------------- */
    let resizeFrame = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w <= 0 || h <= 0) return;
        camera.aspect = w / h;
        // Keep the framing honest when the composition changes breakpoint
        // or the phone rotates.
        camera.position.z = w < 768 ? 5.0 : 4.0;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
      });
    });
    resizeObserver.observe(container);

    /* ---------------- Cleanup ---------------- */
    return () => {
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

      controls.removeEventListener('start', onInteractStart);
      controls.removeEventListener('end', onInteractEnd);
      controls.dispose();

      while (modelGroup.children.length) disposeSubtree(modelGroup.children[0]);

      shadowFloorGeo.dispose();
      shadowFloorMat.dispose();
      envTextureRef.current?.dispose();
      envTextureRef.current = null;
      scene.environment = null;

      renderer.domElement.remove();
      renderer.dispose();
      renderer.forceContextLoss();

      sceneRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      modelGroupRef.current = null;
    };
    // Renderer-level capability settings are baked at construction time.
  }, [isLowPower, dprCap, isTouch]);

  /* ======================================================================
     RENDER-LOOP SUSPENSION
     ====================================================================== */
  useEffect(() => {
    const update = () => {
      const visible = document.visibilityState !== 'hidden';
      const shouldRun = inView && visible;
      if (shouldRun && !runningRef.current) clockRef.current.getDelta(); // drop the gap
      runningRef.current = shouldRun;
    };

    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, [inView]);

  /* ======================================================================
     MODEL LOAD / SWAP
     ====================================================================== */
  useEffect(() => {
    const modelGroup = modelGroupRef.current;
    if (!modelGroup || !modelUrl) return;

    activeUrlRef.current = modelUrl;
    setLoadError(null);
    setLoading(true);

    let cancelled = false;
    const loader = new GLTFLoader();

    const startLoad = () => {
      if (cancelled) return;

      // Anything still mounted belongs to the previous product.
      while (modelGroup.children.length) disposeSubtree(modelGroup.children[0]);

      const normalizedUrl = modelUrl.startsWith('/') ? modelUrl : `/${modelUrl}`;
      const filename = normalizedUrl.split('/').pop() || '';
      const dir = normalizedUrl.slice(0, normalizedUrl.lastIndexOf('/'));

      // Product data now carries the correct casing; these remain as a
      // safety net for case-sensitive hosting.
      const candidates = [
        normalizedUrl,
        `${dir}/${filename.toLowerCase()}`,
        `${dir}/${filename.toUpperCase()}`,
        `/glbmodel/${filename}`,
        `/glbmodel/${filename.toLowerCase()}`,
        `/glbmodel/${filename.toUpperCase()}`,
      ].filter((v, i, self) => self.indexOf(v) === i);

      let candidateIndex = 0;

      const tryNext = () => {
        if (cancelled || activeUrlRef.current !== modelUrl) return;

        if (candidateIndex >= candidates.length) {
          setLoadError(`Unable to load 3D model for ${productName}`);
          setLoading(false);
          return;
        }

        loader.load(
          candidates[candidateIndex++],
          (gltf) => {
            if (cancelled || activeUrlRef.current !== modelUrl) {
              disposeSubtree(gltf.scene);
              return;
            }

            const object = gltf.scene;
            const normalMap = getDuctileIronNormalTexture(isLowPower ? 256 : 512);

            object.traverse((child) => {
              const mesh = child as THREE.Mesh;
              if (!mesh.isMesh) return;

              mesh.castShadow = true;
              mesh.receiveShadow = true;

              const previous = mesh.material;
              mesh.material = createDiMaterial(normalMap);

              if (Array.isArray(previous)) previous.forEach((m) => m.dispose());
              else previous?.dispose();
            });

            // Centre and normalise scale from the bounding sphere.
            object.updateMatrixWorld(true);
            const box = new THREE.Box3().setFromObject(object);
            const center = new THREE.Vector3();
            const sphere = new THREE.Sphere();
            box.getCenter(center);
            box.getBoundingSphere(sphere);
            object.position.set(-center.x, -center.y, -center.z);

            const radius = Math.max(sphere.radius, 0.01);
            const scale = 0.96 / radius;

            const wrapper = new THREE.Group();
            wrapper.add(object);
            wrapper.scale.setScalar(scale);

            const groundedBox = new THREE.Box3().setFromObject(wrapper);
            wrapper.position.y = -groundedBox.min.y - 0.08;

            modelGroup.rotation.set(0, 0, 0);
            modelGroup.add(wrapper);

            // Enter animation — the model resolves into frame instead of popping.
            if (reducedMotionRef.current) {
              modelGroup.scale.setScalar(1);
              setGroupOpacity(modelGroup, 1, true);
              swapRef.current = { phase: 'idle', t: 1 };
            } else {
              modelGroup.scale.setScalar(0.9);
              setGroupOpacity(modelGroup, 0);
              swapRef.current = { phase: 'in', t: 0 };
            }

            const camera = cameraRef.current;
            const controls = controlsRef.current;
            if (camera && controls) {
              camera.position.set(0, 0.45, cameraDistance());
              controls.target.set(0, 0.12, 0);
              controls.update();
            }

            setLoading(false);
          },
          undefined,
          () => tryNext()
        );
      };

      tryNext();
    };

    // Exit animation first, so one product hands over to the next.
    const hasModel = modelGroup.children.length > 0;
    if (hasModel && !reducedMotionRef.current) {
      pendingLoadRef.current = startLoad;
      swapRef.current = { phase: 'out', t: 0 };
    } else {
      startLoad();
    }

    return () => {
      cancelled = true;
      pendingLoadRef.current = null;
    };
  }, [modelUrl, productName, isLowPower, cameraDistance, retryToken]);

  /* ====================================================================== */

  const handleResetCamera = useCallback(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const group = modelGroupRef.current;
    if (!camera || !controls || !group) return;

    camera.position.set(0, 0.45, cameraDistance());
    controls.target.set(0, 0.12, 0);
    controls.update();
    group.rotation.set(0, 0, 0);
  }, [cameraDistance]);

  return (
    <div
      ref={hostRef}
      className={`relative flex h-full w-full select-none flex-col overflow-hidden ${className}`}
    >
      <div
        ref={mountRef}
        className="relative h-full w-full flex-1 cursor-grab active:cursor-grabbing"
      />

      {/* Compact control pill — sits low and centred so it never covers the
          model, and every control is a real tap target. */}
      {!loadError && (
        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center px-3 sm:bottom-3">
          <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/12 bg-black/55 p-1 backdrop-blur-md">
            <span className="flex items-center gap-2 px-3 py-1">
              <Move3d className="h-3.5 w-3.5 shrink-0 text-vm-amber" />
              <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                {isTouch ? 'Drag to rotate' : 'Drag to rotate • Scroll to zoom'}
              </span>
            </span>

            <button
              onClick={handleResetCamera}
              className="tap-target flex cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:text-white"
              title="Reset camera view"
              aria-label="Reset camera view"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => setAutoRotate((v) => !v)}
              className={`tap-target flex cursor-pointer items-center justify-center rounded-full transition-colors ${
                autoRotate ? 'text-vm-amber' : 'text-white/45 hover:text-white'
              }`}
              title={autoRotate ? 'Pause auto-rotation' : 'Resume auto-rotation'}
              aria-label="Toggle auto-rotation"
              aria-pressed={autoRotate}
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Loader — dark, so it dissolves into the stage instead of flashing. */}
      {loading && !loadError && (
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-vm-void/45 backdrop-blur-[2px]">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div
              className="absolute inset-0 animate-spin rounded-full border border-dashed border-white/15 border-t-vm-amber"
              style={{ animationDuration: '3s' }}
            />
            <div className="h-2 w-2 animate-ping rounded-full bg-vm-amber" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
            Loading model
          </p>
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-vm-void/85 p-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vm-amber/12 font-mono text-base font-bold text-vm-amber">
            !
          </div>
          <p className="max-w-xs text-xs text-white/70">{loadError}</p>
          <button
            onClick={() => setRetryToken((t) => t + 1)}
            className="tap-target cursor-pointer rounded-lg border border-white/15 px-4 font-mono text-[11px] uppercase tracking-wider text-white/80 transition-colors hover:border-vm-amber/50 hover:text-white"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Fades every material under the model group.
 * `settle` restores opaque rendering once the transition finishes so we do
 * not pay for transparency sorting during the steady state.
 */
function setGroupOpacity(group: THREE.Object3D, opacity: number, settle = false) {
  group.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      if (!material) continue;
      material.opacity = opacity;
      material.transparent = !settle && opacity < 1;
      material.depthWrite = settle || opacity >= 1;
    }
  });
}
