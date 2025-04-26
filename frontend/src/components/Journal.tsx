import React, { useEffect, useRef } from 'react';

interface JournalProps {
  alerts: string[];
  timestamps?: string[];
  open: boolean;
  onToggle: () => void;
}

export const Journal: React.FC<JournalProps> = ({ alerts, timestamps, open, onToggle }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [alerts, open]);

  const parseAlertClass = (alert: string) =>
    alert.includes('❌')
      ? 'text-rose-700 border-rose-300 bg-rose-50'
      : alert.includes('✅')
      ? 'text-green-800 border-green-300 bg-green-50'
      : alert.includes('⚠️')
      ? 'text-amber-700 border-amber-300 bg-amber-50'
      : 'text-indigo-900 border-indigo-300 bg-indigo-50';

  const fallbackTimestamp = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onToggle}
        className="mb-2 px-3 py-1 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700 transition"
      >
        {open ? 'Close Journal 📕' : 'Open Journal 📖'}
      </button>
      {open && (
        <div className="w-80 max-h-80 overflow-y-auto rounded-xl shadow-2xl border border-purple-500 p-4 bg-[url('/parchment-texture.png')] bg-cover ring-2 ring-purple-400 backdrop-blur-md">
          <h2 className="font-bold text-xl text-purple-900 mb-2 drop-shadow">🕯️ Grimoire Log</h2>
          {alerts.length === 0 ? (
            <p className="text-center italic text-gray-500">No entries yet… 🌫️</p>
          ) : (
            <ul className="space-y-2 text-sm font-serif">
              {alerts.map((alert, i) => (
                <li key={i} className={`px-3 py-2 border rounded-lg ${parseAlertClass(alert)}`}>
                  <div className="flex justify-between">
                    <span>{alert}</span>
                    <span className="text-xs text-gray-500 italic">
                      {timestamps?.[i] || fallbackTimestamp()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};