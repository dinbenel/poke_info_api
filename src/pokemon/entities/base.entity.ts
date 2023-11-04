import { Prop } from '@nestjs/mongoose';

export class Base {
  @Prop()
  name: string;
  @Prop()
  url: string;
}
