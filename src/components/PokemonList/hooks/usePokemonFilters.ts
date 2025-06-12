import { useState, useEffect } from 'react';
import { Pokemon } from '@/types/pokemon';
import { UsePokemonFiltersReturn } from '../types';

export const usePokemonFilters = (pokemonList: Pokemon[]): UsePokemonFiltersReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);

  const filterPokemon = () => {
    let filtered = pokemonList;

    // For generation filtering, we don't filter here since we load specific generation Pokemon
    // Only apply search and type filters to the loaded Pokemon
    if (searchTerm) {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.id.toString().includes(searchTerm)
      );
    }

    if (selectedType) {
      filtered = filtered.filter(pokemon =>
        pokemon.types.some(type => type.type.name === selectedType)
      );
    }

    // Remove any potential duplicates by ID to prevent React key conflicts
    const uniqueFiltered = filtered.filter((pokemon, index, array) => 
      array.findIndex(p => p.id === pokemon.id) === index
    );

    setFilteredPokemon(uniqueFiltered);
  };

  useEffect(() => {
    filterPokemon();
  }, [pokemonList, searchTerm, selectedType]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedGeneration,
    setSelectedGeneration,
    filteredPokemon
  };
};
