import { Interface } from 'readline';
import { User, UserDocument } from 'src/user/entities/user.entity';

export interface UserDbPayload extends User {
  _id: string;
}

export type UserDbNoPassword = Omit<UserDbPayload, 'password'>;

export interface UserReturnType {
  user: UserDbNoPassword;
  tokens: Tokens;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
