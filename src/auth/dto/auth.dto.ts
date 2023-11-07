import { IsEmail, IsString } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/user.dto';

export class RegisterDto extends CreateUserDto {}

export class LogInDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
