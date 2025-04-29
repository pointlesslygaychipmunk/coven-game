// frontend/src/components/GardenPlot.tsx
import React from 'react';
import { GardenSlot, MoonPhase, Season, WeatherFate } from '@shared/types';
import './GardenPlot.css';

interface GardenPlotProps {
  slot: GardenSlot;
  selected: boolean;
  onClick: () => void;
  moonPhase: MoonPhase;
  season: Season;
  weather: WeatherFate;
}

const GardenPlot: React.FC<GardenPlotProps> = ({
  slot,
  selected,
  onClick,
  moonPhase,
  season,
  weather
}) => {
  const plant = slot.plant;
  
  // Determine visual growth stage (0-3)
  const getGrowthStage = () => {
    if (!plant) return 0;
    
    const percentage = (plant.growth / plant.maxGrowth) * 100;
    if (percentage < 25) return 0; // Seedling
    if (percentage < 50) return 1; // Small
    if (percentage < 75) return 2; // Medium
    if (percentage < 100) return 3; // Almost mature
    return 4; // Fully mature
  };
  
  // Get classnames based on plant's state and environmental factors
  const getClassNames = () => {
    const classes = ['garden-plot'];
    
    if (selected) classes.push('selected');
    
    if (!plant) {
      classes.push('empty');
      
      // Soil moisture for empty plots
      if (slot.moisture < 30) classes.push('dry-soil');
      else if (slot.moisture > 70) classes.push('wet-soil');
      
      // Soil fertility indication
      if (slot.fertility < 40) classes.push('poor-soil');
      else if (slot.fertility > 80) classes.push('rich-soil');
      
      return classes.join(' ');
    }
    
    // Plant-specific classes
    classes.push('has-plant');
    
    // Growth stage
    const growthStage = getGrowthStage();
    classes.push(`growth-stage-${growthStage}`);
    
    // Watering status
    if (!plant.watered) classes.push('needs-water');
    
    // Health status
    if (plant.health < 30) classes.push('unhealthy');
    else if (plant.health > 80) classes.push('thriving');
    
    // Special properties
    if (plant.moonBlessed) classes.push('moon-blessed');
    if (plant.mutations && plant.mutations.length > 0) classes.push('mutated');
    
    // Harvest ready
    if (plant.growth >= plant.maxGrowth) classes.push('harvest-ready');
    
    return classes.join(' ');
  };
  
  // Get appropriate plant image based on type and growth stage
  const getPlantImage = () => {
    if (!plant) return null;
    
    const plantName = plant.name.toLowerCase().replace(/\s/g, '_');
    const growthStage = getGrowthStage();
    
    return `/images/plants/${plantName}_stage_${growthStage}.png`;
  };
  
  // Get CSS variables for plant styling
  const getPlantStyle = () => {
    if (!plant) return {};
    
    // Calculate various visual effects based on plant state
    const healthColor = getHealthColor(plant.health);
    const growthScale = 0.5 + (plant.growth / plant.maxGrowth) * 0.5;
    const swayAmount = weather === 'windy' ? '5px' : '2px';
    
    return {
      '--health-color': healthColor,
      '--growth-scale': growthScale,
      '--sway-amount': swayAmount
    } as React.CSSProperties;
  };
  
  // Helper function to get health indicator color
  const getHealthColor = (health: number) => {
    if (health < 30) return '#e74c3c'; // Unhealthy - red
    if (health < 60) return '#f39c12'; // Moderately healthy - orange
    if (health < 80) return '#2ecc71'; // Healthy - green
    return '#27ae60'; // Very healthy - dark green
  };
  
  // Generate a tooltip with plant information
  const getTooltipContent = () => {
    if (!plant) return 'Empty plot. Click to plant a seed.';
    
    const growthPercent = Math.round((plant.growth / plant.maxGrowth) * 100);
    
    if (plant.growth >= plant.maxGrowth) {
      return `${plant.name} - Ready to harvest!`;
    }
    
    return `${plant.name} - Growth: ${growthPercent}% - Health: ${plant.health}%
            ${plant.watered ? '(Watered)' : '(Needs water)'}`;
  };
  
  return (
    <div 
      className={getClassNames()}
      onClick={onClick}
      style={getPlantStyle()}
      title={getTooltipContent()}
    >
      {plant ? (
        <div className="plant-container">
          {/* Plant visual */}
          <div className="plant-visual">
            <img 
              src={getPlantImage()} 
              alt={plant.name}
              className={`plant-image ${plant.watered ? 'watered' : 'dry'}`}
            />
            
            {/* Special effects */}
            {plant.moonBlessed && (
              <div className="moon-glow-effect"></div>
            )}
            
            {plant.mutations && plant.mutations.length > 0 && (
              <div className="mutation-effect"></div>
            )}
            
            {/* Growth indicator */}
            <div className="growth-indicator">
              <div 
                className="growth-bar"
                style={{ width: `${(plant.growth / plant.maxGrowth) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Harvest indicator for mature plants */}
          {plant.growth >= plant.maxGrowth && (
            <div className="harvest-indicator">✨</div>
          )}
        </div>
      ) : (
        <div className="empty-plot">
          {/* Show soil quality visual */}
          <div className={`soil-visual fertility-${Math.floor(slot.fertility / 20)}`}></div>
          
          {/* Show planting hint when selected */}
          {selected && (
            <div className="plant-here-hint">Plant Here</div>
          )}
        </div>
      )}
      
      {/* Plot border shows selection state */}
      <div className="plot-border"></div>
    </div>
  );
};

export default GardenPlot;