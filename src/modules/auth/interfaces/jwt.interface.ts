import { Role } from '../../../../generated/prisma/enums'

export interface JwtPayload {
  id: string
  roles: Role[]
}
