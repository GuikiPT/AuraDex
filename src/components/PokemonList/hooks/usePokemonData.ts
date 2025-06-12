import { useState } from 'react';
import { Pokemon, PokemonListResponse } from '@/types/pokemon';
import { pokemonApi } from '@/utils/pokemon-api';
import { PokemonRange, UsePokemonDataReturn } from '../types';

const POKEMON_PER_PAGE = 20;

export const usePokemonData = (): UsePokemonDataReturn => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [generationOffset, setGenerationOffset] = useState(0);

  const loadPokemon = async (loadMore = false, specificRange?: PokemonRange) => {
    try {
      setLoading(true);
      
      if (specificRange) {
        // Load paginated Pokemon for generation filtering
        const currentOffset = loadMore ? generationOffset : 0;
        const startId = specificRange.start + currentOffset;
        const endId = Math.min(startId + POKEMON_PER_PAGE - 1, specificRange.end);
        
        if (startId > specificRange.end) {
          setHasMore(false);
          setLoading(false);
          return;
        }
        
        const pokemonPromises = [];
        for (let i = startId; i <= endId; i++) {
          pokemonPromises.push(pokemonApi.getPokemon(i.toString()));
        }
        
        const pokemonData = await Promise.all(pokemonPromises);
        
        if (loadMore) {
          setPokemonList(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newPokemon = pokemonData.filter(p => !existingIds.has(p.id));
            return [...prev, ...newPokemon];
          });
          setGenerationOffset(prev => prev + POKEMON_PER_PAGE);
        } else {
          setPokemonList(pokemonData);
          setGenerationOffset(POKEMON_PER_PAGE);
        }
        
        setHasMore(endId < specificRange.end);
      } else {
        // Regular pagination loading
        const offset = loadMore ? pokemonList.length : 0;
        const response: PokemonListResponse = await pokemonApi.getPokemonList(offset, POKEMON_PER_PAGE);
        
        // Fetch detailed data for each Pokemon
        const pokemonPromises = response.results.map(p => pokemonApi.getPokemon(p.name));
        const pokemonData = await Promise.all(pokemonPromises);
        
        if (loadMore) {
          setPokemonList(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newPokemon = pokemonData.filter(p => !existingIds.has(p.id));
            return [...prev, ...newPokemon];
          });
        } else {
          setPokemonList(pokemonData);
        }
        
        setHasMore(response.next !== null);
      }
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreHandler = (loadMore = false, specificRange?: PokemonRange) => {
    if (!loading && hasMore) {
      loadPokemon(loadMore, specificRange);
    }
  };

  return {
    pokemonList,
    loading,
    hasMore,
    generationOffset,
    loadPokemon,
    loadMoreHandler
  };
};
