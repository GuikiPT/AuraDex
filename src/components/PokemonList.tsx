'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Filter, Grid3X3, List } from 'lucide-react';
import { Pokemon, PokemonListResponse } from '@/types/pokemon';
import { pokemonApi, formatPokemonName } from '@/utils/pokemon-api';
import Header from './Header';
import PokemonCard from './PokemonCard';
import TypeBadge from './TypeBadge';
import GenerationFilter from './GenerationFilter';

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hasMore, setHasMore] = useState(true);
  const [generationOffset, setGenerationOffset] = useState(0);
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const POKEMON_PER_PAGE = 20;

  const loadPokemon = async (loadMore = false, specificRange?: { start: number; end: number }) => {
    try {
      setLoading(true);
      
      if (specificRange) {
        // Load paginated Pokemon for generation filtering
        const currentOffset = loadMore ? generationOffset : 0;
        const startId = specificRange.start + currentOffset;
        const endId = Math.min(startId + POKEMON_PER_PAGE - 1, specificRange.end);
        
        if (startId > specificRange.end) {
          setHasMore(false);
          setLoading(false);
          return;
        }
        
        const pokemonPromises = [];
        for (let i = startId; i <= endId; i++) {
          pokemonPromises.push(pokemonApi.getPokemon(i.toString()));
        }
        
        const pokemonData = await Promise.all(pokemonPromises);
        
        if (loadMore) {
          setPokemonList(prev => [...prev, ...pokemonData]);
          setGenerationOffset(prev => prev + POKEMON_PER_PAGE);
        } else {
          setPokemonList(pokemonData);
          setGenerationOffset(POKEMON_PER_PAGE);
        }
        
        setHasMore(endId < specificRange.end);
      } else {
        // Regular pagination loading
        const offset = loadMore ? pokemonList.length : 0;
        const response: PokemonListResponse = await pokemonApi.getPokemonList(offset, POKEMON_PER_PAGE);
        
        // Fetch detailed data for each Pokemon
        const pokemonPromises = response.results.map(p => pokemonApi.getPokemon(p.name));
        const pokemonData = await Promise.all(pokemonPromises);
        
        if (loadMore) {
          setPokemonList(prev => [...prev, ...pokemonData]);
        } else {
          setPokemonList(pokemonData);
        }
        
        setHasMore(response.next !== null);
      }
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPokemon = () => {
    let filtered = pokemonList;

    // For generation filtering, we don't filter here since we load specific generation Pokemon
    // Only apply search and type filters to the loaded Pokemon
    if (searchTerm) {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.id.toString().includes(searchTerm)
      );
    }

    if (selectedType) {
      filtered = filtered.filter(pokemon =>
        pokemon.types.some(type => type.type.name === selectedType)
      );
    }

    setFilteredPokemon(filtered);
  };

  const handleGenerationChange = async (generation: string) => {
    setSelectedGeneration(generation);
    setGenerationOffset(0);
    
    if (generation) {
      const [start, end] = generation.split('-').map(Number);
      // Load first page of this generation
      await loadPokemon(false, { start, end });
    } else {
      // Load regular Pokemon list when "All Generations" is selected
      await loadPokemon(false);
    }
  };

  useEffect(() => {
    loadPokemon();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    filterPokemon();
  }, [pokemonList, searchTerm, selectedType]); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll implementation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMoreHandler();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loading, hasMore, selectedGeneration]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePokemonClick = (pokemon: Pokemon) => {
    router.push(`/pokemon/${pokemon.id}`);
  };

  const loadMoreHandler = () => {
    if (!loading && hasMore) {
      if (selectedGeneration) {
        const [start, end] = selectedGeneration.split('-').map(Number);
        loadPokemon(true, { start, end });
      } else {
        loadPokemon(true);
      }
    }
  };

  const allTypes = [
    'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
    'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
  ];

  const PokemonListItem = ({ pokemon }: { pokemon: Pokemon }) => (
    <div
      onClick={() => handlePokemonClick(pokemon)}
      className="group glass rounded-xl cursor-pointer p-6 hover:scale-[1.02] transition-all duration-300 border border-white/20 dark:border-gray-700/30"
    >
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0 relative">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center overflow-hidden">
            <Image
              src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default || '/placeholder-pokemon.svg'}
              alt={pokemon.name}
              width={60}
              height={60}
              className="object-contain group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-pokemon.svg';
              }}
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:gradient-text transition-all duration-300">
              {formatPokemonName(pokemon.name)}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
              #{pokemon.id.toString().padStart(3, '0')}
            </span>
          </div>
          
          <div className="flex gap-2 mb-3">
            {pokemon.types.map((type, index) => (
              <TypeBadge key={index} type={type.type.name} size="sm" variant="glass" />
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <span className="block text-gray-500 dark:text-gray-400 text-xs">Height</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{(pokemon.height / 10).toFixed(1)} m</span>
            </div>
            <div className="text-center">
              <span className="block text-gray-500 dark:text-gray-400 text-xs">Weight</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{(pokemon.weight / 10).toFixed(1)} kg</span>
            </div>
            <div className="text-center">
              <span className="block text-gray-500 dark:text-gray-400 text-xs">Experience</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{pokemon.base_experience}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Background */}
      <div className="fixed inset-0 bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 animate-gradient" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      
      <div className="relative z-10">
        {/* Header */}
        <Header onSearchChange={setSearchTerm} searchTerm={searchTerm} />

        {/* Filters Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20 filters-container">
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
                onGenerationChange={handleGenerationChange}
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

          {/* Pokemon Grid/List */}
          {loading && pokemonList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animate-reverse" style={{ animationDelay: '0.5s' }} />
              </div>
              <p className="mt-6 text-gray-600 dark:text-gray-400 text-lg">Loading Pokémon...</p>
            </div>
          ) : (
            <>
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 relative z-10'
                  : 'space-y-4 relative z-10'
              }>
                {filteredPokemon.map((pokemon) => 
                  viewMode === 'grid' ? (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                  ) : (
                    <PokemonListItem key={pokemon.id} pokemon={pokemon} />
                  )
                )}
              </div>

              {/* Infinite Scroll Trigger */}
              <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
                {loading && pokemonList.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <span>Loading more Pokémon...</span>
                  </div>
                )}
              </div>

              {/* Load More Button - Only for "All Generations" without filters */}
              {hasMore && !searchTerm && !selectedType && !selectedGeneration && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMoreHandler}
                    disabled={loading}
                    className="group relative px-8 py-4 rounded-xl glass border border-white/20 dark:border-gray-700/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 text-gray-900 dark:text-gray-100 font-semibold"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative">
                      {loading ? 'Loading...' : 'Load More Pokémon'}
                    </span>
                  </button>
                </div>
              )}

              {/* No Results */}
              {filteredPokemon.length === 0 && !loading && (
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
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedType('');
                      setSelectedGeneration('');
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition-transform duration-200 shadow-lg"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonList;
