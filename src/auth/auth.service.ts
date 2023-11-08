import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LogInDto, RegisterDto } from './dto/auth.dto';
import { errMsg } from 'src/constants/errorMessages';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserPayload } from 'src/types/userPayload.type';
import { LoggerService } from 'src/logger/logger.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly log: LoggerService,
  ) {}

  async register(userDto: RegisterDto) {
    const user = await this.userService.create(userDto);

    return user;
  }

  async logIn(userDto: LogInDto) {
    const user = await this._validateUser(userDto);
    const tokens = await this.generateTokens({
      email: user.email,
      id: user._id.toString(),
      userName: user.userName,
    });
    tokens['user'] = user;
    this.log.verbose(`user ${user.email} loged in`, AuthService.name);
    return tokens;
  }

  private async _validateUser(userDto: LogInDto) {
    const user = await this.userService.findByEmail(userDto.email);

    if (user && (await compare(userDto.password, user.password))) {
      const { password, ...res } = user;
      return res;
    }
    throw new UnauthorizedException(errMsg.credsInvalid);
  }

  async generateTokens({ email, id, userName }: UserPayload) {
    const jwtPayload = {
      userName,
      email,
      id,
    };

    return {
      tokens: {
        accesToken: await this.jwtService.signAsync(jwtPayload, {
          expiresIn: '1h',
          secret: process.env.JWT_SECRET,
        }),
        refreshToken: await this.jwtService.signAsync(jwtPayload, {
          expiresIn: '1d',
          secret: process.env.JWT_SECRET,
        }),
      },
    };
  }
}
