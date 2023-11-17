import { PartialType } from '@nestjs/mapped-types';
import { Type, Move, Sprites, Stat } from '../types/pokemon.type';
import { IsNotEmpty, IsString, IsArray, IsNumber } from 'class-validator';
import { errMsg } from 'src/constants/errorMessages';

export class CreatePokemonDto {
  @IsNumber()
  @IsNotEmpty()
  height: number;

  @IsNotEmpty()
  @IsArray()
  moves: Move[];

  @IsNotEmpty({ message: errMsg.notEmpty })
  @IsString()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsNotEmpty()
  sprites: Sprites;

  @IsArray()
  @IsNotEmpty()
  stats: Stat[];

  @IsArray()
  @IsNotEmpty()
  types: Type[];

  @IsNumber()
  @IsNotEmpty()
  weight: number;
}

export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {
  @IsNotEmpty()
  @IsString()
  pokeId: string;
}

export class AddFavDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  pokeId: string;
}
