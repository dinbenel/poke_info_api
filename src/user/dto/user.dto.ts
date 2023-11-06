import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsString, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsEmail({})
  email: string;
  @IsString()
  password: string;
  @IsString()
  userName: string;
}

export class UpdateUserDto {}
