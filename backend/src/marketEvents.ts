// backend/src/marketEvents.ts
import { MarketState, Season, MoonPhase } from "../../shared/types";

export function applyMarketEvents(
  market: MarketState,
  season: Season,
  moonPhase: MoonPhase
): void {
  for (const key in market.items) {
    const item = market.items[key];

    if (item.type !== "ingredient" && item.type !== "crop") continue;

    const lowerKey = key.toLowerCase();

    // --- Seasonal Price Effects ---
    if (season === "spring") {
      if (lowerKey.includes("flower")) {
        item.price = Math.max(1, Math.round(item.price * 0.75));
        item.rumors = [{ message: "Spring festival boosts flower demand! 🌸" }];
      }
      if (lowerKey.includes("herb")) {
        item.price = Math.max(1, Math.round(item.price * 0.85));
        item.rumors = [{ message: "Fresh herbs are popular for spring feasts. 🌿" }];
      }
    }

    if (season === "summer") {
      if (lowerKey.includes("fruit")) {
        item.price = Math.max(1, Math.round(item.price * 0.7));
        item.rumors = [{ message: "Juicy fruits flood summer markets! 🍉" }];
      }
      if (lowerKey.includes("herb")) {
        item.price = Math.max(1, Math.round(item.price * 1.15));
        item.rumors = [{ message: "Dried herbs gain popularity under the hot sun. ☀️" }];
      }
    }

    if (season === "autumn") {
      if (lowerKey.includes("mushroom")) {
        item.price = Math.round(item.price * 1.25);
        item.rumors = [{ message: "Rare mushrooms are highly prized in autumn! 🍄" }];
      }
      if (lowerKey.includes("fruit")) {
        item.price = Math.round(item.price * 1.1);
        item.rumors = [{ message: "Harvest fruits stored for winter feasts. 🍎" }];
      }
    }

    if (season === "winter") {
      if (lowerKey.includes("herb")) {
        item.price = Math.round(item.price * 1.3);
        item.rumors = [{ message: "Medicinal herbs are scarce during winter. ❄️" }];
      }
      if (lowerKey.includes("flower")) {
        item.price = Math.max(1, Math.round(item.price * 0.9));
        item.rumors = [{ message: "Rare winter blooms draw admiration. 🌼" }];
      }
    }

    // --- Moon Phase-Influenced Random Events ---
    const isFullMoon = moonPhase === 4;
    const isNewMoon = moonPhase === 0;

    // Magical fruit bloom — more likely under full moon
    if (lowerKey.includes("fruit")) {
      const chance = isFullMoon ? 0.15 : 0.03;
      if (Math.random() < chance) {
        item.price = Math.round(item.price * 1.5);
        item.rumors = [{ message: "Rare magical fruits appeared under the full moon! 🌕🍎" }];
      }
    }

    // Mushroom blight — more likely under new moon
    if (lowerKey.includes("mushroom")) {
      const chance = isNewMoon ? 0.2 : 0.1;
      if (Math.random() < chance) {
        item.stock = Math.max(0, Math.floor(item.stock / 2));
        item.rumors = [{ message: "Fungal blight devastates mushroom stocks. 🌑🍄" }];
      }
    }

    // Herb bumper crop — slightly more likely during waxing moons
    if (lowerKey.includes("herb")) {
      const chance = (moonPhase >= 1 && moonPhase <= 3) ? 0.1 : 0.05;
      if (Math.random() < chance) {
        item.stock += 5;
        item.price = Math.max(1, Math.round(item.price * 0.7));
        item.rumors = [{ message: "Bumper herb harvest under a waxing moon! 🌒🌱" }];
      }
    }
  }
}