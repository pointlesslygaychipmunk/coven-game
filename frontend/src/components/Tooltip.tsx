// src/components/Tooltip.tsx
import React from "react";

interface TooltipProps {
  visible: boolean;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ visible, children }) => {
  return (
    <div
      role="tooltip"
      aria-live="polite"
      className={`absolute z-50 text-black text-xs rounded px-2 py-1 shadow-md top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap
        bg-white transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {children}
    </div>
  );
};

export default Tooltip;