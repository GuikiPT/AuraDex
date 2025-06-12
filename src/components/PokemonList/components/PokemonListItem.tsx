import React from 'react';
import Image from 'next/image';
import { Pokemon } from '@/types/pokemon';
import { formatPokemonName } from '@/utils/pokemon-api';
import TypeBadge from '../../TypeBadge';

interface PokemonListItemProps {
  pokemon: Pokemon;
  onPokemonClick: (pokemon: Pokemon) => void;
}

export const PokemonListItem: React.FC<PokemonListItemProps> = ({ 
  pokemon, 
  onPokemonClick 
}) => (
  <div
    onClick={() => onPokemonClick(pokemon)}
    className="group glass rounded-xl cursor-pointer p-6 hover:scale-[1.02] transition-all duration-300 border border-white/20 dark:border-gray-700/30"
  >
    <div className="flex items-center gap-6">
      <div className="flex-shrink-0 relative">
        {/* Container for both normal and shiny images */}
        <div className="flex space-x-2">
          {/* Normal Version */}
          <div className="relative">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center overflow-hidden">
              <Image
                src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default || '/placeholder-pokemon.svg'}
                alt={`${pokemon.name} normal`}
                width={40}
                height={40}
                className="object-contain group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-pokemon.svg';
                }}
              />
            </div>
          </div>

          {/* Shiny Version */}
          <div className="relative">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50 flex items-center justify-center overflow-hidden border border-yellow-200 dark:border-yellow-700/50">
              <Image
                src={pokemon.sprites.other?.['official-artwork']?.front_shiny || pokemon.sprites.front_shiny || '/placeholder-pokemon.svg'}
                alt={`${pokemon.name} shiny`}
                width={40}
                height={40}
                className="object-contain group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-pokemon.svg';
                }}
              />
              {/* Shiny sparkle */}
              <div className="absolute top-0 right-0 text-yellow-400 text-xs animate-pulse">
                ✨
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:gradient-text transition-all duration-300">
            {formatPokemonName(pokemon.name)}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
        </div>
        
        <div className="flex gap-2 mb-3">
          {pokemon.types.map((type, index) => (
            <TypeBadge key={index} type={type.type.name} size="sm" variant="glass" />
          ))}
        </div>
        
        <div className="grid grid-cols-5 gap-4 text-sm">
          <div className="text-center">
            <span className="block text-gray-500 dark:text-gray-400 text-xs">Height</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{(pokemon.height / 10).toFixed(1)} m</span>
          </div>
          <div className="text-center">
            <span className="block text-gray-500 dark:text-gray-400 text-xs">Weight</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{(pokemon.weight / 10).toFixed(1)} kg</span>
          </div>
          <div className="text-center">
            <span className="block text-gray-500 dark:text-gray-400 text-xs">Sp. Attack</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {pokemon.stats.find(stat => stat.stat.name === 'special-attack')?.base_stat || 0}
            </span>
          </div>
          <div className="text-center">
            <span className="block text-gray-500 dark:text-gray-400 text-xs">Sp. Defense</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {pokemon.stats.find(stat => stat.stat.name === 'special-defense')?.base_stat || 0}
            </span>
          </div>
          <div className="text-center">
            <span className="block text-gray-500 dark:text-gray-400 text-xs">Experience</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{pokemon.base_experience}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
