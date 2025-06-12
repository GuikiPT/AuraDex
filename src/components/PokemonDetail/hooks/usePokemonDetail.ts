import { useState, useCallback } from 'react';
import { Pokemon, PokemonSpecies, EvolutionChain, TypeEffectiveness } from '@/types/pokemon';
import { pokemonApi, calculateTypeEffectiveness, getPokemonNameFromUrl, getPokemonId } from '@/utils/pokemon-api';
import { UsePokemonDetailReturn } from '../types';

export const usePokemonDetail = (pokemonId: string): UsePokemonDetailReturn => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [megaEvolutions, setMegaEvolutions] = useState<Pokemon[]>([]);
  const [megaEvolutionsLoading, setMegaEvolutionsLoading] = useState(false);
  const [typeEffectiveness, setTypeEffectiveness] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const fetchPokemonData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch main Pokemon data
      const pokemonData = await pokemonApi.getPokemon(pokemonId);
      setPokemon(pokemonData);
      
      // Fetch species data
      const speciesData = await pokemonApi.getPokemonSpecies(pokemonId);
      setSpecies(speciesData);
      
      // Fetch evolution chain if available
      if (speciesData.evolution_chain) {
        const evolutionChainId = getPokemonId(speciesData.evolution_chain.url);
        const evolutionData = await pokemonApi.getEvolutionChain(evolutionChainId);
        setEvolutionChain(evolutionData);
      }
      
      // Fetch mega evolutions
      setMegaEvolutionsLoading(true);
      const megaEvolutionData: Pokemon[] = [];
      
      if (speciesData.varieties && speciesData.varieties.length > 1) {
        for (const variety of speciesData.varieties) {
          if (variety.pokemon.name !== pokemonData.name && variety.pokemon.name.includes('mega')) {
            try {
              const pokemonName = getPokemonNameFromUrl(variety.pokemon.url);
              const megaData = await pokemonApi.getPokemon(pokemonName);
              megaEvolutionData.push(megaData);
            } catch (error) {
              console.error(`Failed to fetch mega evolution ${variety.pokemon.name}:`, error);
            }
          }
        }
      }
      
      setMegaEvolutions(megaEvolutionData);
      setMegaEvolutionsLoading(false);
      
      // Fetch type effectiveness data
      const typeData: Record<string, TypeEffectiveness> = {};
      for (const type of pokemonData.types) {
        typeData[type.type.name] = await pokemonApi.getTypeEffectiveness(type.type.name);
      }
      
      const effectiveness = calculateTypeEffectiveness(
        pokemonData.types.map(t => t.type.name),
        typeData
      );
      setTypeEffectiveness(effectiveness);
      
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    } finally {
      setLoading(false);
    }
  }, [pokemonId]);

  return {
    pokemon,
    species,
    evolutionChain,
    megaEvolutions,
    megaEvolutionsLoading,
    typeEffectiveness,
    loading,
    fetchPokemonData
  };
};
