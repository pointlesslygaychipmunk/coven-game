// frontend/src/components/WeatherEffectsOverlay.tsx
import React, { useEffect, useRef } from 'react';
import { WeatherFate } from '@shared/types';
import './WeatherEffectsOverlay.css';

interface WeatherEffectsOverlayProps {
  weather: WeatherFate;
}

const WeatherEffectsOverlay: React.FC<WeatherEffectsOverlayProps> = ({ 
  weather 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full size of container
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    // Initial sizing
    resizeCanvas();
    
    // Resize on window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles array
    let particles: any[] = [];
    
    // Initialize particles based on weather type
    const initParticles = () => {
      particles = [];
      
      let count = 0;
      let particleType = '';
      
      switch (weather) {
        case 'rainy':
          count = 100;
          particleType = 'rain';
          break;
        case 'foggy':
          count = 50;
          particleType = 'fog';
          break;
        case 'dry':
          count = 20;
          particleType = 'heat';
          break;
        case 'windy':
          count = 30;
          particleType = 'leaf';
          break;
        case 'stormy':
          count = 150;
          particleType = 'storm';
          break;
        default:
          count = 0;
          break;
      }
      
      // Create particles
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(particleType));
      }
    };
    
    // Create a single particle with appropriate properties
    const createParticle = (type: string) => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      
      switch (type) {
        case 'rain':
          return {
            x,
            y,
            size: Math.random() * 3 + 1,
            speedX: -1,
            speedY: Math.random() * 10 + 10,
            color: 'rgba(120, 150, 255, 0.5)'
          };
          
        case 'fog':
          return {
            x,
            y,
            size: Math.random() * 100 + 50,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.2 - 0.1,
            color: `rgba(200, 200, 200, ${Math.random() * 0.2 + 0.1})`
          };
          
        case 'heat':
          return {
            x,
            y: canvas.height - Math.random() * 100,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 1 - 0.5,
            speedY: -Math.random() * 3 - 1,
            color: `rgba(255, ${Math.floor(Math.random() * 100) + 100}, 0, ${Math.random() * 0.3 + 0.1})`
          };
          
        case 'leaf':
          return {
            x,
            y,
            size: Math.random() * 5 + 3,
            speedX: Math.random() * 6 - 3,
            speedY: Math.random() * 2 - 1,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 5 - 2.5,
            color: `rgb(${Math.floor(Math.random() * 100) + 50}, ${Math.floor(Math.random() * 100) + 100}, 0)`
          };
          
        case 'storm':
          // Randomly choose between rain, lightning, and heavy rain
          const stormType = Math.random();
          if (stormType < 0.7) {
            // Heavy rain
            return {
              x,
              y,
              size: Math.random() * 4 + 2,
              speedX: -2,
              speedY: Math.random() * 15 + 15,
              color: 'rgba(120, 150, 255, 0.6)'
            };
          } else if (stormType < 0.9) {
            // Light rain
            return {
              x,
              y,
              size: Math.random() * 3 + 1,
              speedX: -1,
              speedY: Math.random() * 10 + 10,
              color: 'rgba(120, 150, 255, 0.4)'
            };
          } else {
            // Lightning (special particle that flashes the screen)
            return {
              x: 0,
              y: 0,
              size: canvas.width,
              speedX: 0,
              speedY: 0,
              intensity: Math.random() * 0.3 + 0.1,
              duration: Math.floor(Math.random() * 3) + 1,
              timer: 0,
              active: false,
              delay: Math.floor(Math.random() * 200) + 100,
              color: 'rgba(255, 255, 220, 1)'
            };
          }
          
        default:
          return {
            x,
            y,
            size: 1,
            speedX: 0,
            speedY: 0,
            color: 'rgba(255, 255, 255, 0.5)'
          };
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Handle special weather overlay effects
      switch (weather) {
        case 'foggy':
          // Add overall fog effect
          ctx.fillStyle = 'rgba(230, 230, 230, 0.3)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          break;
          
        case 'stormy':
          // Darken the scene
          ctx.fillStyle = 'rgba(20, 30, 50, 0.2)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          break;
          
        case 'dry':
          // Add heat haze
          ctx.fillStyle = 'rgba(255, 240, 220, 0.1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          break;
      }
      
      // Update and draw particles
      particles.forEach((p, index) => {
        // Special handling for lightning in storms
        if (weather === 'stormy' && p.duration !== undefined) {
          // This is a lightning particle
          if (p.delay > 0) {
            p.delay--;
          } else if (!p.active) {
            p.active = true;
            p.timer = p.duration;
          } else if (p.timer > 0) {
            // Flash the screen
            ctx.fillStyle = `rgba(255, 255, 220, ${p.intensity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            p.timer--;
          } else {
            // Reset lightning
            particles[index] = createParticle('storm');
          }
          return;
        }
        
        // Normal particle rendering
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Particle-specific rendering
        if (weather === 'leaf') {
          // Draw leaves as rotating squares
          p.rotation += p.rotationSpeed;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation * Math.PI / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
          ctx.restore();
        } else if (weather === 'foggy') {
          // Draw fog as large transparent circles
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else {
          // Default particle (rain, heat haze, etc.)
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size * (weather === 'rainy' || weather === 'stormy' ? 3 : 1));
        }
        
        // Reset particles that go off screen
        if (p.x < -50 || p.x > canvas.width + 50 || 
            p.y < -50 || p.y > canvas.height + 50) {
          particles[index] = createParticle(
            weather === 'storm' ? 'storm' : 
            weather === 'rainy' ? 'rain' : 
            weather === 'foggy' ? 'fog' : 
            weather === 'dry' ? 'heat' : 
            weather === 'windy' ? 'leaf' : 'default'
          );
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start the animation
    initParticles();
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [weather]);

  return (
    <div className={`weather-effects ${weather}`}>
      <canvas 
        ref={canvasRef} 
        className="weather-canvas"
      />
    </div>
  );
};

export default WeatherEffectsOverlay;