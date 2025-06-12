import React from 'react';
import { PokemonEncounter } from '@/types/pokemon';
import LoadingSpinner from '../../LoadingSpinner';

interface LocationsTabProps {
  encounters: PokemonEncounter[];
  encountersLoading: boolean;
  // Additional props will be added when fully implementing
}

export const LocationsTab: React.FC<LocationsTabProps> = ({ 
  encounters, 
  encountersLoading 
}) => {
  if (encountersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading encounter data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Wild Encounters
        </h3>
        {encounters.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No wild encounter data available for this Pokémon.
          </p>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Location details will be implemented in the full refactor. 
            This Pokemon has {encounters.length} encounter locations.
          </p>
        )}
      </div>
    </div>
  );
};
