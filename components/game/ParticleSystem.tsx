'use client';

import React, { FC, useEffect, useRef } from 'react';
import { Box } from '@mui/material';

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

interface ParticleSystemProps {
  particles: Particle[];
  onComplete: (id: string) => void;
}

const ParticleComponent: FC<{ particle: Particle }> = ({ particle }) => {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const startTime = useRef(performance.now());

  useEffect(() => {
    let x = particle.x;
    let y = particle.y;
    let vx = particle.vx;
    let vy = particle.vy;
    let life = particle.life;

    const animate = () => {
      const elapsed = performance.now() - startTime.current;
      
      // Update physics
      x += vx;
      y += vy;
      vy += 0.5; // Gravity
      vx *= 0.99; // Friction
      life = Math.max(0, 1 - elapsed / 500); // Fade out over 500ms

      if (ref.current && life > 0.01) { // Stop when almost invisible
        ref.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${life})`;
        ref.current.style.opacity = `${life}`;
        frameRef.current = requestAnimationFrame(animate);
      } else if (ref.current) {
        // Ensure final cleanup
        ref.current.style.opacity = '0';
        ref.current.style.display = 'none';
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [particle]);

  return (
    <Box
      ref={ref}
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        backgroundColor: particle.color,
        borderRadius: '50%',
        pointerEvents: 'none',
        willChange: 'transform, opacity',
        transform: `translate3d(${particle.x}px, ${particle.y}px, 0)`,
        zIndex: 500,
      }}
    />
  );
};

export const ParticleSystem: FC<ParticleSystemProps> = ({ particles, onComplete }) => {
  // Clean up particles after animation
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    particles.forEach(particle => {
      const timer = setTimeout(() => {
        onComplete(particle.id);
      }, 800); // Ensure cleanup after animation
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [particles, onComplete]);

  return (
    <>
      {particles.map(particle => (
        <ParticleComponent key={particle.id} particle={particle} />
      ))}
    </>
  );
};

export const createParticles = (x: number, y: number, width: number, height: number, color: string): Particle[] => {
  const particles: Particle[] = [];
  const particleCount = 8; // Balance between visual effect and performance

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const speed = 3 + Math.random() * 2;
    
    particles.push({
      id: `particle-${Date.now()}-${i}`,
      x: x + width / 2 - 3,
      y: y + height / 2 - 3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: 6 + Math.random() * 4,
      color,
      alpha: 1,
      life: 1,
    });
  }

  return particles;
};

export default ParticleSystem;