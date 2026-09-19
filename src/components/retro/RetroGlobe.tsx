import React, { useEffect, useRef } from 'react';

/**
 * RetroGlobe — a hand-rolled, Cobe-style interactive dot globe.
 *
 * Canvas-rendered orthographic sphere (Fibonacci lattice), with:
 *  - drag-to-spin + inertia
 *  - city markers with radar pings + mono labels
 *  - animated dashed "PR analyzed" arcs flowing between cities
 *  - DPR aware, ResizeObserver-driven, reduced-motion fallback
 * Zero dependencies — pure canvas 2D.
 */

const INK = '#16130e';
const CITY_COLORS = ['#ffbe0b', '#ff5d8f', '#06d6a0', '#3a86ff', '#8338ec', '#fb5607', '#00b4d8', '#ef476f'];

/** name, lat, lon */
const CITIES: Array<[string, number, number]> = [
  ['SF', 37.77, -122.42],
  ['NYC', 40.71, -74.0],
  ['SAO', -23.55, -46.63],
  ['LDN', 51.5, -0.12],
  ['BER', 52.52, 13.4],
  ['BLR', 12.97, 77.59],
  ['TYO', 35.68, 139.69],
  ['SYD', -33.87, 151.21],
];

const ARCS: Array<[number, number]> = [
  [0, 3], [1, 4], [3, 6], [2, 5], [6, 7], [0, 5],
];

const DOTS = 900;
const BASE_SPEED = 0.0028;
const TILT = 0.42;

type Vec3 = [number, number, number];

function latLonToVec3(lat: number, lon: number): Vec3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [
    -Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta),
  ];
}

/** Fibonacci lattice over the unit sphere. */
function buildSphereDots(): Vec3[] {
  const dots: Vec3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < DOTS; i++) {
    const y = 1 - (i / (DOTS - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    dots.push([Math.cos(theta) * radius, y, Math.sin(theta) * radius]);
  }
  return dots;
}

function rotatePoint([x, y, z]: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const rx = x * cos - z * sin;
  const rz = x * sin + z * cos;
  const cosT = Math.cos(TILT);
  const sinT = Math.sin(TILT);
  const ry = y * cosT - rz * sinT;
  return [rx, ry, rz * cosT + y * sinT];
}
interface RetroGlobeProps {
  className?: string;
  label?: string;
}

export const RetroGlobe: React.FC<RetroGlobeProps> = ({
  className = '',
  label = 'Interactive globe showing pull requests analyzed around the world',
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dots = buildSphereDots();
    const cityVecs = CITIES.map(([, lat, lon]) => latLonToVec3(lat, lon));

    let size = 0;
    let raf = 0;
    let rotation = 0.6;
    let velocity = BASE_SPEED;
    let dragging = false;
    let lastX = 0;
    let lastT = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = wrap.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (v: Vec3, R: number, cx: number, cy: number): Vec3 => {
      const [rx, ry, rz] = rotatePoint(v, rotation);
      return [cx + rx * R, cy - ry * R, rz];
    };

    const drawArcs = (t: number, cx: number, cy: number, R: number) => {
      ARCS.forEach(([a, b], i) => {
        const va = cityVecs[a];
        const vb = cityVecs[b];
        const cycle = (((t / 5200) + i * 0.35) % 1 + 1) % 1;
        const visible = Math.min(1, Math.min(cycle * 6, (1 - cycle) * 6));
        if (visible <= 0) return;

        ctx.beginPath();
        let started = false;
        for (let s = 0; s <= 48; s++) {
          const f = s / 48;
          const lift = 1 + Math.sin(f * Math.PI) * 0.22;
          const mx = (va[0] + (vb[0] - va[0]) * f) * lift;
          const my = (va[1] + (vb[1] - va[1]) * f) * lift;
          const mz = (va[2] + (vb[2] - va[2]) * f) * lift;
          const len = Math.sqrt(mx * mx + my * my + mz * mz) || 1;
          const [px, py, pz] = project([mx / len, my / len, mz / len], R, cx, cy);
          if (pz < -0.15) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.strokeStyle = CITY_COLORS[i % CITY_COLORS.length];
        ctx.globalAlpha = visible * 0.9;
        ctx.lineWidth = Math.max(1.4, size * 0.005);
        ctx.setLineDash([4, 6]);
        ctx.lineDashOffset = -(t / 40);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      });
    };
    const drawCities = (t: number, cx: number, cy: number, R: number) => {
      cityVecs.forEach((v, i) => {
        const [px, py, pz] = project(v, R, cx, cy);
        if (pz <= 0) return;
        const color = CITY_COLORS[i % CITY_COLORS.length];
        const dotR = Math.max(2.6, size * 0.009);

        // radar ping
        const p = (((t / 2400) + i * 0.23) % 1 + 1) % 1;
        ctx.beginPath();
        ctx.arc(px, py, dotR + p * dotR * 4.2, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = (1 - p) * 0.75;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // core dot with ink ring
        ctx.beginPath();
        ctx.arc(px, py, dotR, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = INK;
        ctx.stroke();

        // mono label
        const fontSize = Math.max(9, size * 0.028);
        ctx.font = `700 ${fontSize}px "JetBrains Mono", monospace`;
        ctx.fillStyle = 'rgba(22,19,14,0.72)';
        ctx.fillText(CITIES[i][0], px + dotR + 5, py + fontSize * 0.36);
      });
    };

    const draw = (t: number) => {
      if (size === 0) return;
      const cx = size / 2;
      const cy = size / 2;
      const R = size * 0.38;
      ctx.clearRect(0, 0, size, size);

      // halo ring
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(22,19,14,0.18)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 7]);
      ctx.stroke();
      ctx.setLineDash([]);

      // sphere dots — back hemisphere faint, front solid ink
      for (const d of dots) {
        const [px, py, pz] = project(d, R, cx, cy);
        const front = pz > 0;
        ctx.beginPath();
        ctx.arc(px, py, front ? Math.max(1, size * 0.0038) : Math.max(0.6, size * 0.0022), 0, Math.PI * 2);
        ctx.fillStyle = front ? 'rgba(22,19,14,0.34)' : 'rgba(22,19,14,0.07)';
        ctx.fill();
      }

      drawArcs(t, cx, cy, R);
      drawCities(t, cx, cy, R);
    };

    const loop = (t: number) => {
      const dt = lastT ? Math.min(50, t - lastT) : 16;
      lastT = t;
      if (!dragging) {
        velocity += (BASE_SPEED - velocity) * 0.02; // ease back to base spin
      }
      rotation += velocity * (dt / 16);
      if (!dragging) velocity *= 0.985; // inertia decay
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      velocity = dx * 0.0011;
      rotation += dx * 0.004;
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      canvas.style.cursor = 'grab';
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    canvas.style.cursor = 'grab';
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', onPointerUp);
      canvas.addEventListener('pointercancel', onPointerUp);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative aspect-square w-full ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        className="block h-full w-full touch-pan-y select-none"
      />
    </div>
  );
};
