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
    const newRumors: { id: string; message: string }[] = [];

    // --- Seasonal Price Effects ---
    if (season === "spring") {
      if (lowerKey.includes("flower")) {
        item.price = Math.max(1, Math.round(item.price * 0.75));
        newRumors.push({
          id: `${key}-spring-flower`,
          message: "Spring festival boosts flower demand! 🌸"
        });
      }
      if (lowerKey.includes("herb")) {
        item.price = Math.max(1, Math.round(item.price * 0.85));
        newRumors.push({
          id: `${key}-spring-herb`,
          message: "Fresh herbs are popular for spring feasts. 🌿"
        });
      }
    }

    if (season === "summer") {
      if (lowerKey.includes("fruit")) {
        item.price = Math.max(1, Math.round(item.price * 0.7));
        newRumors.push({
          id: `${key}-summer-fruit`,
          message: "Juicy fruits flood summer markets! 🍉"
        });
      }
      if (lowerKey.includes("herb")) {
        item.price = Math.max(1, Math.round(item.price * 1.15));
        newRumors.push({
          id: `${key}-summer-herb`,
          message: "Dried herbs gain popularity under the hot sun. ☀️"
        });
      }
    }

    if (season === "autumn") {
      if (lowerKey.includes("mushroom")) {
        item.price = Math.round(item.price * 1.25);
        newRumors.push({
          id: `${key}-autumn-mushroom`,
          message: "Rare mushrooms are highly prized in autumn! 🍄"
        });
      }
      if (lowerKey.includes("fruit")) {
        item.price = Math.round(item.price * 1.1);
        newRumors.push({
          id: `${key}-autumn-fruit`,
          message: "Harvest fruits stored for winter feasts. 🍎"
        });
      }
    }

    if (season === "winter") {
      if (lowerKey.includes("herb")) {
        item.price = Math.round(item.price * 1.3);
        newRumors.push({
          id: `${key}-winter-herb`,
          message: "Medicinal herbs are scarce during winter. ❄️"
        });
      }
      if (lowerKey.includes("flower")) {
        item.price = Math.max(1, Math.round(item.price * 0.9));
        newRumors.push({
          id: `${key}-winter-flower`,
          message: "Rare winter blooms draw admiration. 🌼"
        });
      }
    }

    // --- Moon Phase-Influenced Random Events ---
    const isFullMoon = moonPhase === 4;
    const isNewMoon = moonPhase === 0;

    if (lowerKey.includes("fruit")) {
      const chance = isFullMoon ? 0.15 : 0.03;
      if (Math.random() < chance) {
        item.price = Math.round(item.price * 1.5);
        newRumors.push({
          id: `${key}-fullmoon-fruit`,
          message: "Rare magical fruits appeared under the full moon! 🌕🍎"
        });
      }
    }

    if (lowerKey.includes("mushroom")) {
      const chance = isNewMoon ? 0.2 : 0.1;
      if (Math.random() < chance) {
        item.stock = Math.max(0, Math.floor(item.stock / 2));
        newRumors.push({
          id: `${key}-newmoon-blight`,
          message: "Fungal blight devastates mushroom stocks. 🌑🍄"
        });
      }
    }

    if (lowerKey.includes("herb")) {
      const chance = (moonPhase >= 1 && moonPhase <= 3) ? 0.1 : 0.05;
      if (Math.random() < chance) {
        item.stock += 5;
        item.price = Math.max(1, Math.round(item.price * 0.7));
        newRumors.push({
          id: `${key}-waxingmoon-herbs`,
          message: "Bumper herb harvest under a waxing moon! 🌒🌱"
        });
      }
    }

    // Apply accumulated rumors
    if (newRumors.length > 0) {
      item.rumors = newRumors;
    }
  }
}