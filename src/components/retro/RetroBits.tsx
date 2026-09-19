import React from 'react';

/**
 * Shared retro primitives for the "Paper & Pixels" landing system.
 * Purely presentational — no state, no side effects.
 */

interface StarburstProps {
  className?: string;
  spikes?: number;
}

export const Starburst: React.FC<StarburstProps> = ({ className, spikes = 16 }) => {
  const points = Array.from({ length: spikes * 2 }, (_, i) => {
    const angle = (Math.PI * i) / spikes;
    const radius = i % 2 === 0 ? 50 : 36;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <polygon points={points} fill="currentColor" stroke="#16130e" strokeWidth="2" />
    </svg>
  );
};

interface StickerProps {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
  color?: string;
}

export const Sticker: React.FC<StickerProps> = ({
  children,
  className = '',
  rotate = -4,
  color = '#ffbe0b',
}) => (
  <span
    className={`retro-sticker px-3 py-1.5 text-xs ${className}`}
    style={{
      '--sticker-rotate': `${rotate}deg`,
      transform: `rotate(${rotate}deg)`,
      background: color,
    } as React.CSSProperties}
  >
    {children}
  </span>
);

interface SectionTagProps {
  children: React.ReactNode;
  color?: string;
}

/** Small 8-bit section label with a colored chip, e.g. "01 — HOW IT WORKS". */
export const SectionTag: React.FC<SectionTagProps> = ({ children, color = '#ffbe0b' }) => (
  <div className="inline-flex items-center gap-3 mb-6">
    <span className="w-3 h-3 border-2 border-ink" style={{ background: color }} aria-hidden="true" />
    <span className="retro-pixel-tag text-ink">{children}</span>
  </div>
);
