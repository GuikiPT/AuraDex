import React, { useState } from 'react';
import { MapPin, Filter, Gamepad2 } from 'lucide-react';
import { PokemonEncounter, LocationArea } from '@/types/pokemon';
import { formatLocationName, formatEncounterRate } from '@/utils/pokemon-api';
import { ENCOUNTER_METHODS, ENCOUNTER_CONDITIONS } from '@/constants/pokemon';
import { hasSupplementalDataForGame } from '@/data/supplemental-encounters';
import LoadingSpinner from '../../LoadingSpinner';

interface LocationsTabProps {
  encounters: PokemonEncounter[];
  encountersLoading: boolean;
  pokemonId?: number;
  locationDetails?: Record<string, LocationArea>;
}

export const LocationsTab: React.FC<LocationsTabProps> = ({ 
  encounters, 
  encountersLoading,
  pokemonId,
  locationDetails = {}
}) => {
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedVersionGroup, setSelectedVersionGroup] = useState('');

  if (encountersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading encounter data..." />
      </div>
    );
  }

  if (encounters.length === 0) {
    return (
      <div className="glass rounded-xl p-8 border border-white/20 dark:border-gray-700/30 text-center">
        <MapPin className="mx-auto mb-4 text-gray-400 dark:text-gray-500" size={48} />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No Wild Encounters
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          This Pokémon cannot be found in the wild. It may be obtained through:
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="glass rounded-lg p-4 border border-white/20 dark:border-gray-700/30">
            <div className="text-2xl mb-2">🎁</div>
            <div className="font-medium text-gray-900 dark:text-gray-100">Gift/Event</div>
            <div className="text-gray-600 dark:text-gray-400">Special events or NPCs</div>
          </div>
          <div className="glass rounded-lg p-4 border border-white/20 dark:border-gray-700/30">
            <div className="text-2xl mb-2">🥚</div>
            <div className="font-medium text-gray-900 dark:text-gray-100">Breeding</div>
            <div className="text-gray-600 dark:text-gray-400">Hatched from eggs</div>
          </div>
          <div className="glass rounded-lg p-4 border border-white/20 dark:border-gray-700/30">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-medium text-gray-900 dark:text-gray-100">Evolution</div>
            <div className="text-gray-600 dark:text-gray-400">Evolved from other Pokémon</div>
          </div>
        </div>
      </div>
    );
  }

  // Group encounters by game version
  const encountersByGame: Record<string, typeof encounters> = {};
  encounters.forEach(encounter => {
    encounter.version_details.forEach(versionDetail => {
      const game = versionDetail.version.name;
      if (!encountersByGame[game]) {
        encountersByGame[game] = [];
      }
      encountersByGame[game].push({
        ...encounter,
        version_details: [versionDetail]
      });
    });
  });

  // Create a mapping for individual game order and generation
  const gameOrderMap: Record<string, { order: number; generation: number }> = {
    'red': { order: 1, generation: 1 }, 'blue': { order: 1, generation: 1 }, 'yellow': { order: 2, generation: 1 },
    'gold': { order: 3, generation: 2 }, 'silver': { order: 3, generation: 2 }, 'crystal': { order: 4, generation: 2 },
    'ruby': { order: 5, generation: 3 }, 'sapphire': { order: 5, generation: 3 }, 'emerald': { order: 6, generation: 3 },
    'firered': { order: 7, generation: 3 }, 'leafgreen': { order: 7, generation: 3 },
    'colosseum': { order: 8, generation: 3 }, 'xd': { order: 9, generation: 3 },
    'diamond': { order: 10, generation: 4 }, 'pearl': { order: 10, generation: 4 }, 'platinum': { order: 11, generation: 4 },
    'heartgold': { order: 12, generation: 4 }, 'soulsilver': { order: 12, generation: 4 },
    'black': { order: 13, generation: 5 }, 'white': { order: 13, generation: 5 }, 'black-2': { order: 14, generation: 5 }, 'white-2': { order: 14, generation: 5 },
    'x': { order: 15, generation: 6 }, 'y': { order: 15, generation: 6 },
    'omega-ruby': { order: 16, generation: 6 }, 'alpha-sapphire': { order: 16, generation: 6 },
    'sun': { order: 17, generation: 7 }, 'moon': { order: 17, generation: 7 },
    'ultra-sun': { order: 18, generation: 7 }, 'ultra-moon': { order: 18, generation: 7 },
    'lets-go-pikachu': { order: 19, generation: 7 }, 'lets-go-eevee': { order: 19, generation: 7 },
    'sword': { order: 20, generation: 8 }, 'shield': { order: 20, generation: 8 },
    'the-isle-of-armor': { order: 21, generation: 8 }, 'the-crown-tundra': { order: 22, generation: 8 },
    'brilliant-diamond': { order: 23, generation: 8 }, 'shining-pearl': { order: 23, generation: 8 },
    'legends-arceus': { order: 24, generation: 8 },
    'scarlet': { order: 25, generation: 9 }, 'violet': { order: 25, generation: 9 },
    'the-teal-mask': { order: 26, generation: 9 }, 'the-indigo-disk': { order: 27, generation: 9 }
  };

  // Function to get display name for games
  const getGameDisplayName = (gameName: string): string => {
    const displayNames: Record<string, string> = {
      'red': 'Red', 'blue': 'Blue', 'yellow': 'Yellow',
      'gold': 'Gold', 'silver': 'Silver', 'crystal': 'Crystal',
      'ruby': 'Ruby', 'sapphire': 'Sapphire', 'emerald': 'Emerald',
      'firered': 'FireRed', 'leafgreen': 'LeafGreen',
      'colosseum': 'Colosseum', 'xd': 'XD: Gale of Darkness',
      'diamond': 'Diamond', 'pearl': 'Pearl', 'platinum': 'Platinum',
      'heartgold': 'HeartGold', 'soulsilver': 'SoulSilver',
      'black': 'Black', 'white': 'White', 'black-2': 'Black 2', 'white-2': 'White 2',
      'x': 'X', 'y': 'Y',
      'omega-ruby': 'Omega Ruby', 'alpha-sapphire': 'Alpha Sapphire',
      'sun': 'Sun', 'moon': 'Moon',
      'ultra-sun': 'Ultra Sun', 'ultra-moon': 'Ultra Moon',
      'lets-go-pikachu': "Let's Go Pikachu", 'lets-go-eevee': "Let's Go Eevee",
      'sword': 'Sword', 'shield': 'Shield',
      'the-isle-of-armor': 'The Isle of Armor', 'the-crown-tundra': 'The Crown Tundra',
      'brilliant-diamond': 'Brilliant Diamond', 'shining-pearl': 'Shining Pearl',
      'legends-arceus': 'Legends: Arceus',
      'scarlet': 'Scarlet', 'violet': 'Violet',
      'the-teal-mask': 'The Teal Mask', 'the-indigo-disk': 'The Indigo Disk'
    };
    return displayNames[gameName] || gameName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get all games that have encounter data
  const gamesWithEncounters = Object.keys(encountersByGame).sort((a, b) => {
    const infoA = gameOrderMap[a] || { order: 999, generation: 999 };
    const infoB = gameOrderMap[b] || { order: 999, generation: 999 };
    
    if (infoA.generation !== infoB.generation) {
      return infoA.generation - infoB.generation;
    }
    if (infoA.order !== infoB.order) {
      return infoA.order - infoB.order;
    }
    return a.localeCompare(b);
  });

  // Define all available games for filtering (even those without encounter data)
  const allAvailableGames = Object.keys(gameOrderMap).sort((a, b) => {
    const infoA = gameOrderMap[a];
    const infoB = gameOrderMap[b];
    
    if (infoA.generation !== infoB.generation) {
      return infoA.generation - infoB.generation;
    }
    if (infoA.order !== infoB.order) {
      return infoA.order - infoB.order;
    }
    return a.localeCompare(b);
  });

  // Group all games by generation for display (not just those with encounters)
  const allGamesByGeneration: Record<number, string[]> = {};
  allAvailableGames.forEach(game => {
    const generation = gameOrderMap[game]?.generation || 999;
    if (!allGamesByGeneration[generation]) {
      allGamesByGeneration[generation] = [];
    }
    allGamesByGeneration[generation].push(game);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <MapPin className="mr-2" size={20} />
              Wild Encounters
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Locations where this Pokémon can be found in the wild
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl mb-2">🗺️</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {gamesWithEncounters.length} game{gamesWithEncounters.length !== 1 ? 's' : ''} with data
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {encounters.length} location{encounters.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Game Version Filter */}
      <div className="glass rounded-xl p-4 border border-white/20 dark:border-gray-700/30">
        <div className="flex items-center space-x-2 mb-3">
          <Filter size={16} className="text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Game:</span>
        </div>
        
        {/* All Games button */}
        <div className="mb-4">
          <button
            onClick={() => setSelectedVersionGroup('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedVersionGroup === ''
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/70'
            }`}
          >
            🎮 All Games ({gamesWithEncounters.length} with data)
          </button>
        </div>

        {/* Games grouped by generation */}
        <div className="space-y-3">
          {Object.keys(allGamesByGeneration)
            .map(Number)
            .sort((a, b) => a - b)
            .map(generation => (
              <div key={generation}>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                  <span className="mr-2">✨</span>
                  Generation {generation === 999 ? 'Other' : generation}
                </div>
                <div className="flex flex-wrap gap-2 pl-4">
                  {allGamesByGeneration[generation].map(game => {
                    const hasEncounterData = encountersByGame[game];
                    const hasSupplementalData = pokemonId && hasSupplementalDataForGame(pokemonId, game);
                    const hasAnyData = hasEncounterData || hasSupplementalData;
                    
                    return (
                      <button
                        key={game}
                        onClick={() => setSelectedVersionGroup(game)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                          selectedVersionGroup === game
                            ? 'bg-blue-500 text-white shadow-md'
                            : hasAnyData
                            ? 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/70'
                            : 'bg-gray-200/50 dark:bg-gray-700/30 text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-60'
                        }`}
                        disabled={!hasAnyData}
                        title={hasAnyData ? undefined : 'No encounter data available for this game'}
                      >
                        {getGameDisplayName(game)}
                        {!hasAnyData && (
                          <span className="ml-1 text-xs">🚫</span>
                        )}
                        {hasSupplementalData && !hasEncounterData && (
                          <span className="ml-1 text-xs" title="Curated data available">✨</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Location Search */}
      {encounters.length > 5 && (
        <div className="glass rounded-xl p-4 border border-white/20 dark:border-gray-700/30">
          <div className="flex items-center space-x-2 mb-3">
            <MapPin size={16} className="text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Locations:</span>
          </div>
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Filter by location name..."
            className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      )}

      {/* Encounters by Game */}
      {gamesWithEncounters
        .filter(game => !selectedVersionGroup || selectedVersionGroup === game)
        .map(game => {
          // Filter encounters by location name if search is active
          const filteredEncounters = encountersByGame[game].filter(encounter => {
            if (!locationFilter) return true;
            const locationArea = locationDetails[encounter.location_area.name];
            const locationName = formatLocationName(encounter.location_area.name);
            const mainLocationName = locationArea?.location.name ? formatLocationName(locationArea.location.name) : '';
            
            return locationName.toLowerCase().includes(locationFilter.toLowerCase()) ||
                   mainLocationName.toLowerCase().includes(locationFilter.toLowerCase());
          });

          if (filteredEncounters.length === 0) return null;

          return (
          <div key={game} className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <Gamepad2 className="mr-2" size={18} />
                Pokémon {getGameDisplayName(game)}
              </h4>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300">
                  Gen {gameOrderMap[game]?.generation || '?'}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredEncounters.length} location{filteredEncounters.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredEncounters.map((encounter, index) => {
                const locationArea = locationDetails[encounter.location_area.name];
                const locationName = formatLocationName(encounter.location_area.name);
                
                return (
                  <div key={index} className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 border border-white/20 dark:border-gray-700/30 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                          <span className="mr-2">📍</span>
                          {locationArea?.location.name ? formatLocationName(locationArea.location.name) : locationName}
                        </h5>
                        {locationArea?.location.name && locationArea.location.name !== encounter.location_area.name && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                            Area: {locationName}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Max Rate</div>
                        <div className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg">
                          <div className="font-bold text-green-700 dark:text-green-300 text-sm">
                            {formatEncounterRate(encounter.version_details[0].max_chance)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {encounter.version_details[0].encounter_details.map((detail, detailIndex) => {
                        const methodInfo = ENCOUNTER_METHODS[detail.method.name] || ENCOUNTER_METHODS.walk;
                        
                        return (
                          <div key={detailIndex} className="bg-white/20 dark:bg-gray-700/20 rounded-lg p-3 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{methodInfo.icon}</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                  {methodInfo.name}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                  {typeof detail.chance === 'number' ? `${detail.chance}%` : detail.chance}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">Level Range:</span>
                                <span className="text-gray-900 dark:text-gray-100 font-medium px-2 py-1 bg-white/20 dark:bg-gray-800/20 rounded">
                                  {detail.min_level === detail.max_level ? 
                                    `Lv. ${detail.min_level}` : 
                                    `Lv. ${detail.min_level}-${detail.max_level}`
                                  }
                                </span>
                              </div>
                              
                              {detail.condition_values.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-white/20 dark:border-gray-600/20">
                                  <div className="text-gray-600 dark:text-gray-400 mb-1">Conditions:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {detail.condition_values.map((condition, condIndex) => {
                                      const conditionInfo = ENCOUNTER_CONDITIONS[condition.name] || ENCOUNTER_CONDITIONS.time;
                                      return (
                                        <span
                                          key={condIndex}
                                          className="inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium border"
                                          style={{ 
                                            backgroundColor: `${conditionInfo.color}20`,
                                            borderColor: `${conditionInfo.color}40`,
                                            color: conditionInfo.color
                                          }}
                                        >
                                          <span>{conditionInfo.icon}</span>
                                          <span>{conditionInfo.name}</span>
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          );
        })}

      {/* Message for games without encounter data */}
      {selectedVersionGroup && !encountersByGame[selectedVersionGroup] && (
        <div>
          {pokemonId && hasSupplementalDataForGame(pokemonId, selectedVersionGroup) ? (
            // Show supplemental data
            <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <Gamepad2 className="mr-2" size={18} />
                  Pokémon {getGameDisplayName(selectedVersionGroup)}
                  <span className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-xs font-medium text-yellow-700 dark:text-yellow-300">
                    Curated Data
                  </span>
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300">
                    Gen {gameOrderMap[selectedVersionGroup]?.generation || '?'}
                  </span>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>✨ Curated Data:</strong> This encounter information has been manually curated from official sources 
                  since detailed encounter data for Generation 8+ games is not yet available in PokéAPI.
                </p>
              </div>

              {/* Render supplemental encounter data here */}
              <div className="text-center text-gray-600 dark:text-gray-400">
                <p>Supplemental encounter display coming soon...</p>
              </div>
            </div>
          ) : (
            // Show no data message
            <div className="glass rounded-xl p-8 border border-white/20 dark:border-gray-700/30 text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Encounter Data Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Pokémon {getGameDisplayName(selectedVersionGroup)} encounter data is not yet available in the database.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> PokéAPI currently has complete encounter data up to Generation 7 (Ultra Sun/Ultra Moon). 
                  Newer games like Sword/Shield, Scarlet/Violet, and others are in the system but encounter locations are still being added.
                </p>
              </div>
              <button
                onClick={() => setSelectedVersionGroup('')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                View All Available Games
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
