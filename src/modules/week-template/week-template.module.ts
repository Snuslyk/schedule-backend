import { Module } from '@nestjs/common'
import { WeekTemplateService } from './week-template.service'
import { WeekTemplateController } from './week-template.controller'

@Module({
  controllers: [WeekTemplateController],
  providers: [WeekTemplateService],
})
export class WeekTemplateModule {}
