import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LogInDto, RegisterDto } from './dto/auth.dto';
import { errMsg } from 'src/constants/errorMessages';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import {
  Tokens,
  UserDbNoPassword,
  UserDbPayload,
  UserReturnType,
} from 'src/types/user.type';
import { LoggerService } from 'src/logger/logger.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly log: LoggerService,
  ) {}

  async register(userDto: RegisterDto): Promise<UserReturnType> {
    const user = await this.userService.create(userDto);

    const tokens = await this.generateTokens({
      email: user.email,
      _id: user._id.toString(),
      userName: user.userName,
    });

    return {
      user,
      tokens,
    };
  }

  async logIn(user: UserDbPayload): Promise<UserReturnType> {
    const tokens = await this.generateTokens({
      email: user.email,
      _id: user._id.toString(),
      userName: user.userName,
    });

    this.log.verbose(`user ${user.email} loged in`, AuthService.name);
    const { password, ...rest } = user;
    return {
      tokens,
      user: rest,
    };
  }

  async validateUser(userDto: LogInDto): Promise<UserDbPayload> {
    const user = await this.userService.findByEmail(userDto.email);

    if (user && (await compare(userDto.password, user.password))) {
      return {
        ...user,
        _id: user._id.toString(),
      };
    }
    throw new UnauthorizedException(errMsg.credsInvalid);
  }

  async generateTokens({ email, _id, userName }): Promise<Tokens> {
    const jwtPayload = {
      userName: email,
      sub: {
        name: userName,
        _id,
      },
    };
    //
    const accessPrm = this.jwtService.signAsync(jwtPayload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });
    const refreshPrm = this.jwtService.signAsync(jwtPayload, {
      expiresIn: '1d',
      secret: process.env.JWT_REFRESH_SECRET,
    });
    const [accessToken, refreshToken] = await Promise.all([
      accessPrm,
      refreshPrm,
    ]);
    const tokens = {
      accessToken,
      refreshToken,
    };

    return tokens;
  }
}
