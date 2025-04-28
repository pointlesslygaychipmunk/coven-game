import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import {
  Tabs,
  TabsContent,
  TabsTrigger,
  DefaultTabsList as TabsList,
} from "@ui/tabs";

export default function Journal() {
  return (
    <Card className="h-full bg-gradient-to-br from-black via-stone-900 to-black text-stone-200 ethereal-border fade-in-spell">
      <Tabs defaultValue="log" className="flex h-full flex-col">
        <CardHeader>
          <TabsList className="rounded-lg bg-stone-800/70 p-1 flex gap-1">
            <TabsTrigger value="log" className="rounded bg-stone-700/60 hover:bg-stone-600 px-3 py-1 text-xs">
              Log
            </TabsTrigger>
            <TabsTrigger value="quests" className="rounded bg-stone-700/60 hover:bg-stone-600 px-3 py-1 text-xs">
              Quests
            </TabsTrigger>
            <TabsTrigger value="notes" className="rounded bg-stone-700/60 hover:bg-stone-600 px-3 py-1 text-xs">
              Notes
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto space-y-4">
          <TabsContent value="log">
            <ul className="space-y-1 text-sm leading-6">
              <li>You planted <b>Mandrake</b>.</li>
              <li>⚡ A storm swept through your garden.</li>
              <li>You harvested <b>Nightshade</b>.</li>
            </ul>
          </TabsContent>

          <TabsContent value="quests">
            <p className="text-sm italic text-stone-400">No active quests.</p>
          </TabsContent>

          <TabsContent value="notes">
            <p className="text-sm">☽ Double-check moon phases before brewing.</p>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
