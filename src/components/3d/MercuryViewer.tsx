import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCw, Move3d, RefreshCcw, Eye, Compass } from 'lucide-react';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface MercuryViewerProps {
  modelUrl?: string;
  productName?: string;
  className?: string;
}

// Authentic ductile iron sand-cast normal bump texture matching ductile iron casting surface & Blender noise bump
function createDuctileIronNormalTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Generate granular sand-casting micro-texture bump matching Blender noise bump
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const n1 = (Math.random() * 2 - 1) * 0.42;
      const n2 = Math.sin(x * 0.35) * Math.cos(y * 0.35) * 0.22;
      const val = n1 + n2;

      // Tangent space normal map calculation
      const nx = Math.floor((val * 0.35 + 0.5) * 255);
      const ny = Math.floor(((Math.random() * 2 - 1) * 0.3 + 0.5) * 255);
      const nz = 215;

      data[idx] = Math.min(255, Math.max(0, nx));
      data[idx + 1] = Math.min(255, Math.max(0, ny));
      data[idx + 2] = nz;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 24);
  return texture;
}

// Ductile Iron Material matching Blender Shader Graph (Dark graphite/charcoal sand-cast iron)
function applyDiMaterial(normalMap: THREE.CanvasTexture | null): THREE.MeshPhysicalMaterial {
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x55595c), // Authentic dark graphite charcoal ductile iron
    metalness: 0.65,                  // Controlled metallic reflection matching Blender reference
    roughness: 0.68,                  // Sand-cast casting roughness
    ior: 7.9,                         // High metallic IOR from Blender setup
    reflectivity: 0.55,
    clearcoat: 0.04,
    clearcoatRoughness: 0.6,
    flatShading: false,
    side: THREE.DoubleSide,
  });

  if (normalMap) {
    mat.normalMap = normalMap;
    mat.normalScale = new THREE.Vector2(0.18, 0.18); // Visible tactile sand-cast surface texture
  }

  return mat;
}

