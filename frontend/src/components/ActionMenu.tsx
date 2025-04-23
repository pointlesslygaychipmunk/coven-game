import React, { useState } from 'react';

export const ActionMenu = ({
  onPlant,
  onHarvest,
  onBrew,
  onPlantTree,
  onFellTree
}: {
  onPlant: (cropType: 'mushroom' | 'flower' | 'herb', index: number) => void;
  onHarvest: () => void;
  onBrew: (map: Record<'mushroom' | 'flower' | 'herb' | 'fruit', number>) => void;
  onPlantTree: (index: number) => void;
  onFellTree: (index: number) => void;
}) => {
  const [selectedCrop, setSelectedCrop] = useState<'mushroom' | 'flower' | 'herb'>('herb');
  const [plotIndex, setPlotIndex] = useState(0);
  const [treeIndex, setTreeIndex] = useState(0);
  const [fellIndex, setFellIndex] = useState(0);
  const [brewMap, setBrewMap] = useState({
    mushroom: 0,
    flower: 0,
    herb: 0,
    fruit: 0
  });

  const updateBrew = (type: 'mushroom' | 'flower' | 'herb' | 'fruit', value: number) => {
    setBrewMap(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="p-4 bg-indigo-50 rounded-xl shadow-md space-y-4">
      <h3 className="text-lg font-semibold">Actions</h3>

      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="crop">Crop:</label>
        <select
          id="crop"
          className="border p-1 rounded"
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value as any)}
        >
          <option value="mushroom">🍄 Mushroom</option>
          <option value="flower">🌸 Flower</option>
          <option value="herb">🌿 Herb</option>
        </select>

        <label htmlFor="plot">Plot:</label>
        <select
          id="plot"
          className="border p-1 rounded"
          value={plotIndex}
          onChange={(e) => setPlotIndex(parseInt(e.target.value))}
        >
          {[...Array(8)].map((_, i) => (
            <option key={i} value={i}>#{i}</option>
          ))}
        </select>

        <button
          className="px-3 py-1 bg-green-300 rounded hover:bg-green-400"
          onClick={() => onPlant(selectedCrop, plotIndex)}
        >
          Plant
        </button>

        <button
          className="px-3 py-1 bg-purple-300 rounded hover:bg-purple-400"
          onClick={onHarvest}
        >
          Harvest Selected
        </button>
      </div>

      <div className="space-y-1">
        <div className="text-sm text-gray-700">Brew Potions</div>
        {(['mushroom', 'flower', 'herb', 'fruit'] as const).map((type) => (
          <div key={type} className="flex gap-2 items-center">
            <label>{type}:</label>
            <input
              type="number"
              value={brewMap[type]}
              onChange={(e) => updateBrew(type, parseInt(e.target.value) || 0)}
              className="border p-1 rounded w-16"
              min={0}
            />
          </div>
        ))}
        <button
          className="mt-2 px-3 py-1 bg-yellow-300 rounded hover:bg-yellow-400"
          onClick={() => onBrew(brewMap)}
        >
          Brew Selected
        </button>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">🌳 Trees</h4>
        <div className="flex gap-2 items-center">
          <label>Plot:</label>
          <select
            className="border p-1 rounded"
            value={treeIndex}
            onChange={(e) => setTreeIndex(parseInt(e.target.value))}
          >
            {[...Array(8)].map((_, i) => (
              <option key={i} value={i}>#{i}</option>
            ))}
          </select>
          <button
            className="px-3 py-1 bg-emerald-300 rounded hover:bg-emerald-400"
            onClick={() => onPlantTree(treeIndex)}
          >
            Plant Tree
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <label>Fell Tree:</label>
          <select
            className="border p-1 rounded"
            value={fellIndex}
            onChange={(e) => setFellIndex(parseInt(e.target.value))}
          >
            {[...Array(8)].map((_, i) => (
              <option key={i} value={i}>#{i}</option>
            ))}
          </select>
          <button
            className="px-3 py-1 bg-rose-300 rounded hover:bg-rose-400"
            onClick={() => onFellTree(fellIndex)}
          >
            Fell Tree
          </button>
        </div>
      </div>
    </div>
  );
};
