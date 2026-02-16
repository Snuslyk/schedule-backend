import { applyDecorators, UseGuards } from '@nestjs/common'
import { JwtGuard } from '../guards/auth.guard'
import { AdminGuard } from '../guards/admin.guard'

export function AuthorizationAdmin() {
  return applyDecorators(UseGuards(JwtGuard, AdminGuard))
}