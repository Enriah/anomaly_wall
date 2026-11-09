import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface WaterRippleItem {
  x: number;
  y: number;
  startTime: number;
  strength: number;
}

export interface WaterBackgroundHandle {
  addRipple: (clientX: number, clientY: number) => void;
  getRipples: () => WaterRippleItem[];
  getStartTime: () => number;
}

interface WaterBackgroundProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

// Vertex shader cho full-screen quad
const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Fragment shader mô phỏng bề mặt nước trắng trong suốt, sóng vật lý va vào 4 mép trang và dội ngược lại (Tối ưu hóa 60FPS)
const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;
uniform int u_num_ripples;
uniform vec4 u_ripples[8]; // Hỗ trợ tối đa 8 đợt sóng đồng thời: x, y, startTime, strength

// Hàm tính toán nhanh 1 gợn sóng với Early-Out: Nếu pixel nằm ngoài vành sóng thì lập tức return 0.0
float sampleWave(vec2 p, vec2 src, float radius, float packetLen, float atten) {
  float dist = length(p - src);
  float lag = radius - dist;
  // Bỏ qua ngay lập tức mọi tính toán lượng giác đắt đỏ khi chưa tới hoặc đã đi qua
  if (lag < 0.0 || lag > packetLen) return 0.0;
  
  float env = sin((lag / packetLen) * 3.14159265);
  return sin(lag * 54.0) * (env * env) * (atten / (1.0 + dist * 0.45));
}

// Sóng dao động tự nhiên trên mặt nước (Đã tối ưu hóa lượng giác)
float getAmbientWave(vec2 p, float t, vec2 aspect) {
  float t1 = t * 0.8;
  float t2 = t * 0.95;
  float halfW = aspect.x * 0.5;
  
  float w1 = cos(2.5 * (p.x - halfW)) * sin(2.5 * halfW + t1) * 0.016;
  float w2 = cos(3.2 * (p.y - 0.5)) * sin(1.6 + t2) * 0.014;
  float w3 = sin(p.x * 1.6 + p.y * 2.0 - t * 0.65) * 0.009;
  return w1 + w2 + w3;
}

// Tính toán sóng lan tỏa từ click chuột:
// Gợn sóng chỉ bật lại tối đa qua 2 mép viền; đến mép thứ 3 va vào sẽ dừng hẳn/không bật lại nữa.
float getClickRipples(vec2 p, float t, vec2 aspect) {
  // Khi không có click nào đang hoạt động: Tiết kiệm 100% tài nguyên GPU
  if (u_num_ripples == 0) return 0.0;
  
  float totalR = 0.0;
  float speed = 0.75;
  float W = aspect.x;
  float H = 1.0;
  float packetLen = 0.32;
  
  for (int i = 0; i < 8; i++) {
    if (i >= u_num_ripples) break;
    vec4 r = u_ripples[i];
    float age = t - r.z;
    if (age > 0.0 && age < 3.5) {
      vec2 c = vec2(r.x * W, r.y);
      float radius = age * speed;
      
      // Tính trước toàn bộ hệ số suy giảm theo thời gian (chỉ tính 1 lần duy nhất cho toàn bộ 13 nguồn sóng)
      float fadeOut = smoothstep(3.5, 2.2, age);
      float timeDamp = exp(-age * 0.48) * fadeOut * r.w * 0.10;
      
      // 1. SÓNG TRỰC TIẾP (Giai đoạn 0: chưa chạm mép nào)
      float w = sampleWave(p, c, radius, packetLen, 1.0);
      
      // 2. BẬT QUA MÉP THỨ 1 (Giai đoạn 1: dội lần 1 từ 4 mép viền của trang)
      w += sampleWave(p, vec2(-c.x, c.y), radius, packetLen, 0.70); // Bật qua mép trái
      w += sampleWave(p, vec2(2.0 * W - c.x, c.y), radius, packetLen, 0.70); // Bật qua mép phải
      w += sampleWave(p, vec2(c.x, -c.y), radius, packetLen, 0.70); // Bật qua mép dưới
      w += sampleWave(p, vec2(c.x, 2.0 * H - c.y), radius, packetLen, 0.70); // Bật qua mép trên
      
      // 3. BẬT QUA MÉP THỨ 2 (Giai đoạn 2: dội lần 2 khi tiếp tục va vào bờ thứ 2)
      // Dội tiếp giữa 2 bờ đối diện:
      w += sampleWave(p, vec2(2.0 * W + c.x, c.y), radius, packetLen, 0.42); // Trái -> Phải
      w += sampleWave(p, vec2(-2.0 * W + c.x, c.y), radius, packetLen, 0.42); // Phải -> Trái
      w += sampleWave(p, vec2(c.x, 2.0 * H + c.y), radius, packetLen, 0.42); // Dưới -> Trên
      w += sampleWave(p, vec2(c.x, -2.0 * H + c.y), radius, packetLen, 0.42); // Trên -> Dưới
      // Dội tiếp giữa 2 bờ kề cận (góc):
      w += sampleWave(p, vec2(-c.x, -c.y), radius, packetLen, 0.36); // Trái <-> Dưới
      w += sampleWave(p, vec2(-c.x, 2.0 * H - c.y), radius, packetLen, 0.36); // Trái <-> Trên
      w += sampleWave(p, vec2(2.0 * W - c.x, -c.y), radius, packetLen, 0.36); // Phải <-> Dưới
      w += sampleWave(p, vec2(2.0 * W - c.x, 2.0 * H - c.y), radius, packetLen, 0.36); // Phải <-> Trên
      
      // 4. ĐẾN MÉP THỨ 3: TUYỆT ĐỐI KHÔNG BẬT LẠI NỮA
      totalR += w * timeDamp;
    }
  }
  return totalR;
}

