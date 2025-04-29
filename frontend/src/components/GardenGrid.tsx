import React from 'react';

function GardenGrid({ garden, onPlant }: any) {
  return (
    <div className="garden">
      <h2>Garden 🌿</h2>
      <div className="garden-grid">
        {garden.map((slot: any) => (
          <div key={slot.id} className="garden-slot" onClick={() => {
            if (!slot.plant) {
              onPlant(slot.id);
            }
          }}>
            {slot.plant ? (
              <div>
                <strong>{slot.plant.name}</strong>
                <div>Stage {slot.plant.growthStage}/{slot.plant.maxGrowthStage}</div>
              </div>
            ) : (
              <div>Empty</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GardenGrid;
