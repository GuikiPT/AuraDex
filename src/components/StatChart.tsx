'use client';

import { PokemonStat } from '@/types/pokemon';
import { STAT_NAMES } from '@/constants/pokemon';

interface StatChartProps {
  stats: PokemonStat[];
  variant?: 'horizontal' | 'radial';
}

const StatChart = ({ stats, variant = 'horizontal' }: StatChartProps) => {
  if (variant === 'horizontal') {
    return (
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const maxStat = 255;
          const percentage = (stat.base_stat / maxStat) * 100;
          const statName = STAT_NAMES[stat.stat.name] || stat.stat.name;
          
          // Color based on stat value
          let barColor = 'bg-red-500';
          if (stat.base_stat >= 100) barColor = 'bg-green-500';
          else if (stat.base_stat >= 70) barColor = 'bg-yellow-500';
          else if (stat.base_stat >= 50) barColor = 'bg-orange-500';
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{statName}</span>
                <span className="text-sm font-bold text-gray-900">{stat.base_stat}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${barColor} transition-all duration-500 ease-out rounded-full`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-bold text-lg text-gray-900">
              {stats.reduce((total, stat) => total + stat.base_stat, 0)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Radial variant could be implemented here for a more advanced visualization
  return null;
};

export default StatChart;
