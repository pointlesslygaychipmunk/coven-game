// src/components/withTooltip.tsx
import React from "react";
import Tooltip from "./Tooltip";
import { useTooltip } from "../useTooltip";

export function withTooltip<P extends object>(
  Component: React.ComponentType<P>,
  tooltipContent: React.ReactNode
) {
  return function WrappedComponent(props: P) {
    const { visible, show, hide } = useTooltip();

    return (
      <div className="relative inline-flex items-center space-x-1">
        <Component {...props} />
        <button
          type="button"
          onMouseEnter={show}
          onMouseLeave={hide}
          onFocus={show}
          onBlur={hide}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Show tooltip"
        >
          🔍
        </button>
        <Tooltip visible={visible}>{tooltipContent}</Tooltip>
      </div>
    );
  };
}