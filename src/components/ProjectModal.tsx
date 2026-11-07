import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X, ExternalLink, Box, Layers, Image as ImageIcon, Sliders, CheckCircle2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  lang: 'vi' | 'en';
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<'study' | '3d'>('study');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [roughness, setRoughness] = useState<number>(0.2);
  const [metalness, setMetalness] = useState<number>(0.9);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    mesh: THREE.Mesh;
    material: THREE.MeshStandardMaterial;
  } | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  // Set up 3D viewport when tab is '3d'
  useEffect(() => {
    if (!project || activeTab !== '3d' || !canvasRef.current) return;

    const container = canvasRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Geometry based on project
    let geom: THREE.BufferGeometry;
    if (project.meshConfig?.geometry === 'torusKnot') {
      geom = new THREE.TorusKnotGeometry(1.1, 0.35, 128, 32);
    } else if (project.meshConfig?.geometry === 'icosahedron') {
      geom = new THREE.IcosahedronGeometry(1.4, 2);
    } else if (project.meshConfig?.geometry === 'torus') {
      geom = new THREE.TorusGeometry(1.2, 0.4, 32, 100);
    } else {
      geom = new THREE.OctahedronGeometry(1.4, 2);
    }

    const material = new THREE.MeshStandardMaterial({
      color: project.color ? new THREE.Color(project.color) : new THREE.Color(0xa855f7),
      metalness: metalness,
      roughness: roughness,
      wireframe: wireframe,
    });

    const mesh = new THREE.Mesh(geom, material);
    scene.add(mesh);

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(amb);

    const pLight1 = new THREE.PointLight(0xa855f7, 50, 10);
    pLight1.position.set(3, 3, 3);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0x06b6d4, 40, 10);
    pLight2.position.set(-3, -2, -2);
    scene.add(pLight2);

    sceneRef.current = { renderer, scene, camera, mesh, material };

    // Mouse drag rotation
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      mesh.rotation.y += dx * 0.01;
      mesh.rotation.x += dy * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        mesh.rotation.y += 0.005;
        mesh.rotation.x += 0.003;
      }
      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      geom.dispose();
      material.dispose();
    };
  }, [project, activeTab]);

  // Update material properties dynamically
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.material.wireframe = wireframe;
      sceneRef.current.material.roughness = roughness;
      sceneRef.current.material.metalness = metalness;
    }
  }, [wireframe, roughness, metalness]);

  if (!project) return null;

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
      
      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-5xl bg-[#09090f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0e0e16]/80 backdrop-blur-md sticky top-0 z-20">
          
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: project.color }} />
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              {lang === 'vi' ? project.categoryVi : project.category}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs font-mono text-zinc-400">{project.year}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Tabs */}
            {project.meshConfig && (
              <div className="flex items-center p-1 rounded-xl glass-panel border border-white/10 mr-2">
                <button
                  onClick={() => setActiveTab('study')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    activeTab === 'study' ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'Ảnh & Bài viết' : 'Overview'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('3d')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    activeTab === '3d' ? 'bg-purple-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'Khung 3D Tương tác' : '3D Viewport'}</span>
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full glass-panel border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Scroll Area */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          
          {/* If 3D Tab active */}
          {activeTab === '3d' && (
            <div className="space-y-4">
              <div className="relative w-full h-[450px] rounded-2xl overflow-hidden glass-card border border-purple-500/30 flex items-center justify-center bg-black/40">
                <div ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                <div className="absolute top-4 left-4 text-xs font-mono text-purple-300 bg-black/60 px-3 py-1 rounded-full border border-purple-500/20">
                  ✦ {lang === 'vi' ? 'Xoay chuột 360° để kiểm tra bề mặt' : 'Drag to inspect 360° geometry'}
                </div>
              </div>

              {/* Shading Controls */}
              <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-wrap items-center gap-6 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span className="text-zinc-300">{lang === 'vi' ? 'Tham số Vật liệu PBR:' : 'PBR Shading Controls:'}</span>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={wireframe}
                    onChange={(e) => setWireframe(e.target.checked)}
                    className="accent-purple-500 w-4 h-4 rounded"
                  />
                  <span>Wireframe Mesh</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Metalness:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={metalness}
                    onChange={(e) => setMetalness(parseFloat(e.target.value))}
                    className="accent-purple-500 w-24 h-1 bg-zinc-700 rounded-lg"
                  />
                  <span className="text-purple-300">{metalness}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Roughness:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={roughness}
                    onChange={(e) => setRoughness(parseFloat(e.target.value))}
                    className="accent-purple-500 w-24 h-1 bg-zinc-700 rounded-lg"
                  />
                  <span className="text-purple-300">{roughness}</span>
                </div>
              </div>
            </div>
          )}

          {/* Main Hero Header */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              {lang === 'vi' ? project.titleVi : project.title}
            </h2>
            <p className="text-base sm:text-lg text-zinc-300 font-light max-w-3xl leading-relaxed">
              {lang === 'vi' ? project.subtitleVi : project.subtitle}
            </p>
          </div>

          {/* Primary Cover Image (when study tab active) */}
          {activeTab === 'study' && (
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[16/9]">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Metadata Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl glass-panel border border-white/10 font-mono text-xs">
            <div>
              <span className="text-zinc-500 block uppercase mb-1">
                {lang === 'vi' ? 'Khách hàng / Đơn vị' : 'Client / Studio'}
              </span>
              <span className="text-white font-semibold">{project.client || 'Self-initiated Research'}</span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase mb-1">
                {lang === 'vi' ? 'Vai trò' : 'Role'}
              </span>
              <span className="text-white font-semibold">{lang === 'vi' ? project.details.roleVi : project.details.role}</span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase mb-1">
                {lang === 'vi' ? 'Năm phát hành' : 'Year Released'}
              </span>
              <span className="text-white font-semibold">{project.year}</span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase mb-1">
                {lang === 'vi' ? 'Chuyên ngành' : 'Discipline'}
              </span>
              <span className="text-purple-400 font-bold uppercase">{project.discipline}</span>
            </div>
          </div>

          {/* Case Study Written Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Narrative */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold font-accent text-white flex items-center gap-2">
                  <span className="text-purple-400">01.</span>
                  <span>{lang === 'vi' ? 'Tổng quan & Thách thức' : 'Overview & Challenge'}</span>
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed font-light">
                  {lang === 'vi' ? project.details.overviewVi : project.details.overview}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold font-accent text-white flex items-center gap-2">
                  <span className="text-rose-400">02.</span>
                  <span>{lang === 'vi' ? 'Ý niệm Nghệ thuật & Tầm nhìn' : 'Concept & Aesthetic Vision'}</span>
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed font-light">
                  {lang === 'vi' ? project.details.conceptVi : project.details.concept}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold font-accent text-white flex items-center gap-2">
                  <span className="text-cyan-400">03.</span>
                  <span>{lang === 'vi' ? 'Quy trình Kỹ thuật & Thực thi' : 'Technical Process & Breakdown'}</span>
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed font-light">
                  {lang === 'vi' ? project.details.processVi : project.details.process}
                </p>
              </div>

              {/* Additional gallery images */}
              {project.additionalImages && project.additionalImages.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {project.additionalImages.map((img, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-white/10 aspect-[4/3]">
                      <img src={img} alt="Detail view" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar: Tools, Metrics & Action Links */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* External Links */}
              <div className="space-y-2.5">
                {project.details.liveUrl && (
                  <a
                    href={project.details.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-semibold transition-all shadow-lg shadow-purple-600/25"
                  >
                    <span>{lang === 'vi' ? 'Xem Trực tiếp (Live Demo)' : 'Open Live Interactive Demo'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {project.details.githubUrl && (
                  <a
                    href={project.details.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl glass-panel border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white font-mono text-xs transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      <span>{lang === 'vi' ? 'Mã nguồn GitHub' : 'View Source Code'}</span>
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={copyShareLink}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl glass-panel border border-white/10 text-zinc-400 hover:text-white font-mono text-xs transition-all"
                >
                  {copiedLink ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">{lang === 'vi' ? 'Đã sao chép liên kết!' : 'Link copied!'}</span>
                    </>
                  ) : (
                    <span>{lang === 'vi' ? 'Sao chép liên kết tác phẩm' : 'Share Project Link'}</span>
                  )}
                </button>
              </div>

              {/* Tools & Pipeline */}
              <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>{lang === 'vi' ? 'Công cụ sử dụng' : 'Tools & Software'}</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.details.tools.map((tool, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Stats */}
              {project.details.stats && (
                <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    {lang === 'vi' ? 'Chỉ số Kỹ thuật' : 'Technical Metrics'}
                  </h4>
                  <div className="space-y-3">
                    {project.details.stats.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono border-b border-white/5 pb-2">
                        <span className="text-zinc-500">{lang === 'vi' ? s.labelVi : s.label}</span>
                        <span className="text-white font-bold">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
