import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'
import { Role, User } from '../../../../generated/prisma/client'

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = ctx.switchToHttp().getRequest()
    const user = req.user as User | undefined
    return user?.roles.includes(Role.ADMIN) ?? false
  }
}
