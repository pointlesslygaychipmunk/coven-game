// src/utils/useTooltip.ts
import { useState, useCallback } from "react";

export function useTooltip() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const show = useCallback((e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPosition({ top: rect.top, left: rect.left + rect.width / 2 });
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  return { visible, position, show, hide };
}