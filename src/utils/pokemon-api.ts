import axios from 'axios';
import {
  Pokemon,
  PokemonSpecies,
  EvolutionChain,
  TypeEffectiveness,
  Move,
  PokemonListResponse,
} from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
});

export const pokemonApi = {
  // Get list of Pokemon
  getPokemonList: async (offset = 0, limit = 20): Promise<PokemonListResponse> => {
    const response = await api.get(`/pokemon?offset=${offset}&limit=${limit}`);
    return response.data;
  },

  // Get Pokemon by ID or name
  getPokemon: async (idOrName: string | number): Promise<Pokemon> => {
    const response = await api.get(`/pokemon/${idOrName}`);
    return response.data;
  },

  // Get Pokemon species data
  getPokemonSpecies: async (idOrName: string | number): Promise<PokemonSpecies> => {
    const response = await api.get(`/pokemon-species/${idOrName}`);
    return response.data;
  },

  // Get evolution chain
  getEvolutionChain: async (id: number): Promise<EvolutionChain> => {
    const response = await api.get(`/evolution-chain/${id}`);
    return response.data;
  },

  // Get type effectiveness
  getTypeEffectiveness: async (type: string): Promise<TypeEffectiveness> => {
    const response = await api.get(`/type/${type}`);
    return response.data;
  },

  // Get move data
  getMove: async (idOrName: string | number): Promise<Move> => {
    const response = await api.get(`/move/${idOrName}`);
    return response.data;
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
