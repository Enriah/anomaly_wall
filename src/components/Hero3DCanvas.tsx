import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hero3DCanvasProps {
  currentDiscipline: 'all' | '3d' | '2d' | 'dev';
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ currentDiscipline }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mainMesh: THREE.Mesh | THREE.Points;
    particles: THREE.Points;
    lights: THREE.Light[];
    materialSolid: THREE.MeshPhysicalMaterial;
    materialWire: THREE.MeshBasicMaterial;
    materialPoints: THREE.PointsMaterial;
    geometry: THREE.BufferGeometry;
  } | null>(null);

  // Discipline color matching
  const getDisciplineColor = (disc: 'all' | '3d' | '2d' | 'dev') => {
    switch (disc) {
      case '3d': return new THREE.Color(0xa855f7); // Purple
      case '2d': return new THREE.Color(0xf43f5e); // Coral
      case 'dev': return new THREE.Color(0x06b6d4); // Cyan
      default: return new THREE.Color(0x9333ea); // Obsidian Violet
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07070a, 0.04);

    // 2. Camera setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.2;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Geometry: Complex artistic Torus Knot
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.38, 140, 36, 2, 3);

    // 5. Materials
    const initialColor = getDisciplineColor(currentDiscipline);

    const materialSolid = new THREE.MeshPhysicalMaterial({
      color: initialColor,
      emissive: initialColor.clone().multiplyScalar(0.12),
      metalness: 0.9,
      roughness: 0.18,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });

    const materialWire = new THREE.MeshBasicMaterial({
      color: initialColor,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });

    const materialPoints = new THREE.PointsMaterial({
      color: initialColor,
      size: 0.035,
      transparent: true,
      opacity: 0.9,
    });

    // Main sculpture mesh
    let mainMesh: THREE.Mesh | THREE.Points = new THREE.Mesh(geometry, materialSolid);
    scene.add(mainMesh);

    // 6. Ambient Particle Stardust Ring
    const particleCount = 700;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i] = radius * Math.cos(theta) * Math.cos(phi);
      particlePositions[i + 1] = radius * Math.sin(phi);
      particlePositions[i + 2] = radius * Math.sin(theta) * Math.cos(phi);
      particleScales[i / 3] = Math.random();
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.45,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 7. Dynamic Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0xa855f7, 45, 12);
    mainLight.position.set(3, 3, 3);
    scene.add(mainLight);

    const rimLight = new THREE.PointLight(0x06b6d4, 35, 12);
    rimLight.position.set(-3, -2, -2);
    scene.add(rimLight);

    const warmLight = new THREE.PointLight(0xf43f5e, 30, 10);
    warmLight.position.set(0, 4, -2);
    scene.add(warmLight);

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      mainMesh,
      particles,
      lights: [ambientLight, mainLight, rimLight, warmLight],
      materialSolid,
      materialWire,
      materialPoints,
      geometry,
    };

    // 8. Mouse interaction (smooth damping)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.8;
      targetY = y * 0.6;
    };

    window.addEventListener('mousemove', onPointerMove);

    // 9. Resize observer
    const handleResize = () => {
      if (!container || !sceneRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 10. Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      // Smooth mouse lerping
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      if (sceneRef.current) {
        const mesh = sceneRef.current.mainMesh;
        // Self rotation
        mesh.rotation.x += delta * 0.35;
        mesh.rotation.y += delta * 0.45;

        // Interactive mouse offset
        mesh.rotation.y += mouseX * 0.03;
        mesh.rotation.x += -mouseY * 0.03;

        // Rotating stardust particles
        sceneRef.current.particles.rotation.y -= delta * 0.08;
        sceneRef.current.particles.rotation.x += delta * 0.04;

        // Dynamic light hovering
        mainLight.position.x = Math.sin(time * 0.001) * 3;
        mainLight.position.y = Math.cos(time * 0.001) * 3;
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onPointerMove);
      resizeObserver.disconnect();
      renderer.dispose();
      geometry.dispose();
      materialSolid.dispose();
      materialWire.dispose();
      materialPoints.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update color when currentDiscipline changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const color = getDisciplineColor(currentDiscipline);
    sceneRef.current.materialSolid.color.set(color);
    sceneRef.current.materialSolid.emissive.set(color.clone().multiplyScalar(0.12));
    sceneRef.current.materialWire.color.set(color);
    sceneRef.current.materialPoints.color.set(color);
  }, [currentDiscipline]);

  return (
    <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] flex items-center justify-center">
      {/* Three.js Canvas mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Ambient background glow orb */}
      <div 
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-[100px] pointer-events-none -z-10 transition-colors duration-700 opacity-30"
        style={{
          backgroundColor: currentDiscipline === '3d' ? '#a855f7' : currentDiscipline === '2d' ? '#f43f5e' : currentDiscipline === 'dev' ? '#06b6d4' : '#8b5cf6'
        }}
      />
    </div>
  );
};
