// src/components/ui/index.ts
// re-export only the primitives we actually use.
// every other component can be added here later in one line.

export {
  // layout
  Card,
  CardHeader,
  CardTitle,
  CardContent,

  // dialog / modal
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,

  // progress bar
  Progress,

  // tabs
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@shadcn/ui";