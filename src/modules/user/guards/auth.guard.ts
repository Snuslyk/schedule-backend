import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { PUBLIC_KEY } from '../../../decorators/public.decorator'

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const handler = ctx.getHandler()
    const skip = this.reflector.get<boolean>(PUBLIC_KEY, handler)

    if (skip) return true

    return super.canActivate(ctx)
  }
}
