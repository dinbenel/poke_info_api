import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsString, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsEmail({})
  email: string;
  @IsString()
  @Min(4)
  @Max(10)
  password: string;
}

export class UpdateUserDto {}
