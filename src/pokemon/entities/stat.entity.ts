import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Stat {
  @Prop()
  effort: number;
  @Prop()
  attack: string;
  @Prop()
  defense: string;
  @Prop()
  hp: string;
  @Prop()
  'special-attack': string;
  @Prop()
  'special-defense': string;
  @Prop()
  speed: string;
  @Prop()
  name: string;
}

export type StateDocument = HydratedDocument<Stat>;
export const stateSchema = SchemaFactory.createForClass(Stat);
