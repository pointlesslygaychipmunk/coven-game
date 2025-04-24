// src/components/withTooltip.tsx
import React from "react";
import Tooltip from "./Tooltip";
import { useTooltip } from "../useTooltip";

export function withTooltip(
  Component: React.ComponentType<any>,
  tooltipContent: React.ReactNode
) {
  return function Wrapped(props: any) {
    const { visible, toggle, hide } = useTooltip();

    return (
      <div
        onMouseEnter={toggle}
        onMouseLeave={hide}
        className="relative inline-block"
      >
        <Component {...props} />
        <Tooltip visible={visible}>{tooltipContent}</Tooltip>
      </div>
    );
  };
}