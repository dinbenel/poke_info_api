import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as schema } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Sprites {
  @Prop({})
  back_default: string;
  @Prop({})
  back_shiny: string;
  @Prop({})
  front_default: string;
  @Prop({})
  front_shiny: string;
}

export type SpriteDocument = HydratedDocument<Sprites>;
export const spriteSchema = SchemaFactory.createForClass(Sprites);
