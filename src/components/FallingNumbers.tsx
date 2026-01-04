'use client';

import React, { useEffect, useRef } from 'react';

interface FallingNumbersProps {
  count?: number;
  speed?: number;
  fontSize?: number;
}

const FallingNumbers: React.FC<FallingNumbersProps> = ({
  count = 50,
  speed = 2,
  fontSize = 20,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    interface Particle {
      x: number;
      y: number;
      value: number;
      velocity: number;
      angle: number;
    }

    let particles: Particle[] = [];

    const createParticle = (): Particle => {
      const isTen = Math.random() > 0.9;
      return {
        x: Math.random() * canvas.width,
        y: -fontSize,
        value: Math.floor(Math.random() * 10) + 1,
        velocity: speed + Math.random() * 2,
        angle: (Math.random() * 90 - 45) * (Math.PI / 180),
      };
    };

    for (let i = 0; i < count; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      particles.forEach((p, index) => {
        p.y += p.velocity;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillText(p.value.toString(), 0, 0);
        ctx.restore();

        if (p.y > canvas.height + fontSize) {
          particles[index] = createParticle();
        }
      });

      if (particles.length < count) {
        particles.push(createParticle());
      } else if (particles.length > count) {
        particles.splice(0, particles.length - count);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, speed, fontSize]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundColor: 'black',
        pointerEvents: 'none',
      }}
    />
  );
};

export default FallingNumbers;