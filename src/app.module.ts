import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SubjectModule } from './modules/subject/subject.module'
import { ConfigModule } from '@nestjs/config'
import { OrganizationModule } from './modules/organization/organization.module'
import { PrismaModule } from './prisma/prisma.module'
import { ScheduleModule } from './modules/schedule/schedule.module'
import { GroupModule } from './modules/group/group.module'
import { WeekTemplateModule } from './modules/week-template/week-template.module'
import { DayModule } from './modules/day/day.module'
import { LessonModule } from './modules/lesson/lesson.module'
import { TeacherModule } from './modules/teacher/teacher.module'
import { ReplaceModule } from './modules/replace/replace.module'
import { OwnerModule } from './modules/owner/owner.module'
import { AuthModule } from './modules/auth/auth.module'
import { CacheModule } from '@nestjs/cache-manager'
import { AvatarModule } from './modules/avatar/avatar.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 24 * 1000 * 60 * 60,
    }),
    PrismaModule,
    SubjectModule,
    OrganizationModule,
    ScheduleModule,
    GroupModule,
    WeekTemplateModule,
    DayModule,
    LessonModule,
    TeacherModule,
    ReplaceModule,
    OwnerModule,
    AuthModule,
    AvatarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
