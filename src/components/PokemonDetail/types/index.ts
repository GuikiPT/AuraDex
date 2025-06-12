import { Pokemon, PokemonSpecies, EvolutionChain, Move, PokemonEncounter, LocationArea } from '@/types/pokemon';

export interface PokemonDetailProps {
  pokemonId: string;
}

export type TabId = 'overview' | 'stats' | 'type-defenses' | 'breeding' | 'evolution' | 'moves' | 'locations';

export interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface PokemonDetailState {
  pokemon: Pokemon | null;
  species: PokemonSpecies | null;
  evolutionChain: EvolutionChain | null;
  megaEvolutions: Pokemon[];
  megaEvolutionsLoading: boolean;
  typeEffectiveness: Record<string, number>;
  loading: boolean;
}

export interface MoveDetailState {
  moveDetails: Record<string, Move | { loading: boolean }>;
  selectedMove: Move | null;
  showMoveModal: boolean;
}

export interface EncounterState {
  encounters: PokemonEncounter[];
  encountersLoading: boolean;
  locationDetails: Record<string, LocationArea>;
  locationFilter: string;
  selectedVersionGroup: string;
}

export interface ModalState {
  showSpritesModal: boolean;
  showMoveModal: boolean;
  showMegaModal: boolean;
  selectedMegaEvolution: Pokemon | null;
}

export interface UIState {
  activeTab: TabId;
  currentDescriptionIndex: number;
  statChartVariant: 'horizontal' | 'radial';
}

export interface UsePokemonDetailReturn extends PokemonDetailState {
  fetchPokemonData: () => Promise<void>;
}

export interface UseMoveDetailsReturn extends MoveDetailState {
  loadMoveDetails: (moveName: string) => Promise<void>;
  batchLoadMoves: (moveNames: string[]) => Promise<void>;
  openMoveModal: (moveName: string) => Promise<void>;
  setSelectedMove: (move: Move | null) => void;
  setShowMoveModal: (show: boolean) => void;
}

export interface UseEncountersReturn extends EncounterState {
  fetchEncounterData: () => Promise<void>;
  setLocationFilter: (filter: string) => void;
  setSelectedVersionGroup: (version: string) => void;
}
