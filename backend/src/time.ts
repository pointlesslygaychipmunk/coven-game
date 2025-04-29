const MoonPhases = [
    'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
    'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
  ];
  
  const Seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
  
  export class TimeManager {
    currentPhaseIndex = 0;
    currentSeasonIndex = 0;
    year = 1;
  
    get phaseName() {
      return MoonPhases[this.currentPhaseIndex];
    }
  
    get season() {
      return Seasons[this.currentSeasonIndex];
    }
  
    get seasonYearLabel() {
      return `${this.season} Y${this.year}`;
    }
  
    advancePhase() {
      this.currentPhaseIndex++;
      if (this.currentPhaseIndex >= MoonPhases.length) {
        this.currentPhaseIndex = 0;
        this.currentSeasonIndex++;
        if (this.currentSeasonIndex >= Seasons.length) {
          this.currentSeasonIndex = 0;
          this.year++;
        }
      }
    }
  }
  