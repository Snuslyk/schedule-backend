import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './interfaces/jwt.interface'
import ms, { StringValue } from 'ms'
import { UserDto } from './auth.dto'
import { PrismaService } from '../../prisma/prisma.service'
import { compare, hash } from 'bcryptjs'
import type { Response, Request } from 'express'
import { isDev } from '../../utils/is-dev'

@Injectable()
export class AuthService {
  private readonly JWT_SECRET: string
  private readonly JWT_ACCESS_TOKEN_TTL: StringValue
  private readonly JWT_REFRESH_TOKEN_TTL: StringValue

  private readonly COOKIE_DOMAIN: string

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {
    this.JWT_SECRET = configService.getOrThrow('JWT_SECRET')
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow('JWT_ACCESS_TOKEN_TTL')
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow('JWT_REFRESH_TOKEN_TTL')
    this.COOKIE_DOMAIN = configService.getOrThrow('COOKIE_DOMAIN')
  }

  async register(res: Response, dto: UserDto) {
    const existUser = await this.prismaService.user.findUnique({
      where: { email: dto.email }
    })

    if (existUser) {
      throw new ConflictException(`User with email ${dto.email} already exists`)
    }

    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        password: await hash(dto.password, 10)
      }
    })

    return this.auth(res, user.id)
  }

  async login(res: Response, dto: UserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        password: true
      }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const isValidPassword: boolean = await compare(dto.password, user.password)

    if (!isValidPassword) {
      throw new NotFoundException('User not found')
    }

    return this.auth(res, user.id)

  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'] as string | undefined

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token should be updated')
    }

    let payload: JwtPayload
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken)
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.id },
      select: { id: true },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.auth(res, user.id)
  }

  logout(res: Response) {
    this.setCookie(res, 'refreshToken', new Date(0))
  }

  private auth(res: Response, id: string) {
    const { accessToken, refreshToken } = this.generateTokens(id)

    const refreshTokenTTL = ms(this.JWT_REFRESH_TOKEN_TTL)

    this.setCookie(res, refreshToken, new Date(Date.now() + refreshTokenTTL))

    return { accessToken }
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'none' : 'lax'
    })
  }

  async validate(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id
      }
    })

    if (!user) {
      throw new NotFoundException(`User not found`)
    }

    return user
  }

  private generateTokens(id: string) {
    const payload: JwtPayload = { id: id }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL
    })

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL
    })

    return {
      accessToken,
      refreshToken
    }
  }


}
