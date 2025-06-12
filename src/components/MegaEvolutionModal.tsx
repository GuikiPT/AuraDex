'use client';

import React from 'react';
import Image from 'next/image';
import { X, Star, Zap, Shield, Swords } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';
import { formatPokemonName } from '@/utils/pokemon-api';
import TypeIcon from './TypeIcon';

interface MegaEvolutionModalProps {
  pokemon: Pokemon | null;
  isOpen: boolean;
  onClose: () => void;
}

const MegaEvolutionModal: React.FC<MegaEvolutionModalProps> = ({
  pokemon,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !pokemon) return null;

  const baseStatTotal = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
  
  // Determine the form type and colors
  const formType = pokemon.name.includes('mega') ? 'mega' :
                   pokemon.name.includes('gmax') ? 'gmax' :
                   pokemon.name.includes('primal') ? 'primal' :
                   pokemon.name.includes('ultra') ? 'ultra' : 'form';

  const badgeColors = {
    mega: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    gmax: 'bg-gradient-to-r from-purple-500 to-pink-500',
    primal: 'bg-gradient-to-r from-red-500 to-red-600',
    ultra: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    form: 'bg-gradient-to-r from-gray-500 to-gray-600'
  };

  const badgeText = {
    mega: 'MEGA EVOLUTION',
    gmax: 'GIGANTAMAX FORM',
    primal: 'PRIMAL REVERSION',
    ultra: 'ULTRA FORM',
    form: 'ALTERNATE FORM'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="relative glass rounded-2xl border border-white/20 dark:border-gray-700/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
          title="Close modal"
        >
          <X className="text-white" size={20} />
        </button>

        {/* Header */}
        <div className="relative p-6 pb-4">
          <div className={`inline-block px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg ${badgeColors[formType]} animate-pulse mb-4`}>
            {badgeText[formType]}
          </div>
          
          <div className="flex items-start space-x-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Normal Form */}
              <div className="relative">
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                  alt={pokemon.name}
                  width={120}
                  height={120}
                  className="transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                  }}
                />
              </div>
              
              {/* Shiny Form */}
              <div className="relative">
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemon.id}.png`}
                  alt={`Shiny ${pokemon.name}`}
                  width={120}
                  height={120}
                  className="transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`;
                  }}
                />
                {/* Shiny sparkle indicator */}
                <div className="absolute -top-2 -right-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    <span className="text-white text-sm font-bold">✨</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {formatPokemonName(pokemon.name)}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                #{pokemon.id.toString().padStart(3, '0')}
              </p>
              
              {/* Types */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Types:</span>
                <div className="flex space-x-2">
                  {pokemon.types.map((type) => (
                    <TypeIcon key={type.type.name} type={type.type.name} size={96} />
                  ))}
                </div>
              </div>

              {/* Base Stat Total */}
              <div className="flex items-center space-x-2">
                <Zap className="text-yellow-500" size={16} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Base Stat Total: 
                </span>
                <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  {baseStatTotal}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Star className="mr-2 text-yellow-500" size={18} />
            Base Stats
          </h3>
          
          <div className="space-y-3">
            {pokemon.stats.map((stat) => {
              const statName = stat.stat.name;
              const statValue = stat.base_stat;
              const maxStat = 255; // Maximum possible stat value
              const percentage = (statValue / maxStat) * 100;
              
              const statColors = {
                hp: 'bg-red-500',
                attack: 'bg-orange-500',
                defense: 'bg-yellow-500',
                'special-attack': 'bg-blue-500',
                'special-defense': 'bg-green-500',
                speed: 'bg-pink-500'
              };

              const statIcons = {
                hp: '❤️',
                attack: '⚔️',
                defense: '🛡️',
                'special-attack': '🔥',
                'special-defense': '🌟',
                speed: '💨'
              };

              const displayName = statName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
              
              return (
                <div key={statName} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 w-32">
                    <span className="text-sm">{statIcons[statName as keyof typeof statIcons]}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {displayName}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full ${statColors[statName as keyof typeof statColors]} transition-all duration-500 ease-out`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-8 text-right">
                      {statValue}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Info */}
        <div className="px-6 pb-6 border-t border-white/20 dark:border-gray-700/30 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="glass rounded-lg p-3 border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center justify-center mb-1">
                <Swords className="text-orange-500" size={16} />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Attack</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0}
              </p>
            </div>
            
            <div className="glass rounded-lg p-3 border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center justify-center mb-1">
                <Shield className="text-blue-500" size={16} />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Defense</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0}
              </p>
            </div>
            
            <div className="glass rounded-lg p-3 border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center justify-center mb-1">
                <Zap className="text-yellow-500" size={16} />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Speed</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaEvolutionModal;
