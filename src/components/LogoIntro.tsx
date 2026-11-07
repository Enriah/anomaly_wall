import React, { useEffect, useState, useMemo, useRef } from 'react';

interface LogoIntroProps {
  onComplete: () => void;
  lang?: 'vi' | 'en';
}

interface HexPolygon {
  cls: 'cls-1' | 'cls-2';
  points: string;
}

const LAYER2_POLYGONS: HexPolygon[] = [
  { cls: 'cls-2', points: '363.15 249.87 338.15 249.87 325.65 272.08 338.15 294.29 363.15 294.29 375.65 272.08 363.15 249.87' },
  { cls: 'cls-1', points: '428.98 207.79 419.54 224.14 429.28 241.01 448.76 241.01 458.5 224.14 449.06 207.79 428.98 207.79' },
  { cls: 'cls-1', points: '459.59 257.88 449.85 241.01 459.59 224.14 479.07 224.14 488.81 241.01 479.07 257.88 459.59 257.88' },
  { cls: 'cls-1', points: '450.68 207.79 460.12 224.14 479.6 224.14 489.05 207.79 450.68 207.79' },
  { cls: 'cls-1', points: '509.1 207.79 518.54 224.14 538.02 224.14 547.46 207.79 509.1 207.79' },
  { cls: 'cls-1', points: '489.44 343.16 479.7 326.29 489.44 309.42 508.92 309.42 518.66 326.29 508.92 343.16 489.44 343.16' },
  { cls: 'cls-1', points: '569.25 207.79 578.69 224.14 598.17 224.14 607.62 207.79 569.25 207.79' },
  { cls: 'cls-1', points: '489.14 207.79 479.7 224.14 489.44 241.01 508.92 241.01 518.66 224.14 509.22 207.79 489.14 207.79' },
  { cls: 'cls-1', points: '489.44 274.75 479.7 257.88 489.44 241.01 508.92 241.01 518.66 257.88 508.92 274.75 489.44 274.75' },
  { cls: 'cls-1', points: '459.59 292.09 449.85 275.21 459.59 258.34 479.07 258.34 488.81 275.21 479.07 292.09 459.59 292.09' },
  { cls: 'cls-1', points: '429.28 274.75 419.54 257.88 429.28 241.01 448.76 241.01 458.5 257.88 448.76 274.75 429.28 274.75' },
  { cls: 'cls-1', points: '429.28 308.02 419.54 291.15 429.28 274.28 448.76 274.28 458.5 291.15 448.76 308.02 429.28 308.02' },
  { cls: 'cls-1', points: '459.59 326.29 449.85 309.42 459.59 292.55 479.07 292.55 488.81 309.42 479.07 326.29 459.59 326.29' },
  { cls: 'cls-1', points: '489.44 308.96 479.7 292.09 489.44 275.21 508.92 275.21 518.66 292.09 508.92 308.96 489.44 308.96' },
  { cls: 'cls-1', points: '518.54 257.88 508.8 241.01 518.54 224.14 538.02 224.14 547.76 241.01 538.02 257.88 518.54 257.88' },
  { cls: 'cls-1', points: '548.85 274.75 539.11 257.88 548.85 241.01 568.33 241.01 578.07 257.88 568.33 274.75 548.85 274.75' },
  { cls: 'cls-1', points: '549.08 207.79 539.64 224.14 549.38 241.01 568.86 241.01 578.6 224.14 569.16 207.79 549.08 207.79' },
  { cls: 'cls-1', points: '578.69 257.88 568.95 241.01 578.69 224.14 598.17 224.14 607.91 241.01 598.17 257.88 578.69 257.88' },
  { cls: 'cls-1', points: '578.69 291.63 568.95 274.75 578.69 257.88 598.17 257.88 607.91 274.75 598.17 291.63 578.69 291.63' },
  { cls: 'cls-1', points: '548.85 308.96 539.11 292.09 548.85 275.21 568.33 275.21 578.07 292.09 568.33 308.96 548.85 308.96' },
  { cls: 'cls-1', points: '518.54 291.63 508.8 274.75 518.54 257.88 538.02 257.88 547.76 274.75 538.02 291.63 518.54 291.63' },
  { cls: 'cls-1', points: '518.54 324.9 508.8 308.02 518.54 291.15 538.02 291.15 547.76 308.02 538.02 324.9 518.54 324.9' },
  { cls: 'cls-1', points: '548.85 343.16 539.11 326.29 548.85 309.42 568.33 309.42 578.07 326.29 568.33 343.16 548.85 343.16' },
  { cls: 'cls-1', points: '578.69 325.83 568.95 308.96 578.69 292.09 598.17 292.09 607.91 308.96 598.17 325.83 578.69 325.83' },
  { cls: 'cls-1', points: '655.53 324.42 639.17 324.42 629.43 341.29 639.17 358.16 655.53 358.16 655.53 324.42' },
  { cls: 'cls-1', points: '609.33 341.29 599.59 324.42 609.33 307.55 628.81 307.55 638.55 324.42 628.81 341.29 609.33 341.29' },
  { cls: 'cls-1', points: '609.33 308.5 599.59 291.63 609.33 274.75 628.81 274.75 638.55 291.63 628.81 308.5 609.33 308.5' },
  { cls: 'cls-1', points: '609.33 275.21 599.59 258.34 609.33 241.47 628.81 241.47 638.55 258.34 628.81 275.21 609.33 275.21' },
  { cls: 'cls-1', points: '655.53 224.14 639.17 224.14 629.43 241.01 639.17 257.88 655.53 257.88 655.53 224.14' },
  { cls: 'cls-1', points: '609.03 207.79 599.59 224.14 609.33 241.01 628.81 241.01 638.55 224.14 629.11 207.79 609.03 207.79' },
  { cls: 'cls-1', points: '629.73 207.79 639.17 224.14 655.53 224.14 655.53 207.79 629.73 207.79' },
  { cls: 'cls-1', points: '655.53 257.41 639.17 257.41 629.43 274.28 639.17 291.15 655.53 291.15 655.53 257.41' },
  { cls: 'cls-1', points: '655.53 290.5 639.17 290.5 629.43 307.37 639.17 324.24 655.53 324.24 655.53 290.5' },
  { cls: 'cls-1', points: '609.33 408.78 599.59 391.91 609.33 375.04 628.81 375.04 638.55 391.91 628.81 408.78 609.33 408.78' },
  { cls: 'cls-1', points: '609.86 375.04 600.12 358.16 609.86 341.29 629.34 341.29 639.08 358.16 629.34 375.04 609.86 375.04' },
  { cls: 'cls-1', points: '655.53 358.16 639.17 358.16 629.43 375.04 639.17 391.91 655.53 391.91 655.53 358.16' },
  { cls: 'cls-1', points: '655.53 391.91 639.17 391.91 629.43 408.78 639.17 425.65 655.53 425.65 655.53 391.91' },
  { cls: 'cls-1', points: '609.33 442.98 599.59 426.11 609.33 409.24 628.81 409.24 638.55 426.11 628.81 442.98 609.33 442.98' },
  { cls: 'cls-1', points: '655.53 426.11 639.17 426.11 629.43 442.98 639.17 459.85 655.53 459.85 655.53 426.11' },
  { cls: 'cls-1', points: '518.77 358.16 509.03 341.29 518.77 324.42 538.25 324.42 547.99 341.29 538.25 358.16 518.77 358.16' },
  { cls: 'cls-1', points: '518.77 391.91 509.03 375.04 518.77 358.16 538.25 358.16 547.99 375.04 538.25 391.91 518.77 391.91' },
  { cls: 'cls-1', points: '549.08 408.78 539.34 391.91 549.08 375.04 568.56 375.04 578.3 391.91 568.56 408.78 549.08 408.78' },
  { cls: 'cls-1', points: '549.61 375.04 539.87 358.16 549.61 341.29 569.09 341.29 578.83 358.16 569.09 375.04 549.61 375.04' },
  { cls: 'cls-1', points: '578.93 391.91 569.19 375.04 578.93 358.16 598.41 358.16 608.15 375.04 598.41 391.91 578.93 391.91' },
  { cls: 'cls-1', points: '578.97 358.87 569.23 342 578.97 325.13 598.45 325.13 608.19 342 598.45 358.87 578.97 358.87' },
  { cls: 'cls-1', points: '578.93 425.65 569.19 408.78 578.93 391.91 598.41 391.91 608.15 408.78 598.41 425.65 578.93 425.65' },
  { cls: 'cls-1', points: '549.08 442.98 539.34 426.11 549.08 409.24 568.56 409.24 578.3 426.11 568.56 442.98 549.08 442.98' },
  { cls: 'cls-1', points: '518.77 425.65 509.03 408.78 518.77 391.91 538.25 391.91 547.99 408.78 538.25 425.65 518.77 425.65' },
  { cls: 'cls-1', points: '518.77 458.92 509.03 442.05 518.77 425.18 538.25 425.18 547.99 442.05 538.25 458.92 518.77 458.92' },
  { cls: 'cls-1', points: '578.93 461.46 569.19 444.59 578.93 427.72 598.41 427.72 608.15 444.59 598.41 461.46 578.93 461.46' },
  { cls: 'cls-2', points: '502.37 615.22 527.37 615.22 539.87 593.01 527.37 570.8 502.37 570.8 489.87 593.01 502.37 615.22' },
  { cls: 'cls-1', points: '437.02 656.47 445.98 640.95 436.24 624.08 416.76 624.08 407.02 640.95 415.99 656.47 437.02 656.47' },
  { cls: 'cls-1', points: '405.93 607.21 415.67 624.08 405.93 640.95 386.45 640.95 376.71 624.08 386.45 607.21 405.93 607.21' },
  { cls: 'cls-1', points: '414.36 656.47 405.4 640.95 385.92 640.95 376.96 656.47 414.36 656.47' },
  { cls: 'cls-1', points: '355.95 656.47 346.99 640.95 327.51 640.95 318.54 656.47 355.95 656.47' },
  { cls: 'cls-1', points: '376.09 521.94 385.83 538.81 376.09 555.68 356.61 555.68 346.87 538.81 356.61 521.94 376.09 521.94' },
  { cls: 'cls-1', points: '295.79 656.47 286.83 640.95 267.35 640.95 258.39 656.47 295.79 656.47' },
  { cls: 'cls-1', points: '376.86 656.47 385.83 640.95 376.09 624.08 356.61 624.08 346.87 640.95 355.83 656.47 376.86 656.47' },
  { cls: 'cls-1', points: '376.09 590.34 385.83 607.21 376.09 624.08 356.61 624.08 346.87 607.21 356.61 590.34 376.09 590.34' },
  { cls: 'cls-1', points: '405.93 573.01 415.67 589.88 405.93 606.75 386.45 606.75 376.71 589.88 386.45 573.01 405.93 573.01' },
  { cls: 'cls-1', points: '436.24 590.34 445.98 607.21 436.24 624.08 416.76 624.08 407.02 607.21 416.76 590.34 436.24 590.34' },
  { cls: 'cls-1', points: '436.24 557.07 445.98 573.94 436.24 590.81 416.76 590.81 407.02 573.94 416.76 557.07 436.24 557.07' },
  { cls: 'cls-1', points: '405.93 538.81 415.67 555.68 405.93 572.55 386.45 572.55 376.71 555.68 386.45 538.81 405.93 538.81' },
  { cls: 'cls-1', points: '376.09 556.14 385.83 573.01 376.09 589.88 356.61 589.88 346.87 573.01 356.61 556.14 376.09 556.14' },
  { cls: 'cls-1', points: '346.99 607.21 356.73 624.08 346.99 640.95 327.51 640.95 317.77 624.08 327.51 607.21 346.99 607.21' },
  { cls: 'cls-1', points: '316.68 590.34 326.42 607.21 316.68 624.08 297.2 624.08 287.46 607.21 297.2 590.34 316.68 590.34' },
  { cls: 'cls-1', points: '316.92 656.47 325.88 640.95 316.14 624.08 296.66 624.08 286.92 640.95 295.89 656.47 316.92 656.47' },
  { cls: 'cls-1', points: '286.83 607.21 296.57 624.08 286.83 640.95 267.35 640.95 257.61 624.08 267.35 607.21 286.83 607.21' },
  { cls: 'cls-1', points: '286.83 573.47 296.57 590.34 286.83 607.21 267.35 607.21 257.61 590.34 267.35 573.47 286.83 573.47' },
  { cls: 'cls-1', points: '316.68 556.14 326.42 573.01 316.68 589.88 297.2 589.88 287.46 573.01 297.2 556.14 316.68 556.14' },
  { cls: 'cls-1', points: '346.99 573.47 356.73 590.34 346.99 607.21 327.51 607.21 317.77 590.34 327.51 573.47 346.99 573.47' },
  { cls: 'cls-1', points: '346.99 540.2 356.73 557.07 346.99 573.94 327.51 573.94 317.77 557.07 327.51 540.2 346.99 540.2' },
  { cls: 'cls-1', points: '316.68 521.94 326.42 538.81 316.68 555.68 297.2 555.68 287.46 538.81 297.2 521.94 316.68 521.94' },
  { cls: 'cls-1', points: '286.83 539.27 296.57 556.14 286.83 573.01 267.35 573.01 257.61 556.14 267.35 539.27 286.83 539.27' },
  { cls: 'cls-1', points: '226.35 506.93 207.55 506.93 207.55 540.67 226.35 540.67 236.09 523.8 226.35 506.93' },
  { cls: 'cls-1', points: '256.2 523.8 265.94 540.67 256.2 557.54 236.72 557.54 226.98 540.67 236.72 523.8 256.2 523.8' },
  { cls: 'cls-1', points: '256.2 556.6 265.94 573.47 256.2 590.34 236.72 590.34 226.98 573.47 236.72 556.6 256.2 556.6' },
  { cls: 'cls-1', points: '256.2 589.88 265.94 606.75 256.2 623.62 236.72 623.62 226.98 606.75 236.72 589.88 256.2 589.88' },
  { cls: 'cls-1', points: '226.35 607.21 207.55 607.21 207.55 640.95 226.35 640.95 236.09 624.08 226.35 607.21' },
  { cls: 'cls-1', points: '256.97 656.47 265.94 640.95 256.2 624.08 236.72 624.08 226.98 640.95 235.94 656.47 256.97 656.47' },
  { cls: 'cls-1', points: '235.31 656.47 226.35 640.95 207.55 640.95 207.55 656.47 235.31 656.47' },
  { cls: 'cls-1', points: '226.35 573.94 207.55 573.94 207.55 607.68 226.35 607.68 236.09 590.81 226.35 573.94' },
  { cls: 'cls-1', points: '226.35 540.85 207.55 540.85 207.55 574.59 226.35 574.59 236.09 557.72 226.35 540.85' },
  { cls: 'cls-1', points: '256.2 456.32 265.94 473.19 256.2 490.06 236.72 490.06 226.98 473.19 236.72 456.32 256.2 456.32' },
  { cls: 'cls-1', points: '255.66 490.06 265.4 506.93 255.66 523.8 236.18 523.8 226.44 506.93 236.18 490.06 255.66 490.06' },
  { cls: 'cls-1', points: '226.35 473.19 207.55 473.19 207.55 506.93 226.35 506.93 236.09 490.06 226.35 473.19' },
  { cls: 'cls-1', points: '226.35 439.45 207.55 439.45 207.55 473.19 226.35 473.19 236.09 456.32 226.35 439.45' },
  { cls: 'cls-1', points: '256.2 422.12 265.94 438.99 256.2 455.86 236.72 455.86 226.98 438.99 236.72 422.12 256.2 422.12' },
  { cls: 'cls-1', points: '226.35 405.25 207.55 405.25 207.55 438.99 226.35 438.99 236.09 422.12 226.35 405.25' },
  { cls: 'cls-1', points: '346.76 506.93 356.5 523.8 346.76 540.67 327.27 540.67 317.53 523.8 327.28 506.93 346.76 506.93' },
  { cls: 'cls-1', points: '346.76 473.19 356.5 490.06 346.76 506.93 327.27 506.93 317.53 490.06 327.28 473.19 346.76 473.19' },
  { cls: 'cls-1', points: '316.45 456.32 326.19 473.19 316.45 490.06 296.97 490.06 287.23 473.19 296.97 456.32 316.45 456.32' },
  { cls: 'cls-1', points: '315.91 490.06 325.65 506.93 315.91 523.8 296.43 523.8 286.69 506.93 296.43 490.06 315.91 490.06' },
  { cls: 'cls-1', points: '286.6 473.19 296.34 490.06 286.6 506.93 267.12 506.93 257.38 490.06 267.12 473.19 286.6 473.19' },
  { cls: 'cls-1', points: '286.55 506.23 296.29 523.1 286.55 539.97 267.07 539.97 257.33 523.1 267.07 506.23 286.55 506.23' },
  { cls: 'cls-1', points: '286.6 439.45 296.34 456.32 286.6 473.19 267.12 473.19 257.38 456.32 267.12 439.45 286.6 439.45' },
  { cls: 'cls-1', points: '316.45 422.12 326.19 438.99 316.45 455.86 296.97 455.86 287.23 438.99 296.97 422.12 316.45 422.12' },
  { cls: 'cls-1', points: '346.76 439.45 356.5 456.32 346.76 473.19 327.27 473.19 317.53 456.32 327.28 439.45 346.76 439.45' },
  { cls: 'cls-1', points: '346.76 406.18 356.5 423.05 346.76 439.92 327.27 439.92 317.53 423.05 327.28 406.18 346.76 406.18' },
  { cls: 'cls-1', points: '286.6 403.63 296.34 420.5 286.6 437.37 267.12 437.37 257.38 420.5 267.12 403.63 286.6 403.63' },
];

