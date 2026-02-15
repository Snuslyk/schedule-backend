import { Module } from '@nestjs/common'
import { ScheduleService } from './schedule.service'
import { ScheduleController } from './schedule.controller'
import { TeacherScheduleService } from './services/teacher-schedule.service'
import { GroupScheduleService } from './services/group-schedule.service'

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService, GroupScheduleService, TeacherScheduleService],
})
export class ScheduleModule {}
