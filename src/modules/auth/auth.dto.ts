import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { Role } from '../../../generated/prisma/enums'
import { ApiProperty } from '@nestjs/swagger'

export class UserCreateDto {

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