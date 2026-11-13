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

// Fragment shader mô phỏng bề mặt nước pha lê siêu tối ưu bằng toán học giải tích (Single-Pass Analytical Derivative)
// Loại bỏ hoàn toàn 3 lần lấy mẫu sai phân (Finite Difference 3x) -> Giảm 67% khối lượng tính toán
const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec4 u_amb; // x: mod1, y: mod2, z: t * 0.65, w: halfW
uniform int u_num_ripples;
uniform vec4 u_ripples[8]; // Hỗ trợ tối đa 8 đợt sóng đồng thời: x, y, startTime, strength

#define PI 3.14159265359

// Hàm tính toán đồng thời độ cao và đạo hàm riêng không gian (Analytical Gradient) trong 1 lần duy nhất
// acc.x: độ cao h(x, y)
// acc.y: đạo hàm dh/dx
// acc.z: đạo hàm dh/dy
void addWaveAnalytical(inout vec3 acc, vec2 p, vec2 src, float radius, float packetLen, float atten) {
  vec2 d = p - src;
  float dist = length(d);
  float lag = radius - dist;
  
  // Early-Out: Nếu pixel nằm ngoài vành sóng thì thoát ngay lập tức (tiết kiệm 100% phép toán phía sau)
  if (lag < 0.0 || lag > packetLen) return;
  
  float kEnv = PI / packetLen;
  float u = lag * kEnv;
  float v = lag * 54.0;
  
  float sU = sin(u);
  float cU = cos(u);
  float sV = sin(v);
  float cV = cos(v);
  
  float env2 = sU * sU;
  // Đạo hàm d/d(lag) của [sin^2(u) * sin(v)] theo quy tắc nhân vi tích phân
  float dLag = (2.0 * sU * cU * kEnv) * sV + env2 * (54.0 * cV);
  
  float amp = atten / (1.0 + dist * 0.45);
  float h = sV * env2 * amp;
  
  // lag = radius - dist => d(lag)/d(dist) = -1.0
  float dDist = -dLag * amp;
  
  float invDist = 1.0 / max(dist, 0.0001);
  vec2 dir = d * invDist;
  
  acc.x += h;
  acc.yz += dDist * dir;
}

// Sóng dao động tự nhiên trên mặt nước (Phép toán giải tích 1-Pass, nhận hệ số mod1/mod2 tính sẵn từ CPU)
vec3 getAmbientSurface(vec2 p) {
  float arg1 = 2.5 * (p.x - u_amb.w);
  float w1 = cos(arg1) * u_amb.x;
  float dw1_dx = -2.5 * sin(arg1) * u_amb.x;
  
  float arg2 = 3.2 * (p.y - 0.5);
  float w2 = cos(arg2) * u_amb.y;
  float dw2_dy = -3.2 * sin(arg2) * u_amb.y;
  
  float arg3 = p.x * 1.6 + p.y * 2.0 - u_amb.z;
  float w3 = sin(arg3) * 0.009;
  float c3 = cos(arg3) * 0.009;
  float dw3_dx = 1.6 * c3;
  float dw3_dy = 2.0 * c3;
  
  return vec3(
    w1 + w2 + w3,
    dw1_dx + dw3_dx,
    dw2_dy + dw3_dy
  );
}

