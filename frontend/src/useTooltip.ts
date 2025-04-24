// src/utils/useTooltip.ts
import { useState } from "react";

export function useTooltip() {
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible(v => !v);
  const hide = () => setVisible(false);

  return {
    visible,
    toggle,
    hide,
  };
}