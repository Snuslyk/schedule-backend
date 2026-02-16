import { Module } from '@nestjs/common'
import { UserService } from './services/user.service'
import { UserController } from './user.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { getJwtConfig } from '../../../config/jwt.config'
import { JwtStrategy } from './strategies/jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { AvatarService } from './services/avatar.service'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AvatarService, JwtStrategy],
})
export class UserModule {}
