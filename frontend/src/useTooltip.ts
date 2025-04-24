// src/useTooltip.ts
import { useState } from "react";

export function useTooltip() {
  const [visible, setVisible] = useState(false);
  return {
    visible,
    show: () => setVisible(true),
    hide: () => setVisible(false),
  };
}