import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'
import { Role, User } from '../../../../generated/prisma/client'
import { Reflector } from '@nestjs/core'
import { NOT_ADMIN_PUBLIC_KEY } from '../../../decorators/public.decorator'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const handler = ctx.getHandler()
    const skip = this.reflector.get<boolean>(NOT_ADMIN_PUBLIC_KEY, handler)

    if (skip) return true

    const req: Request = ctx.switchToHttp().getRequest()
    const user = req.user as User | undefined
    if (!user) return true
    return user.roles.includes(Role.ADMIN) ?? false
  }
}
