// frontend/src/components/Brewing.tsx
import React, { useState, useEffect } from 'react';
import { Player, GameTime, InventoryItem } from '@shared/types';
import { getIngredientEffect, getRecipeByIngredients } from '../utils/gameData';
import './Brewing.css';

interface BrewingProps {
  player: Player;
  time: GameTime;
  onBrew: (ingredients: [string, string]) => void;
}

const Brewing: React.FC<BrewingProps> = ({ player, time, onBrew }) => {
  // State for selected ingredients and brewing process
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [matchingRecipe, setMatchingRecipe] = useState<any | null>(null);
  const [brewingInProgress, setBrewingInProgress] = useState<boolean>(false);
  const [brewingSuccess, setBrewingSuccess] = useState<boolean | null>(null);
  const [brewingResult, setBrewingResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'recipes'>('ingredients');

  // Filter inventory to show only ingredients
  const ingredients = player.inventory.filter(item => 
    item.type === 'ingredient' && item.quantity > 0
  );

  // Known recipes (would be based on player's discovered recipes)
  const knownRecipes = [
    { 
      name: "Radiant Moon Mask", 
      ingredients: ["Ancient Ginseng", "Sacred Lotus"],
      properties: ["brightening", "rejuvenating"],
      description: "A luxurious facial mask that brightens and rejuvenates skin.",
      idealPhase: "Full Moon"
    },
    { 
      name: "Moon Glow Serum", 
      ingredients: ["Moonbud", "Glimmerroot"],
      properties: ["brightening", "firming"],
      description: "A luminous facial serum that gives skin a moonlit glow while firming the complexion.",
      idealPhase: "Waxing Gibbous"
    },
    { 
      name: "Ginseng Infusion", 
      ingredients: ["Ancient Ginseng", "Moonbud"],
      properties: ["rejuvenating", "brightening"],
      description: "A potent tonic that revitalizes skin with the power of Ancient Ginseng.",
      idealPhase: "New Moon"
    }
  ];

  // Effect to check for matching recipe when ingredients are selected
  useEffect(() => {
    if (selectedIngredients.length === 2) {
      // In a real implementation, this would call the getRecipeByIngredients utility
      const recipe = knownRecipes.find(recipe => 
        recipe.ingredients.includes(selectedIngredients[0]) && 
        recipe.ingredients.includes(selectedIngredients[1])
      );
      
      setMatchingRecipe(recipe || null);
    } else {
      setMatchingRecipe(null);
    }
  }, [selectedIngredients]);

  // Handle ingredient selection
  const handleIngredientSelect = (ingredient: InventoryItem) => {
    // Prevent selecting more than 2 ingredients
    if (selectedIngredients.includes(ingredient.name)) {
      // Deselect if already selected
      setSelectedIngredients(prev => prev.filter(ing => ing !== ingredient.name));
    } else if (selectedIngredients.length < 2) {
      // Add to selected ingredients
      setSelectedIngredients(prev => [...prev, ingredient.name]);
    }
  };

  // Handle brewing action
  const handleBrew = () => {
    if (selectedIngredients.length !== 2 || !matchingRecipe) return;
    
    setBrewingInProgress(true);
    
    // Simulate brewing process with animation
    setTimeout(() => {
      // Make the API call to brew the potion
      onBrew(selectedIngredients as [string, string]);
      
      // Simulate result (would come from the API in a real implementation)
      const success = Math.random() < 0.8; // 80% success rate for demo
      setBrewingSuccess(success);
      
      if (success) {
        setBrewingResult(matchingRecipe.name);
      } else {
        setBrewingResult("Failed Brew");
      }
      
      // Reset after showing result
      setTimeout(() => {
        setBrewingInProgress(false);
        setBrewingSuccess(null);
        setBrewingResult(null);
        setSelectedIngredients([]);
      }, 3000);
    }, 2000);
  };

  // Reset selections
  const handleReset = () => {
    setSelectedIngredients([]);
    setMatchingRecipe(null);
  };

  // Calculate brewing success chance based on moon phase and other factors
  const calculateBrewingSuccessChance = () => {
    if (!matchingRecipe) return 0;
    
    let chance = 0.7; // Base 70% chance
    
    // Bonus for brewing during the ideal moon phase
    if (matchingRecipe.idealPhase === time.phaseName) {
      chance += 0.2; // +20%
    }
    
    // Bonus based on player's brewing skill (simplified)
    chance += (player.skills?.brewing || 1) * 0.05; // +5% per level
    
    // Cap at 95%
    return Math.min(0.95, chance);
  };

  // Format success chance as percentage
  const getSuccessChanceText = () => {
    const chance = calculateBrewingSuccessChance();
    return `${Math.round(chance * 100)}%`;
  };

  // Format property text with emoji icons
  const formatProperty = (property: string) => {
    const propertyIcons: Record<string, string> = {
      'brightening': '✨',
      'rejuvenating': '🌱',
      'firming': '💪',
      'hydrating': '💧',
      'soothing': '🌿',
      'balancing': '⚖️',
      'protective': '🛡️',
      'purifying': '🌊'
    };
    
    return `${propertyIcons[property] || ''} ${property.charAt(0).toUpperCase() + property.slice(1)}`;
  };

  // Get moon phase bonus text
  const getMoonPhaseBonus = () => {
    if (!matchingRecipe) return '';
    
    if (matchingRecipe.idealPhase === time.phaseName) {
      return `✨ Perfect Moon Phase (${time.phaseName}) - Brewing bonus active!`;
    }
    
    return `Ideal Moon Phase: ${matchingRecipe.idealPhase} (current: ${time.phaseName})`;
  };

  return (
    <div className="brewing-container">
      <div className="brewing-header">
        <h2>Atelier Brewing Chamber</h2>
        <p className="brewing-subtext">
          Current Moon Phase: <span className="moon-phase">{time.phaseName}</span> | 
          Season: <span className="season">{time.season}</span>
        </p>
      </div>
      
      <div className="brewing-tabs">
        <button 
          className={`tab ${activeTab === 'ingredients' ? 'active' : ''}`}
          onClick={() => setActiveTab('ingredients')}
        >
          Ingredients
        </button>
        <button 
          className={`tab ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          Recipe Book
        </button>
      </div>
      
      <div className="brewing-content">
        {/* Ingredients tab */}
        {activeTab === 'ingredients' && (
          <div className="ingredients-panel">
            <div className="ingredients-list">
              <h3>Available Ingredients</h3>
              {ingredients.length === 0 ? (
                <p className="no-ingredients">No ingredients available. Harvest plants from your garden first.</p>
              ) : (
                <div className="ingredients-grid">
                  {ingredients.map(ingredient => (
                    <div 
                      key={ingredient.id}
                      className={`ingredient-item ${selectedIngredients.includes(ingredient.name) ? 'selected' : ''}`}
                      onClick={() => handleIngredientSelect(ingredient)}
                    >
                      <img 
                        src={`/images/ingredients/${ingredient.name.toLowerCase().replace(/\s/g, '_')}.png`} 
                        alt={ingredient.name}
                        className="ingredient-icon"
                      />
                      <div className="ingredient-details">
                        <span className="ingredient-name">{ingredient.name}</span>
                        <span className="ingredient-quality">
                          Quality: {ingredient.quality || 70}%
                        </span>
                        <span className="ingredient-quantity">x{ingredient.quantity}</span>
                      </div>
                      {ingredient.harvestedDuring && (
                        <div className="harvest-tag">
                          <span className="moon-harvested">Harvested during {ingredient.harvestedDuring}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="brewing-station">
              <h3>Brewing Station</h3>
              
              {/* Brewing cauldron */}
              <div className={`brewing-cauldron ${brewingInProgress ? 'active' : ''}`}>
                {/* Selected ingredients visualization */}
                <div className="selected-ingredients">
                  {selectedIngredients.map((ingredient, index) => (
                    <div className="selected-ingredient" key={index}>
                      <img 
                        src={`/images/ingredients/${ingredient.toLowerCase().replace(/\s/g, '_')}.png`} 
                        alt={ingredient}
                      />
                      <span>{ingredient}</span>
                    </div>
                  ))}
                  
                  {selectedIngredients.length < 2 && (
                    Array(2 - selectedIngredients.length).fill(0).map((_, index) => (
                      <div className="empty-ingredient" key={`empty-${index}`}>
                        <div className="empty-slot"></div>
                        <span>Select Ingredient</span>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Brewing animation and result */}
                {brewingInProgress && (
                  <div className="brewing-animation">
                    <div className="bubbles"></div>
                    {brewingResult && (
                      <div className={`brewing-result ${brewingSuccess ? 'success' : 'failure'}`}>
                        <h4>{brewingResult}</h4>
                        {brewingSuccess && (
                          <img 
                            src={`/images/potions/${brewingResult.toLowerCase().replace(/\s/g, '_')}.png`} 
                            alt={brewingResult}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Recipe detection */}
                {matchingRecipe && !brewingInProgress && (
                  <div className="recipe-detected">
                    <h4>Recipe Detected: {matchingRecipe.name}</h4>
                    <p>{matchingRecipe.description}</p>
                    <div className="recipe-properties">
                      {matchingRecipe.properties.map((prop: string) => (
                        <span className="property" key={prop}>
                          {formatProperty(prop)}
                        </span>
                      ))}
                    </div>
                    <div className="brewing-chance">
                      <span className="chance-label">Success Chance:</span>
                      <div className="chance-bar">
                        <div 
                          className="chance-fill"
                          style={{ width: `${calculateBrewingSuccessChance() * 100}%` }}
                        ></div>
                      </div>
                      <span className="chance-value">{getSuccessChanceText()}</span>
                    </div>
                    <p className="moon-bonus">{getMoonPhaseBonus()}</p>
                  </div>
                )}
              </div>
              
              {/* Brewing controls */}
              <div className="brewing-controls">
                <button 
                  className="brew-button"
                  disabled={!matchingRecipe || brewingInProgress}
                  onClick={handleBrew}
                >
                  Brew Potion
                </button>
                <button 
                  className="reset-button"
                  disabled={selectedIngredients.length === 0 || brewingInProgress}
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Recipes tab */}
        {activeTab === 'recipes' && (
          <div className="recipes-panel">
            <h3>Known Recipes</h3>
            <div className="recipes-list">
              {knownRecipes.map(recipe => (
                <div className="recipe-card" key={recipe.name}>
                  <div className="recipe-header">
                    <h4>{recipe.name}</h4>
                    <div className="recipe-image">
                      <img 
                        src={`/images/potions/${recipe.name.toLowerCase().replace(/\s/g, '_')}.png`} 
                        alt={recipe.name}
                      />
                    </div>
                  </div>
                  
                  <div className="recipe-body">
                    <p className="recipe-description">{recipe.description}</p>
                    
                    <div className="recipe-ingredients">
                      <h5>Ingredients:</h5>
                      <ul>
                        {recipe.ingredients.map(ing => (
                          <li key={ing}>
                            <img 
                              src={`/images/ingredients/${ing.toLowerCase().replace(/\s/g, '_')}.png`} 
                              alt={ing}
                              className="mini-icon"
                            />
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="recipe-properties">
                      <h5>Properties:</h5>
                      <div className="properties-list">
                        {recipe.properties.map((prop: string) => (
                          <span className="property" key={prop}>
                            {formatProperty(prop)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="recipe-notes">
                      <p><strong>Ideal Moon Phase:</strong> {recipe.idealPhase}</p>
                      <button 
                        className="brew-this-button"
                        onClick={() => {
                          setSelectedIngredients(recipe.ingredients);
                          setActiveTab('ingredients');
                        }}
                      >
                        Brew This
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Brewing;