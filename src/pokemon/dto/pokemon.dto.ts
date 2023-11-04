import { PartialType } from '@nestjs/mapped-types';
import { Type, Move, Sprites, Stat } from '../types/pokemon.type';
import { IsNotEmpty } from 'class-validator';
import { errMsg } from 'src/constants/errorMessages';

export class CreatePokemonDto {
  height: number;
  moves: Move[];
  @IsNotEmpty({ message: errMsg.notEmpty })
  name: string;
  order: number;
  sprites: Sprites;
  stats: Stat[];
  types: Type[];
  weight: number;
}

export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {}
