// src/components/Tooltip.tsx
import React from "react";

interface TooltipProps {
  children: React.ReactNode;
  visible: boolean;
  position: { top: number; left: number };
}

const Tooltip: React.FC<TooltipProps> = ({ children, visible, position }) => {
  if (!visible) return null;

  return (
    <div
      className="absolute z-50 bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md pointer-events-none transition-opacity duration-150"
      style={{
        top: position.top,
        left: position.left,
        transform: "translateY(-100%)",
      }}
    >
      {children}
    </div>
  );
};

export default Tooltip;