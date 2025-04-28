import GardenGrid from "@/components/GardenGrid";
import InventoryBox from "@/components/InventoryBox";
import Journal from "@/components/Journal";
import Market from "@/components/Market";
import PotionPanel from "@/components/PotionPanel";
import RumorFeed from "@/components/RumorFeed";
import TownRequests from "@/components/TownRequests";
import type { GameState } from "@shared/types";

interface Props {
  state: GameState;
}

export default function GameView({ state }: Props) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-stone-900 to-black text-stone-200 font-serif starfield-bg fade-in-spell">
      
      {/* 🌿 Cottage */}
      <div className="flex flex-col w-2/3 p-6 gap-6 border-r border-stone-700/50">
        <h2 className="text-3xl shimmer-text mb-4">🌿 Cottage</h2>
        <GardenGrid
          tiles={state.players[0].garden}
          inventory={state.players[0].inventory}
          onAction={() => {}} // TODO: real action dispatch
        />
        <InventoryBox items={state.players[0].inventory} />
        <PotionPanel player={state.players[0]} onBrew={() => {}} />
        <Journal />
      </div>

      {/* 🏛️ Town */}
      <div className="flex flex-col w-1/3 p-6 gap-6">
        <h2 className="text-3xl shimmer-text mb-4">🏛️ Town</h2>
        <Market />
        <TownRequests cards={[]} onFulfill={() => {}} />
        <RumorFeed rumors={[]} />
      </div>
    </div>
  );
}
