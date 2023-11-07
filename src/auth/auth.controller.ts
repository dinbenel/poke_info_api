import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto, RegisterDto } from './dto/auth.dto';

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
}
