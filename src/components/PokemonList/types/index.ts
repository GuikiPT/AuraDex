import { Pokemon } from '@/types/pokemon';

export interface PokemonRange {
  start: number;
  end: number;
}

export type ViewMode = 'grid' | 'list';

export interface UsePokemonDataReturn {
  pokemonList: Pokemon[];
  loading: boolean;
  hasMore: boolean;
  generationOffset: number;
  loadPokemon: (loadMore?: boolean, specificRange?: PokemonRange) => Promise<void>;
  loadMoreHandler: (loadMore?: boolean, specificRange?: PokemonRange) => void;
}

export interface UsePokemonFiltersReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedGeneration: string;
  setSelectedGeneration: (generation: string) => void;
  filteredPokemon: Pokemon[];
}
