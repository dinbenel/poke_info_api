import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from './base.entity';

@Schema()
export class Type extends Base {}

export type TypeDocument = HydratedDocument<Type>;
export const typeSchema = SchemaFactory.createForClass(Type);
