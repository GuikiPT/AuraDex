'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';
import { pokemonApi, formatPokemonName } from '@/utils/pokemon-api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  onSearchChange?: (query: string) => void;
  searchTerm?: string;
  placeholder?: string;
}

const SearchBar = ({ onSearchChange, searchTerm = '', placeholder = "Search Pokémon..." }: SearchBarProps) => {
  const [query, setQuery] = useState(searchTerm);
  const [results, setResults] = useState<Pokemon[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setQuery(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchPokemon = async () => {
      if (!query || query.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await pokemonApi.searchPokemon(query);
        const validResults = Array.isArray(searchResults) ? searchResults.slice(0, 8) : [];
        setResults(validResults);
        setIsOpen(validResults.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchPokemon, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    onSearchChange?.(value);
  };

  const handlePokemonSelect = (pokemon: Pokemon) => {
    router.push(`/pokemon/${pokemon.id}`);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery('');
    onSearchChange?.('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative group">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
        
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-400 dark:text-gray-500 z-10" />
          
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 rounded-xl glass border border-white/20 dark:border-gray-700/50 focus:border-blue-500/50 dark:focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            onFocus={() => query.length >= 2 && setIsOpen(true)}
          />
          
          <div className="absolute right-4 flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
            {query && !loading && (
              <button
                onClick={clearSearch}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[80] max-h-96 overflow-auto rounded-xl glass border border-white/20 dark:border-gray-700/50 shadow-2xl animate-in">
          {results.map((pokemon) => (
            <button
              key={pokemon.id}
              onClick={() => handlePokemonSelect(pokemon)}
              className="w-full flex items-center gap-4 p-4 hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl border-b border-white/10 dark:border-gray-700/30 last:border-b-0"
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                <Image
                  src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default || '/placeholder-pokemon.svg'}
                  alt={pokemon.name}
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {formatPokemonName(pokemon.name)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  #{pokemon.id.toString().padStart(3, '0')}
                </div>
              </div>
              
              <div className="flex gap-1">
                {pokemon.types.slice(0, 2).map((type) => (
                  <span
                    key={type.type.name}
                    className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[80] p-4 rounded-xl glass border border-white/20 dark:border-gray-700/50 shadow-2xl animate-in">
          <div className="text-center text-gray-500 dark:text-gray-400">
            No Pokémon found for &ldquo;{query}&rdquo;
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
