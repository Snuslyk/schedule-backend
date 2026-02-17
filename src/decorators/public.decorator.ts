import { SetMetadata } from '@nestjs/common'

export const PUBLIC_KEY = 'is_public'
export const Public = () => SetMetadata(PUBLIC_KEY, true)

export const NOT_ADMIN_PUBLIC_KEY = 'is_not_admin_public'
export const AuthorizedPublic = () => SetMetadata(NOT_ADMIN_PUBLIC_KEY, true)