import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from './base.entity';

@Schema()
export class Move extends Base {}

export type MoveDocument = HydratedDocument<Move>;
export const moveSchema = SchemaFactory.createForClass(Move);
