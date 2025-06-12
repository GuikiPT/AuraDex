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

export const VERSION_GROUPS: Record<string, { name: string; generation: number; games: string[]; order: number }> = {
  'red-blue': { name: 'Red/Blue', generation: 1, games: ['Red', 'Blue'], order: 1 },
  'yellow': { name: 'Yellow', generation: 1, games: ['Yellow'], order: 2 },
  'gold-silver': { name: 'Gold/Silver', generation: 2, games: ['Gold', 'Silver'], order: 3 },
  'crystal': { name: 'Crystal', generation: 2, games: ['Crystal'], order: 4 },
  'ruby-sapphire': { name: 'Ruby/Sapphire', generation: 3, games: ['Ruby', 'Sapphire'], order: 5 },
  'emerald': { name: 'Emerald', generation: 3, games: ['Emerald'], order: 6 },
  'firered-leafgreen': { name: 'FireRed/LeafGreen', generation: 3, games: ['FireRed', 'LeafGreen'], order: 7 },
  'diamond-pearl': { name: 'Diamond/Pearl', generation: 4, games: ['Diamond', 'Pearl'], order: 8 },
  'platinum': { name: 'Platinum', generation: 4, games: ['Platinum'], order: 9 },
  'heartgold-soulsilver': { name: 'HeartGold/SoulSilver', generation: 4, games: ['HeartGold', 'SoulSilver'], order: 10 },
  'black-white': { name: 'Black/White', generation: 5, games: ['Black', 'White'], order: 11 },
  'colosseum': { name: 'Colosseum', generation: 3, games: ['Colosseum'], order: 12 },
  'xd': { name: 'XD: Gale of Darkness', generation: 3, games: ['XD'], order: 13 },
  'black-2-white-2': { name: 'Black 2/White 2', generation: 5, games: ['Black 2', 'White 2'], order: 14 },
  'x-y': { name: 'X/Y', generation: 6, games: ['X', 'Y'], order: 15 },
  'omega-ruby-alpha-sapphire': { name: 'Omega Ruby/Alpha Sapphire', generation: 6, games: ['Omega Ruby', 'Alpha Sapphire'], order: 16 },
  'sun-moon': { name: 'Sun/Moon', generation: 7, games: ['Sun', 'Moon'], order: 17 },
  'ultra-sun-ultra-moon': { name: 'Ultra Sun/Ultra Moon', generation: 7, games: ['Ultra Sun', 'Ultra Moon'], order: 18 },
  'lets-go-pikachu-lets-go-eevee': { name: "Let's Go Pikachu/Eevee", generation: 7, games: ["Let's Go Pikachu", "Let's Go Eevee"], order: 19 },
  'sword-shield': { name: 'Sword/Shield', generation: 8, games: ['Sword', 'Shield'], order: 20 },
  'the-isle-of-armor': { name: 'The Isle of Armor', generation: 8, games: ['Isle of Armor'], order: 21 },
  'the-crown-tundra': { name: 'The Crown Tundra', generation: 8, games: ['Crown Tundra'], order: 22 },
  'brilliant-diamond-and-shining-pearl': { name: 'Brilliant Diamond/Shining Pearl', generation: 8, games: ['Brilliant Diamond', 'Shining Pearl'], order: 23 },
  'legends-arceus': { name: 'Legends: Arceus', generation: 8, games: ['Legends: Arceus'], order: 24 },
  'scarlet-violet': { name: 'Scarlet/Violet', generation: 9, games: ['Scarlet', 'Violet'], order: 25 },
  'the-teal-mask': { name: 'The Teal Mask', generation: 9, games: ['The Teal Mask'], order: 26 },
  'the-indigo-disk': { name: 'The Indigo Disk', generation: 9, games: ['The Indigo Disk'], order: 27 },
};

export const MOVE_CATEGORIES: Record<string, { name: string; color: string; icon: string }> = {
  physical: { name: 'Physical', color: '#C92A2A', icon: '💥' },
  special: { name: 'Special', color: '#5F3DC4', icon: '🌟' },
  status: { name: 'Status', color: '#868E96', icon: '💫' },
};

export const MOVE_LEARN_METHODS: Record<string, { name: string; color: string; icon: string }> = {
  'level-up': { name: 'Level Up', color: '#37B24D', icon: '📈' },
  machine: { name: 'TM/TR', color: '#1971C2', icon: '💿' },
  egg: { name: 'Egg Move', color: '#F76707', icon: '🥚' },
  tutor: { name: 'Move Tutor', color: '#7048E8', icon: '🎓' },
  stadium: { name: 'Stadium', color: '#495057', icon: '🏟️' },
  light: { name: 'Colosseum/XD', color: '#6741D9', icon: '💎' },
  form: { name: 'Form Change', color: '#E03131', icon: '🔄' },
};
