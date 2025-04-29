// frontend/src/components/LunarPhaseIcon.tsx
import React from 'react';
import { MoonPhase } from '@shared/types';
import './LunarPhaseIcon.css';

interface LunarPhaseIconProps {
  phase: MoonPhase;
  size?: 'small' | 'medium' | 'large';
}

const LunarPhaseIcon: React.FC<LunarPhaseIconProps> = ({ 
  phase, 
  size = 'medium' 
}) => {
  // Generate the appropriate SVG for the lunar phase
  const renderMoonSVG = () => {
    // Common attributes for all moon phases
    const width = size === 'small' ? 32 : size === 'medium' ? 64 : 96;
    const height = width;
    const radius = width / 2 - 2; // Slightly smaller to allow for border
    const cx = width / 2;
    const cy = height / 2;
    
    // For waxing/waning phases, we need to calculate the appropriate curve
    const isWaxing = phase.includes('Waxing');
    const isWaning = phase.includes('Waning');
    const isQuarter = phase.includes('Quarter');
    const isGibbous = phase.includes('Gibbous');
    const isNewMoon = phase === 'New Moon';
    const isFullMoon = phase === 'Full Moon';
    
    // SVG path data for different phases
    if (isNewMoon) {
      // New Moon - dark circle with light border
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <circle 
            cx={cx} 
            cy={cy} 
            r={radius} 
            fill="#121212" 
            stroke="#8a85b1" 
            strokeWidth="1"
          />
        </svg>
      );
    } else if (isFullMoon) {
      // Full Moon - light circle
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <circle 
            cx={cx} 
            cy={cy} 
            r={radius} 
            fill="#f4f4ff" 
            stroke="#8a85b1" 
            strokeWidth="1"
          />
          {/* Add some subtle moon texture */}
          <circle cx={cx - radius * 0.3} cy={cy - radius * 0.2} r={radius * 0.08} fill="#e1e1e8" opacity="0.6" />
          <circle cx={cx + radius * 0.4} cy={cy + radius * 0.3} r={radius * 0.1} fill="#e1e1e8" opacity="0.5" />
          <circle cx={cx - radius * 0.1} cy={cy + radius * 0.4} r={radius * 0.07} fill="#e1e1e8" opacity="0.4" />
        </svg>
      );
    } else if (isQuarter) {
      // First or Last Quarter - half circle
      const d = isWaxing 
        ? `M ${cx} ${cy - radius} A ${radius} ${radius} 0 0 1 ${cx} ${cy + radius} L ${cx} ${cy - radius}` 
        : `M ${cx} ${cy - radius} A ${radius} ${radius} 0 0 0 ${cx} ${cy + radius} L ${cx} ${cy - radius}`;
      
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <circle 
            cx={cx} 
            cy={cy} 
            r={radius} 
            fill="#121212" 
            stroke="#8a85b1" 
            strokeWidth="1"
          />
          <path 
            d={d} 
            fill="#f4f4ff" 
            stroke="#8a85b1" 
            strokeWidth="1"
          />
        </svg>
      );
    } else if (isWaxing) {
      // Waxing Crescent or Waxing Gibbous
      // For crescent, we show a small portion, for gibbous a large portion
      const percentage = isGibbous ? 0.75 : 0.25;
      const offsetX = radius * (1 - 2 * percentage);
      
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <circle 
            cx={cx} 
            cy={cy} 
            r={radius} 
            fill="#121212" 
            stroke="#8a85b1" 
            strokeWidth="1"
          />
          <path 
            d={`M ${cx} ${cy - radius} 
                A ${radius} ${radius} 0 0 1 ${cx} ${cy + radius} 
                A ${radius} ${radius} 0 0 1 ${cx} ${cy - radius}`}
            fill="#121212"
            stroke="#8a85b1"
            strokeWidth="1"
          />
          <ellipse 
            cx={cx + offsetX} 
            cy={cy} 
            rx={radius * percentage} 
            ry={radius}
            fill="#f4f4ff"
            stroke="none"
          />
        </svg>
      );
    } else if (isWaning) {
      // Waning Crescent or Waning Gibbous
      // For crescent, we show a small portion, for gibbous a large portion
      const percentage = isGibbous ? 0.75 : 0.25;
      const offsetX = -radius * (1 - 2 * percentage);
      
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <circle 
            cx={cx} 
            cy={cy} 
            r={radius} 
            fill="#121212" 
            stroke="#8a85b1" 
            strokeWidth="1"
          />
          <path 
            d={`M ${cx} ${cy - radius} 
                A ${radius} ${radius} 0 0 0 ${cx} ${cy + radius} 
                A ${radius} ${radius} 0 0 0 ${cx} ${cy - radius}`}
            fill="#121212"
            stroke="#8a85b1"
            strokeWidth="1"
          />
          <ellipse 
            cx={cx + offsetX} 
            cy={cy} 
            rx={radius * percentage} 
            ry={radius}
            fill="#f4f4ff"
            stroke="none"
          />
        </svg>
      );
    }
    
    // Default case - just show a full circle
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <circle 
          cx={cx} 
          cy={cy} 
          r={radius} 
          fill="#f4f4ff" 
          stroke="#8a85b1" 
          strokeWidth="1"
        />
      </svg>
    );
  };

  // Add a special glow effect for full moon
  const isFullMoon = phase === 'Full Moon';
  
  return (
    <div className={`lunar-phase-icon ${size} ${isFullMoon ? 'full-moon-glow' : ''}`}>
      {renderMoonSVG()}
    </div>
  );
};

export default LunarPhaseIcon;