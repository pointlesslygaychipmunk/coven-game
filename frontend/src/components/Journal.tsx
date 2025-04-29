// frontend/src/components/Journal.tsx
import React, { useState } from 'react';
import { JournalEntry, Rumor, RitualQuest, GameTime } from '@shared/types';
import './Journal.css';

interface JournalProps {
  journal: JournalEntry[];
  rumors: Rumor[];
  rituals: RitualQuest[];
  time: GameTime;
}

const Journal: React.FC<JournalProps> = ({ journal, rumors, rituals, time }) => {
  // State for journal filtering and display
  const [filter, setFilter] = useState<'all' | 'event' | 'ritual' | 'market' | 'moon' | 'season'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showRumors, setShowRumors] = useState<boolean>(false);
  const [showQuests, setShowQuests] = useState<boolean>(false);
  const entriesPerPage = 10;

  // Filter journal entries based on the selected filter
  const filteredEntries = journal
    .filter(entry => filter === 'all' || entry.category === filter)
    .sort((a, b) => b.turn - a.turn); // Sort newest first

  // Paginate entries
  const pageCount = Math.ceil(filteredEntries.length / entriesPerPage);
  const displayedEntries = filteredEntries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Handle page navigation
  const nextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get class for entry based on importance
  const getEntryClass = (importance: number) => {
    if (importance >= 5) return 'very-important';
    if (importance >= 4) return 'important';
    if (importance >= 3) return 'standard';
    if (importance >= 2) return 'minor';
    return 'trivial';
  };

  // Get icon for entry category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'event': return '📜';
      case 'ritual': return '✨';
      case 'market': return '💰';
      case 'moon': return '🌙';
      case 'season': return '🍂';
      default: return '📝';
    }
  };

  // Format date for display
  const formatDate = (date: string) => {
    return date; // In a real implementation, this would format the date string
  };

  return (
    <div className="journal-container">
      <div className="journal-header">
        <h2>Witch's Journal</h2>
        <div className="current-date">
          {time.phaseName}, {time.season} Year {time.year}
        </div>
      </div>

      <div className="journal-content">
        <div className="journal-sidebar">
          <div className="journal-tabs">
            <button
              className={`tab ${!showRumors && !showQuests ? 'active' : ''}`}
              onClick={() => { setShowRumors(false); setShowQuests(false); }}
            >
              Journal Entries
            </button>
            <button
              className={`tab ${showRumors ? 'active' : ''}`}
              onClick={() => { setShowRumors(true); setShowQuests(false); }}
            >
              Rumors {rumors.length > 0 && <span className="badge">{rumors.length}</span>}
            </button>
            <button
              className={`tab ${showQuests ? 'active' : ''}`}
              onClick={() => { setShowRumors(false); setShowQuests(true); }}
            >
              Rituals {rituals.filter(r => r.unlocked).length > 0 && 
                <span className="badge">{rituals.filter(r => r.unlocked).length}</span>}
            </button>
          </div>

          {!showRumors && !showQuests && (
            <div className="filter-options">
              <h3>Filter by Type</h3>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => { setFilter('all'); setCurrentPage(1); }}
                >
                  All Entries
                </button>
                <button
                  className={`filter-btn ${filter === 'event' ? 'active' : ''}`}
                  onClick={() => { setFilter('event'); setCurrentPage(1); }}
                >
                  Events
                </button>
                <button
                  className={`filter-btn ${filter === 'ritual' ? 'active' : ''}`}
                  onClick={() => { setFilter('ritual'); setCurrentPage(1); }}
                >
                  Rituals
                </button>
                <button
                  className={`filter-btn ${filter === 'market' ? 'active' : ''}`}
                  onClick={() => { setFilter('market'); setCurrentPage(1); }}
                >
                  Market
                </button>
                <button
                  className={`filter-btn ${filter === 'moon' ? 'active' : ''}`}
                  onClick={() => { setFilter('moon'); setCurrentPage(1); }}
                >
                  Moon Phases
                </button>
                <button
                  className={`filter-btn ${filter === 'season' ? 'active' : ''}`}
                  onClick={() => { setFilter('season'); setCurrentPage(1); }}
                >
                  Seasons
                </button>
              </div>
            </div>
          )}

          <div className="lunar-guide">
            <h3>Lunar Phase Guide</h3>
            <div className="lunar-phases">
              {[
                'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
                'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
              ].map((phase, index) => (
                <div 
                  key={phase} 
                  className={`phase ${time.phaseName === phase ? 'current' : ''}`}
                  title={`${phase}: ${
                    phase === 'Full Moon' ? 'Perfect for harvesting and powerful brewing' :
                    phase === 'New Moon' ? 'Best for planting new seeds' :
                    phase.includes('Waxing') ? 'Good for growth and development' :
                    'Good for refinement and completion'
                  }`}
                >
                  <div className={`phase-icon phase-${index}`}></div>
                  <span className="phase-name">{phase}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="journal-main">
          {/* Journal Entries View */}
          {!showRumors && !showQuests && (
            <div className="entries-container">
              <h3>Journal Entries {filter !== 'all' && `(${filter})`}</h3>
              
              {displayedEntries.length === 0 ? (
                <div className="empty-state">
                  <p>No entries found for this filter.</p>
                </div>
              ) : (
                <>
                  <div className="entries-list">
                    {displayedEntries.map(entry => (
                      <div 
                        key={entry.id}
                        className={`journal-entry ${getEntryClass(entry.importance)}`}
                      >
                        <div className="entry-header">
                          <span className="entry-icon">{getCategoryIcon(entry.category)}</span>
                          <span className="entry-date">{formatDate(entry.date)}</span>
                        </div>
                        <div className="entry-text">{entry.text}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {pageCount > 1 && (
                    <div className="pagination">
                      <button 
                        onClick={prevPage} 
                        disabled={currentPage === 1}
                        className="page-btn"
                      >
                        Previous
                      </button>
                      <span className="page-indicator">
                        Page {currentPage} of {pageCount}
                      </span>
                      <button 
                        onClick={nextPage} 
                        disabled={currentPage === pageCount}
                        className="page-btn"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Rumors View */}
          {showRumors && (
            <div className="rumors-container">
              <h3>Market Rumors</h3>
              
              {rumors.length === 0 ? (
                <div className="empty-state">
                  <p>No rumors are currently circulating.</p>
                </div>
              ) : (
                <div className="rumors-list">
                  {rumors.map(rumor => (
                    <div 
                      key={rumor.id}
                      className={`rumor-card ${
                        rumor.spread > 70 ? 'widespread' :
                        rumor.spread > 40 ? 'common' : 'rare'
                      }`}
                    >
                      <div className="rumor-header">
                        <span className="rumor-icon">🗣️</span>
                        <span className="rumor-spread">
                          {rumor.spread > 70 ? 'Widespread Rumor' :
                           rumor.spread > 40 ? 'Common Talk' : 'Rare Whispers'}
                        </span>
                      </div>
                      <div className="rumor-content">
                        "{rumor.content}"
                      </div>
                      <div className="rumor-source">
                        <span>From: {rumor.origin}</span>
                        <span className="rumor-age">
                          {rumor.turnsActive > 0 && `${rumor.turnsActive} ${rumor.turnsActive === 1 ? 'day' : 'days'} ago`}
                        </span>
                      </div>
                      {rumor.verified && (
                        <div className="rumor-verified">✓ Verified</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rituals View */}
          {showQuests && (
            <div className="rituals-container">
              <h3>Ritual Quests</h3>
              
              {rituals.filter(r => r.unlocked).length === 0 ? (
                <div className="empty-state">
                  <p>No rituals discovered yet. Explore and uncover the mysteries of the seasons and moon phases.</p>
                </div>
              ) : (
                <div className="rituals-list">
                  {rituals.filter(r => r.unlocked).map(ritual => (
                    <div 
                      key={ritual.id}
                      className={`ritual-card ${
                        ritual.stepsCompleted >= ritual.totalSteps ? 'completed' :
                        ritual.stepsCompleted > 0 ? 'in-progress' : 'not-started'
                      }`}
                    >
                      <div className="ritual-header">
                        <h4>{ritual.name}</h4>
                        <div className="ritual-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${(ritual.stepsCompleted / ritual.totalSteps) * 100}%` }}
                            ></div>
                          </div>
                          <span className="progress-text">
                            {ritual.stepsCompleted}/{ritual.totalSteps} Steps
                          </span>
                        </div>
                      </div>
                      
                      <div className="ritual-description">
                        {ritual.description}
                      </div>
                      
                      <div className="ritual-steps">
                        <h5>Required Steps:</h5>
                        <ul>
                          {ritual.steps.map((step, idx) => (
                            <li key={idx} className={step.completed ? 'completed' : ''}>
                              <span className="step-check">
                                {step.completed ? '✓' : '○'}
                              </span>
                              <span className="step-text">{step.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="ritual-requirements">
                        {ritual.requiredMoonPhase && (
                          <div className="requirement moon-requirement">
                            <span className="requirement-label">Required Moon Phase:</span>
                            <span className="requirement-value">{ritual.requiredMoonPhase}</span>
                            {ritual.requiredMoonPhase === time.phaseName && (
                              <span className="requirement-met">✓ Current</span>
                            )}
                          </div>
                        )}
                        
                        {ritual.requiredSeason && (
                          <div className="requirement season-requirement">
                            <span className="requirement-label">Required Season:</span>
                            <span className="requirement-value">{ritual.requiredSeason}</span>
                            {ritual.requiredSeason === time.season && (
                              <span className="requirement-met">✓ Current</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="ritual-rewards">
                        <h5>Rewards:</h5>
                        <ul>
                          {ritual.rewards.map((reward, idx) => (
                            <li key={idx}>
                              {reward.type === 'gold' && `${reward.value} Gold`}
                              {reward.type === 'item' && `Item: ${reward.value}`}
                              {reward.type === 'skill' && `${reward.value} Skill +1`}
                              {reward.type === 'reputation' && `${reward.value} Reputation`}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {ritual.stepsCompleted >= ritual.totalSteps && (
                        <div className="ritual-complete-banner">
                          <span>Ritual Complete! Claim your rewards from the ritual altar.</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;