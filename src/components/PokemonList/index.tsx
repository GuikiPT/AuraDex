'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Pokemon } from '@/types/pokemon';
import { usePokemonData, usePokemonFilters, useInfiniteScroll } from './hooks';
import { FiltersSection, PokemonGrid, LoadingState, EmptyState, LoadMoreButton } from './components';
import Header from '../Header';

const PokemonList = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    pokemonList,
    loading,
    hasMore,
    loadPokemon,
    loadMoreHandler
  } = usePokemonData();

  const {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedGeneration,
    setSelectedGeneration,
    filteredPokemon
  } = usePokemonFilters(pokemonList);

  // Initialize data loading
  useEffect(() => {
    loadPokemon();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle generation changes
  const handleGenerationChange = async (generation: string) => {
    setSelectedGeneration(generation);
    
    if (generation) {
      const [start, end] = generation.split('-').map(Number);
      await loadPokemon(false, { start, end });
    } else {
      await loadPokemon(false);
    }
  };

  // Set up infinite scroll
  useInfiniteScroll(loadMoreRef, loading, hasMore, () => {
    if (selectedGeneration) {
      const [start, end] = selectedGeneration.split('-').map(Number);
      loadMoreHandler(true, { start, end });
    } else {
      loadMoreHandler(true);
    }
  });

  const handlePokemonClick = (pokemon: Pokemon) => {
    router.push(`/pokemon/${pokemon.id}`);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedGeneration('');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Background */}
      <div className="fixed inset-0 bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 animate-gradient" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      
      <div className="relative z-10">
        {/* Header */}
        <Header onSearchChange={setSearchTerm} searchTerm={searchTerm} />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20 filters-container">
          {/* Filters Section */}
          <FiltersSection
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedGeneration={selectedGeneration}
            onGenerationChange={handleGenerationChange}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {/* Pokemon Content */}
          {loading && pokemonList.length === 0 ? (
            <LoadingState />
          ) : (
            <>
              <PokemonGrid
                pokemonList={filteredPokemon}
                viewMode={viewMode}
                onPokemonClick={handlePokemonClick}
              />

              {/* Infinite Scroll Trigger */}
              <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
                {loading && pokemonList.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <span>Loading more Pokémon...</span>
                  </div>
                )}
              </div>

              {/* Load More Button */}
              <LoadMoreButton
                hasMore={hasMore}
                loading={loading}
                searchTerm={searchTerm}
                selectedType={selectedType}
                selectedGeneration={selectedGeneration}
                onLoadMore={loadMoreHandler}
              />

              {/* Empty State */}
              {filteredPokemon.length === 0 && !loading && (
                <EmptyState onClearFilters={clearAllFilters} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonList;
