import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { errMsg } from 'src/constants/errorMessages';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser({
      email: username,
      password,
    });
    if (!user) {
      throw new UnauthorizedException(errMsg.unAthorized);
    }

    return user;
  }
}
