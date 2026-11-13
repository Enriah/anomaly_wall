import React, { useEffect, useRef, useState } from 'react';
import {
  WaterBackgroundHandle,
  computeWaterHeightAndSlope,
} from './WaterBackground';

interface FloatingPetalsProps {
  containerRef: React.RefObject<HTMLElement | null>;
  waterRef: React.RefObject<WaterBackgroundHandle | null>;
}

interface PetalState {
  id: number;
  imageIndex: number; // Index file trong public/petals/petal-{X}.png
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  baseRotation: number; // Góc nằm nghỉ tự nhiên cố định
  opacity: number;
  lift: number;
  tiltX: number;
  tiltY: number;
  pushVx: number; // Vận tốc bị sóng đẩy tạm thời
  pushVy: number;
}

// 7 kiểu dáng cánh hoa được chọn lọc tỉ mỉ:
// - 1: Cánh nở truyền thống có khía chữ V đặc trưng
// - 5: Cánh hoa hơi uốn cong thanh thoát
// - 7: Cánh nghiêng góc nhìn cạnh (side profile) độc đáo
// - 10: Cánh hoa xòe rộng, vân phớt hồng mềm mại
// - 13: Cánh hoa cúp nhẹ tự nhiên
// - 17: Cánh hoa cong nhẹ như đang trôi bềnh bồng
// - 24: Cánh hoa mảnh mai uốn lượn
const SELECTED_PETAL_IDS = [1, 5, 7, 10, 13, 17, 24];

// Tọa độ khởi tạo ban đầu phân bổ hài hòa quanh trang chủ (tránh đè trực diện chữ AnomalyWall)
const INITIAL_LAYOUTS = [
  { xRatio: 0.16, yRatio: 0.22, rot: 25,  scale: 1.05 }, // Góc trên trái
  { xRatio: 0.82, yRatio: 0.18, rot: -35, scale: 0.95 }, // Góc trên phải
  { xRatio: 0.38, yRatio: 0.14, rot: 50,  scale: 1.10 }, // Đỉnh giữa trái
  { xRatio: 0.12, yRatio: 0.68, rot: -15, scale: 1.00 }, // Giữa dưới trái
  { xRatio: 0.86, yRatio: 0.62, rot: 70,  scale: 1.08 }, // Giữa dưới phải
  { xRatio: 0.32, yRatio: 0.84, rot: -60, scale: 0.92 }, // Đáy trái
  { xRatio: 0.68, yRatio: 0.82, rot: 30,  scale: 1.02 }, // Đáy phải
];

