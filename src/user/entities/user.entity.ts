import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  firstName: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: true })
  userName: string;
  @Prop({ unique: true, required: true, index: true })
  email: string;
  @Prop({ required: true })
  password: number;
  @Prop()
  avatar: string;
}

export type UserDocument = HydratedDocument<User>;
export const userSchema = SchemaFactory.createForClass(User);