// Tính toán sóng lan tỏa từ click chuột bằng toán học giải tích kết hợp Geometric Culling:
// Gợn sóng chỉ bật lại tối đa qua 2 mép viền; đến mép thứ 3 va vào sẽ dừng hẳn/không bật lại nữa.
vec3 getClickSurface(vec2 p, float t, vec2 aspect) {
  // Khi không có click nào đang hoạt động: Tiết kiệm 100% tài nguyên GPU
  if (u_num_ripples == 0) return vec3(0.0);
  
  vec3 total = vec3(0.0);
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
      
      // Hệ số suy giảm theo thời gian (chỉ tính 1 lần duy nhất cho toàn bộ các nguồn phản xạ)
      float fadeOut = clamp((3.5 - age) / 1.3, 0.0, 1.0);
      float timeDamp = exp(-age * 0.48) * fadeOut * r.w * 0.10;
      
      vec3 rippleAcc = vec3(0.0);
      
      // 1. SÓNG TRỰC TIẾP (Giai đoạn 0: chưa chạm mép nào)
      addWaveAnalytical(rippleAcc, p, c, radius, packetLen, 1.0);
      
      // 2. BẬT QUA MÉP THỨ 1 (Culling hình học: Chỉ tính nguồn phản xạ khi bán kính sóng đã vươn tới mép đó)
      if (radius > c.x) {
        addWaveAnalytical(rippleAcc, p, vec2(-c.x, c.y), radius, packetLen, 0.70); // Bật qua mép trái
      }
      if (radius > (W - c.x)) {
        addWaveAnalytical(rippleAcc, p, vec2(2.0 * W - c.x, c.y), radius, packetLen, 0.70); // Bật qua mép phải
      }
      if (radius > c.y) {
        addWaveAnalytical(rippleAcc, p, vec2(c.x, -c.y), radius, packetLen, 0.70); // Bật qua mép dưới
      }
      if (radius > (H - c.y)) {
        addWaveAnalytical(rippleAcc, p, vec2(c.x, 2.0 * H - c.y), radius, packetLen, 0.70); // Bật qua mép trên
      }
      
      // 3. BẬT QUA MÉP THỨ 2 (Chỉ xảy ra khi sóng đã di chuyển quãng đường lớn hơn bề rộng mép)
      if (radius > min(W, H)) {
        // Dội tiếp giữa 2 bờ đối diện:
        if (radius > (2.0 * W - c.x)) {
          addWaveAnalytical(rippleAcc, p, vec2(2.0 * W + c.x, c.y), radius, packetLen, 0.42); // Trái -> Phải
        }
        if (radius > (W + c.x)) {
          addWaveAnalytical(rippleAcc, p, vec2(-2.0 * W + c.x, c.y), radius, packetLen, 0.42); // Phải -> Trái
        }
        if (radius > (2.0 * H - c.y)) {
          addWaveAnalytical(rippleAcc, p, vec2(c.x, 2.0 * H + c.y), radius, packetLen, 0.42); // Dưới -> Trên
        }
        if (radius > (H + c.y)) {
          addWaveAnalytical(rippleAcc, p, vec2(c.x, -2.0 * H + c.y), radius, packetLen, 0.42); // Trên -> Dưới
        }
        // Dội tiếp giữa 2 bờ kề cận (góc) - có Culling hình học:
        if (radius > length(vec2(c.x, c.y))) {
          addWaveAnalytical(rippleAcc, p, vec2(-c.x, -c.y), radius, packetLen, 0.36); // Trái <-> Dưới
        }
        if (radius > length(vec2(c.x, H - c.y))) {
          addWaveAnalytical(rippleAcc, p, vec2(-c.x, 2.0 * H - c.y), radius, packetLen, 0.36); // Trái <-> Trên
        }
        if (radius > length(vec2(W - c.x, c.y))) {
          addWaveAnalytical(rippleAcc, p, vec2(2.0 * W - c.x, -c.y), radius, packetLen, 0.36); // Phải <-> Dưới
        }
        if (radius > length(vec2(W - c.x, H - c.y))) {
          addWaveAnalytical(rippleAcc, p, vec2(2.0 * W - c.x, 2.0 * H - c.y), radius, packetLen, 0.36); // Phải <-> Trên
        }
      }
      
      // 4. ĐẾN MÉP THỨ 3: TUYỆT ĐỐI KHÔNG BẬT LẠI NỮA
      total += rippleAcc * timeDamp;
    }
  }
  return total;
}

