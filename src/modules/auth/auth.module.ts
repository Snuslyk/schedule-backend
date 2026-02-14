import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { getJwtConfig } from '../../../config/jwt.config'
import { JwtStrategy } from './strategies/jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { AvatarModule } from '../avatar/avatar.module'

@Module({
  imports: [
    AvatarModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: getJwtConfig,
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
