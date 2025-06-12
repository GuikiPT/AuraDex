import React from 'react';
import { Pokemon } from '@/types/pokemon';

interface MovesTabProps {
  pokemon: Pokemon;
  // Additional props will be added when fully implementing
}

export const MovesTab: React.FC<MovesTabProps> = ({ pokemon }) => {
  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Moves Learned
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Move details will be implemented in the full refactor. 
          This Pokemon can learn {pokemon.moves.length} different moves.
        </p>
      </div>
    </div>
  );
};
