import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, pokemonSchema } from './entities/pokemon.entity';
import { Sprites, spriteSchema } from './entities/sprite.entity';
import { Type, typeSchema } from './entities/type.entity';
import { Move, moveSchema } from './entities/nove.entity';
import { Stat, stateSchema } from './entities/stat.entity';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pokemon.name, schema: pokemonSchema },
      { name: Sprites.name, schema: spriteSchema },
      { name: Type.name, schema: typeSchema },
      { name: Move.name, schema: moveSchema },
      { name: Stat.name, schema: stateSchema },
    ]),
  ],
  controllers: [PokemonController],
  providers: [PokemonService, LoggerService],
})
export class PokemonModule {}
