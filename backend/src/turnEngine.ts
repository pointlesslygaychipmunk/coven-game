import type { GameState, Action } from "./shared/types";
import { applyMarketEvents }      from "./marketEvents";
import updateAscendancy           from "./modules/ascendancy";
import { resolveQuests }          from "./modules/questSystem";

/* lightweight produce clone using structuredClone ---------------- */
const produce = <T>(state: T, mutator: (draft: T) => void): T => {
  const draft = structuredClone(state) as T;
  mutator(draft);
  return draft;
};

export function nextTurn(state: GameState, actions: Action[]): GameState {
  const newState = produce(state, draft => {
    // demo: count actions, garden growth, etc.
    draft.actionsUsed += actions.length;
    draft.players[0].garden.forEach(g => {
      if (g.crop && !g.dead) g.growth = Math.min(1, g.growth + 0.25);
    });
  });

  applyMarketEvents(newState);
  newState.quests = resolveQuests(newState.quests ?? [], newState);
  updateAscendancy(newState);

  return newState;
}
