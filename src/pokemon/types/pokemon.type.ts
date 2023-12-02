export interface Pokemon {
  height: number;
  _id: number;
  moves: Move[];
  name: string;
  order: number;
  sprites: Sprites;
  stats: Stat[];
  types: any[];
  weight: number;
}

export interface Type extends Ability {}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: Ability;
}

export interface Sprites {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
}

export interface Move {
  move: Ability;
}

interface Ability {
  name: string;
  url: string;
}

export interface PokemonQueryParams {
  limit?: string;
}
