import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from "./auth.service"
import { UserRegisterDto, UserLoginDto } from './auth.dto'
import type { Response, Request } from 'express'
import { Authorization } from './decorators/authorization.decorator'
import { IsAdmin } from './decorators/is-admin.decorator'
import { Role } from '../../../generated/prisma/enums'
import {
  ApiBody, ApiCookieAuth,
  ApiOperation, ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { Authorized } from './decorators/authorized.decorator'
import type { User } from '../../../generated/prisma/client'
import { AuthGuard } from '@nestjs/passport'

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //@Authorization()
  //@IsAdmin()
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: UserRegisterDto })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: UserRegisterDto
  ) {
    return this.authService.register(res, dto)
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: UserLoginDto })
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: UserLoginDto
  ) {
    return this.authService.login(res, dto)
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
  @ApiCookieAuth('refreshToken')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refresh(req, res)
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user and clear cookies' })
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res)
  }

  @Authorization()
  @Get('profile')
  @ApiOperation({ summary: 'Get logged user profile' })
  @ApiCookieAuth()
  @HttpCode(HttpStatus.OK)
  async getMyProfile(@Authorized() user: User) {
    return await this.authService.getProfile(user)
  }

  @Post('role')
  @ApiOperation({ summary: 'Add role to user' })
  @ApiQuery({ name: 'id', type: String, description: 'User ID' })
  @ApiQuery({ name: 'role', enum: Role, description: 'Role to assign' })
  @HttpCode(HttpStatus.OK)
  addRole(
    @Query('id') id: string,
    @Query('role') role: Role
  ) {
    return this.authService.roles(id, role)
  }
}
