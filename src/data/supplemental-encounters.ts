// Supplemental encounter data for modern games where PokéAPI is incomplete
// This data is manually curated from official sources like Serebii and Pokémon Database

export interface SupplementalEncounter {
  pokemonId: number;
  pokemonName: string;
  games: {
    [gameName: string]: {
      locations: {
        name: string;
        area?: string;
        methods: {
          method: string;
          levelRange: string;
          rate: string;
          conditions?: string[];
        }[];
      }[];
    };
  };
}

// Popular Pokémon encounter data for Generation 8+ games
export const SUPPLEMENTAL_ENCOUNTERS: SupplementalEncounter[] = [
  {
    pokemonId: 25,
    pokemonName: 'pikachu',
    games: {
      'sword': {
        locations: [
          {
            name: 'Route 4',
            methods: [
              {
                method: 'Walking',
                levelRange: '13-16',
                rate: '10%',
                conditions: ['All weather']
              }
            ]
          },
          {
            name: 'Wild Area',
            area: 'Rolling Fields',
            methods: [
              {
                method: 'Walking',
                levelRange: '7-12',
                rate: '5%',
                conditions: ['Thunderstorm']
              }
            ]
          }
        ]
      },
      'shield': {
        locations: [
          {
            name: 'Route 4',
            methods: [
              {
                method: 'Walking',
                levelRange: '13-16',
                rate: '10%',
                conditions: ['All weather']
              }
            ]
          },
          {
            name: 'Wild Area',
            area: 'Rolling Fields',
            methods: [
              {
                method: 'Walking',
                levelRange: '7-12',
                rate: '5%',
                conditions: ['Thunderstorm']
              }
            ]
          }
        ]
      },
      'brilliant-diamond': {
        locations: [
          {
            name: 'Trophy Garden',
            methods: [
              {
                method: 'Walking',
                levelRange: '16-18',
                rate: '5%',
                conditions: ['Daily Pokémon']
              }
            ]
          }
        ]
      },
      'shining-pearl': {
        locations: [
          {
            name: 'Trophy Garden',
            methods: [
              {
                method: 'Walking',
                levelRange: '16-18',
                rate: '5%',
                conditions: ['Daily Pokémon']
              }
            ]
          }
        ]
      },
      'scarlet': {
        locations: [
          {
            name: 'South Province',
            area: 'Area One',
            methods: [
              {
                method: 'Walking',
                levelRange: '3-6',
                rate: 'Common'
              }
            ]
          },
          {
            name: 'South Province',
            area: 'Area Two',
            methods: [
              {
                method: 'Walking',
                levelRange: '8-11',
                rate: 'Common'
              }
            ]
          }
        ]
      },
      'violet': {
        locations: [
          {
            name: 'South Province',
            area: 'Area One',
            methods: [
              {
                method: 'Walking',
                levelRange: '3-6',
                rate: 'Common'
              }
            ]
          },
          {
            name: 'South Province',
            area: 'Area Two',
            methods: [
              {
                method: 'Walking',
                levelRange: '8-11',
                rate: 'Common'
              }
            ]
          }
        ]
      }
    }
  },
  {
    pokemonId: 133,
    pokemonName: 'eevee',
    games: {
      'sword': {
        locations: [
          {
            name: 'Route 4',
            methods: [
              {
                method: 'Walking',
                levelRange: '13-16',
                rate: '1%'
              }
            ]
          }
        ]
      },
      'shield': {
        locations: [
          {
            name: 'Route 4',
            methods: [
              {
                method: 'Walking',
                levelRange: '13-16',
                rate: '1%'
              }
            ]
          }
        ]
      },
      'scarlet': {
        locations: [
          {
            name: 'South Province',
            area: 'Area Two',
            methods: [
              {
                method: 'Walking',
                levelRange: '8-11',
                rate: 'Uncommon'
              }
            ]
          }
        ]
      },
      'violet': {
        locations: [
          {
            name: 'South Province',
            area: 'Area Two',
            methods: [
              {
                method: 'Walking',
                levelRange: '8-11',
                rate: 'Uncommon'
              }
            ]
          }
        ]
      }
    }
  }
  // Add more popular Pokémon as needed
];

// Helper function to get supplemental encounter data
export function getSupplementalEncounters(pokemonId: number): SupplementalEncounter | null {
  return SUPPLEMENTAL_ENCOUNTERS.find(encounter => encounter.pokemonId === pokemonId) || null;
}

// Helper function to check if a Pokémon has supplemental data for a specific game
export function hasSupplementalDataForGame(pokemonId: number, game: string): boolean {
  const supplemental = getSupplementalEncounters(pokemonId);
  return supplemental ? game in supplemental.games : false;
}

// Convert supplemental data to match PokéAPI encounter format
export function convertSupplementalToEncounterFormat(supplemental: SupplementalEncounter, game: string) {
  const gameData = supplemental.games[game];
  if (!gameData) return [];

  return gameData.locations.map(location => ({
    location_area: {
      name: location.area ? `${location.name.toLowerCase().replace(/\s+/g, '-')}-${location.area.toLowerCase().replace(/\s+/g, '-')}` : location.name.toLowerCase().replace(/\s+/g, '-'),
      url: '#supplemental'
    },
    version_details: [{
      version: {
        name: game,
        url: `https://pokeapi.co/api/v2/version/${game}`
      },
      max_chance: location.methods.reduce((max, method) => {
        const rate = method.rate.includes('%') ? parseInt(method.rate) : 
                    method.rate === 'Common' ? 30 :
                    method.rate === 'Uncommon' ? 10 :
                    method.rate === 'Rare' ? 5 : 15;
        return Math.max(max, rate);
      }, 0),
      encounter_details: location.methods.map(method => ({
        min_level: parseInt(method.levelRange.split('-')[0]),
        max_level: parseInt(method.levelRange.split('-')[1] || method.levelRange.split('-')[0]),
        condition_values: [],
        chance: method.rate.includes('%') ? parseInt(method.rate) : 
               method.rate === 'Common' ? 30 :
               method.rate === 'Uncommon' ? 10 :
               method.rate === 'Rare' ? 5 : 15,
        method: {
          name: method.method.toLowerCase().replace(/\s+/g, '-'),
          url: '#supplemental'
        }
      }))
    }]
  }));
}
