import React from "react";
import { motion } from "framer-motion";
import { Leaf, Flower2, Flame } from "lucide-react";

type Props = {
  spaces: (string | null)[];
  onPlantCrop: (type: "mushroom" | "flower" | "herb", index: number) => void;
  onPlantTree: () => void;
  player: any;
};

export const GardenGrid = ({ spaces, onPlantCrop, onPlantTree, player }: Props) => {
  const handleDropdownChange = (index: number, value: string) => {
    if (value === "tree") {
      onPlantTree();
    } else if (value === "mushroom" || value === "flower" || value === "herb") {
      onPlantCrop(value, index);
    }
  };

  const cropIcon = (type: string) => {
    switch (type) {
      case "mushroom": return <Flame className="w-4 h-4 inline text-orange-600" />;
      case "flower": return <Flower2 className="w-4 h-4 inline text-pink-600" />;
      case "herb": return <Leaf className="w-4 h-4 inline text-green-600" />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3 p-4 rounded-xl bg-white/60 shadow-inner">
      {spaces.map((plot, index) => (
        <motion.div
          key={index}
          className="h-24 flex flex-col items-center justify-center border border-purple-300 rounded-lg bg-purple-50 shadow-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {plot ? (
            <div className="text-lg font-semibold text-purple-800">
              {cropIcon(plot)} {plot}
            </div>
          ) : (
            <select
              className="mt-2 text-sm bg-white border border-purple-200 rounded-full px-3 py-1 shadow-sm hover:bg-purple-50"
              onChange={(e) => handleDropdownChange(index, e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Plant...
              </option>
              {Object.entries(player.inventory)
                .filter(([_, count]) => (count as number) > 0)
                .map(([type]) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              <option value="tree">Tree 🌳</option>
            </select>
          )}
        </motion.div>
      ))}
    </div>
  );
};