import svEncounters from './sv-encounters.json';
export interface SvLocation {
  location: string;
  biome: string;
}
export const SV_ENCOUNTERS: Record<string, SvLocation[]> = svEncounters as Record<string, SvLocation[]>;

export function getSvEncounters(pokemonName: string): SvLocation[] | null {
  return SV_ENCOUNTERS[pokemonName.toLowerCase()] || null;
}

// Convert SV encounter data to PokéAPI-like format
export function convertSvToEncounterFormat(encounters: SvLocation[]) {
  return encounters.flatMap(enc => {
    const areaName = `sv-${enc.location}-${enc.biome.replace(/\s+/g, '-').toLowerCase()}`;
    return ['scarlet', 'violet'].map(game => ({
      location_area: { name: areaName, url: '#sv' },
      version_details: [{
        version: { name: game, url: '#' },
        max_chance: 0,
        encounter_details: [{
          min_level: 0,
          max_level: 0,
          condition_values: [],
          chance: 0,
          method: { name: 'walk', url: '#sv' },
        }]
      }]
    }));
  });
}
