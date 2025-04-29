// atelier.ts – Define specialization options
export interface AtelierSpecialization {
    id: string;
    name: string;
    description: string;
    startBonus: string;   // e.g. description of bonus effect
    // Possibly we can list what starter items or stat modifiers each gives
  }
  
  export const SPECIALIZATIONS: AtelierSpecialization[] = [
    {
      id: 'Botany',
      name: 'Herbal Atelier',
      description: 'A greenhouse-like workshop overflowing with plants. Excels at gardening.',
      startBonus: 'Plants grow 20% faster; +1 extra seed variety at start'
    },
    {
      id: 'Alchemy',
      name: 'Alchemical Atelier',
      description: 'A lab of bubbling cauldrons and glass vials. Excels at brewing potions.',
      startBonus: 'Potions have +10% effectiveness; start with a bonus healing tonic'
    },
    {
      id: 'Astrology',
      name: 'Celestial Atelier',
      description: 'A moonlit observatory with astrolabes. Excels at time and celestial magic.',
      startBonus: 'Once per season, skip a watering cycle without penalty'
    },
    {
      id: 'Trading',
      name: 'Curio Atelier',
      description: 'A cozy shop filled with trinkets. Excels at trade and negotiation.',
      startBonus: 'Market prices 10% better in your favor; start with extra honey and beeswax'
    }
  ];
  