import React from 'react';
import { Shield } from 'lucide-react';
import { formatPokemonName } from '@/utils/pokemon-api';
import TypeIcon from '../../TypeIcon';

interface TypeDefensesTabProps {
  typeEffectiveness: Record<string, number>;
}

export const TypeDefensesTab: React.FC<TypeDefensesTabProps> = ({ typeEffectiveness }) => {
  return (
    <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
        <Shield className="mr-2" size={20} />
        Type Defenses
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Object.entries(typeEffectiveness).map(([type, multiplier]) => {
          let bgColor = 'bg-gray-100 dark:bg-gray-700';
          let textColor = 'text-gray-700 dark:text-gray-300';
          let borderColor = 'border-gray-200 dark:border-gray-600';
          
          if (multiplier === 0) {
            bgColor = 'bg-gray-500 dark:bg-gray-600';
            textColor = 'text-white';
            borderColor = 'border-gray-400 dark:border-gray-500';
          } else if (multiplier === 0.25) {
            bgColor = 'bg-green-600 dark:bg-green-700';
            textColor = 'text-white';
            borderColor = 'border-green-500 dark:border-green-600';
          } else if (multiplier === 0.5) {
            bgColor = 'bg-green-400 dark:bg-green-500';
            textColor = 'text-white';
            borderColor = 'border-green-300 dark:border-green-400';
          } else if (multiplier === 2) {
            bgColor = 'bg-red-400 dark:bg-red-500';
            textColor = 'text-white';
            borderColor = 'border-red-300 dark:border-red-400';
          } else if (multiplier === 4) {
            bgColor = 'bg-red-600 dark:bg-red-700';
            textColor = 'text-white';
            borderColor = 'border-red-500 dark:border-red-600';
          }
          
          return (
            <div 
              key={type} 
              className={`${bgColor} ${textColor} p-4 rounded-lg text-center text-sm border ${borderColor} transition-transform hover:scale-105`} 
              title={`${formatPokemonName(type)} - ${multiplier}× damage`}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <TypeIcon type={type} size={96} />
                <div className="text-xs font-semibold opacity-90">{multiplier}×</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
