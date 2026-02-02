import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class ConceptionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()

    const isAuth = request.headers.auth === 'secret'
    if (!isAuth) new UnauthorizedException('Not auth')

    return isAuth
  }
}
