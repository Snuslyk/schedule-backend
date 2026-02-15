import { Module } from '@nestjs/common'
import { ReplaceService } from './replace.service'
import { ReplaceController } from './replace.controller'

@Module({
  controllers: [ReplaceController],
  providers: [ReplaceService],
})
export class ReplaceModule {}