export const FloatingPetals: React.FC<FloatingPetalsProps> = ({
  containerRef,
  waterRef,
}) => {
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const animIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const isTabActiveRef = useRef<boolean>(true);
  const lastTimeRef = useRef<number>(performance.now());

  // Bộ nhớ đệm kích thước container: Tránh truy vấn DOM clientWidth/clientHeight 60 lần/giây
  const boundsRef = useRef({
    cw: typeof window !== 'undefined' ? window.innerWidth : 1200,
    ch: typeof window !== 'undefined' ? window.innerHeight : 800,
    aspect: (typeof window !== 'undefined' ? window.innerWidth : 1200) / (typeof window !== 'undefined' ? window.innerHeight : 800),
  });

  // Sử dụng useState để đảm bảo React RENDER NGAY LẬP TỨC 7 phần tử cánh hoa vào DOM
  const [petals] = useState<PetalState[]>(() => {
    const baseWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const baseHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    return SELECTED_PETAL_IDS.map((imgId, i) => {
      const layout = INITIAL_LAYOUTS[i] || { xRatio: 0.5, yRatio: 0.5, rot: 0, scale: 1 };
      const w = 50 * layout.scale;
      const h = 66 * layout.scale;

      return {
        id: i,
        imageIndex: imgId,
        x: layout.xRatio * baseWidth,
        y: layout.yRatio * baseHeight,
        // Vận tốc trôi dạt tự nhiên siêu chậm, thanh bình (1.2 đến 2.4 px/s)
        vx: (i % 2 === 0 ? 1 : -1) * (1.2 + i * 0.2),
        vy: (i % 3 === 0 ? 1 : -1) * (0.9 + i * 0.15),
        width: w,
        height: h,
        baseRotation: layout.rot,
        opacity: 0.94,
        lift: 0,
        tiltX: 0,
        tiltY: 0,
        pushVx: 0,
        pushVy: 0,
      };
    });
  });

  const petalsRef = useRef<PetalState[]>(petals);
  // Bộ đệm phẳng tái sử dụng để lưu các nguồn sóng hoạt động (Zero Memory Allocation)
  const waveSourcesBufferRef = useRef<
    { sx: number; sy: number; radius: number; packetLen: number; forceMul: number }[]
  >([]);

  // Đo đạc kích thước thực tế bằng ResizeObserver mà không gây reflow DOM trong render loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateBounds = () => {
      const cw = container.clientWidth || window.innerWidth;
      const ch = container.clientHeight || window.innerHeight;
      boundsRef.current = {
        cw,
        ch,
        aspect: cw / Math.max(ch, 1),
      };

      petalsRef.current.forEach((p, i) => {
        const layout = INITIAL_LAYOUTS[i];
        if (layout) {
          p.x = layout.xRatio * cw;
          p.y = layout.yRatio * ch;
        }
      });
    };

    updateBounds();
    const resizeObserver = new ResizeObserver(updateBounds);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  // Vòng lặp vật lý siêu nhẹ với bộ điều tốc thích ứng (30 FPS khi tĩnh, 60 FPS khi có sóng click)
  useEffect(() => {
    let isRunning = true;
    const IDLE_FRAME_MS = 32.0;
    const ACTIVE_FRAME_MS = 16.0;

    const updatePetals = () => {
      if (!isVisibleRef.current || !isTabActiveRef.current) {
        animIdRef.current = null;
        return;
      }

      const now = performance.now();
      const water = waterRef.current;
      const ripples = water ? water.getRipples() : [];
      const targetFrameMs = ripples.length > 0 ? ACTIVE_FRAME_MS : IDLE_FRAME_MS;
      const elapsedMs = now - lastTimeRef.current;

      if (elapsedMs < targetFrameMs) {
        animIdRef.current = requestAnimationFrame(updatePetals);
        return;
      }

      const dt = Math.min(elapsedMs / 1000, 0.05);
      lastTimeRef.current = now - (elapsedMs % targetFrameMs);

      // Đọc từ bộ nhớ đệm (0ns, không trigger layout recalculation)
      const { cw, ch, aspect } = boundsRef.current;

      const startTime = water ? water.getStartTime() : 0;
      const waterTime = (now - startTime) / 1000;

      // TỐI ƯU HÓA 1: Tiền tính toán các mặt sóng 1 lần duy nhất mỗi frame trước khi lặp cánh hoa
      const activeWaveSources = waveSourcesBufferRef.current;
      activeWaveSources.length = 0; // Tái sử dụng mảng tĩnh

      if (ripples.length > 0) {
        for (let rIdx = 0; rIdx < Math.min(ripples.length, 8); rIdx++) {
          const r = ripples[rIdx];
          const age = waterTime - r.startTime;
          if (age > 0.04 && age < 3.2) {
            const waveRadius = age * 0.75 * ch;
            const packetLenPx = 0.32 * ch;
            const fadeOut = Math.max(0, Math.min(1, (3.5 - age) / 1.3));
            const baseForce = Math.exp(-age * 0.48) * fadeOut * r.strength * 40.0;

            // Sóng trực tiếp
            activeWaveSources.push({
              sx: r.x * cw,
              sy: (1.0 - r.y) * ch,
              radius: waveRadius,
              packetLen: packetLenPx,
              forceMul: baseForce,
            });

            // 4 mép viền (Bounce 1)
            const f1 = baseForce * 0.70;
            activeWaveSources.push(
              { sx: -r.x * cw, sy: (1.0 - r.y) * ch, radius: waveRadius, packetLen: packetLenPx, forceMul: f1 },
              { sx: (2.0 - r.x) * cw, sy: (1.0 - r.y) * ch, radius: waveRadius, packetLen: packetLenPx, forceMul: f1 },
              { sx: r.x * cw, sy: (2.0 - (1.0 - r.y)) * ch, radius: waveRadius, packetLen: packetLenPx, forceMul: f1 },
              { sx: r.x * cw, sy: -(1.0 - r.y) * ch, radius: waveRadius, packetLen: packetLenPx, forceMul: f1 }
            );

            // 2 bờ đối diện (Bounce 2)
            const f2 = baseForce * 0.40;
            activeWaveSources.push(
              { sx: (2.0 + r.x) * cw, sy: (1.0 - r.y) * ch, radius: waveRadius, packetLen: packetLenPx, forceMul: f2 },
              { sx: (-2.0 + r.x) * cw, sy: (1.0 - r.y) * ch, radius: waveRadius, packetLen: packetLenPx, forceMul: f2 }
            );
          }
        }
      }

      const petalsList = petalsRef.current;
      const margin = 28;
      const hasWaves = activeWaveSources.length > 0;

      for (let i = 0; i < petalsList.length; i++) {
        const p = petalsList[i];
        const el = elementsRef.current[i];
        if (!el) continue;

        // 1. Tọa độ chuẩn hóa UV của WebGL [0, 1] x [0, 1]
        const normX = Math.max(0.001, Math.min(0.999, p.x / cw));
        const normY = Math.max(0.001, Math.min(0.999, 1.0 - p.y / ch));

        // 2. Lấy thông số độ cao và độ dốc mặt nước tại vị trí cánh hoa
        const { height: waterHeight, slopeX, slopeY } = computeWaterHeightAndSlope(
          normX,
          normY,
          waterTime,
          aspect,
          ripples
        );

        // 3. Phản ứng nhô lên / hạ xuống êm dịu theo sóng (dùng exponential smoothing mượt mà)
        const targetLift = waterHeight * 36.0;
        const smoothBlend = 1.0 - Math.exp(-8.0 * dt);
        p.lift += (targetLift - p.lift) * smoothBlend;

        // Rung nhẹ liên tục không bị giật bước (Continuous Smooth Shimmer)
        const waveAmp = Math.abs(waterHeight);
        const tremor = Math.sin(waterTime * 28.0) * (waveAmp * waveAmp * 60.0);
        const totalLift = p.lift + tremor;

        // 4. Độ nghiêng 3D rất khẽ và mượt mà
        const targetTiltX = Math.max(-4.0, Math.min(4.0, slopeY * 5.0));
        const targetTiltY = Math.max(-4.0, Math.min(4.0, -slopeX * 5.0));
        p.tiltX += (targetTiltX - p.tiltX) * smoothBlend;
        p.tiltY += (targetTiltY - p.tiltY) * smoothBlend;

        // 5. TỐI ƯU HÓA 2: Lực đẩy nhẹ tính toán siêu tốc từ danh sách mặt sóng đã tiền xử lý
        if (hasWaves) {
          let pushAccX = 0;
          let pushAccY = 0;

          for (let s = 0; s < activeWaveSources.length; s++) {
            const src = activeWaveSources[s];
            const dx = p.x - src.sx;
            const dy = p.y - src.sy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 1.0) continue;

            const lag = src.radius - dist;
            if (lag >= 0.0 && lag <= src.packetLen) {
              const env = Math.sin((lag / src.packetLen) * Math.PI);
              const waveForce = (env * env) * src.forceMul;
              pushAccX += (dx / dist) * waveForce;
              pushAccY += (dy / dist) * waveForce;
            }
          }

          p.pushVx += pushAccX * dt;
          p.pushVy += pushAccY * dt;

          // Giới hạn vận tốc đẩy tối đa ở mức thật nhẹ nhàng (~12 px/s)
          const pushMag = Math.sqrt(p.pushVx * p.pushVx + p.pushVy * p.pushVy);
          if (pushMag > 12.0) {
            p.pushVx = (p.pushVx / pushMag) * 12.0;
            p.pushVy = (p.pushVy / pushMag) * 12.0;
          }
        }

        // Tiêu tán vận tốc đẩy: khi sóng nước đi qua, nhanh chóng trở về vận tốc tự nhiên ban đầu
        if (Math.abs(p.pushVx) > 0.01 || Math.abs(p.pushVy) > 0.01) {
          const decayFactor = Math.exp(-2.2 * dt);
          p.pushVx *= decayFactor;
          p.pushVy *= decayFactor;
        } else {
          p.pushVx = 0;
          p.pushVy = 0;
        }

        // 6. Dòng chảy vi lưu nước trôi lững thững tự nhiên
        p.vx += Math.sin(waterTime * 0.25 + p.id * 1.6) * 0.06 * dt;
        p.vy += Math.cos(waterTime * 0.20 + p.id * 2.0) * 0.05 * dt;

        p.vx = Math.max(-2.8, Math.min(2.8, p.vx));
        p.vy = Math.max(-2.2, Math.min(2.2, p.vy));

        p.x += (p.vx + p.pushVx) * dt;
        p.y += (p.vy + p.pushVy) * dt;

        // Góc xoay: Giữ nguyên dáng cánh hoa, chỉ đung đưa nhẹ quanh góc nghỉ (+- 2 độ)
        const currentRotation = p.baseRotation + Math.sin(waterTime * 0.4 + p.id * 1.4) * 2.2;

        // 7. Bật lại nhẹ nhàng khi va chạm vào 4 mép của Trang chủ
        if (p.x < margin) {
          p.x = margin;
          p.vx = Math.abs(p.vx) * 0.85 + 0.8;
          p.pushVx = Math.abs(p.pushVx) * 0.5;
        } else if (p.x > cw - margin) {
          p.x = cw - margin;
          p.vx = -Math.abs(p.vx) * 0.85 - 0.8;
          p.pushVx = -Math.abs(p.pushVx) * 0.5;
        }

        if (p.y < margin) {
          p.y = margin;
          p.vy = Math.abs(p.vy) * 0.85 + 0.8;
          p.pushVy = Math.abs(p.pushVy) * 0.5;
        } else if (p.y > ch - margin) {
          p.y = ch - margin;
          p.vy = -Math.abs(p.vy) * 0.85 - 0.8;
          p.pushVy = -Math.abs(p.pushVy) * 0.5;
        }

        // 8. Tọa độ Sub-Pixel mượt mà (0.01px): GPU nội suy trôi nổi không giật cục
        const posX = (p.x - p.width * 0.5).toFixed(2);
        const posY = (p.y - p.height * 0.5 - totalLift).toFixed(2);
        const posZ = totalLift.toFixed(2);
        const rotZ = currentRotation.toFixed(2);
        const tiltX = p.tiltX.toFixed(2);
        const tiltY = p.tiltY.toFixed(2);

        el.style.transform = `translate3d(${posX}px, ${posY}px, ${posZ}px) rotateZ(${rotZ}deg) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }

      animIdRef.current = requestAnimationFrame(updatePetals);
    };

    const startLoop = () => {
      if (isRunning && isVisibleRef.current && isTabActiveRef.current) {
        lastTimeRef.current = performance.now();
        animIdRef.current = requestAnimationFrame(updatePetals);
      }
    };

    const stopLoop = () => {
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
        animIdRef.current = null;
      }
    };

    // Tự động đóng băng animation khi người dùng scroll qua phần khác
    const targetElement = containerRef.current;
    let observer: IntersectionObserver | null = null;
    if (targetElement) {
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries[0]?.isIntersecting;
          isVisibleRef.current = visible;
          if (visible) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(targetElement);
    }

    const handleVisibility = () => {
      const active = !document.hidden;
      isTabActiveRef.current = active;
      if (active && isVisibleRef.current) {
        startLoop();
      } else {
        stopLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    startLoop();

    return () => {
      isRunning = false;
      stopLoop();
      if (observer && targetElement) {
        observer.unobserve(targetElement);
        observer.disconnect();
      }
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [containerRef, waterRef]);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-[5]"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
      aria-hidden="true"
    >
      {petals.map((petal, index) => (
        <div
          key={petal.id}
          ref={(el) => {
            elementsRef.current[index] = el;
          }}
          className="absolute top-0 left-0 will-change-transform transform-gpu select-none pointer-events-none"
          style={{
            width: `${petal.width}px`,
            height: `${petal.height}px`,
            opacity: petal.opacity,
            transformOrigin: '50% 50%',
            transition: 'none',
            transform: `translate3d(${(petal.x - petal.width * 0.5).toFixed(2)}px, ${(petal.y - petal.height * 0.5).toFixed(2)}px, 0px) rotateZ(${petal.baseRotation}deg)`,
          }}
        >
          <img
            src={`/petals/petal-${petal.imageIndex}.png`}
            alt=""
            loading="eager"
            draggable={false}
            className="w-full h-full object-contain pointer-events-none select-none"
            style={{ filter: 'drop-shadow(1px 3px 5px rgba(45, 60, 95, 0.20))' }}
          />
        </div>
      ))}
    </div>
  );
};
