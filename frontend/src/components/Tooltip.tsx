// src/components/Tooltip.tsx
import React from "react";

interface TooltipProps {
  visible: boolean;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ visible, children }) => {
  if (!visible) return null;

  return (
    <div className="absolute z-50 mt-2 px-3 py-1 rounded-md bg-black text-white text-sm shadow-lg max-w-xs w-max">
      {children}
    </div>
  );
};

export default Tooltip;