import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { ApiTags } from '@nestjs/swagger';
import { AddFavDto, UpdatePokemonDto } from './dto/pokemon.dto';
import { PokemonQueryParams } from './types/pokemon.type';
@ApiTags('Pokemon')
@Controller('api/pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  findAll(@Query() { limit }: PokemonQueryParams) {
    return this.pokemonService.findAll(limit || '');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(id);
  }

  @Post('fav')
  addToFav(@Body() { userId, pokeId }: AddFavDto) {
    return this.pokemonService.addToFav({ pokeId, userId });
  }

  @Post('update')
  updatePokemon(@Body() updateInput: UpdatePokemonDto) {
    return this.pokemonService.update(updateInput);
  }
}
