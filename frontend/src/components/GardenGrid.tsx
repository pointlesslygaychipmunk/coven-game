import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Flower2,
  Flame,
  Apple,
  Hand,
  Droplets,
  Sparkles,
  Timer,
  Skull,
  Loader2,
  Droplet
} from "lucide-react";

let growthInterval: ReturnType<typeof setTimeout> | null = null;

interface GardenPlot {
  type: string;
  stage: "young" | "mature" | "withered";
  watered?: boolean;
}

type Props = {
  spaces: (GardenPlot | null)[];
  onPlantCrop: (type: "mushroom" | "flower" | "herb", index: number) => void;
  onPlantTree: (index: number) => void;
  player: any;
};

export const GardenGrid = ({ spaces, onPlantCrop, onPlantTree, player }: Props) => {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [internalSpaces, setInternalSpaces] = useState(spaces);
  const [isPlanting, setIsPlanting] = useState(false);
  const [plotTimers, setPlotTimers] = useState<number[]>(Array(spaces.length).fill(0));

  useEffect(() => {
    setInternalSpaces(spaces);
  }, [spaces]);

  useEffect(() => {
    if (growthInterval) clearInterval(growthInterval);
    growthInterval = setInterval(() => {
      setInternalSpaces((prev) =>
        prev.map((plot, i) => {
          if (!plot) return null;
          if (plot.watered) {
            plot.watered = false;
            return plot;
          }
          if (plot.stage === "young") return { ...plot, stage: "mature" };
          if (plot.stage === "mature") return { ...plot, stage: "withered" };
          return plot;
        })
      );
      setPlotTimers((prev) => prev.map((t) => Math.max(t - 15, 0)));
    }, 15000);
    return () => clearInterval(growthInterval!);
  }, []);

  const handlePlotClick = async (index: number) => {
    if (!selectedCrop || internalSpaces[index] || isPlanting) return;
    setIsPlanting(true);
    if (selectedCrop === "tree") {
      await onPlantTree(index);
    } else if (selectedCrop === "mushroom" || selectedCrop === "flower" || selectedCrop === "herb") {
      await onPlantCrop(selectedCrop, index);
    }
    setIsPlanting(false);
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

  const stageIcon = (stage: string, timeRemaining: number, watered?: boolean) => {
    if (watered) return <Droplet className="absolute top-1 left-1 w-4 h-4 text-blue-300 animate-bounce" />;
    switch (stage) {
      case "young": return <Timer className="absolute top-1 left-1 w-4 h-4 text-blue-400 animate-ping" />;
      case "mature": return <Sparkles className="absolute top-1 right-1 w-4 h-4 text-yellow-400 animate-pulse" />;
      case "withered": return <Skull className="absolute top-1 right-1 w-4 h-4 text-gray-500" />;
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
              disabled={isPlanting}
            >
              {cropIcon(type)} {type}
            </button>
          ))}
        {player.inventory.fruit > 0 && (
          <button
            onClick={() => setSelectedCrop("tree")}
            className={`px-3 py-1 rounded-full shadow-md border transition duration-200 ${selectedCrop === "tree" ? "bg-purple-300 text-white" : "bg-white text-purple-700 hover:bg-purple-100"}`}
            disabled={isPlanting}
          >
            <Apple className="w-4 h-4 inline text-red-600" /> Tree
          </button>
        )}
        {isPlanting && (
          <Loader2 className="w-5 h-5 text-purple-500 animate-spin ml-2" />
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 p-4 rounded-xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 shadow-inner">
        {internalSpaces.map((plot, index) => (
          <motion.div
            key={index}
            onClick={() => handlePlotClick(index)}
            className={`relative h-24 flex flex-col items-center justify-center border rounded-lg shadow-md transition-all duration-300 cursor-pointer ${plot ? (plot.type === "tree" ? "bg-green-100 border-green-300" : "bg-purple-50 border-purple-300") : "bg-white/30 border-dashed border-purple-200 hover:bg-purple-100"}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence>
              {plot ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-lg font-semibold text-purple-800"
                >
                  {cropIcon(plot.type)} {plot.type === "tree" ? "Tree" : plot.type}
                  {stageIcon(plot.stage, plotTimers[index], plot.watered)}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-purple-300 flex items-center gap-1"
                >
                  <Hand className="w-4 h-4" /> Empty Plot
                  <Droplets className="absolute bottom-1 right-1 w-4 h-4 text-blue-300" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};