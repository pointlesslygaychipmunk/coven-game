// src/components/Tooltip.tsx
import React from "react";

interface TooltipProps {
  visible: boolean;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ visible, children }) => {
  if (!visible) return null;

  return (
    <div className="absolute z-50 bg-white text-black text-xs rounded px-2 py-1 shadow-md top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
      {children}
    </div>
  );
};

export default Tooltip;