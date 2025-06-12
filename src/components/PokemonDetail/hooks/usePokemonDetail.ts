import { useState } from 'react';
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
  const [loading, setLoading] = useState(true);

  const fetchPokemonData = async () => {
    try {
      setLoading(true);
      
      // Fetch basic Pokemon data
      const pokemonData = await pokemonApi.getPokemon(pokemonId);
      setPokemon(pokemonData);
      
      // Fetch species data
      const speciesData = await pokemonApi.getPokemonSpecies(pokemonId);
      setSpecies(speciesData);
      
      // Fetch evolution chain
      if (speciesData.evolution_chain?.url) {
        const evolutionId = getPokemonId(speciesData.evolution_chain.url);
        const evolutionData = await pokemonApi.getEvolutionChain(evolutionId);
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
      
      // Check for other mega forms by species relationships
      // TODO: Fix type issue with evolves_from_species
      /*
      if ((speciesData as any).evolves_from_species) {
        try {
          const baseSpeciesName = getPokemonNameFromUrl((speciesData as any).evolves_from_species.url);
          const baseSpeciesData = await pokemonApi.getPokemonSpecies(baseSpeciesName);
          
          if (baseSpeciesData.varieties && baseSpeciesData.varieties.length > 1) {
            for (const variety of baseSpeciesData.varieties) {
              if (variety.pokemon.name.includes('mega')) {
                try {
                  const pokemonName = getPokemonNameFromUrl(variety.pokemon.url);
                  const megaData = await pokemonApi.getPokemon(pokemonName);
                  if (!megaEvolutionData.find(m => m.id === megaData.id)) {
                    megaEvolutionData.push(megaData);
                  }
                } catch (error) {
                  console.error(`Failed to fetch species mega evolution ${variety.pokemon.name}:`, error);
                }
              }
            }
          }
        } catch (error) {
          console.error(`Failed to fetch species data for ${pokemonData.name}:`, error);
        }
      }
      */
      
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
  };

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
