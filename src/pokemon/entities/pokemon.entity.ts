import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as schema } from 'mongoose';
import { Sprites } from './sprite.entity';
import { Stat } from './stat.entity';
import { Type } from './type.entity';
import { Move } from './nove.entity';

@Schema({
  timestamps: true,
})
export class Pokemon {
  @Prop({ unique: true, required: true, index: true })
  name: string;
  @Prop({ unique: true, required: true, index: true })
  order: number;
  @Prop()
  height: number;
  @Prop({ type: [{ type: schema.Types.ObjectId, ref: 'Move' }] })
  moves: Move[];
  @Prop({ type: schema.Types.ObjectId, ref: 'Sprites' })
  sprites: Sprites;
  @Prop({ type: { type: schema.Types.ObjectId, ref: 'State' } })
  stats: Stat;
  @Prop({ type: [{ type: schema.Types.ObjectId, ref: 'Type' }] })
  types: Type[];
  @Prop({ index: true })
  weight: number;
}

export type PokemonDocument = HydratedDocument<Pokemon>;
export const pokemonSchema = SchemaFactory.createForClass(Pokemon);
