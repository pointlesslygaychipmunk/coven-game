import React, { useEffect, useRef } from "react";

interface JournalProps {
  alerts: string[];
  timestamps?: string[]; // optional array of time strings (e.g. ["10:42 AM", ...])
}

export const Journal: React.FC<JournalProps> = ({ alerts, timestamps }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [alerts]);

  const parseAlertClass = (alert: string): string => {
    if (alert.includes("❌")) return "text-rose-600 border-rose-300 bg-rose-50";
    if (alert.includes("✅")) return "text-emerald-700 border-emerald-400 bg-emerald-50";
    if (alert.includes("⚠️")) return "text-amber-700 border-amber-300 bg-amber-50";
    return "text-indigo-900 border-indigo-300 bg-indigo-50";
  };

  const fallbackTimestamp = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed bottom-6 right-6 w-[28rem] max-h-80 overflow-y-auto rounded-2xl shadow-2xl border border-purple-500 p-5 z-50
                    bg-[url('/parchment-texture.png')] bg-cover bg-center backdrop-blur-md
                    ring-2 ring-purple-400 animate-glow backdrop-saturate-150 scroll-smooth">
      <h2 className="font-bold text-xl text-purple-900 tracking-widest mb-3 border-b border-purple-300 pb-2 drop-shadow-sm">
        🕯️ Grimoire Log
      </h2>

      {alerts.length === 0 ? (
        <p className="text-center italic text-sm text-gray-500">No omens yet... 🌫️</p>
      ) : (
        alerts.map((alert, index) => (
          <div
            key={index}
            className={`text-sm font-serif px-4 py-2 border rounded-lg shadow-inner flex justify-between items-start gap-3 ${parseAlertClass(alert)}`}
          >
            <span className="before:content-['✦'] before:mr-2 text-xs leading-snug break-words flex-1">
              {alert}
            </span>
            <span className="text-xs text-gray-500 italic">
              {timestamps?.[index] || fallbackTimestamp()}
            </span>
          </div>
        ))
      )}

      <div ref={bottomRef} />
    </div>
  );
};