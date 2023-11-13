import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto, RegisterDto } from './dto/auth.dto';
import { JWTRefreshGuard } from './guards/jwtRefresh.guard';
import { UserPayload } from 'src/types/userPayload.type';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() userDto: RegisterDto) {
    return this.authService.register(userDto);
  }

  @Post('logIn')
  logIn(@Body() userDto: LogInDto) {
    return this.authService.logIn(userDto);
  }

  @UseGuards(JWTRefreshGuard)
  @Post('refresh')
  refreshToken(@Req() req) {
    const { email, id, userName } = req.user as UserPayload;
    return this.authService.generateTokens({ email, id, userName });
  }
}
