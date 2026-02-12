import { Body, Controller, HttpCode, HttpStatus, Post, Query, Req, Res } from '@nestjs/common'
import { AuthService } from "./auth.service"
import { UserCreateDto, UserDto } from './auth.dto'
import type { Response, Request } from 'express'
import { Authorization } from './decorators/authorization.decorator'
import { IsAdmin } from './decorators/is-admin.decorator'
import { Role } from '../../../generated/prisma/enums'

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //@Authorization()
  //@IsAdmin()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Res({ passthrough: true }) res: Response, @Body() dto: UserCreateDto) {
    return await this.authService.register(res, dto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Res({ passthrough: true }) res: Response, @Body() dto: UserDto) {
    return await this.authService.login(res, dto)
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.refresh(req, res)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res)
  }

  @Post('role')
  roles(@Query('id') id: string, @Query('role') role: Role) {
    return this.authService.roles(id, role)
  }
}