export const LogoIntro: React.FC<LogoIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'assembling' | 'docking'>('assembling');
  const [dockTransform, setDockTransform] = useState<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const lastTapRef = useRef<number>(0);

  // Compute centroid distance from center (431.87, 431.87) for each hexagon to stagger ripple wave
  const computedPolygons = useMemo(() => {
    const center = { x: 431.87, y: 431.87 };
    const withDist = LAYER2_POLYGONS.map((poly, index) => {
      const nums = poly.points.trim().split(/\s+/).map(Number);
      let sumX = 0;
      let sumY = 0;
      let count = 0;
      for (let i = 0; i < nums.length; i += 2) {
        if (!isNaN(nums[i]) && !isNaN(nums[i + 1])) {
          sumX += nums[i];
          sumY += nums[i + 1];
          count++;
        }
      }
      const cx = count > 0 ? sumX / count : center.x;
      const cy = count > 0 ? sumY / count : center.y;
      const dist = Math.hypot(cx - center.x, cy - center.y);
      return { ...poly, index, cx, cy, dist };
    });

    const minDist = Math.min(...withDist.map(p => p.dist));
    const maxDist = Math.max(...withDist.map(p => p.dist));

    return withDist.map(p => {
      const normalized = (p.dist - minDist) / Math.max(1, maxDist - minDist);
      // Ripple wave starts at 0.35s and spreads out to 1.2s
      const delay = 0.35 + normalized * 0.85;
      return { ...p, delay };
    });
  }, []);

  const triggerDocking = () => {
    const navLogo = document.getElementById('navbar-logo-target');
    const isMobile = window.innerWidth < 640;
    const initialSize = isMobile ? 220 : 300;

    if (navLogo) {
      const rect = navLogo.getBoundingClientRect();
      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;

      setDockTransform({
        x: targetCenterX - viewportCenterX,
        y: targetCenterY - viewportCenterY,
        scale: rect.width / initialSize,
      });
    } else {
      setDockTransform({
        x: -window.innerWidth * 0.42,
        y: -window.innerHeight * 0.45,
        scale: 0.1,
      });
    }
    setPhase('docking');
  };

  useEffect(() => {
    // Lock scroll while intro is active
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const dockTimer = setTimeout(() => {
      triggerDocking();
    }, 2700);

    const completeTimer = setTimeout(() => {
      document.body.style.overflow = prevOverflow;
      onComplete();
    }, 3600);

    return () => {
      clearTimeout(dockTimer);
      clearTimeout(completeTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [onComplete]);

  const handleScreenTap = () => {
    const now = performance.now();
    if (now - lastTapRef.current < 350) {
      onComplete();
    }
    lastTapRef.current = now;
  };

  return (
    <div
      onClick={handleScreenTap}
      onDoubleClick={onComplete}
      className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto select-none transition-colors duration-700 ${
        phase === 'docking' ? 'pointer-events-none' : ''
      }`}
    >
      {/* Translucent dark backdrop that fades out during docking */}
      <div
        className={`absolute inset-0 bg-[#060609]/80 backdrop-blur-md transition-opacity duration-[850ms] ease-in-out ${
          phase === 'docking' ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Water ripples radiating outward synced with the two 'A' legs sliding in */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
          phase === 'docking' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="relative w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] flex items-center justify-center">
          {/* Beat 1: Triggered when the left leg of 'A' locks into place */}
          <span className="anw-water-ripple anw-water-ripple-1" />
          <span className="anw-water-ripple anw-water-ripple-1-echo" />
          {/* Beat 2: Triggered when the right leg of 'A' locks into place */}
          <span className="anw-water-ripple anw-water-ripple-2" />
          <span className="anw-water-ripple anw-water-ripple-2-echo" />
        </div>
      </div>

      {/* Animated SVG Container that docks into the Navbar logo */}
      <div
        style={{
          transform:
            phase === 'docking'
              ? `translate3d(${dockTransform.x}px, ${dockTransform.y}px, 0) scale(${dockTransform.scale})`
              : 'translate3d(0px, 0px, 0) scale(1)',
          transition:
            phase === 'docking'
              ? 'transform 850ms cubic-bezier(0.76, 0, 0.24, 1)'
              : 'none',
        }}
        className="relative z-10 w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] flex items-center justify-center will-change-transform"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="205.8 205.8 452.2 452.2"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <style>{`
              .anw-cls-1 {
                stroke: #fff;
                stroke-width: 2px;
                fill: #231f20;
                stroke-miterlimit: 10;
              }
              .anw-cls-2 {
                fill: #231f20;
              }
              .anw-cls-3 {
                fill: #808285;
                stroke: #231f20;
                stroke-miterlimit: 10;
              }
              .anw-cls-4 {
                fill: #d1d3d4;
              }

              @keyframes anw-base-circle {
                0% {
                  transform: scale(0.6);
                  opacity: 0;
                }
                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }

              @keyframes anw-hex-ripple {
                0% {
                  transform: scale(0);
                  opacity: 0;
                }
                65% {
                  transform: scale(1.14);
                  opacity: 1;
                }
                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }

              @keyframes anw-core-ring {
                0% {
                  transform: scale(0);
                  opacity: 0;
                }
                70% {
                  transform: scale(1.06);
                  opacity: 1;
                }
                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }

              @keyframes anw-slash-left {
                0% {
                  transform: translate(55px, -135px);
                  opacity: 0;
                }
                100% {
                  transform: translate(0, 0);
                  opacity: 1;
                }
              }

              @keyframes anw-slash-right {
                0% {
                  transform: translate(65px, 125px);
                  opacity: 0;
                }
                100% {
                  transform: translate(0, 0);
                  opacity: 1;
                }
              }

              .anim-base-circle {
                transform-origin: 431.87px 431.87px;
                animation: anw-base-circle 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }

              .anim-core-ring {
                transform-origin: 431.87px 431.87px;
                opacity: 0;
                animation: anw-core-ring 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) 1.05s forwards;
              }

              .anim-slash-left {
                opacity: 0;
                animation: anw-slash-left 0.65s cubic-bezier(0.16, 1, 0.3, 1) 1.45s forwards;
              }

              .anim-slash-right {
                opacity: 0;
                animation: anw-slash-right 0.65s cubic-bezier(0.16, 1, 0.3, 1) 1.62s forwards;
              }

              @keyframes anw-water-wave {
                0% {
                  transform: scale(0.88);
                  opacity: 0;
                }
                18% {
                  opacity: 0.55;
                }
                100% {
                  transform: scale(2.15);
                  opacity: 0;
                }
              }

              @keyframes anw-water-wave-soft {
                0% {
                  transform: scale(0.92);
                  opacity: 0;
                }
                20% {
                  opacity: 0.32;
                }
                100% {
                  transform: scale(2.45);
                  opacity: 0;
                }
              }

              .anw-water-ripple {
                position: absolute;
                inset: 0;
                border-radius: 9999px;
                opacity: 0;
                pointer-events: none;
                border: 1.5px solid rgba(225, 230, 240, 0.45);
                background: radial-gradient(
                  circle,
                  transparent 54%,
                  rgba(210, 215, 225, 0.08) 66%,
                  rgba(255, 255, 255, 0.18) 70%,
                  transparent 74%
                );
                box-shadow: 0 0 24px rgba(255, 255, 255, 0.12), inset 0 0 18px rgba(255, 255, 255, 0.08);
              }

              /* Synced with left leg impact (~1.72s) */
              .anw-water-ripple-1 {
                animation: anw-water-wave 1.15s cubic-bezier(0.16, 1, 0.3, 1) 1.72s forwards;
              }
              .anw-water-ripple-1-echo {
                border-width: 1px;
                animation: anw-water-wave-soft 1.25s cubic-bezier(0.16, 1, 0.3, 1) 1.84s forwards;
              }

              /* Synced with right leg impact (~1.92s) */
              .anw-water-ripple-2 {
                animation: anw-water-wave 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1.92s forwards;
              }
              .anw-water-ripple-2-echo {
                border-width: 1px;
                animation: anw-water-wave-soft 1.3s cubic-bezier(0.16, 1, 0.3, 1) 2.04s forwards;
              }
            `}</style>
          </defs>

          <g>
            {/* Layer 1: Outer Circle */}
            <g id="Intro_Layer_1">
              <path
                className="anw-cls-1 anim-base-circle"
                d="M448.69,206.99h-33.63c-116.41,8.62-208.18,106-208.18,224.88s100.74,225.5,225,225.5,225-100.96,225-225.5-91.77-216.25-208.18-224.88Z"
              />
            </g>

            {/* Layer 2: 100 Hexagonal Cells Rippling Outward */}
            <g id="Intro_Layer_2">
              {computedPolygons.map(poly => (
                <polygon
                  key={poly.index}
                  className={poly.cls === 'cls-1' ? 'anw-cls-1' : 'anw-cls-2'}
                  points={poly.points}
                  style={{
                    transformOrigin: `${poly.cx}px ${poly.cy}px`,
                    opacity: 0,
                    animation: `anw-hex-ripple 0.48s cubic-bezier(0.34, 1.56, 0.64, 1) ${poly.delay.toFixed(3)}s forwards`,
                  }}
                />
              ))}
            </g>

            {/* Layer 3: Inner Grey Core Circle */}
            <g id="Intro_Layer_3">
              <circle
                className="anw-cls-3 anim-core-ring"
                cx="431.87"
                cy="431.87"
                r="124.5"
              />
            </g>

            {/* Layer 4: Foreground Stylized Lambda / 'A' Monogram */}
            <g id="Intro_Layer_4">
              <path
                className="anw-cls-4 anim-slash-left"
                d="M450.4,309.42h-75.91c-9.91,0-21.76,9.98-26.46,22.29l-115.95,303.43c-4.7,12.31-.48,22.29,9.43,22.29h75.91c9.91,0,21.76-9.98,26.46-22.29l115.95-303.43c4.7-12.31.48-22.29-9.43-22.29Z"
              />
              <path
                className="anw-cls-4 anim-slash-right"
                d="M442.98,460.97l32.43-77.62c5.92-14.17,14.74-19.94,19.13-11.52l141.04,270.74c4.27,8.2-3.92,14.87-17.04,14.9l-72.19.17c-6.25.01-13.18-4.08-15.85-9.14l-87.54-166.39c-2.71-5.15-2.77-14.43.03-21.13Z"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};