void main() {
  vec2 uv = v_uv;
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  float t = u_time;
  vec2 p = vec2(uv.x * aspect.x, uv.y);
  
  // TỐI ƯU TOÁN HỌC ĐỈNH CAO: Tính toán bề mặt và pháp tuyến trong 1 Pass duy nhất (Single Pass)
  vec3 amb = getAmbientSurface(p);
  vec3 rip = getClickSurface(p, t, aspect);
  vec3 surf = amb + rip;
  
  float h0 = surf.x;
  // Gradient giải tích chính xác tuyệt đối không cần lấy mẫu sai phân
  float normalScale = 0.38;
  vec3 normal = normalize(vec3(-surf.y * normalScale, -surf.z * normalScale, 1.0));

  // Hướng nguồn sáng chính (đã chuẩn hóa sẵn thành hằng số, không cần normalize mỗi pixel)
  const vec3 viewDir = vec3(0.0, 0.0, 1.0);
  const vec3 halfVec = vec3(0.1466, 0.2722, 0.9510);
  
  // TỐI ƯU HÓA LŨY THỪA NHỊ PHÂN: Thay hàm pow() đắt đỏ bằng các phép nhân liên tiếp
  // Tiết kiệm 100% tài nguyên đơn vị xử lý siêu việt SFU trên GPU tích hợp Intel UHD
  float nh = max(dot(normal, halfVec), 0.0);
  float nh2 = nh * nh;
  float nh4 = nh2 * nh2;
  float nh8 = nh4 * nh4;
  float nh16 = nh8 * nh8;
  float spec = nh16 * nh8 * nh4; // Tương đương nh^28
  
  float nh32 = nh16 * nh16;
  float nh64 = nh32 * nh32;
  float specSharp = nh64 * nh32 * nh16; // Tương đương nh^112 (xấp xỉ nh^110)
  
  float f1 = 1.0 - max(dot(normal, viewDir), 0.0);
  float fresnel = f1 * f1 * f1; // f1^3

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
      const uAmbLocation = gl.getUniformLocation(program, 'u_amb');
      const uNumRipplesLocation = gl.getUniformLocation(program, 'u_num_ripples');
      const uRipplesLocation = gl.getUniformLocation(program, 'u_ripples');

      // Tự động điều chỉnh kích thước Canvas: Giới hạn DPR ở mức 0.45 giúp giảm ~72% điểm ảnh (Pixel Fill-rate)
      // Sóng nước có tần số thấp và mượt nên bộ lọc Bilinear Smoothing của WebGL tự động làm mịn hoàn hảo, không răng cưa
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 0.45);
        const displayWidth = Math.max(320, Math.floor(canvas.clientWidth * dpr));
        const displayHeight = Math.max(240, Math.floor(canvas.clientHeight * dpr));

        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
          canvas.width = displayWidth;
          canvas.height = displayHeight;
          gl.viewport(0, 0, displayWidth, displayHeight);
        }
      };
      resize();

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);

      // Vòng lặp Render WebGL thích ứng (Adaptive Frame Governor):
      // - Khi mặt nước tĩnh (không có ripple): chạy 30 FPS (~32ms) tiết kiệm 50% GPU mà vẫn mượt hoàn toàn
      // - Khi có sóng click (ripple active): tự động tăng lên ~55-60 FPS (~16ms) để gợn sóng sắc nét
      let isRendering = false;
      const rippleData = rippleBufferRef.current;
      let lastFrameTime = performance.now();
      const IDLE_FRAME_MS = 32.0;   // ~30 FPS khi chỉ có sóng tự nhiên
      const ACTIVE_FRAME_MS = 16.0; // ~60 FPS khi có sóng click đang lan tỏa

      const render = (currentTime: number) => {
        if (!isVisibleRef.current || !isTabActiveRef.current) {
          isRendering = false;
          animIdRef.current = null;
          return;
        }

        animIdRef.current = requestAnimationFrame(render);

        const hasActiveRipples = ripplesRef.current.length > 0;
        const targetFrameMs = hasActiveRipples ? ACTIVE_FRAME_MS : IDLE_FRAME_MS;
        const delta = currentTime - lastFrameTime;
        if (delta < targetFrameMs) {
          return;
        }
        lastFrameTime = currentTime - (delta % targetFrameMs);

        const now = (currentTime - startTimeRef.current) / 1000;
        const aspectX = canvas.width / Math.max(canvas.height, 1);
        const halfW = aspectX * 0.5;
        const mod1 = Math.sin(2.5 * halfW + now * 0.8) * 0.016;
        const mod2 = Math.sin(1.6 + now * 0.95) * 0.014;

        gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(uTimeLocation, now);
        gl.uniform4f(uAmbLocation, mod1, mod2, now * 0.65, halfW);

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
      };

      const startRenderLoop = () => {
        if (!isRendering && isVisibleRef.current && isTabActiveRef.current) {
          isRendering = true;
          lastFrameTime = performance.now();
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

      // TỐI ƯU HIỆU NĂNG 1: IntersectionObserver đóng băng ngay khi scroll qua phần khác (Gallery / Projects)
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
          threshold: 0.05, // Lập tức đóng băng toàn bộ WebGL khi scroll xuống phần Gallery
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
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ display: 'block' }}
      />
    );
  }
);

