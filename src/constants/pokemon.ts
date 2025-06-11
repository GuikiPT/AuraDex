export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fighting: '#C03028',
  flying: '#A890F0',
  poison: '#A040A0',
  ground: '#E0C068',
  rock: '#B8A038',
  bug: '#A8B820',
  ghost: '#705898',
  steel: '#B8B8D0',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  psychic: '#F85888',
  ice: '#98D8D8',
  dragon: '#7038F8',
  dark: '#705848',
  fairy: '#EE99AC',
};

export const STAT_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  speed: 'Speed',
};

export const GENERATION_RANGES = [
  { name: 'Generation I', start: 1, end: 151 },
  { name: 'Generation II', start: 152, end: 251 },
  { name: 'Generation III', start: 252, end: 386 },
  { name: 'Generation IV', start: 387, end: 493 },
  { name: 'Generation V', start: 494, end: 649 },
  { name: 'Generation VI', start: 650, end: 721 },
  { name: 'Generation VII', start: 722, end: 809 },
  { name: 'Generation VIII', start: 810, end: 905 },
  { name: 'Generation IX', start: 906, end: 1025 },
];

export const TYPE_EFFECTIVENESS_MULTIPLIERS = {
  0: 'No effect',
  0.25: '¼× damage',
  0.5: '½× damage',
  1: 'Normal damage',
  2: '2× damage',
  4: '4× damage',
};

export const EGG_GROUP_NAMES: Record<string, string> = {
  monster: 'Monster',
  water1: 'Water 1',
  water2: 'Water 2',
  water3: 'Water 3',
  bug: 'Bug',
  flying: 'Flying',
  field: 'Field',
  fairy: 'Fairy',
  grass: 'Grass',
  'human-like': 'Human-Like',
  mineral: 'Mineral',
  amorphous: 'Amorphous',
  ditto: 'Ditto',
  dragon: 'Dragon',
  'no-eggs': 'Undiscovered',
};

export const GROWTH_RATES: Record<string, string> = {
  slow: 'Slow',
  medium: 'Medium',
  fast: 'Fast',
  'medium-slow': 'Medium Slow',
  'slow-then-very-fast': 'Slow then Very Fast',
  'fast-then-very-slow': 'Fast then Very Slow',
};
