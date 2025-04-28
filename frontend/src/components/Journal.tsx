// frontend/src/components/Journal.tsx – Journal panel with Log, Quests, and Notes tabs
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import type { RitualQuestCard } from '@shared/types';

interface JournalProps {
  log: string[];
  quests: RitualQuestCard[];
}

const Journal: React.FC<JournalProps> = ({ log, quests }) => {
  return (
    <div className="h-full bg-stone-900/80 rounded-xl">
      <Tabs defaultValue="log" className="flex flex-col h-full">
        {/* Tab headers */}
        <div className="px-4 pt-2">
          <TabsList className="bg-stone-800/70 rounded-lg p-1 flex space-x-1">
            <TabsTrigger value="log" className="text-xs px-3 py-1 rounded bg-stone-700/60 hover:bg-stone-600">Log</TabsTrigger>
            <TabsTrigger value="quests" className="text-xs px-3 py-1 rounded bg-stone-700/60 hover:bg-stone-600">Quests</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs px-3 py-1 rounded bg-stone-700/60 hover:bg-stone-600">Notes</TabsTrigger>
          </TabsList>
        </div>
        {/* Tab contents */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          <TabsContent value="log">
            {log.length ? (
              <ul className="space-y-1">
                {log.map((entry, idx) => <li key={idx}>{entry}</li>)}
              </ul>
            ) : (
              <p className="italic text-stone-400">No events recorded yet.</p>
            )}
          </TabsContent>
          <TabsContent value="quests">
            {quests.length ? (
              <ul className="space-y-1">
                {quests.map(q => {
                  const totalContrib = Object.values(q.contributions).reduce((a, b) => a + b, 0);
                  return (
                    <li key={q.id}>
                      {q.fulfilled ? '✅' : '⬜'} {q.title} 
                      {q.fulfilled ? ' – Completed!' : ` – Progress: ${totalContrib}/${q.goal}`}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="italic text-stone-400">🌒 New quests will appear as the moons turn.</p>
            )}
          </TabsContent>
          <TabsContent value="notes">
            <p>🖋️ Remember to bless the garden under the next full moon.</p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Journal;
