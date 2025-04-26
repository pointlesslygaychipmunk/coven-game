// frontend/src/components/Journal.tsx

import React, { useEffect, useRef } from "react";

interface JournalProps {
  alerts: string[];
  timestamps?: string[];
}

export const Journal: React.FC<JournalProps> = ({ alerts, timestamps }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [alerts]);

  const parseAlertClass = (alert: string): string => {
    if (alert.includes("❌")) return "text-rose-700 border-rose-300 bg-rose-50";
    if (alert.includes("✅")) return "text-green-800 border-green-300 bg-green-50";
    if (alert.includes("⚠️")) return "text-amber-700 border-amber-300 bg-amber-50";
    return "text-indigo-900 border-indigo-300 bg-indigo-50";
  };

  const fallbackTimestamp = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="fixed bottom-6 right-6 w-[28rem] max-h-80 overflow-y-auto rounded-2xl shadow-2xl border border-purple-500 p-5 z-50
                 bg-[url('/parchment-texture.png')] bg-cover bg-center
                 ring-2 ring-purple-400 animate-glow backdrop-blur-md backdrop-saturate-150 scroll-smooth"
    >
      <h2 className="font-bold text-xl text-purple-900 tracking-widest mb-3 border-b border-purple-300 pb-2 drop-shadow">
        🕯️ Journal
      </h2>

      {alerts.length === 0 ? (
        <p className="text-center italic text-sm text-gray-500">
          No omens yet... 🌫️
        </p>
      ) : (
        <ul className="space-y-2 text-sm font-serif">
          {alerts.map((alert, i) => (
            <li
              key={i}
              className={`px-4 py-2 border rounded-lg shadow-inner flex justify-between items-start gap-3 ${parseAlertClass(
                alert
              )}`}
            >
              <span className="before:content-['✦'] before:mr-2 flex-1 break-words leading-snug">
                {alert}
              </span>
              <span className="text-xs text-gray-500 italic whitespace-nowrap">
                {timestamps?.[i] || fallbackTimestamp()}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div ref={bottomRef} />
    </div>
  );
};