import React from 'react';
import { ChevronLeft, ChevronRight, Book, Ruler, Star, Zap } from 'lucide-react';
import { Pokemon, PokemonSpecies } from '@/types/pokemon';
import { formatPokemonName } from '@/utils/pokemon-api';
import { GROWTH_RATES } from '@/constants/pokemon';

interface OverviewTabProps {
  pokemon: Pokemon;
  species: PokemonSpecies;
  englishDescriptions: Array<{ flavor_text: string; version: { name: string } }>;
  englishGenus: string;
  currentDescriptionIndex: number;
  onPrevDescription: () => void;
  onNextDescription: () => void;
  onSetDescriptionIndex: (index: number) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  pokemon,
  species,
  englishDescriptions,
  englishGenus,
  currentDescriptionIndex,
  onPrevDescription,
  onNextDescription,
  onSetDescriptionIndex
}) => {
  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Book className="mr-2" size={20} />
            Description
          </h3>
          {englishDescriptions.length > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={onPrevDescription}
                className="p-1 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors"
                title="Previous description"
              >
                <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {currentDescriptionIndex + 1} of {englishDescriptions.length}
              </span>
              <button
                onClick={onNextDescription}
                className="p-1 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors"
                title="Next description"
              >
                <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          )}
        </div>
        
        <div className="relative">
          {englishDescriptions.length > 0 ? (
            <div className="transition-all duration-300 ease-in-out">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {englishDescriptions[currentDescriptionIndex]?.flavor_text.replace(/\f/g, ' ')}
              </p>
              {englishDescriptions.length > 1 && (
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    From: {englishDescriptions[currentDescriptionIndex]?.version.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  <div className="flex space-x-1">
                    {englishDescriptions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => onSetDescriptionIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentDescriptionIndex
                            ? 'bg-blue-500 dark:bg-blue-400'
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                        title={`View description from ${englishDescriptions[index]?.version.name}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No description available</p>
          )}
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">The {englishGenus}</p>
      </div>

      {/* Pokedex Data */}
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
          <Ruler className="mr-2" size={20} />
          Pokédex Data
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Height</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{(pokemon.height / 10).toFixed(1)} m</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Weight</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{(pokemon.weight / 10).toFixed(1)} kg</p>
          </div>
        </div>
      </div>

      {/* Abilities */}
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
          <Star className="mr-2" size={20} />
          Abilities
        </h3>
        <div className="space-y-3">
          {pokemon.abilities.map((ability, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                ability.is_hidden 
                  ? 'bg-gradient-to-r from-purple-100 via-pink-50 to-purple-100 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-purple-900/30 border-purple-300 dark:border-purple-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02]' 
                  : 'bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`font-semibold ${ability.is_hidden ? 'text-purple-800 dark:text-purple-200' : 'text-gray-900 dark:text-gray-100'}`}>
                  {formatPokemonName(ability.ability.name)}
                </span>
                {ability.is_hidden && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-purple-600 dark:text-purple-300 font-medium">Rare Ability</span>
                  </div>
                )}
              </div>
              {ability.is_hidden && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-bold shadow-md animate-pulse">
                    ✨ Hidden
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Training */}
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
          <Zap className="mr-2" size={20} />
          Training
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">EV Yield</span>
            <div className="space-y-1">
              {pokemon.stats.filter(stat => stat.effort > 0).length > 0 ? (
                pokemon.stats.filter(stat => stat.effort > 0).map((stat, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      +{stat.effort} {formatPokemonName(stat.stat.name)}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-700 dark:text-gray-300">No EV yield</span>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Catch Rate</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{species.capture_rate}</p>
            <div className="space-y-1">
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>🔴 Poké Ball:</span>
                  <span className="font-medium">{((species.capture_rate / 255) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>💙 Great Ball:</span>
                  <span className="font-medium">{Math.min(((species.capture_rate / 255) * 100 * 1.5), 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>💜 Ultra Ball:</span>
                  <span className="font-medium">{Math.min(((species.capture_rate / 255) * 100 * 2), 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>🖤 Master Ball:</span>
                  <span className="font-medium">100%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Base Friendship</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{species.base_happiness}</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Base Exp.</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{pokemon.base_experience}</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Growth Rate</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
              {GROWTH_RATES[species.growth_rate.name] || formatPokemonName(species.growth_rate.name)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
