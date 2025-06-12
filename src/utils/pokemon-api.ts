import axios from 'axios';
import {
  Pokemon,
  PokemonSpecies,
  EvolutionChain,
  TypeEffectiveness,
  Move,
  PokemonListResponse,
  PokemonEncounter,
  LocationArea,
  Location,
} from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
});

// Simple in-memory cache with localStorage persistence
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

function getCache<T>(key: string): T | null {
  const now = Date.now();
  const memory = cache.get(key);
  if (memory && now - memory.timestamp < CACHE_TTL) return memory.data as T;

  if (typeof localStorage !== 'undefined') {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item) as { data: T; timestamp: number };
        if (now - parsed.timestamp < CACHE_TTL) {
          cache.set(key, parsed);
          return parsed.data;
        }
      }
    } catch {
      /* ignore corrupt cache */
    }
  }
  return null;
}

function setCache<T>(key: string, data: T) {
  const value = { data, timestamp: Date.now() };
  cache.set(key, value);
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore storage errors */
    }
  }
}

async function fetchWithCache<T>(path: string): Promise<T> {
  const key = `poke:${path}`;
  const cached = getCache<T>(key);
  if (cached) return cached;

  const response = await api.get<T>(path);
  setCache(key, response.data);
  return response.data;
}

export const pokemonApi = {
  // Get list of Pokemon
  getPokemonList: async (offset = 0, limit = 20): Promise<PokemonListResponse> => {
    return fetchWithCache<PokemonListResponse>(
      `/pokemon?offset=${offset}&limit=${limit}`
    );
  },

  // Get Pokemon by ID or name
  getPokemon: async (idOrName: string | number): Promise<Pokemon> => {
    return fetchWithCache<Pokemon>(`/pokemon/${idOrName}`);
  },

  // Get Pokemon species data
  getPokemonSpecies: async (idOrName: string | number): Promise<PokemonSpecies> => {
    return fetchWithCache<PokemonSpecies>(`/pokemon-species/${idOrName}`);
  },

  // Get evolution chain
  getEvolutionChain: async (id: number): Promise<EvolutionChain> => {
    return fetchWithCache<EvolutionChain>(`/evolution-chain/${id}`);
  },

  // Get type effectiveness
  getTypeEffectiveness: async (type: string): Promise<TypeEffectiveness> => {
    return fetchWithCache<TypeEffectiveness>(`/type/${type}`);
  },

  // Get move data
  getMove: async (idOrName: string | number): Promise<Move> => {
    return fetchWithCache<Move>(`/move/${idOrName}`);
  },

  // Get Pokemon encounter locations
  getPokemonEncounters: async (idOrName: string | number): Promise<PokemonEncounter[]> => {
    return fetchWithCache<PokemonEncounter[]>(`/pokemon/${idOrName}/encounters`);
  },

  // Get location area details
  getLocationArea: async (idOrName: string | number): Promise<LocationArea> => {
    return fetchWithCache<LocationArea>(`/location-area/${idOrName}`);
  },

  // Get location details
  getLocation: async (idOrName: string | number): Promise<Location> => {
    return fetchWithCache<Location>(`/location/${idOrName}`);
  },

  // Search Pokemon
  searchPokemon: async (query: string): Promise<Pokemon[]> => {
    try {
      // First try to get by exact name/id
      const pokemon = await pokemonApi.getPokemon(query.toLowerCase());
      return [pokemon];
    } catch {
      // If exact match fails, get all Pokemon and filter
      const allPokemon = await pokemonApi.getPokemonList(0, 1500);
      const matches = allPokemon.results.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      
      const pokemonData = await Promise.all(
        matches.slice(0, 10).map(p => pokemonApi.getPokemon(p.name))
      );
      
      return pokemonData;
    }
  },
};

// Utility functions
export const getPokemonId = (url: string): number => {
  const matches = url.match(/\/(\d+)\/$/);
  return matches ? parseInt(matches[1]) : 0;
};

export const getPokemonNameFromUrl = (url: string): string => {
  const matches = url.match(/\/pokemon\/([^\/]+)\/$/);
  return matches ? matches[1] : '';
};

export const formatPokemonName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');
};

export const formatStatName = (statName: string): string => {
  const statMap: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    speed: 'Speed',
  };
  return statMap[statName] || statName;
};

export const getGenerationFromId = (id: number): string => {
  if (id <= 151) return 'Generation I';
  if (id <= 251) return 'Generation II';
  if (id <= 386) return 'Generation III';
  if (id <= 493) return 'Generation IV';
  if (id <= 649) return 'Generation V';
  if (id <= 721) return 'Generation VI';
  if (id <= 809) return 'Generation VII';
  if (id <= 905) return 'Generation VIII';
  return 'Generation IX';
};

export const calculateTypeEffectiveness = (
  defendingTypes: string[],
  allTypeData: Record<string, TypeEffectiveness>
): Record<string, number> => {
  const effectiveness: Record<string, number> = {};
  
  // Initialize all types with 1x effectiveness
  const allTypes = [
    'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
    'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
  ];
  
  allTypes.forEach(type => {
    effectiveness[type] = 1;
  });
  
  // Calculate effectiveness for each defending type
  defendingTypes.forEach(defendingType => {
    const typeData = allTypeData[defendingType];
    if (!typeData) return;
    
    // Double damage from these types
    typeData.damage_relations.double_damage_from.forEach(relation => {
      effectiveness[relation.name] *= 2;
    });
    
    // Half damage from these types
    typeData.damage_relations.half_damage_from.forEach(relation => {
      effectiveness[relation.name] *= 0.5;
    });
    
    // No damage from these types
    typeData.damage_relations.no_damage_from.forEach(relation => {
      effectiveness[relation.name] = 0;
    });
  });
  
  return effectiveness;
};

// Location utility functions
export const formatLocationName = (locationName: string): string => {
  return locationName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getLocationAreaId = (url: string): number => {
  const matches = url.match(/\/location-area\/(\d+)\/$/);
  return matches ? parseInt(matches[1]) : 0;
};

export const getLocationId = (url: string): number => {
  const matches = url.match(/\/location\/(\d+)\/$/);
  return matches ? parseInt(matches[1]) : 0;
};

export const formatEncounterRate = (rate: number): string => {
  if (rate >= 50) return 'Very Common';
  if (rate >= 30) return 'Common';
  if (rate >= 20) return 'Uncommon';
  if (rate >= 10) return 'Rare';
  if (rate >= 5) return 'Very Rare';
  return 'Extremely Rare';
};