export default function MercuryViewer({
  modelUrl = '/glbmodel/A_V.glb',
  productName = 'Product Model',
  className = '',
}: MercuryViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const normalMapRef = useRef<THREE.CanvasTexture | null>(null);

  const isInteractingRef = useRef<boolean>(false);
  const autoRotateRef = useRef<boolean>(true);
  const idleTimeoutRef = useRef<any>(null);
  const activeLoadingUrlRef = useRef<string>(modelUrl);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Initialize Three.js Scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    normalMapRef.current = createDuctileIronNormalTexture();

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup - calibrated perspective for pristine framing
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 1000);
    const isMobile = width < 768;
    camera.position.set(0, 1.5, isMobile ? 5 : 4);
    cameraRef.current = camera;

    // 3. Renderer setup - transparent background
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environment = new RoomEnvironment();

    scene.environment = pmremGenerator.fromScene(environment).texture;

    environment.dispose();
    pmremGenerator.dispose();

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Balanced Foundry & Studio Lighting setup ismobile
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    // Key Light - focused dimensional light source
    const dirLight1 = new THREE.DirectionalLight(0xfff4e6, 1.15);
    dirLight1.position.set(-5, 7, 4);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 2048;
    dirLight1.shadow.mapSize.height = 2048;
    dirLight1.shadow.bias = -0.0001;
    scene.add(dirLight1);

    // Fill Light - subtle cool ambient contrast
    const dirLight2 = new THREE.DirectionalLight(0xdce8f2, 0.28);
    dirLight2.position.set(-6, 3, -4);
    scene.add(dirLight2);

    // Rim Light — warm burnished metal edge
    const dirLight3 = new THREE.DirectionalLight(0xd8a06a, 0.75);
    dirLight3.position.set(-3, 4, -6);
    scene.add(dirLight3);

    // Top Overhead Light
    const topLight = new THREE.DirectionalLight(0xffe9cf, 0.42);
    topLight.position.set(0, 8, 1);
    scene.add(topLight);

    // Warm copper separation light — makes the DI fitting stand out
    const productRimLight = new THREE.PointLight(
      0xc2764a,
      1.6,
      9,
      2
    );

    productRimLight.position.set(-2.5, 2.5, -3.5);
    scene.add(productRimLight);

    // Soft front fill — keeps flange details visible
    const productFrontFill = new THREE.PointLight(
      0xffffff,
      0.7,
      7,
      2
    );

    productFrontFill.position.set(2, 1, 4);
    scene.add(productFrontFill);

    // 5. OrbitControls for smooth user interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    if (isMobile) {
      controls.enabled = false;
    }
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 6.5;
    controls.minDistance = 1.4;
    controls.autoRotate = false;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.target.set(0, -0.05, 0);

    controls.addEventListener('start', () => {
      isInteractingRef.current = true;
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    });

    controls.addEventListener('end', () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        isInteractingRef.current = false;
      }, 1500);
    });

    controlsRef.current = controls;

    // 6. Model Group Container
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 6A. Invisible floor used only to receive the product shadow —
    // a soft engineered grounding rather than a floating object.
    const shadowFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 7),
      new THREE.ShadowMaterial({
        color: 0x101214,
        opacity: 0.3,
      })
    );

    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -0.95;

    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    // 7. Continuous Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (!isInteractingRef.current && autoRotateRef.current && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += 0.004; // Smooth turntable rotation
      }

      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      resizeObserver.disconnect();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Robust Load & Swap Model with fallback URL handling and zero ghosting
  useEffect(() => {
    const modelGroup = modelGroupRef.current;
    if (!modelGroup || !modelUrl) return;

    activeLoadingUrlRef.current = modelUrl;

    // Clear previous geometry immediately to prevent any mix-ups
    while (modelGroup.children.length > 0) {
      const obj = modelGroup.children[0];
      modelGroup.remove(obj);
      obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        }
      });
    }

    setLoading(true);
    setLoadError(null);

    const loader = new GLTFLoader();

    // Generate fallback URLs in case of case mismatches
    const normalizedUrl = modelUrl.startsWith('/') ? modelUrl : `/${modelUrl}`;
    const filename = normalizedUrl.split('/').pop() || '';
    const dir = normalizedUrl.substring(0, normalizedUrl.lastIndexOf('/'));
    
    const candidateUrls = [
      normalizedUrl,
      `${dir}/${filename.toLowerCase()}`,
      `${dir}/${filename.toUpperCase()}`,
      `/glbmodel/${filename}`,
      `/glbmodel/${filename.toLowerCase()}`,
      `/glbmodel/${filename.toUpperCase()}`
    ].filter((val, idx, self) => self.indexOf(val) === idx);

    let currentUrlIndex = 0;

    const tryLoadNext = () => {
      if (currentUrlIndex >= candidateUrls.length) {
        if (activeLoadingUrlRef.current === modelUrl) {
          setLoadError(`Unable to load 3D model for ${productName}`);
          setLoading(false);
        }
        return;
      }

      const urlToTry = candidateUrls[currentUrlIndex];

      loader.load(
        urlToTry,
        (gltf) => {
          if (activeLoadingUrlRef.current !== modelUrl) return;

          const object = gltf.scene;

          // Apply authentic dark ductile iron material and compute smooth normals
          object.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;

              mesh.castShadow = true;
              mesh.receiveShadow = true;

              const oldMaterial = mesh.material;

              const diMaterial = applyDiMaterial(normalMapRef.current);

              // Foundry-grade ductile iron — warm graphite, catches light
              diMaterial.color.setHex(0x353638);
              diMaterial.metalness = 0.92;
              diMaterial.roughness = 0.52;
              diMaterial.envMapIntensity = 0.95;
              diMaterial.clearcoat = 0.1;
              diMaterial.clearcoatRoughness = 0.7;

              mesh.material = diMaterial;

              // Clean up original GLB material
              if (Array.isArray(oldMaterial)) {
                oldMaterial.forEach((mat) => mat.dispose());
              } else if (oldMaterial) {
                oldMaterial.dispose();    
              }
            }
          });

          // Compute exact bounding box for mathematically centered framing
          object.updateMatrixWorld(true);
          const box = new THREE.Box3().setFromObject(object);
          const center = new THREE.Vector3();
          const sphere = new THREE.Sphere();
          box.getCenter(center);
          box.getBoundingSphere(sphere);

          // Center object precisely at origin
          object.position.set(-center.x, -center.y, -center.z);

          // Normalized scale
          const radius = Math.max(sphere.radius, 0.01);
          const targetScale = 0.96 / radius;

          const wrapper = new THREE.Group();
          wrapper.add(object);
          wrapper.scale.set(targetScale, targetScale, targetScale);
          
          // Ground the product so its lowest point sits near the factory floor
          const scaledBox = new THREE.Box3().setFromObject(wrapper);
          const groundOffset = -scaledBox.min.y;

          wrapper.position.y = groundOffset - 0.08;

          // Clear again to ensure no race artifact
          while (modelGroup.children.length > 0) {
            modelGroup.remove(modelGroup.children[0]);
          }

          modelGroup.rotation.set(0, 0, 0);
          modelGroup.position.y = -0.28;
          modelGroup.add(wrapper);

          if (controlsRef.current && cameraRef.current) {
            cameraRef.current.position.set(
              0,
              0.45,
              window.innerWidth < 768 ? 5.0 : 4.0
            );

            controlsRef.current.target.set(0, 0.12, 0);
            controlsRef.current.update();
          }

          setLoading(false);
        },
        undefined,
        () => {
          // Try next fallback candidate
          currentUrlIndex++;
          tryLoadNext();
        }
      );
    };

    tryLoadNext();
  }, [modelUrl, productName]);

  // Reset Camera View Helper
  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current && modelGroupRef.current) {
      const isMobile = window.innerWidth < 768;

      cameraRef.current.position.set(
        0,
        0.45,
        isMobile ? 5.0 : 4.0
      );

      controlsRef.current.target.set(0, -0.05, 0);
      controlsRef.current.update();
      modelGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col select-none ${className}`}>
      {/* WebGL Canvas: Direct Transparent Rendering */}
      <div ref={mountRef} className="w-full h-full flex-1 relative cursor-grab active:cursor-grabbing" />

      {/* ================= QUIET 3D CONTROL CLUSTER ================= */}
      {!loading && !loadError && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-5 z-20 pointer-events-auto flex items-center gap-1.5">
          {/* Restrained 360 hint */}
          <div className="hidden md:flex bg-ivory/82 backdrop-blur-md border border-ink/10 pl-3 pr-3.5 py-1.5 rounded-full shadow-[0_8px_24px_-12px_rgba(21,23,26,0.5)] items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full bg-copper shrink-0"
              style={{ animation: 'vm-pulse-dot 2.4s ease-in-out infinite' }}
            />
            <Move3d className="w-3 h-3 text-copper shrink-0" strokeWidth={1.6} />
            <span className="font-mono font-medium text-[10px] tracking-[0.18em] uppercase text-ink/65">
              360° 3D Model · Drag to rotate
            </span>
          </div>

          {/* Reset camera */}
          <button
            onClick={handleResetCamera}
            className="w-8 h-8 rounded-full bg-ivory/85 backdrop-blur-md hover:bg-ivory text-ink/60 hover:text-ink border border-ink/10 flex items-center justify-center transition-all cursor-pointer"
            title="Reset 3D Camera View"
            aria-label="Reset Camera"
          >
            <RefreshCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>

          {/* Toggle turntable */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
              autoRotate
                ? 'bg-copper text-ivory border-copper'
                : 'bg-ivory/85 text-ink/60 border-ink/10 hover:text-ink hover:bg-ivory'
            }`}
            title={autoRotate ? 'Pause 360° auto-spin' : 'Start 360° auto-spin'}
            aria-label="Toggle Auto-Rotation"
          >
            <RotateCw className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Industrial loader */}
      {loading && (
        <div className="absolute inset-0 z-30 bg-ivory/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center pointer-events-none transition-opacity duration-300">
          <div className="relative w-14 h-14 flex items-center justify-center mb-4">
            <div
              className="absolute inset-0 rounded-full border border-dashed border-ink/20 border-t-copper vm-spin-slow"
              style={{ animationDuration: '3s' }}
            />
            <div className="w-2 h-2 rotate-45 bg-copper" />
          </div>

          <div className="space-y-1.5">
            <p className="text-ink font-mono text-[10px] tracking-[0.26em] uppercase font-medium">
              Rendering 3D Specification
            </p>
            <p className="text-steel font-mono text-[9px] tracking-[0.2em] uppercase font-medium">
              {productName}
            </p>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 z-30 bg-ivory/92 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-10 h-10 rounded-full border border-copper/30 text-copper-deep flex items-center justify-center mb-3">
            <span className="font-mono font-bold text-base">!</span>
          </div>
          <p className="text-ink font-semibold text-xs mb-1">{loadError}</p>
          <button
            onClick={() => {
              setLoading(true);
              setLoadError(null);
            }}
            className="mt-2 text-[11px] font-mono font-semibold tracking-widest uppercase px-4 py-2 bg-graphite text-ivory rounded-full hover:bg-copper transition-colors"
          >
            Retry Loading
          </button>
        </div>
      )}
    </div>
  );
}
