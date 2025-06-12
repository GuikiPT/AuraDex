'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Zap, Shield, Swords, Star } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';
import { formatPokemonName } from '@/utils/pokemon-api';
import { TYPE_COLORS } from '@/constants/pokemon';
import TypeIcon from './TypeIcon';

interface PokemonCardProps {
  pokemon: Pokemon;
  priority?: boolean;
}

export default function PokemonCard({ pokemon, priority = false }: PokemonCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    router.push(`/pokemon/${pokemon.id}`);
  };

  const primaryType = pokemon.types[0]?.type.name;
  const typeColor = TYPE_COLORS[primaryType as keyof typeof TYPE_COLORS] || '#6b7280';

  const stats = {
    hp: pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
    attack: pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
    defense: pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
    specialAttack: pokemon.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0,
    specialDefense: pokemon.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0,
    speed: pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
  };

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
        style={{
          background: `linear-gradient(135deg, ${typeColor}40, ${typeColor}20)`
        }}
      />
      
      {/* Card */}
      <div className="relative glass rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/30 shadow-xl group-hover:shadow-2xl transition-all duration-300">
        {/* Header with ID */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-2 py-1 rounded-lg bg-black/20 backdrop-blur-sm text-white text-xs font-mono">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
        </div>

        {/* Pokemon Images */}
        <div 
          className="relative h-48 p-4 flex items-center justify-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${typeColor}20, ${typeColor}10, transparent)`
          }}
        >
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 shimmer" />
            </div>
          )}
          
          {/* Normal and Shiny Images Side by Side */}
          <div className="flex space-x-4 items-center">
            {/* Normal Version */}
            <div className="relative w-24 h-24 group-hover:animate-float">
              <Image
                src={imageError ? '/placeholder-pokemon.svg' : (pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default || '/placeholder-pokemon.svg')}
                alt={`${pokemon.name} normal`}
                fill
                sizes="96px"
                priority={priority}
                className={`object-contain transition-all duration-500 drop-shadow-lg ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </div>

            {/* Shiny Version */}
            <div className="relative w-24 h-24 group-hover:animate-float" style={{ animationDelay: '0.1s' }}>
              <Image
                src={imageError ? '/placeholder-pokemon.svg' : (pokemon.sprites.other?.['official-artwork']?.front_shiny || pokemon.sprites.front_shiny || '/placeholder-pokemon.svg')}
                alt={`${pokemon.name} shiny`}
                fill
                sizes="96px"
                priority={priority}
                className={`object-contain transition-all duration-500 drop-shadow-lg ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              {/* Shiny sparkle effect */}
              <div className="absolute top-1 right-1 text-yellow-300 animate-pulse text-sm">
                ✨
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-2 left-2 w-20 h-20 rounded-full bg-white/5 blur-3xl" />
        </div>

        {/* Pokemon Info */}
        <div className="p-4 space-y-3">
          {/* Name */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:gradient-text transition-all duration-300">
            {formatPokemonName(pokemon.name)}
          </h3>

          {/* Types */}
          <div className="flex gap-2 flex-wrap">
            {pokemon.types.map((type) => (
              <TypeIcon key={type.type.name} type={type.type.name} size={96} />
            ))}
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <Zap className="w-3 h-3 text-red-500" />
              </div>
              <span className="text-gray-600 dark:text-gray-400">HP</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.hp}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Swords className="w-3 h-3 text-orange-500" />
              </div>
              <span className="text-gray-600 dark:text-gray-400">ATK</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.attack}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Shield className="w-3 h-3 text-blue-500" />
              </div>
              <span className="text-gray-600 dark:text-gray-400">DEF</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.defense}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Star className="w-3 h-3 text-purple-500" />
              </div>
              <span className="text-gray-600 dark:text-gray-400">SP.A</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.specialAttack}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <Shield className="w-3 h-3 text-indigo-500" />
              </div>
              <span className="text-gray-600 dark:text-gray-400">SP.D</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.specialDefense}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Zap className="w-3 h-3 text-green-500" />
              </div>
              <span className="text-gray-600 dark:text-gray-400">SPD</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.speed}</span>
            </div>
          </div>

          {/* Power level indicator */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/10 dark:border-gray-700/50">
            <span className="text-xs text-gray-500 dark:text-gray-400">Power Level</span>
            <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.min((Object.values(stats).reduce((a, b) => a + b, 0) / 600) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
