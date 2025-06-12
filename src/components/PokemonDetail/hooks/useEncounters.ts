import { useState, useCallback } from 'react';
import { PokemonEncounter, LocationArea } from '@/types/pokemon';
import { pokemonApi } from '@/utils/pokemon-api';
import { getSupplementalEncounters, convertSupplementalToEncounterFormat } from '@/data/supplemental-encounters';
import { UseEncountersReturn } from '../types';

export const useEncounters = (pokemonId: string): UseEncountersReturn => {
  const [encounters, setEncounters] = useState<PokemonEncounter[]>([]);
  const [encountersLoading, setEncountersLoading] = useState(false);
  const [locationDetails, setLocationDetails] = useState<Record<string, LocationArea>>({});
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedVersionGroup, setSelectedVersionGroup] = useState<string>('');

  const fetchEncounterData = useCallback(async () => {
    try {
      setEncountersLoading(true);
      
      // Fetch PokéAPI encounter data
      const apiEncounters = await pokemonApi.getPokemonEncounters(pokemonId);
      
      // Fetch supplemental encounter data
      const supplementalEncounters = getSupplementalEncounters(parseInt(pokemonId));
      const convertedSupplemental: PokemonEncounter[] = [];
      
      if (supplementalEncounters) {
        // Convert supplemental data for each game
        const modernGames = ['sword', 'shield', 'brilliant-diamond', 'shining-pearl', 'legends-arceus', 'scarlet', 'violet'];
        for (const game of modernGames) {
          if (supplementalEncounters.games[game]) {
            const gameEncounters = convertSupplementalToEncounterFormat(supplementalEncounters, game);
            convertedSupplemental.push(...gameEncounters);
          }
        }
      }
      
      // Note: SV encounters need pokemon name, but we only have ID here
      // For now, skip SV encounters or implement a name lookup
      const convertedSv: PokemonEncounter[] = [];
      
      // Combine all encounter data
      const allEncounters = [
        ...apiEncounters,
        ...convertedSupplemental,
        ...convertedSv
      ];
      
      setEncounters(allEncounters);
      
      // Fetch location area details for each encounter
      const locationPromises = allEncounters.map(async (encounter) => {
        try {
          const locationArea = await pokemonApi.getLocationArea(encounter.location_area.name);
          return { [encounter.location_area.name]: locationArea };
        } catch (error) {
          console.error(`Failed to fetch location area ${encounter.location_area.name}:`, error);
          return {
            [encounter.location_area.name]: {
              id: 0,
              name: encounter.location_area.name,
              game_index: 0,
              encounter_method_rates: [],
              location: {
                name: encounter.location_area.name,
                url: ''
              },
              names: [],
              pokemon_encounters: []
            }
          };
        }
      });
      
      const locationResults = await Promise.all(locationPromises);
      const locationDetailsMap = locationResults.reduce((acc, location) => ({
        ...acc,
        ...location
      }), {});
      
      setLocationDetails(locationDetailsMap);
    } catch (error) {
      console.error('Error fetching encounter data:', error);
    } finally {
      setEncountersLoading(false);
    }
  }, [pokemonId]);

  return {
    encounters,
    encountersLoading,
    locationDetails,
    locationFilter,
    selectedVersionGroup,
    fetchEncounterData,
    setLocationFilter,
    setSelectedVersionGroup
  };
};
