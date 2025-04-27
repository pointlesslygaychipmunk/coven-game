/* src/components/Journal.tsx */
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import {
  Tabs,
  TabsContent,
  TabsTrigger,
  DefaultTabsList as TabsList,
} from "@ui/tabs";

export default function Journal() {
  return (
    <Card className="h-full">
      <Tabs defaultValue="log" className="flex h-full flex-col">
        <CardHeader>
          <TabsList>
            <TabsTrigger value="log"   className="rounded px-3 py-1 text-xs">Log</TabsTrigger>
            <TabsTrigger value="quests" className="rounded px-3 py-1 text-xs">Quests</TabsTrigger>
            <TabsTrigger value="notes"  className="rounded px-3 py-1 text-xs">Notes</TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          <TabsContent value="log">
            <ul className="space-y-1 text-sm leading-5">
              <li>You planted <b>Mandrake</b>.</li>
              <li>⚡ A storm hit the garden.</li>
              <li>You harvested <b>Nightshade</b>.</li>
            </ul>
          </TabsContent>

          <TabsContent value="quests">
            <p className="text-sm italic text-layer-11">No active quests.</p>
          </TabsContent>

          <TabsContent value="notes">
            <p className="text-sm">Double-check moon phases before next brew.</p>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}