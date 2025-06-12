import React from 'react';
import { Filter, Grid3X3, List } from 'lucide-react';
import { formatPokemonName } from '@/utils/pokemon-api';
import GenerationFilter from '../../GenerationFilter';
import { ViewMode } from '../types';

interface FiltersSectionProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedGeneration: string;
  onGenerationChange: (generation: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const allTypes = [
  'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
  'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
];

export const FiltersSection: React.FC<FiltersSectionProps> = ({
  selectedType,
  setSelectedType,
  selectedGeneration,
  onGenerationChange,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="glass rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 mb-8">
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* Type Filter */}
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="glass rounded-xl border border-white/20 dark:border-gray-700/50 px-4 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 bg-white/50 dark:bg-gray-900/50"
          >
            <option value="">All Types</option>
            {allTypes.map(type => (
              <option key={type} value={type}>
                {formatPokemonName(type)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Generation Filter */}
        <GenerationFilter 
          selectedGeneration={selectedGeneration}
          onGenerationChange={onGenerationChange}
        />

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 glass rounded-xl p-1 border border-white/20 dark:border-gray-700/50 ml-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-3 rounded-lg transition-all duration-200 ${
              viewMode === 'grid' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/10'
            }`}
            aria-label="Grid view"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-3 rounded-lg transition-all duration-200 ${
              viewMode === 'list' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/10'
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
