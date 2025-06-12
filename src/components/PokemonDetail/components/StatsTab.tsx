import React from 'react';
import { Zap, BarChart, Activity } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';
import StatChart from '../../StatChart';

interface StatsTabProps {
  pokemon: Pokemon;
  statChartVariant: 'horizontal' | 'radial';
  onStatChartVariantChange: (variant: 'horizontal' | 'radial') => void;
}

export const StatsTab: React.FC<StatsTabProps> = ({
  pokemon,
  statChartVariant,
  onStatChartVariantChange
}) => {
  return (
    <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Zap className="mr-2" size={20} />
          Base Stats
        </h3>
        <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 rounded-lg p-1 border border-white/30 dark:border-gray-700/30">
          <button
            onClick={() => onStatChartVariantChange('horizontal')}
            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              statChartVariant === 'horizontal'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            title="Horizontal chart view"
          >
            <BarChart size={16} />
            <span>Bars</span>
          </button>
          <button
            onClick={() => onStatChartVariantChange('radial')}
            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              statChartVariant === 'radial'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            title="Radial chart view"
          >
            <Activity size={16} />
            <span>Radar</span>
          </button>
        </div>
      </div>
      <StatChart stats={pokemon.stats} variant={statChartVariant} />
    </div>
  );
};