// Tính toán độ cao và độ dốc mặt nước trên CPU bằng toán học giải tích 1-Pass (Đồng bộ hoàn hảo với WebGL Shader)
export function computeWaterHeightAndSlope(
  normX: number,
  normY: number,
  t: number,
  aspect: number,
  ripples: WaterRippleItem[]
): { height: number; slopeX: number; slopeY: number } {
  const px = normX * aspect;
  const py = normY;

  // 1. Sóng tự nhiên (Ambient Waves - Analytical Derivatives)
  const t1 = t * 0.8;
  const t2 = t * 0.95;
  const halfW = aspect * 0.5;

  const arg1 = 2.5 * (px - halfW);
  const mod1 = Math.sin(2.5 * halfW + t1) * 0.016;
  const w1 = Math.cos(arg1) * mod1;
  const dw1_dx = -2.5 * Math.sin(arg1) * mod1;

  const arg2 = 3.2 * (py - 0.5);
  const mod2 = Math.sin(1.6 + t2) * 0.014;
  const w2 = Math.cos(arg2) * mod2;
  const dw2_dy = -3.2 * Math.sin(arg2) * mod2;

  const arg3 = px * 1.6 + py * 2.0 - t * 0.65;
  const w3 = Math.sin(arg3) * 0.009;
  const c3 = Math.cos(arg3) * 0.009;
  const dw3_dx = 1.6 * c3;
  const dw3_dy = 2.0 * c3;

  let totalH = w1 + w2 + w3;
  let totalSlopeX = dw1_dx + dw3_dx;
  let totalSlopeY = dw2_dy + dw3_dy;

  // 2. Sóng click chuột với Geometric Culling và Analytical Gradient
  if (ripples && ripples.length > 0) {
    const speed = 0.75;
    const W = aspect;
    const H = 1.0;
    const packetLen = 0.32;
    const kEnv = Math.PI / packetLen;

    for (let i = 0; i < Math.min(ripples.length, 8); i++) {
      const r = ripples[i];
      const age = t - r.startTime;
      if (age > 0.0 && age < 3.5) {
        const cx = r.x * W;
        const cy = r.y;
        const radius = age * speed;
        const fadeOut = Math.max(0, Math.min(1, (3.5 - age) / 1.3));
        const timeDamp = Math.exp(-age * 0.48) * fadeOut * r.strength * 0.10;

        const addWave = (sx: number, sy: number, atten: number) => {
          const dx = px - sx;
          const dy = py - sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const lag = radius - dist;
          if (lag < 0.0 || lag > packetLen) return;

          const u = lag * kEnv;
          const v = lag * 54.0;
          const sU = Math.sin(u);
          const cU = Math.cos(u);
          const sV = Math.sin(v);
          const cV = Math.cos(v);

          const env2 = sU * sU;
          const dLag = (2.0 * sU * cU * kEnv) * sV + env2 * (54.0 * cV);
          const amp = atten / (1.0 + dist * 0.45);
          const waveH = sV * env2 * amp;
          const dDist = -dLag * amp;
          const invDist = 1.0 / Math.max(dist, 0.0001);

          totalH += waveH * timeDamp;
          totalSlopeX += dDist * (dx * invDist) * timeDamp;
          totalSlopeY += dDist * (dy * invDist) * timeDamp;
        };

        // 1. Sóng trực tiếp
        addWave(cx, cy, 1.0);

        // 2. Bật qua mép thứ 1 (Culling hình học)
        if (radius > cx) addWave(-cx, cy, 0.70);
        if (radius > W - cx) addWave(2.0 * W - cx, cy, 0.70);
        if (radius > cy) addWave(cx, -cy, 0.70);
        if (radius > H - cy) addWave(cx, 2.0 * H - cy, 0.70);

        // 3. Bật qua mép thứ 2
        if (radius > Math.min(W, H)) {
          if (radius > 2.0 * W - cx) addWave(2.0 * W + cx, cy, 0.42);
          if (radius > W + cx) addWave(-2.0 * W + cx, cy, 0.42);
          if (radius > 2.0 * H - cy) addWave(cx, 2.0 * H + cy, 0.42);
          if (radius > H + cy) addWave(cx, -2.0 * H + cy, 0.42);
          addWave(-cx, -cy, 0.36);
          addWave(-cx, 2.0 * H - cy, 0.36);
          addWave(2.0 * W - cx, -cy, 0.36);
          addWave(2.0 * W - cx, 2.0 * H - cy, 0.36);
        }
      }
    }
  }

  return { height: totalH, slopeX: totalSlopeX, slopeY: totalSlopeY };
}
