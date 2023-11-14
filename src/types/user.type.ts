import { User } from 'src/user/entities/user.entity';

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

export interface JWTPayload {
  userName: string;
  sub: Sub;
  iat: number;
  exp: number;
}

interface Sub {
  name: string;
  _id: string;
}
