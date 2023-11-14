import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { LocalGuard } from './guards/local.guard';
import { RefreshJwtGuard } from './guards/jwtRefresh.guard';
import { JwtAccessStrategy } from './strategy/jwtAccess.strategy';
@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() userDto: RegisterDto) {
    return this.authService.register(userDto);
  }

  @UseGuards(JwtAccessStrategy)
  @UseGuards(LocalGuard)
  @Post('login')
  logIn(@Request() req) {
    return this.authService.logIn(req.user);
  }

  // @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  refreshToken(@Request() req) {
    const { email, _id, userName } = req.user;
    return this.authService.generateTokens({ email, _id, userName });
  }
}
