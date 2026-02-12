import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { Role } from '../../../generated/prisma/enums'

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

  roles: Role[]
}

export class UserDto {
  id?: string

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email?: string

  @IsString()
  @IsNotEmpty()
  password?: string

  roles?: Role[]
}