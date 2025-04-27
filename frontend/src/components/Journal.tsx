/* ─────────────────────────────  Journal  ───────────────────────────── */

import * as React from "react";
import { cn } from "@/lib/utils";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

/* Example props – tweak as necessary */
export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  body: string;
}

interface JournalProps {
  entries?: JournalEntry[];
}

export default function Journal({ entries = [] }: JournalProps) {
  /* If you later load entries from a server just swap this out */
  const [selected, setSelected] = React.useState(entries[0]?.id ?? "");

  return (
    <Card className="h-full max-h-[32rem] overflow-hidden">
      <CardHeader>
        <CardTitle>Journal</CardTitle>
        <CardDescription>
          Your witchy notes &amp; research progress
        </CardDescription>
      </CardHeader>

      <CardContent className="h-full flex flex-col">
        {/* Tabs across the top for each entry */}
        <Tabs
          value={selected}
          onValueChange={setSelected}
          className="flex flex-col flex-1"
        >
          <TabsList className="overflow-x-auto whitespace-nowrap no-scrollbar">
            {entries.map((e) => (
              <TabsTrigger
                key={e.id}
                value={e.id}
                className={cn("px-4 py-2", selected === e.id && "font-semibold")}
              >
                {e.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {entries.map((e) => (
            <TabsContent
              key={e.id}
              value={e.id}
              className="flex-1 overflow-y-auto prose dark:prose-invert p-4"
            >
              <h3 className="mt-0">{e.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{e.date}</p>
              <p>{e.body}</p>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}