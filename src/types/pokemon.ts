export interface Pokemon {
  id: number;
  name: string;
  species: {
    name: string;
    url: string;
  };
  sprites: {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    other: {
      'official-artwork': {
        front_default: string | null;
        front_shiny: string | null;
      };
      dream_world: {
        front_default: string | null;
        front_female: string | null;
      };
      home: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
      showdown: {
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
    };
  };
  types: PokemonType[];
  stats: PokemonStat[];
  height: number;
  weight: number;
  base_experience: number;
  abilities: PokemonAbility[];
  moves: PokemonMove[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: {
    level_learned_at: number;
    move_learn_method: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }[];
}

export interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: FlavorTextEntry[];
  genera: Genera[];
  evolution_chain: {
    url: string;
  };
  varieties: PokemonVariety[];
  egg_groups: EggGroup[];
  gender_rate: number;
  hatch_counter: number;
  base_happiness: number;
  capture_rate: number;
  growth_rate: {
    name: string;
    url: string;
  };
  habitat: {
    name: string;
    url: string;
  } | null;
}

export interface PokemonVariety {
  is_default: boolean;
  pokemon: {
    name: string;
    url: string;
  };
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
    url: string;
  };
  version: {
    name: string;
    url: string;
  };
}

export interface Genera {
  genus: string;
  language: {
    name: string;
    url: string;
  };
}

export interface EggGroup {
  name: string;
  url: string;
}

export interface EvolutionChain {
  id: number;
  chain: EvolutionChainLink;
}

export interface EvolutionChainLink {
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  };
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionDetail {
  trigger: {
    name: string;
    url: string;
  };
  min_level?: number;
  min_happiness?: number;
  min_beauty?: number;
  min_affection?: number;
  time_of_day?: string;
  item?: {
    name: string;
    url: string;
  };
  held_item?: {
    name: string;
    url: string;
  };
  known_move?: {
    name: string;
    url: string;
  };
  known_move_type?: {
    name: string;
    url: string;
  };
  location?: {
    name: string;
    url: string;
  };
  party_species?: {
    name: string;
    url: string;
  };
  party_type?: {
    name: string;
    url: string;
  };
  relative_physical_stats?: number;
  trade_species?: {
    name: string;
    url: string;
  };
  turn_upside_down?: boolean;
}

export interface TypeEffectiveness {
  damage_relations: {
    double_damage_from: TypeRelation[];
    double_damage_to: TypeRelation[];
    half_damage_from: TypeRelation[];
    half_damage_to: TypeRelation[];
    no_damage_from: TypeRelation[];
    no_damage_to: TypeRelation[];
  };
}

export interface TypeRelation {
  name: string;
  url: string;
}

export interface Move {
  id: number;
  name: string;
  type: {
    name: string;
    url: string;
  };
  power: number | null;
  pp: number;
  accuracy: number | null;
  damage_class: {
    name: string;
    url: string;
  };
  effect_entries: {
    effect: string;
    short_effect: string;
    language: {
      name: string;
      url: string;
    };
  }[];
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}
