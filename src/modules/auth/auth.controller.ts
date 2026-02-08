import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from "./auth.service"
import { UserCreateDto } from './auth.dto'

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  register(@Body() dto: UserCreateDto) {

  }
}
