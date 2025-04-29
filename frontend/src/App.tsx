// frontend/src/App.tsx
import React, { useEffect, useState } from 'react';
import { GameState, Player, MoonPhase, Season } from '@shared/types';
import * as api from './api';
import Garden from './components/Garden';
import Market from './components/Market';
import Requests from './components/Requests';
import Brewing from './components/Brewing';
import Journal from './components/Journal';
import BlackMarket from './components/BlackMarket';
import Rituals from './components/Rituals';
import HUD from './components/HUD';
import LoadingScreen from './components/LoadingScreen';
import { showNotification } from './utils/notifications';

// Main App component serving as the central hub
const App: React.FC = () => {
  // State management
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>('Garden');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('Essence');
  const [showNewGame, setShowNewGame] = useState<boolean>(false);
  const [journalNotifications, setJournalNotifications] = useState<number>(0);

  // Get current player ID (using first player in current design)
  const playerId = gameState?.players[0]?.id || '';
  const currentPlayer = gameState?.players[0] || null;

  // Fetch initial game state
  useEffect(() => {
    fetchGameState();
  }, []);

  // Check for unread journal entries when game state updates
  useEffect(() => {
    if (gameState) {
      const unreadCount = gameState.journal.filter(entry => !entry.readByPlayer).length;
      setJournalNotifications(unreadCount);
      
      // Show notification for new important entries
      const importantEntries = gameState.journal
        .filter(entry => !entry.readByPlayer && entry.importance >= 4)
        .slice(-3); // Show at most 3 recent entries
      
      importantEntries.forEach(entry => {
        showNotification('Coven', entry.text, entry.category);
      });
    }
  }, [gameState]);

  // Fetch game state from API
  const fetchGameState = async () => {
    setLoading(true);
    try {
      const state = await api.fetchState();
      setGameState(state);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch game state:', err);
      setError('Failed to connect to the game server. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Start a new game with player name and specialization
  const handleStartNewGame = async () => {
    if (!playerName.trim()) {
      showNotification('Error', 'Please enter a name for your witch', 'error');
      return;
    }
    
    setLoading(true);
    try {
      // In a real implementation, we'd have an API endpoint for this
      // For now, we'll simulate with the existing state
      const state = await api.fetchState();
      
      // Update player name and specialization
      if (state.players && state.players.length > 0) {
        state.players[0].name = playerName;
        state.players[0].atelierSpecialization = selectedSpecialization as any;
      }
      
      setGameState(state);
      setShowNewGame(false);
    } catch (err) {
      console.error('Failed to start new game:', err);
      setError('Failed to start a new game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle view changes
  const changeView = (view: string) => {
    setCurrentView(view);
    
    // Mark journal entries as read when visiting the journal
    if (view === 'Journal' && gameState) {
      const updatedJournal = gameState.journal.map(entry => ({
        ...entry,
        readByPlayer: true
      }));
      
      setGameState({
        ...gameState,
        journal: updatedJournal
      });
      
      setJournalNotifications(0);
    }
  };

  // Handler functions for various game actions

  const handlePlant = async (slotId: number, seedName: string) => {
    if (!gameState || !playerId) return;
    
    try {
      const newState = await api.plantSeed(playerId, slotId, seedName);
      setGameState(newState);
    } catch (err) {
      console.error('Error planting seed:', err);
      showNotification('Error', 'Failed to plant seed', 'error');
    }
  };

  const handleWater = async () => {
    if (!gameState || !playerId) return;
    
    // In a real implementation, we might have a watering minigame here
    // For now, we'll simulate with a random success rate
    const success = Math.random() < 0.85; // 85% success rate
    
    try {
      const newState = await api.waterPlants(playerId, success);
      setGameState(newState);
      
      if (success) {
        showNotification('Garden', 'Plants watered successfully', 'success');
      } else {
        showNotification('Garden', 'Watering was not entirely successful', 'warning');
      }
    } catch (err) {
      console.error('Error watering plants:', err);
      showNotification('Error', 'Failed to water plants', 'error');
    }
  };

  const handleHarvest = async (slotId: number) => {
    if (!gameState || !playerId) return;
    
    try {
      const newState = await api.harvestPlant(playerId, slotId);
      setGameState(newState);
    } catch (err) {
      console.error('Error harvesting plant:', err);
      showNotification('Error', 'Failed to harvest plant', 'error');
    }
  };

  const handleBrew = async (ingredients: [string, string]) => {
    if (!gameState || !playerId) return;
    
    try {
      const newState = await api.brewPotion(playerId, ingredients);
      setGameState(newState);
    } catch (err) {
      console.error('Error brewing potion:', err);
      showNotification('Error', 'Failed to brew potion', 'error');
    }
  };

  const handleFulfillRequest = async (requestId: string) => {
    if (!gameState || !playerId) return;
    
    try {
      const newState = await api.fulfillRequest(playerId, requestId);
      setGameState(newState);
    } catch (err) {
      console.error('Error fulfilling request:', err);
      showNotification('Error', 'Failed to fulfill request', 'error');
    }
  };

  const handleBuyItem = async (itemId: string) => {
    if (!gameState || !playerId) return;
    
    try {
      const newState = await api.buyItem(playerId, itemId);
      setGameState(newState);
    } catch (err) {
      console.error('Error buying item:', err);
      showNotification('Error', 'Failed to buy item', 'error');
    }
  };

  const handleSellItem = async (itemId: string) => {
    if (!gameState || !playerId) return;
    
    try {
      const newState = await api.sellItem(playerId, itemId);
      setGameState(newState);
    } catch (err) {
      console.error('Error selling item:', err);
      showNotification('Error', 'Failed to sell item', 'error');
    }
  };

  const handleEndTurn = async () => {
    if (!gameState || !playerId) return;
    
    try {
      const newState = await api.endTurn(playerId);
      setGameState(newState);
      
      // Show notification about moon phase change
      showNotification(
        'Lunar Cycle', 
        `The moon has changed to ${newState.time.phaseName}`, 
        'moon'
      );
      
      // Check if season changed
      if (gameState.time.season !== newState.time.season) {
        showNotification(
          'Seasons', 
          `The season has changed to ${newState.time.season}`, 
          'season'
        );
      }
    } catch (err) {
      console.error('Error ending turn:', err);
      showNotification('Error', 'Failed to end turn', 'error');
    }
  };

  // Function to access the black market
  const handleAccessBlackMarket = async () => {
    if (!gameState || !playerId) return;
    
    try {
      const newState = await api.accessBlackMarket(playerId);
      setGameState(newState);
      changeView('BlackMarket');
    } catch (err) {
      console.error('Error accessing black market:', err);
      showNotification('Error', 'Failed to access black market', 'error');
    }
  };

  // Function to progress ritual quests
  const handleProgressRitual = async (ritualId: string, action: string, details: any) => {
    if (!gameState || !playerId) return;
    
    try {
      const newState = await api.progressRitual(playerId, ritualId, action, details);
      setGameState(newState);
    } catch (err) {
      console.error('Error progressing ritual:', err);
      showNotification('Error', 'Failed to progress ritual', 'error');
    }
  };

  // Function to claim ritual rewards
  const handleClaimRitualReward = async (ritualId: string) => {
    if (!gameState || !playerId) return;
    
    try {
      const newState = await api.claimRitualReward(playerId, ritualId);
      setGameState(newState);
      showNotification('Ritual', 'Ritual rewards claimed successfully', 'success');
    } catch (err) {
      console.error('Error claiming ritual reward:', err);
      showNotification('Error', 'Failed to claim ritual reward', 'error');
    }
  };

  // Show loading screen while fetching initial state
  if (loading && !gameState) {
    return <LoadingScreen />;
  }

  // Show error message if connection failed
  if (error && !gameState) {
    return (
      <div className="error-screen">
        <h1>Connection Error</h1>
        <p>{error}</p>
        <button onClick={fetchGameState}>Retry</button>
      </div>
    );
  }

  // Show new game screen if needed
  if (showNewGame || !gameState) {
    return (
      <div className={`new-game-screen ${darkMode ? 'dark' : 'light'}`}>
        <h1>Coven</h1>
        <h2>The Skincare Witch's Journey</h2>
        
        <div className="new-game-form">
          <label>
            Your Witch's Name:
            <input 
              type="text" 
              value={playerName} 
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
            />
          </label>
          
          <label>
            Atelier Specialization:
            <select 
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
            >
              <option value="Essence">Essence</option>
              <option value="Fermentation">Fermentation</option>
              <option value="Distillation">Distillation</option>
              <option value="Infusion">Infusion</option>
            </select>
          </label>
          
          <button onClick={handleStartNewGame}>Begin Your Journey</button>
        </div>
        
        <p className="specialization-description">
          {selectedSpecialization === 'Essence' && 
            "Master the extraction of pure essence from magical plants."}
          {selectedSpecialization === 'Fermentation' && 
            "Transform ingredients through time and natural processes."}
          {selectedSpecialization === 'Distillation' && 
            "Separate and purify the most potent elements from your ingredients."}
          {selectedSpecialization === 'Infusion' && 
            "Blend ingredients to create harmonious and potent mixtures."}
        </p>
        
        <button 
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    );
  }

  // Main game interface
  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      {/* HUD for moon phase, season, etc. */}
      <HUD 
        time={gameState.time}
        player={currentPlayer!}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        journalNotifications={journalNotifications}
      />
      
      {/* Navigation Tabs */}
      <div className="navigation-tabs">
        <button 
          className={currentView === 'Garden' ? 'active' : ''}
          onClick={() => changeView('Garden')}
        >
          Garden
        </button>
        <button 
          className={currentView === 'Brewing' ? 'active' : ''}
          onClick={() => changeView('Brewing')}
        >
          Brewing
        </button>
        <button 
          className={currentView === 'Market' ? 'active' : ''}
          onClick={() => changeView('Market')}
        >
          Market
        </button>
        <button 
          className={currentView === 'Requests' ? 'active' : ''}
          onClick={() => changeView('Requests')}
        >
          Requests
        </button>
        <button 
          className={currentView === 'Rituals' ? 'active' : ''}
          onClick={() => changeView('Rituals')}
        >
          Rituals
        </button>
        <button 
          className={currentView === 'Journal' ? 'active' : ''}
          onClick={() => changeView('Journal')}
        >
          Journal {journalNotifications > 0 && <span className="notification-badge">{journalNotifications}</span>}
        </button>
        {currentPlayer?.blackMarketAccess && (
          <button 
            className={currentView === 'BlackMarket' ? 'active' : ''}
            onClick={() => changeView('BlackMarket')}
          >
            Black Market
          </button>
        )}
        {!currentPlayer?.blackMarketAccess && (
          <button onClick={handleAccessBlackMarket}>
            Unlock Black Market
          </button>
        )}
      </div>
      
      {/* Main content area - show different component based on current view */}
      <div className="main-content">
        {currentView === 'Garden' && (
          <Garden
            player={currentPlayer!}
            time={gameState.time}
            onPlant={handlePlant}
            onWater={handleWater}
            onHarvest={handleHarvest}
            onEndTurn={handleEndTurn}
          />
        )}
        
        {currentView === 'Brewing' && (
          <Brewing
            player={currentPlayer!}
            time={gameState.time}
            onBrew={handleBrew}
          />
        )}
        
        {currentView === 'Market' && (
          <Market
            market={gameState.market.filter(item => !item.blackMarketOnly)}
            player={currentPlayer!}
            onBuy={handleBuyItem}
            onSell={handleSellItem}
          />
        )}
        
        {currentView === 'Requests' && (
          <Requests
            requests={gameState.townRequests}
            player={currentPlayer!}
            onFulfill={handleFulfillRequest}
          />
        )}
        
        {currentView === 'Rituals' && (
          <Rituals
            rituals={gameState.rituals}
            player={currentPlayer!}
            time={gameState.time}
            onProgress={handleProgressRitual}
            onClaim={handleClaimRitualReward}
          />
        )}
        
        {currentView === 'Journal' && (
          <Journal
            journal={gameState.journal}
            rumors={gameState.rumors}
            rituals={gameState.rituals}
            time={gameState.time}
          />
        )}
        
        {currentView === 'BlackMarket' && currentPlayer?.blackMarketAccess && (
          <BlackMarket
            market={gameState.market.filter(item => item.blackMarketOnly)}
            player={currentPlayer!}
            time={gameState.time}
            onBuy={(itemId, traderId) => api.buyFromBlackMarket(playerId, itemId, traderId)}
          />
        )}
      </div>
    </div>
  );
};

export default App;