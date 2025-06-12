import React from 'react';
import { Pokemon } from '@/types/pokemon';
import PokemonCard from '../../PokemonCard';
import { PokemonListItem } from './PokemonListItem';
import { ViewMode } from '../types';

interface PokemonGridProps {
  pokemonList: Pokemon[];
  viewMode: ViewMode;
  onPokemonClick: (pokemon: Pokemon) => void;
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({
  pokemonList,
  viewMode,
  onPokemonClick
}) => {
  return (
    <div className={
      viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 relative z-10'
        : 'space-y-4 relative z-10'
    }>
      {pokemonList.map((pokemon) => 
        viewMode === 'grid' ? (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ) : (
          <PokemonListItem 
            key={pokemon.id} 
            pokemon={pokemon} 
            onPokemonClick={onPokemonClick}
          />
        )
      )}
    </div>
  );
};
