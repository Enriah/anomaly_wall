import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sliders, Sparkles, RefreshCw, Cpu, Activity } from 'lucide-react';

interface CreativeLabProps {
  lang: 'vi' | 'en';
}

export const CreativeLab: React.FC<CreativeLabProps> = ({ lang }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [shape, setShape] = useState<'torusKnot' | 'icosahedron' | 'sphere' | 'cylinder'>('torusKnot');
  const [styleMode, setStyleMode] = useState<'hologram' | 'metal' | 'wire' | 'particles'>('hologram');
  const [themeColor, setThemeColor] = useState<string>('#a855f7');
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [wireThickness, setWireThickness] = useState<boolean>(false);
  const [liveFps, setLiveFps] = useState<number>(60);
  const [polyCount, setPolyCount] = useState<number>(12800);

  const labStateRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mesh: THREE.Mesh | THREE.Points;
    geometry: THREE.BufferGeometry;
    speed: number;
  } | null>(null);

  // Update speed ref
  useEffect(() => {
    if (labStateRef.current) {
      labStateRef.current.speed = rotationSpeed;
    }
  }, [rotationSpeed]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const light1 = new THREE.PointLight(new THREE.Color(themeColor), 50, 10);
    light1.position.set(3, 4, 3);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x06b6d4, 40, 10);
    light2.position.set(-3, -3, -2);
    scene.add(light2);

    // Build geometry based on shape
    const getGeometry = (s: string) => {
      switch (s) {
        case 'icosahedron':
          return new THREE.IcosahedronGeometry(1.4, 3);
        case 'sphere':
          return new THREE.SphereGeometry(1.3, 64, 64);
        case 'cylinder':
          return new THREE.CylinderGeometry(0.8, 1.2, 2.2, 48);
        case 'torusKnot':
        default:
          return new THREE.TorusKnotGeometry(1.0, 0.35, 120, 24);
      }
    };

    const geometry = getGeometry(shape);
    const posAttr = geometry.getAttribute('position');
    if (posAttr) {
      setPolyCount(posAttr.count);
    }

    // Material setup
    const getMaterial = (mode: string, colorHex: string) => {
      const color = new THREE.Color(colorHex);
      if (mode === 'metal') {
        return new THREE.MeshStandardMaterial({
          color: color,
          metalness: 0.95,
          roughness: 0.12,
          wireframe: wireThickness,
        });
      }
      if (mode === 'wire') {
        return new THREE.MeshBasicMaterial({
          color: color,
          wireframe: true,
          transparent: true,
          opacity: 0.85,
        });
      }
      if (mode === 'particles') {
        return new THREE.PointsMaterial({
          color: color,
          size: 0.04,
          transparent: true,
          opacity: 0.8,
        });
      }
      // hologram / iridescent
      return new THREE.MeshPhysicalMaterial({
        color: color,
        emissive: color.clone().multiplyScalar(0.2),
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.6,
        ior: 1.5,
        clearcoat: 1.0,
        wireframe: wireThickness,
      });
    };

    const material = getMaterial(styleMode, themeColor);
    let mesh: THREE.Mesh | THREE.Points;
    if (styleMode === 'particles') {
      mesh = new THREE.Points(geometry, material as THREE.PointsMaterial);
    } else {
      mesh = new THREE.Mesh(geometry, material as THREE.Material);
    }
    scene.add(mesh);

    labStateRef.current = {
      scene,
      camera,
      renderer,
      mesh,
      geometry,
      speed: rotationSpeed,
    };

    // Resize
    const handleResize = () => {
      if (!container || !labStateRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Interactive Dragging
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !mesh) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      mesh.rotation.y += dx * 0.01;
      mesh.rotation.x += dy * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId: number;
    let frameCount = 0;
    let lastFpsTime = performance.now();

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);

      frameCount++;
      if (time - lastFpsTime >= 1000) {
        setLiveFps(Math.round((frameCount * 1000) / (time - lastFpsTime)));
        frameCount = 0;
        lastFpsTime = time;
      }

      if (labStateRef.current && !isDragging) {
        const curSpeed = labStateRef.current.speed;
        mesh.rotation.y += 0.008 * curSpeed;
        mesh.rotation.x += 0.004 * curSpeed;
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      resizeObserver.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [shape, styleMode, themeColor, wireThickness]);

  const shapesList = [
    { id: 'torusKnot', label: 'Torus Knot' },
    { id: 'icosahedron', label: 'Icosahedron' },
    { id: 'sphere', label: 'Morph Sphere' },
    { id: 'cylinder', label: 'Cylinder Pillar' },
  ];

  const modesList = [
    { id: 'hologram', labelEn: 'Holographic Glass', labelVi: 'Kính Hologram' },
    { id: 'metal', labelEn: 'PBR Chrome', labelVi: 'Kim loại Chrome' },
    { id: 'wire', labelEn: 'Cyber Blueprint', labelVi: 'Khung lưới Wireframe' },
    { id: 'particles', labelEn: 'Point Cloud', labelVi: 'Hạt Vertices' },
  ];

  const colorsList = [
    { hex: '#a855f7', name: 'Violet Neon' },
    { hex: '#06b6d4', name: 'Cyber Cyan' },
    { hex: '#f43f5e', name: 'Vermilion Glow' },
    { hex: '#10b981', name: 'Emerald Flux' },
    { hex: '#eab308', name: 'Imperial Gold' },
  ];

  return (
    <section id="lab" className="py-24 relative overflow-hidden bg-[#07070b]">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-purple-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CREATIVE LAB & REAL-TIME SHADERS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              {lang === 'vi' ? 'Phòng Thí Nghiệm Sáng Tạo' : 'Interactive Shader Lab'}
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl font-light">
              {lang === 'vi'
                ? 'Không gian thể nghiệm kết hợp mô hình 3D, vật liệu đồ họa và thuật toán shader chạy thời gian thực trên GPU trình duyệt của bạn.'
                : 'A live playground synthesizing spatial geometry, graphic shaders, and WebGL computation rendered in real-time on your GPU.'}
            </p>
          </div>

          {/* Engine Status Badges */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-full glass-panel border border-white/10 flex items-center gap-2 text-zinc-300">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>GPU SHADER ENGINE</span>
            </div>
            <div className="px-3 py-1.5 rounded-full glass-panel border border-white/10 flex items-center gap-2 text-emerald-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>{liveFps} FPS</span>
            </div>
            <div className="px-3 py-1.5 rounded-full glass-panel border border-white/10 text-zinc-400">
              <span>{polyCount.toLocaleString()} VERTICES</span>
            </div>
          </div>
        </div>

        {/* Interactive Lab Workspace Card */}
        <div className="rounded-3xl glass-card border border-white/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
          
          {/* Main 3D Canvas Viewport */}
          <div className="lg:col-span-8 relative min-h-[420px] lg:min-h-[560px] bg-black/40 flex items-center justify-center p-4">
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono text-zinc-400 border border-white/5">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>{lang === 'vi' ? 'Xoay chuột tự do trong không gian' : 'Interactive WebGL Canvas'}</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-zinc-500 pointer-events-none">
              <span>WebGL 2.0 ACES Filmic</span>
              <span>BufferGeometry Dynamic Pipeline</span>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="lg:col-span-4 p-6 sm:p-8 space-y-6 bg-[#0c0c14]/90 border-t lg:border-t-0 lg:border-l border-white/10">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-white font-semibold">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>{lang === 'vi' ? 'Bảng Điều Khiển Tham Số' : 'Live Tuning Parameters'}</span>
              </div>
              <button
                onClick={() => {
                  setShape('torusKnot');
                  setStyleMode('hologram');
                  setThemeColor('#a855f7');
                  setRotationSpeed(1);
                  setWireThickness(false);
                }}
                className="text-zinc-500 hover:text-white transition-colors"
                title="Reset Parameters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Geometry Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                {lang === 'vi' ? '01. Hình khối không gian:' : '01. Spatial Geometry:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {shapesList.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setShape(s.id as unknown as typeof shape)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono transition-all text-left ${
                      shape === s.id
                        ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                        : 'glass-panel text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Material / Shader Mode */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                {lang === 'vi' ? '02. Phong cách Vật liệu & Shader:' : '02. Material & Shader Style:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {modesList.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setStyleMode(m.id as unknown as typeof styleMode)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono transition-all text-left ${
                      styleMode === m.id
                        ? 'bg-white text-zinc-950 font-bold shadow-md shadow-white/20'
                        : 'glass-panel text-zinc-400 hover:text-white'
                    }`}
                  >
                    {lang === 'vi' ? m.labelVi : m.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                {lang === 'vi' ? '03. Màu sắc quang phổ:' : '03. Chromatic Tone:'}
              </label>
              <div className="flex items-center gap-3">
                {colorsList.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setThemeColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      themeColor === c.hex ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110 opacity-70 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Sliders: Speed & Wireframe */}
            <div className="space-y-4 pt-3 border-t border-white/10 font-mono text-xs">
              <div className="space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>{lang === 'vi' ? 'Tốc độ quay quỹ đạo' : 'Orbit Spin Velocity'}</span>
                  <span className="text-white font-bold">{rotationSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg accent-purple-500 cursor-pointer"
                />
              </div>

              {styleMode !== 'wire' && styleMode !== 'particles' && (
                <label className="flex items-center justify-between cursor-pointer py-1 text-zinc-300">
                  <span>{lang === 'vi' ? 'Bật khung dây bề mặt' : 'Overlay Surface Wireframe'}</span>
                  <input
                    type="checkbox"
                    checked={wireThickness}
                    onChange={(e) => setWireThickness(e.target.checked)}
                    className="accent-purple-500 w-4 h-4 rounded"
                  />
                </label>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
