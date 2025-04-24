// src/components/withTooltip.tsx
import React from "react";
import Tooltip from "./Tooltip";
import { useTooltip } from "../useTooltip";

export function withTooltip(Component: React.ComponentType<any>, tooltipContent: React.ReactNode) {
  return function Wrapped(props: any) {
    const { visible, position, show, hide } = useTooltip();

    return (
      <div onMouseEnter={show} onMouseLeave={hide} className="relative inline-block">
        <Component {...props} />
        <Tooltip visible={visible} position={position}>{tooltipContent}</Tooltip>
      </div>
    );
  };
}