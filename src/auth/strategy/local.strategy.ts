import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { errMsg } from 'src/constants/errorMessages';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(userName: string, password: string) {
    const user = await this.authService.validateUser({
      email: userName,
      password,
    });

    if (!user) {
      throw new UnauthorizedException(errMsg.unAthorized);
    }

    return user;
  }
}
