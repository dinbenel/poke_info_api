import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { ApiTags } from '@nestjs/swagger';
import { AddFavDto, UpdatePokemonDto } from './dto/pokemon.dto';
@ApiTags('Pokemon')
@Controller('api/pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  findAll() {
    return this.pokemonService.findAll();
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
