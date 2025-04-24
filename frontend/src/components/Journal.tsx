// frontend/src/components/Journal.tsx
import React, { useEffect, useRef } from "react";

export const Journal = ({ alerts }: { alerts: string[] }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [alerts]);

  const parseAlertClass = (alert: string): string => {
    if (alert.includes("❌")) return "text-red-500";
    if (alert.includes("✅")) return "text-green-600";
    if (alert.includes("⚠️")) return "text-yellow-500";
    return "text-gray-700";
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg p-3 space-y-2 z-50">
      <h2 className="font-semibold text-lg text-purple-800 mb-2">📝 Journal</h2>
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`text-sm font-mono break-words ${parseAlertClass(alert)}`}
        >
          {alert}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};