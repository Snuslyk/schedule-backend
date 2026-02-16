import {
  BadRequestException,
  Body,
  Controller, FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus, MaxFileSizeValidator, ParseFilePipe,
  Post,
  Query,
  Req,
  Res, UploadedFile,
} from '@nestjs/common'
import { UserService } from './services/user.service'
import { UserRegisterDto, UserLoginDto } from './user.dto'
import type { Response, Request } from 'express'
import { Authorization } from './decorators/authorization.decorator'
import { IsAdmin } from './decorators/is-admin.decorator'
import { Role } from '../../../generated/prisma/enums'
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { Authorized } from './decorators/authorized.decorator'
import type { User } from '../../../generated/prisma/client'
import { File } from './decorators/avatar.decorator'
import { AvatarService } from './services/avatar.service'

@ApiTags('Auth')
@Controller('auth')
export class UserController {
  constructor(
    private readonly authService: UserService,
    private readonly avatarService: AvatarService
  ) {}

  //@Authorization()
  //@IsAdmin()
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: UserRegisterDto })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: UserRegisterDto,
  ) {
    return this.authService.register(res, dto)
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: UserLoginDto })
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: UserLoginDto,
  ) {
    return this.authService.login(res, dto)
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
  @ApiCookieAuth('refreshToken')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req, res)
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user and clear cookies' })
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res)
  }

  @Authorization()
  @Get('profile')
  @ApiOperation({ summary: 'Get logged user profile' })
  @ApiCookieAuth()
  @HttpCode(HttpStatus.OK)
  async getMyProfile(@Authorized() user: User) {
    return await this.authService.getProfile(user)
  }

  @Post('role')
  @ApiOperation({ summary: 'Add role to user' })
  @ApiQuery({ name: 'id', type: String, description: 'User ID' })
  @ApiQuery({ name: 'role', enum: Role, description: 'Role to assign' })
  @HttpCode(HttpStatus.OK)
  addRole(@Query('id') id: string, @Query('role') role: Role) {
    return this.authService.roles(id, role)
  }

  @Authorization()
  @Post('avatar')
  @ApiOperation({ summary: 'Avatar uploading to yandex bucket' })
  @File('avatar')
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: 2097152 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png|webp)/ }),
        ],
      }),
    )
      file: Express.Multer.File,
    @Authorized('id') id: string,
    @Body('cropData') cropDataString: string
  ) {
    let cropData: { x: number; y: number; size: number }
    try {
      cropData = JSON.parse(cropDataString) as { x: number; y: number; size: number }
    } catch (e) {
      throw new BadRequestException()
    }

    await this.avatarService.upload(id, file.buffer, cropData)
  }
}
