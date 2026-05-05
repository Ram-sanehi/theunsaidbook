import { useMemo } from "react";

/**
 * Global floating gold particles + ambient blob glow —
 * renders once at root level and overlays across every page.
 */

const PARTICLE_COUNT = 18;

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  dur: number;
  delay: number;
  op: number;
}

export function FloatingParticles() {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: 5 + Math.floor(Math.random() * 90),
        top: 5 + Math.floor(Math.random() * 90),
        size: 1.5 + (i % 3) * 0.8,
        dur: 4 + (i % 5) * 1.2,
        delay: (i % 7) * 0.6,
        op: 0.12 + (i % 4) * 0.06,
      })),
    [],
  );

  return (
    <>
      {/* Ambient blob glow layer */}
      <div
        className="global-blobs"
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
      </div>

      {/* Floating gold particles layer */}
      <div
        className="global-particles"
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {particles.map((p) => (
          <span
            key={p.id}
            className="gold-particle"
            style={
              {
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                animation: `particle-float ${p.dur}s ${p.delay}s ease-in-out infinite`,
                "--op": p.op,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </>
  );
}