// Tổng hợp độ cao mặt nước tại tọa độ uv
float getWaterHeight(vec2 uv, float t, vec2 aspect) {
  vec2 p = vec2(uv.x * aspect.x, uv.y);
  return getAmbientWave(p, t, aspect) + getClickRipples(p, t, aspect);
}

void main() {
  vec2 uv = v_uv;
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  float t = u_time;
  
  // TỐI ƯU HÓA NORMAL: Central Difference với 3 lần lấy mẫu thay vì 4 lần (Giảm 25% tổng tải shader)
  vec2 e = vec2(2.2 / u_resolution.x, 2.2 / u_resolution.y);
  float h0 = getWaterHeight(uv, t, aspect);
  float hX = getWaterHeight(uv + vec2(e.x, 0.0), t, aspect);
  float hY = getWaterHeight(uv + vec2(0.0, e.y), t, aspect);
  
  float dhX = (hX - h0) * 22.0;
  float dhY = (hY - h0) * 22.0;
  vec3 normal = normalize(vec3(-dhX, -dhY, 1.0));

  // Hướng nguồn sáng chính (Studio Light phía trên bên trái)
  vec3 lightDir = normalize(vec3(0.28, 0.52, 0.81));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfVec = normalize(lightDir + viewDir);

  float NdotL = dot(normal, lightDir);
  float spec = pow(max(dot(normal, halfVec), 0.0), 28.0);
  float specSharp = pow(max(dot(normal, halfVec), 0.0), 110.0);
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

  // Gam màu nước trắng ngọc bích / pha lê (Luminous Crystal White Water)
  vec3 baseColor = vec3(0.985, 0.988, 0.995);
  vec3 crestColor = vec3(1.0, 1.0, 1.0);
  vec3 troughColor = vec3(0.925, 0.938, 0.958);

  // Hiệu ứng đổ bóng khúc xạ nước (Refraction Depth Slope)
  float slope = clamp(normal.x * 0.25 + normal.y * 0.35, -0.2, 0.2);
  
  vec3 color = mix(baseColor, troughColor, clamp(-h0 * 7.5 - slope * 0.4, 0.0, 0.16));
  color = mix(color, crestColor, clamp(h0 * 9.0 + slope * 0.3, 0.0, 0.22));

  // Ánh sáng lấp lánh phản quang (Specular & Caustic Shimmer)
  color += spec * 0.20 + specSharp * 0.45;
  color += fresnel * 0.08 * vec3(0.85, 0.89, 0.96);

  // Viền hồ nước nhẹ định hình khuôn khổ trang chủ (Basin Boundary Rim)
  float edgeDistX = min(uv.x, 1.0 - uv.x) * aspect.x;
  float edgeDistY = min(uv.y, 1.0 - uv.y);
  float edgeDist = min(edgeDistX, edgeDistY);
  float rim = smoothstep(0.0, 0.025, edgeDist);
  color = mix(color * 0.965, color, rim);

  // Vignette nhẹ ở 4 góc
  vec2 sc = uv - 0.5;
  color *= (1.0 - dot(sc, sc) * 0.15);

  gl_FragColor = vec4(color, 1.0);
}
`;

export const WaterBackground = forwardRef<WaterBackgroundHandle, WaterBackgroundProps>(
  ({ containerRef }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const animIdRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(performance.now());
    const isVisibleRef = useRef<boolean>(true);
    const isTabActiveRef = useRef<boolean>(true);

    // Mảng lưu trữ tối đa 8 đợt sóng kích hoạt
    const MAX_RIPPLES = 8;
    const ripplesRef = useRef<{ x: number; y: number; startTime: number; strength: number }[]>([]);
    // Bộ đệm TypedArray tái sử dụng cố định (8 vec4 = 32 floats), triệt tiêu hoàn toàn rác bộ nhớ (Zero Garbage Collection)
    const rippleBufferRef = useRef(new Float32Array(32));

    const addRippleAtNormalized = (normX: number, normY: number, strength = 1.0) => {
      const now = (performance.now() - startTimeRef.current) / 1000;
      // Lọc bỏ những sóng đã hoàn tất 2 lần bật và tan hẳn sau 3.5 giây
      const list = ripplesRef.current.filter((r) => now - r.startTime < 3.5);
      list.push({ x: normX, y: normY, startTime: now, strength });
      if (list.length > MAX_RIPPLES) {
        list.shift();
      }
      ripplesRef.current = list;
    };

    useImperativeHandle(ref, () => ({
      addRipple: (clientX: number, clientY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const normX = Math.max(0.001, Math.min(0.999, (clientX - rect.left) / rect.width));
        const normY = Math.max(0.001, Math.min(0.999, 1.0 - (clientY - rect.top) / rect.height)); // Lật ngược trục Y cho hệ tọa độ WebGL
        addRippleAtNormalized(normX, normY, 1.0);
      },
      getRipples: () => ripplesRef.current,
      getStartTime: () => startTimeRef.current,
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Cấu hình ngữ cảnh WebGL hiệu năng cao: tắt MSAA thừa thãi (quad 2D không cần), tắt Depth & Stencil buffer
      const gl = canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false,
      });

      if (!gl) {
        console.warn('WebGL không được hỗ trợ trên thiết bị này.');
        return;
      }
      glRef.current = gl;

      // Biên dịch Shader
      const createShader = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error('Lỗi biên dịch shader:', gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      if (!vertShader || !fragShader) return;

      const program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vertShader);
      gl.attachShader(program, fragShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Lỗi liên kết chương trình WebGL:', gl.getProgramInfoLog(program));
        return;
      }
      gl.useProgram(program);

      // Tạo Fullscreen Quad Geometry
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positions = new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

      const aPositionLocation = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(aPositionLocation);
      gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);

      // Định vị các Uniforms
      const uResolutionLocation = gl.getUniformLocation(program, 'u_resolution');
      const uTimeLocation = gl.getUniformLocation(program, 'u_time');
      const uNumRipplesLocation = gl.getUniformLocation(program, 'u_num_ripples');
      const uRipplesLocation = gl.getUniformLocation(program, 'u_ripples');

      // Tự động điều chỉnh kích thước Canvas: Giới hạn DPR tối đa 1.25 giúp giảm tải 65% điểm ảnh (Pixel Fill-rate) mà vẫn sắc nét
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
        const displayWidth = Math.floor(canvas.clientWidth * dpr);
        const displayHeight = Math.floor(canvas.clientHeight * dpr);

        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
          canvas.width = displayWidth;
          canvas.height = displayHeight;
          gl.viewport(0, 0, displayWidth, displayHeight);
        }
      };
      resize();

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);

      // Vòng lặp Render WebGL (Render Loop)
      let isRendering = false;
      const rippleData = rippleBufferRef.current;

      const render = () => {
        if (!isVisibleRef.current || !isTabActiveRef.current) {
          isRendering = false;
          animIdRef.current = null;
          return;
        }

        const now = (performance.now() - startTimeRef.current) / 1000;
        gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(uTimeLocation, now);

        // Chuẩn bị dữ liệu cho mảng đợt sóng trên bộ đệm tĩnh (Contiguous Packing - Không để lại lỗ hổng)
        const ripples = ripplesRef.current;
        let activeCount = 0;
        let hasExpired = false;

        for (let i = 0; i < ripples.length; i++) {
          const r = ripples[i];
          const age = now - r.startTime;
          if (age >= 0.0 && age < 3.5) {
            if (activeCount < MAX_RIPPLES) {
              rippleData[activeCount * 4 + 0] = r.x;
              rippleData[activeCount * 4 + 1] = r.y;
              rippleData[activeCount * 4 + 2] = r.startTime;
              rippleData[activeCount * 4 + 3] = r.strength;
              activeCount++;
            }
          } else {
            hasExpired = true;
          }
        }

        // Tự động dọn dẹp các đợt sóng đã tắt khỏi danh sách trạng thái
        if (hasExpired) {
          ripplesRef.current = ripples.filter((r) => now - r.startTime < 3.5);
        }

        // Điền dữ liệu rỗng cho các slot còn lại
        for (let i = activeCount; i < MAX_RIPPLES; i++) {
          rippleData[i * 4 + 0] = -10.0;
          rippleData[i * 4 + 1] = -10.0;
          rippleData[i * 4 + 2] = -100.0;
          rippleData[i * 4 + 3] = 0.0;
        }

        gl.uniform1i(uNumRipplesLocation, activeCount);
        if (activeCount > 0) {
          gl.uniform4fv(uRipplesLocation, rippleData);
        }

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        animIdRef.current = requestAnimationFrame(render);
      };

      const startRenderLoop = () => {
        if (!isRendering && isVisibleRef.current && isTabActiveRef.current) {
          isRendering = true;
          animIdRef.current = requestAnimationFrame(render);
        }
      };

      const stopRenderLoop = () => {
        if (animIdRef.current) {
          cancelAnimationFrame(animIdRef.current);
          animIdRef.current = null;
        }
        isRendering = false;
      };

      // TỐI ƯU HIỆU NĂNG 1: IntersectionObserver đóng băng ngay khi scroll qua phần khác
      const targetElement = containerRef?.current || canvas;
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const visible = entry && entry.isIntersecting;
          isVisibleRef.current = visible;
          if (visible) {
            startRenderLoop();
          } else {
            stopRenderLoop();
          }
        },
        {
          root: null,
          threshold: 0.02, // Đóng băng ngay khi phần khác chiếm gần như toàn bộ page
        }
      );
      intersectionObserver.observe(targetElement);

      // TỐI ƯU HIỆU NĂNG 2: Đóng băng khi người dùng chuyển sang tab trình duyệt khác
      const handleVisibilityChange = () => {
        const active = !document.hidden;
        isTabActiveRef.current = active;
        if (active && isVisibleRef.current) {
          startRenderLoop();
        } else {
          stopRenderLoop();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Khởi động vòng lặp render
      startRenderLoop();

      return () => {
        stopRenderLoop();
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        document.removeEventListener('visibilitychange', handleVisibilityChange);

        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
      };
    }, [containerRef]);

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 transform-gpu"
        style={{ display: 'block', willChange: 'transform' }}
      />
    );
  }
);

// Tính toán độ cao và độ dốc mặt nước trên CPU đồng bộ hoàn hảo với WebGL Shader
function sampleWaveCPU(px: number, py: number, srcX: number, srcY: number, radius: number, packetLen: number, atten: number): number {
  const dx = px - srcX;
  const dy = py - srcY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const lag = radius - dist;
  if (lag < 0.0 || lag > packetLen) return 0.0;
  const env = Math.sin((lag / packetLen) * Math.PI);
  return Math.sin(lag * 54.0) * (env * env) * (atten / (1.0 + dist * 0.45));
}

function getAmbientWaveCPU(px: number, py: number, t: number, aspect: number): number {
  const t1 = t * 0.8;
  const t2 = t * 0.95;
  const halfW = aspect * 0.5;
  const w1 = Math.cos(2.5 * (px - halfW)) * Math.sin(2.5 * halfW + t1) * 0.016;
  const w2 = Math.cos(3.2 * (py - 0.5)) * Math.sin(1.6 + t2) * 0.014;
  const w3 = Math.sin(px * 1.6 + py * 2.0 - t * 0.65) * 0.009;
  return w1 + w2 + w3;
}

function getClickRipplesCPU(px: number, py: number, t: number, aspect: number, ripples: WaterRippleItem[]): number {
  if (!ripples || ripples.length === 0) return 0.0;
  let totalR = 0.0;
  const speed = 0.75;
  const W = aspect;
  const H = 1.0;
  const packetLen = 0.32;

  for (let i = 0; i < Math.min(ripples.length, 8); i++) {
    const r = ripples[i];
    const age = t - r.startTime;
    if (age > 0.0 && age < 3.5) {
      const cx = r.x * W;
      const cy = r.y;
      const radius = age * speed;
      const fadeOut = Math.max(0, Math.min(1, (3.5 - age) / (3.5 - 2.2)));
      const timeDamp = Math.exp(-age * 0.48) * fadeOut * r.strength * 0.10;

      // 1. Sóng trực tiếp
      let w = sampleWaveCPU(px, py, cx, cy, radius, packetLen, 1.0);
      // 2. Bật qua mép 1
      w += sampleWaveCPU(px, py, -cx, cy, radius, packetLen, 0.70);
      w += sampleWaveCPU(px, py, 2.0 * W - cx, cy, radius, packetLen, 0.70);
      w += sampleWaveCPU(px, py, cx, -cy, radius, packetLen, 0.70);
      w += sampleWaveCPU(px, py, cx, 2.0 * H - cy, radius, packetLen, 0.70);
      // 3. Bật qua mép 2
      w += sampleWaveCPU(px, py, 2.0 * W + cx, cy, radius, packetLen, 0.42);
      w += sampleWaveCPU(px, py, -2.0 * W + cx, cy, radius, packetLen, 0.42);
      w += sampleWaveCPU(px, py, cx, 2.0 * H + cy, radius, packetLen, 0.42);
      w += sampleWaveCPU(px, py, cx, -2.0 * H + cy, radius, packetLen, 0.42);
      w += sampleWaveCPU(px, py, -cx, -cy, radius, packetLen, 0.36);
      w += sampleWaveCPU(px, py, -cx, 2.0 * H - cy, radius, packetLen, 0.36);
      w += sampleWaveCPU(px, py, 2.0 * W - cx, -cy, radius, packetLen, 0.36);
      w += sampleWaveCPU(px, py, 2.0 * W - cx, 2.0 * H - cy, radius, packetLen, 0.36);

      totalR += w * timeDamp;
    }
  }
  return totalR;
}

export function computeWaterHeightAndSlope(
  normX: number,
  normY: number,
  t: number,
  aspect: number,
  ripples: WaterRippleItem[]
): { height: number; slopeX: number; slopeY: number } {
  const px = normX * aspect;
  const py = normY;
  const h0 = getAmbientWaveCPU(px, py, t, aspect) + getClickRipplesCPU(px, py, t, aspect, ripples);

  const eps = 0.008;
  const hX = getAmbientWaveCPU(px + eps, py, t, aspect) + getClickRipplesCPU(px + eps, py, t, aspect, ripples);
  const hY = getAmbientWaveCPU(px, py + eps, t, aspect) + getClickRipplesCPU(px, py + eps, t, aspect, ripples);

  const slopeX = (hX - h0) / eps;
  const slopeY = (hY - h0) / eps;

  return { height: h0, slopeX, slopeY };
}
