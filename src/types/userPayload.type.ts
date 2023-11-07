import { User } from 'src/user/entities/user.entity';

export interface UserPayload extends Pick<User, 'email' | 'userName'> {
  id: string;
}
