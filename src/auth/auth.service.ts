import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(userDto: CreateUserDto) {
    const user = await this.userService.create(userDto);

    return user;
  }

  async signIn(userDto: CreateUserDto) {
    // const user = await this.userService.create(userDto);

    return `This action returns a #$ auth`;
  }
}
