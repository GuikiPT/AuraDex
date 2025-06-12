import React from 'react';

interface LoadMoreButtonProps {
  hasMore: boolean;
  loading: boolean;
  searchTerm: string;
  selectedType: string;
  selectedGeneration: string;
  onLoadMore: () => void;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  hasMore,
  loading,
  searchTerm,
  selectedType,
  selectedGeneration,
  onLoadMore
}) => {
  // Only show for "All Generations" without filters
  if (!hasMore || searchTerm || selectedType || selectedGeneration) {
    return null;
  }

  return (
    <div className="text-center mt-12">
      <button
        onClick={onLoadMore}
        disabled={loading}
        className="group relative px-8 py-4 rounded-xl glass border border-white/20 dark:border-gray-700/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 text-gray-900 dark:text-gray-100 font-semibold"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative">
          {loading ? 'Loading...' : 'Load More Pokémon'}
        </span>
      </button>
    </div>
  );
};
