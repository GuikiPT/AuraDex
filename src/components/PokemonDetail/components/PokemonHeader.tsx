import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';
import { formatPokemonName } from '@/utils/pokemon-api';
import { TYPE_COLORS } from '@/constants/pokemon';
import TypeIcon from '../../TypeIcon';

interface PokemonHeaderProps {
  pokemon: Pokemon;
  onShowSpritesModal: () => void;
}

export const PokemonHeader: React.FC<PokemonHeaderProps> = ({ 
  pokemon, 
  onShowSpritesModal 
}) => {
  const router = useRouter();

  return (
    <div 
      className="relative h-80 overflow-hidden"
      style={{
        background: pokemon.types.length > 0 
          ? `linear-gradient(135deg, ${TYPE_COLORS[pokemon.types[0].type.name]} 0%, ${TYPE_COLORS[pokemon.types[pokemon.types.length - 1].type.name] || TYPE_COLORS[pokemon.types[0].type.name]} 100%)`
          : 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)'
      }}
    >
      {/* Floating pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2240%22%20r%3D%223%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-white hover:text-white/80 transition-colors mb-4 glass-button rounded-xl px-4 py-2 border border-white/20"
        >
          <ChevronLeft size={24} className="mr-1" />
          Back to Pokédex
        </button>
        
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">{formatPokemonName(pokemon.name)}</h1>
            <p className="text-xl opacity-90 drop-shadow-md">#{pokemon.id.toString().padStart(3, '0')}</p>
            <div className="flex space-x-2 mt-3">
              {pokemon.types.map((type, index) => (
                <TypeIcon key={index} type={type.type.name} size={96} />
              ))}
            </div>
          </div>
          
          <div className="relative flex space-x-6">
            {/* Normal Version */}
            <div className="relative">
              <div className="absolute -inset-4 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
              <button
                onClick={onShowSpritesModal}
                className="relative z-10 group"
                title="Click to view all sprites"
              >
                <Image
                  src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default || '/placeholder-pokemon.svg'}
                  alt={`${pokemon.name} normal`}
                  width={180}
                  height={180}
                  className="drop-shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
                {/* Overlay with hint */}
                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-full text-xs font-medium text-gray-900 dark:text-gray-100">
                    View All Sprites
                  </div>
                </div>
              </button>
              <div className="text-center mt-2">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                  Normal
                </span>
              </div>
            </div>

            {/* Shiny Version */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-2xl animate-pulse"></div>
              <button
                onClick={onShowSpritesModal}
                className="relative z-10 group"
                title="Click to view all sprites"
              >
                <Image
                  src={pokemon.sprites.other['official-artwork']?.front_shiny || pokemon.sprites.front_shiny || '/placeholder-pokemon.svg'}
                  alt={`${pokemon.name} shiny`}
                  width={180}
                  height={180}
                  className="drop-shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
                {/* Shiny sparkle effect */}
                <div className="absolute top-2 right-2 text-yellow-300 animate-pulse">
                  ✨
                </div>
                {/* Overlay with hint */}
                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-full text-xs font-medium text-gray-900 dark:text-gray-100">
                    View All Sprites
                  </div>
                </div>
              </button>
              <div className="text-center mt-2">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-full text-white text-sm font-medium shadow-lg">
                  ✨ Shiny
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
