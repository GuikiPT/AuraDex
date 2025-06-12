# PokemonDetail Component

This folder contains the refactored PokemonDetail component organized into a modular structure.

## Structure

```
PokemonDetail/
├── index.tsx                 # Main component file
├── components/               # UI components for each tab
│   ├── index.ts             # Component exports
│   ├── OverviewTab.tsx      # Overview tab content
│   ├── StatsTab.tsx         # Stats tab content
│   ├── TypeDefensesTab.tsx  # Type defenses tab content
│   ├── BreedingTab.tsx      # Breeding tab content
│   ├── EvolutionTab.tsx     # Evolution tab content
│   ├── MovesTab.tsx         # Moves tab content
│   ├── LocationsTab.tsx     # Locations tab content
│   ├── TabNavigation.tsx    # Tab navigation component
│   └── PokemonHeader.tsx    # Pokemon header with sprites
├── hooks/                   # Custom hooks
│   ├── index.ts            # Hook exports
│   ├── usePokemonDetail.ts # Main pokemon data hook
│   ├── useMoveDetails.ts   # Move details management
│   └── useEncounters.ts    # Encounter data management
└── types/                   # TypeScript types
    └── index.ts            # Component-specific types
```

## Components

### Main Component (`index.tsx`)
- Orchestrates all sub-components and hooks
- Manages active tab state and modals
- Handles navigation and layout
- Provides background styling

### UI Components

- **PokemonHeader**: Pokemon header with sprites, name, types, and back button
- **TabNavigation**: Tab navigation bar with all available tabs
- **OverviewTab**: Basic Pokemon information, description, abilities, training
- **StatsTab**: Base stats with chart visualization
- **TypeDefensesTab**: Type effectiveness chart
- **BreedingTab**: Breeding information and egg groups
- **EvolutionTab**: Evolution chain and mega evolutions
- **MovesTab**: Move learning data by game version
- **LocationsTab**: Wild encounter locations by game

### Custom Hooks

- **usePokemonDetail**: Manages main Pokemon data fetching and state
- **useMoveDetails**: Handles move detail loading and caching
- **useEncounters**: Manages encounter data and location filtering

### Types

- **PokemonDetailProps**: Main component props
- **TabId**: Available tab identifiers
- **MoveDetailState**: Move detail loading states
- **EncounterFilter**: Location and game filtering options

## Benefits of This Structure

1. **Separation of Concerns**: Each tab is a separate component
2. **Reusability**: Components and hooks can be easily reused or modified
3. **Maintainability**: Easier to locate and fix issues in specific tabs
4. **Testability**: Individual components and hooks can be tested in isolation
5. **Type Safety**: Centralized type definitions improve code reliability
6. **Performance**: Individual tab components can be optimized independently

## Usage

The component is exported from `index.tsx` and can be imported as:

```tsx
import PokemonDetail from './PokemonDetail';
// or
import PokemonDetail from './PokemonDetail/index';
```

The original `PokemonDetail.tsx` file can be replaced with this folder structure to maintain the same API.
