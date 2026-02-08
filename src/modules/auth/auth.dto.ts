import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(128)
  password: string
}