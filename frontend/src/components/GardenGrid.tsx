// src/GardenGrid.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Flower2, Flame, Apple, Hand, Droplets, Sparkles, Timer, Skull } from "lucide-react";

type Props = {
  spaces: ({ type: string; stage: "young" | "mature" | "withered"; age: number } | null)[];
  onPlantCrop: (type: "mushroom" | "flower" | "herb", index: number) => void;
  onPlantTree: (index: number) => void;
  player: any;
};

export const GardenGrid = ({ spaces, onPlantCrop, onPlantTree, player }: Props) => {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const handlePlotClick = (index: number) => {
    if (!selectedCrop || spaces[index] || isBusy) return;
    setIsBusy(true);
    setTimeout(() => setIsBusy(false), 500);
    if (selectedCrop === "tree") {
      onPlantTree(index);
    } else if (selectedCrop === "mushroom" || selectedCrop === "flower" || selectedCrop === "herb") {
      onPlantCrop(selectedCrop, index);
    }
  };

  const cropIcon = (type: string) => {
    switch (type) {
      case "mushroom": return <span title="Mushroom"><Flame className="w-4 h-4 inline text-orange-600" /></span>;
      case "flower": return <span title="Flower"><Flower2 className="w-4 h-4 inline text-pink-600" /></span>;
      case "herb": return <span title="Herb"><Leaf className="w-4 h-4 inline text-green-600" /></span>;
      case "tree": return <span title="Tree"><Apple className="w-4 h-4 inline text-red-600" /></span>;
      default: return null;
    }
  };

  const stageIcon = (stage: string) => {
    switch (stage) {
      case "young": return <span title="Growing"><Timer className="absolute top-1 left-1 w-4 h-4 text-blue-400 animate-ping" /></span>;
      case "mature": return <span title="Ready"><Sparkles className="absolute top-1 right-1 w-4 h-4 text-yellow-400 animate-pulse" /></span>;
      case "withered": return <span title="Withered"><Skull className="absolute top-1 right-1 w-4 h-4 text-gray-500" /></span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-2 mb-2">
        {Object.entries(player.inventory)
          .filter(([type, count]) => typeof count === 'number' && count > 0 && ["mushroom", "flower", "herb"].includes(type))
          .map(([type]) => (
            <button
              key={type}
              onClick={() => setSelectedCrop(type)}
              className={`px-3 py-1 rounded-full shadow-md border transition duration-200 ${selectedCrop === type ? "bg-purple-300 text-white" : "bg-white text-purple-700 hover:bg-purple-100"}`}
              title={`Select ${type} to plant`}
            >
              {cropIcon(type)} {type}
            </button>
          ))}
        {player.inventory.fruit > 0 && (
          <button
            onClick={() => setSelectedCrop("tree")}
            className={`px-3 py-1 rounded-full shadow-md border transition duration-200 ${selectedCrop === "tree" ? "bg-purple-300 text-white" : "bg-white text-purple-700 hover:bg-purple-100"}`}
            title="Select fruit to grow a tree"
          >
            <Apple className="w-4 h-4 inline text-red-600" /> Tree
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 p-4 rounded-xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 shadow-inner">
        {spaces.map((plot, index) => (
          <motion.div
            key={index}
            onClick={() => handlePlotClick(index)}
            className={`relative h-24 flex flex-col items-center justify-center border rounded-lg shadow-md transition-all duration-300 cursor-pointer ${plot ? (plot.type === "tree" ? "bg-green-100 border-green-300" : "bg-purple-50 border-purple-300") : "bg-white/30 border-dashed border-purple-200 hover:bg-purple-100"}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {plot ? (
              <div className="text-lg font-semibold text-purple-800">
                {cropIcon(plot.type)} {plot.type === "tree" ? "Tree" : plot.type}
                {stageIcon(plot.stage)}
              </div>
            ) : (
              <div className="text-sm text-purple-300 flex items-center gap-1">
                <Hand className="w-4 h-4" /> Empty Plot
                <Droplets className="absolute bottom-1 right-1 w-4 h-4 text-blue-300" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};