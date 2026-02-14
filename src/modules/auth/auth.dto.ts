import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { Role } from '../../../generated/prisma/enums'
import { ApiProperty } from '@nestjs/swagger'

export class UserRegisterDto {

  @ApiProperty({
    example: 'Dwayne Johnson',
    description: 'The name of the user',
    minLength: 6,
    maxLength: 128
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(128)
  name: string

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
    format: 'email'
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string


  @ApiProperty({
    example: 'strongPassword123',
    description: 'The password of the user',
    minLength: 6,
    maxLength: 128
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(128)
  password: string


  @ApiProperty({
    description: 'Array of user roles',
    enum: Role,
    isArray: true,
    example: ['STUDENT']
  })
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[]
}

export class UserLoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
    format: 'email'
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    example: 'strongPassword123',
    description: 'The password of the user',
    minLength: 6,
    maxLength: 128
  })
  @IsString()
  @IsNotEmpty()
  password: string
}

export class UserDto {
  id?: string
  name?: string
  email?: string
  password?: string
  roles?: Role[]
}