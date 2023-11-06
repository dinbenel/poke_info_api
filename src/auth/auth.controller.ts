import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/user.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }
  @Post('logIn')
  logIn(@Body() userDto: CreateUserDto) {
    return this.authService.signIn(userDto);
  }
}
