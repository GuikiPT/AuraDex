import React from 'react';
import { Baby } from 'lucide-react';
import { PokemonSpecies } from '@/types/pokemon';
import { formatPokemonName } from '@/utils/pokemon-api';
import { EGG_GROUP_NAMES } from '@/constants/pokemon';

interface BreedingTabProps {
  species: PokemonSpecies;
}

export const BreedingTab: React.FC<BreedingTabProps> = ({ species }) => {
  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
          <Baby className="mr-2" size={20} />
          Breeding
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Egg Groups</span>
            <div className="space-y-2">
              {species.egg_groups.map((group, index) => (
                <div key={index} className="inline-block mr-2 mb-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium">
                    {EGG_GROUP_NAMES[group.name] || formatPokemonName(group.name)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Gender Ratio</span>
            <div className="space-y-2">
              {species.gender_rate === -1 ? (
                <div className="px-3 py-1 bg-gray-500 text-white rounded-full text-sm font-medium inline-block">
                  Genderless
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{((8 - species.gender_rate) / 8 * 100).toFixed(1)}% ♂</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{(species.gender_rate / 8 * 100).toFixed(1)}% ♀</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Egg Cycles</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{species.hatch_counter}</p>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Base Happiness</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{species.base_happiness}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
