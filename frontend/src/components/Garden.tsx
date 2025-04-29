// frontend/src/components/Garden.tsx
import React, { useState, useEffect } from 'react';
import { Player, GardenSlot, Plant, GameTime } from '@shared/types';
import { getIngredientData } from '../utils/gameData';
import GardenPlot from './GardenPlot';
import InventorySidebar from './InventorySidebar';
import LunarPhaseDisplay from './LunarPhaseDisplay';
import WeatherEffectsOverlay from './WeatherEffectsOverlay';
import './Garden.css';

interface GardenProps {
  player: Player;
  time: GameTime;
  onPlant: (slotId: number, seedName: string) => void;
  onWater: () => void;
  onHarvest: (slotId: number) => void;
  onEndTurn: () => void;
}

const Garden: React.FC<GardenProps> = ({ 
  player, 
  time, 
  onPlant, 
  onWater, 
  onHarvest, 
  onEndTurn 
}) => {
  // Local state
  const [selectedSeed, setSelectedSeed] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showPlantInfo, setShowPlantInfo] = useState<boolean>(false);
  const [selectedPlant, setSelectedPlant] = useState<{plant: Plant, slot: GardenSlot} | null>(null);
  const [gardenMetrics, setGardenMetrics] = useState<{
    totalPlants: number;
    maturePlants: number;
    needWatering: number;
    averageHealth: number;
  }>({
    totalPlants: 0,
    maturePlants: 0,
    needWatering: 0,
    averageHealth: 0
  });

  // Separate seeds from inventory for planting options
  const seedItems = player.inventory.filter(item => item.type === 'seed');
  
  // Calculate garden metrics whenever garden changes
  useEffect(() => {
    const metrics = {
      totalPlants: 0,
      maturePlants: 0,
      needWatering: 0,
      averageHealth: 0,
      totalHealth: 0
    };
    
    player.garden.forEach(slot => {
      if (slot.plant) {
        metrics.totalPlants++;
        if (slot.plant.growth >= slot.plant.maxGrowth) {
          metrics.maturePlants++;
        }
        if (!slot.plant.watered) {
          metrics.needWatering++;
        }
        metrics.totalHealth += slot.plant.health;
      }
    });
    
    metrics.averageHealth = metrics.totalPlants > 0 
      ? Math.round(metrics.totalHealth / metrics.totalPlants) 
      : 0;
    
    setGardenMetrics({
      totalPlants: metrics.totalPlants,
      maturePlants: metrics.maturePlants,
      needWatering: metrics.needWatering,
      averageHealth: metrics.averageHealth
    });
  }, [player.garden]);

  // Handle slot selection
  const handleSlotClick = (slot: GardenSlot) => {
    const slotId = slot.id;
    
    // If player has a seed selected and clicks an empty slot, plant the seed
    if (selectedSeed && !slot.plant) {
      onPlant(slotId, selectedSeed);
      setSelectedSeed(null); // Clear selection after planting
      return;
    }
    
    // If clicking a slot with a mature plant, harvest it
    if (slot.plant && slot.plant.growth >= slot.plant.maxGrowth) {
      onHarvest(slotId);
      return;
    }
    
    // Otherwise, show info about the slot/plant
    setSelectedSlot(slotId);
    
    if (slot.plant) {
      setSelectedPlant({ plant: slot.plant, slot });
      setShowPlantInfo(true);
    } else {
      setSelectedPlant(null);
      setShowPlantInfo(false);
    }
  };

  // Handle seed selection
  const handleSeedSelect = (seedName: string) => {
    setSelectedSeed(prevSeed => prevSeed === seedName ? null : seedName);
    setShowPlantInfo(false);
  };

  // Get styling based on weather
  const getWeatherClass = () => {
    switch (time.weatherFate) {
      case 'rainy': return 'garden-rainy';
      case 'dry': return 'garden-dry';
      case 'foggy': return 'garden-foggy';
      case 'windy': return 'garden-windy';
      case 'stormy': return 'garden-stormy';
      default: return 'garden-normal';
    }
  };

  // Calculate best planting time based on moon phase and season
  const getBestPlantingConditions = (seedName: string) => {
    // This would use the getIngredientData utility to check optimal conditions
    // For simplicity, we'll return a generic message for now
    return "Best planted during Full Moon in Spring.";
  };

  return (
    <div className={`garden-container ${getWeatherClass()}`}>
      {/* Weather effects overlay */}
      <WeatherEffectsOverlay weather={time.weatherFate} />
      
      {/* Garden info header */}
      <div className="garden-header">
        <h2>Your Garden</h2>
        <div className="garden-stats">
          <span>Plants: {gardenMetrics.totalPlants}/9</span>
          <span>Ready to Harvest: {gardenMetrics.maturePlants}</span>
          <span>Need Watering: {gardenMetrics.needWatering}</span>
          <span>Average Health: {gardenMetrics.averageHealth}%</span>
        </div>
      </div>
      
      {/* Main content area with garden grid and sidebar */}
      <div className="garden-content">
        {/* Garden grid */}
        <div className="garden-grid">
          {player.garden.map(slot => (
            <GardenPlot
              key={slot.id}
              slot={slot}
              selected={selectedSlot === slot.id}
              onClick={() => handleSlotClick(slot)}
              moonPhase={time.phaseName}
              season={time.season}
              weather={time.weatherFate}
            />
          ))}
        </div>
        
        {/* Right sidebar with inventory and info */}
        <div className="garden-sidebar">
          {/* Seed selection */}
          <div className="seed-selection">
            <h3>Seeds</h3>
            {seedItems.length === 0 ? (
              <p className="no-seeds">No seeds available.</p>
            ) : (
              <div className="seed-list">
                {seedItems.map(seed => (
                  <div 
                    key={seed.id}
                    className={`seed-item ${selectedSeed === seed.name ? 'selected' : ''}`}
                    onClick={() => handleSeedSelect(seed.name)}
                  >
                    <img 
                      src={`/images/seeds/${seed.name.toLowerCase().replace(/\s/g, '_')}.png`} 
                      alt={seed.name}
                      className="seed-icon"
                    />
                    <div className="seed-details">
                      <span className="seed-name">{seed.name}</span>
                      <span className="seed-quantity">x{seed.quantity}</span>
                      {selectedSeed === seed.name && (
                        <p className="seed-tip">{getBestPlantingConditions(seed.name)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Plant information */}
          {showPlantInfo && selectedPlant && (
            <div className="plant-info">
              <h3>{selectedPlant.plant.name}</h3>
              <div className="plant-stats">
                <div className="stat">
                  <span className="stat-label">Growth:</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(selectedPlant.plant.growth / selectedPlant.plant.maxGrowth) * 100}%` }}
                    ></div>
                  </div>
                  <span className="stat-value">
                    {selectedPlant.plant.growth} / {selectedPlant.plant.maxGrowth}
                  </span>
                </div>
                
                <div className="stat">
                  <span className="stat-label">Health:</span>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${selectedPlant.plant.health < 30 ? 'low' : 
                                               selectedPlant.plant.health < 70 ? 'medium' : 'high'}`}
                      style={{ width: `${selectedPlant.plant.health}%` }}
                    ></div>
                  </div>
                  <span className="stat-value">{selectedPlant.plant.health}%</span>
                </div>
                
                <div className="stat">
                  <span className="stat-label">Watered:</span>
                  <span className={`stat-value ${selectedPlant.plant.watered ? 'yes' : 'no'}`}>
                    {selectedPlant.plant.watered ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="stat">
                  <span className="stat-label">Soil Moisture:</span>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${selectedPlant.slot.moisture < 30 ? 'low' : 
                                               selectedPlant.slot.moisture < 70 ? 'medium' : 'high'}`}
                      style={{ width: `${selectedPlant.slot.moisture}%` }}
                    ></div>
                  </div>
                  <span className="stat-value">{selectedPlant.slot.moisture}%</span>
                </div>
                
                <div className="stat">
                  <span className="stat-label">Fertility:</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${selectedPlant.slot.fertility}%` }}
                    ></div>
                  </div>
                  <span className="stat-value">{selectedPlant.slot.fertility}%</span>
                </div>
                
                {selectedPlant.plant.moonBlessed && (
                  <div className="special-trait">
                    <span className="moon-blessed">✨ Moon Blessed</span>
                  </div>
                )}
                
                {selectedPlant.plant.mutations && selectedPlant.plant.mutations.length > 0 && (
                  <div className="special-trait">
                    <span className="mutation">🧬 {selectedPlant.plant.mutations.join(', ')}</span>
                  </div>
                )}
              </div>
              
              <div className="plant-actions">
                {selectedPlant.plant.growth >= selectedPlant.plant.maxGrowth && (
                  <button 
                    onClick={() => onHarvest(selectedPlant.slot.id)}
                    className="harvest-button"
                  >
                    Harvest
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Garden actions */}
          <div className="garden-actions">
            <button 
              onClick={onWater}
              className="action-button water-button"
              disabled={gardenMetrics.totalPlants === 0}
            >
              Water All Plants
            </button>
            
            <button 
              onClick={onEndTurn} 
              className="action-button end-turn-button"
            >
              End Turn & Advance Time
            </button>
          </div>
          
          {/* Lunar phase display */}
          <LunarPhaseDisplay 
            phase={time.phaseName} 
            season={time.season}
            weather={time.weatherFate}
          />
        </div>
      </div>
    </div>
  );
};

export default Garden;