import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
} from '@nestjs/common'
import { AvatarService } from './avatar.service'
import { File } from './decorators/avatar.decorator'
import { Authorized } from '../auth/decorators/authorized.decorator'
import { Authorization } from '../auth/decorators/authorization.decorator'

@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Authorization()
  @Post()
  @File('avatar')
  async uploadAvatar(
    @UploadedFile(new ParseFilePipe({
      fileIsRequired: true,
      validators: [
        new MaxFileSizeValidator({ maxSize: 2097152 }),
        new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png|webp)/ })
      ]
    })) file: Express.Multer.File,
    @Authorized('id') id: string
  ) {
    await this.avatarService.upload(id, file.buffer)
  }
}
