import React from "react";
import type { GameStatus } from "../../../shared/src/types";

export const GameStatusBar = ({ status }: { status: GameStatus }) => {
  // Moon phase emojis using Unicode escape sequences to avoid parser issues
  const moonEmojis = ['\u{1F311}', '\u{1F312}', '\u{1F313}', '\u{1F314}', '\u{1F315}', '\u{1F316}', '\u{1F317}', '\u{1F318}'];
  const moonPhaseIcon = moonEmojis[Math.floor((status.moonPhase % 28) / 4)];

  return (
    <div className="flex flex-wrap items-center justify-between bg-stone-100 rounded-xl border px-4 py-2 mb-4 text-sm">
      <span>📆 Year {status.year}, {status.season}</span>
      <span>{moonPhaseIcon} Moon Phase {status.moonPhase}</span>
      <span>🌦️ Weather: {status.weather}</span>
    </div>
  );
};