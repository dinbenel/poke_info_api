import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PokemonModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
  ],
  providers: [],
})
export class AppModule {}
