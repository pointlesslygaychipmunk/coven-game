// frontend/src/components/Brewing.tsx
import React from 'react';
import { Player } from '../types';

interface BrewingProps {
  player: Player;
  onBrew: (ing1: string, ing2: string) => void;
}

const Brewing: React.FC<BrewingProps> = ({ player, onBrew }) => {
  // List all ingredient items the player has for selection
  const ingredients = player.inventory.filter(item => item.category === 'ingredient');
  
  // For simplicity, list known recipes here (these should match backend RECIPES)
  const knownRecipes = [
    { name: "Radiant Moon Mask", ingredients: ["Ancient Ginseng", "Sacred Lotus"] },
    { name: "Moon Glow Serum", ingredients: ["Moonbud", "Glimmerroot"] },
    { name: "Ginseng Infusion", ingredients: ["Ancient Ginseng", "Moonbud"] }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Brewing</h2>
      <div className="mb-2">
        <p>Select a recipe to brew. You must have the required ingredients.</p>
      </div>
      <ul className="space-y-2">
        {knownRecipes.map(recipe => {
          const [req1, req2] = recipe.ingredients;
          const hasReq1 = player.inventory.find(it => it.name === req1 && it.quantity > 0);
          const hasReq2 = player.inventory.find(it => it.name === req2 && it.quantity > 0);
          const canBrew = hasReq1 && hasReq2;
          return (
            <li key={recipe.name} className="p-2 border rounded text-sm">
              <div><strong>{recipe.name}</strong> — requires {req1} + {req2}</div>
              <button 
                onClick={() => onBrew(req1, req2)} 
                disabled={!canBrew}
                className={`mt-1 px-2 py-1 rounded ${canBrew ? 'bg-pink-100 hover:bg-pink-200' : 'bg-gray-200'}`}
              >
                Brew
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-4">
        <h3 className="font-medium">Your Ingredients:</h3>
        {ingredients.length === 0 ? (
          <p className="text-sm text-gray-500">No ingredients available.</p>
        ) : (
          <ul className="text-sm list-disc list-inside">
            {ingredients.map(item => (
              <li key={item.id}>{item.name} x{item.quantity}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Brewing;
