import React from 'react';
import { Filter } from 'lucide-react';

interface EmptyStateProps {
  onClearFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => (
  <div className="text-center py-20">
    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
      <Filter className="w-16 h-16 text-gray-400 dark:text-gray-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
      No Pokémon Found
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">
      No Pokémon match your current search criteria.
    </p>
    <button
      onClick={onClearFilters}
      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition-transform duration-200 shadow-lg"
    >
      Clear All Filters
    </button>
  </div>
);
