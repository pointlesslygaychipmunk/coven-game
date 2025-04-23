import React, { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Flower2, Flame, Apple, MousePointer } from "lucide-react";

type Props = {
  spaces: (string | null)[];
  onPlantCrop: (type: "mushroom" | "flower" | "herb", index: number) => void;
  onPlantTree: (index: number) => void;
  player: any;
};

export const GardenGrid = ({ spaces, onPlantCrop, onPlantTree, player }: Props) => {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  const handlePlotClick = (index: number) => {
    if (!selectedCrop || spaces[index]) return;
    if (selectedCrop === "tree") {
      onPlantTree(index);
    } else if (selectedCrop === "mushroom" || selectedCrop === "flower" || selectedCrop === "herb") {
      onPlantCrop(selectedCrop, index);
    }
  };

  const cropIcon = (type: string) => {
    switch (type) {
      case "mushroom": return <Flame className="w-4 h-4 inline text-orange-600" />;
      case "flower": return <Flower2 className="w-4 h-4 inline text-pink-600" />;
      case "herb": return <Leaf className="w-4 h-4 inline text-green-600" />;
      case "tree": return <Apple className="w-4 h-4 inline text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-center gap-2 mb-2">
        {Object.entries(player.inventory)
          .filter(([type, count]) => typeof count === 'number' && count > 0 && ["mushroom", "flower", "herb"].includes(type))
          .map(([type]) => (
            <button
              key={type}
              onClick={() => setSelectedCrop(type)}
              className={`px-3 py-1 rounded-full shadow-md border ${selectedCrop === type ? "bg-purple-300 text-white" : "bg-white text-purple-700"}`}
            >
              {cropIcon(type)} {type}
            </button>
          ))}
        {player.inventory.fruit > 0 && (
          <button
            onClick={() => setSelectedCrop("tree")}
            className={`px-3 py-1 rounded-full shadow-md border ${selectedCrop === "tree" ? "bg-purple-300 text-white" : "bg-white text-purple-700"}`}
          >
            <Apple className="w-4 h-4 inline text-red-600" /> Tree
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 p-4 rounded-xl bg-white/60 shadow-inner">
        {spaces.map((plot, index) => (
          <motion.div
            key={index}
            onClick={() => handlePlotClick(index)}
            className={`h-24 flex flex-col items-center justify-center border rounded-lg shadow-md transition-all duration-300 cursor-pointer ${plot === "tree" ? "bg-green-100 border-green-300" : plot ? "bg-purple-50 border-purple-300" : "bg-white/30 border-dashed border-purple-200"}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {plot ? (
              <div className="text-lg font-semibold text-purple-800" title={plot}>
                {cropIcon(plot)} {plot === "tree" ? "Tree" : plot}
              </div>
            ) : (
              <div className="text-sm text-purple-300 flex items-center gap-1">
                <MousePointer className="w-4 h-4" /> Click to Plant
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};