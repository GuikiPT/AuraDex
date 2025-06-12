# PokemonList Component

This folder contains the refactored PokemonList component organized into a modular structure.

## Structure

```
PokemonList/
├── index.tsx                 # Main component file
├── components/               # UI components
│   ├── index.ts             # Component exports
│   ├── FiltersSection.tsx   # Filters UI (type, generation, view mode)
│   ├── PokemonGrid.tsx      # Grid/list layout for Pokemon
│   ├── PokemonListItem.tsx  # Individual Pokemon list item
│   ├── LoadingState.tsx     # Loading spinner component
│   ├── EmptyState.tsx       # No results component
│   └── LoadMoreButton.tsx   # Load more functionality
├── hooks/                   # Custom hooks
│   ├── index.ts            # Hook exports
│   ├── usePokemonData.ts   # Pokemon data management
│   ├── usePokemonFilters.ts # Filter logic
│   └── useInfiniteScroll.ts # Infinite scroll functionality
└── types/                   # TypeScript types
    └── index.ts            # Component-specific types
```

## Components

### Main Component (`index.tsx`)
- Orchestrates all sub-components and hooks
- Manages view mode state
- Handles Pokemon click navigation
- Provides layout and background styling

### UI Components

- **FiltersSection**: Type filter, generation filter, and view mode toggle
- **PokemonGrid**: Handles both grid and list view layouts
- **PokemonListItem**: Individual Pokemon card for list view
- **LoadingState**: Loading spinner for initial load
- **EmptyState**: No results message with clear filters option
- **LoadMoreButton**: Load more button (only shown when appropriate)

### Custom Hooks

- **usePokemonData**: Manages Pokemon data fetching, pagination, and loading states
- **usePokemonFilters**: Handles search, type, and generation filtering
- **useInfiniteScroll**: Implements infinite scroll functionality

### Types

- **PokemonRange**: Interface for generation ranges
- **ViewMode**: Type for grid/list view modes
- **UsePokemonDataReturn**: Return type for usePokemonData hook
- **UsePokemonFiltersReturn**: Return type for usePokemonFilters hook

## Benefits of This Structure

1. **Separation of Concerns**: Each file has a single responsibility
2. **Reusability**: Components and hooks can be easily reused or modified
3. **Maintainability**: Easier to locate and fix issues
4. **Testability**: Individual components and hooks can be tested in isolation
5. **Type Safety**: Centralized type definitions improve code reliability
6. **Code Organization**: Clear folder structure makes navigation intuitive

## Usage

The component is exported from `index.tsx` and can be imported as:

```tsx
import PokemonList from './PokemonList';
// or
import PokemonList from './PokemonList/index';
```

The original `PokemonList.tsx` file now re-exports from the folder structure to maintain backward compatibility.
