import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SubjectsModule } from './modules/subjects/subjects.module'
import { ConfigModule } from '@nestjs/config'
import { ConceptionMiddleware } from './conception/conception.middleware'
import { OrganizationModule } from './modules/organization/organization.module';
import { PrismaModule } from './prisma/prisma.module'
import { ScheduleModule } from './modules/schedule/schedule.module';
import { GroupModule } from './modules/group/group.module';
import { WeekTemplateModule } from './modules/week-template/week-template.module';
import { DayModule } from './modules/day/day.module';
import { LessonModule } from './modules/lesson/lesson.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, SubjectsModule, OrganizationModule, ScheduleModule, GroupModule, WeekTemplateModule, DayModule, LessonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ConceptionMiddleware).forRoutes('subjects')
  }
}
