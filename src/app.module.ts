import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { CoursesModule } from './courses/course.module';
import { TeachersModule } from './teachers/teacher.module';
import { StudentsModule } from './students/student.module';
import { ServicesModule } from './services/service.module';
import { EmployeesModule } from './employees/employee.module';
import { AboutModule } from './about/about.module';
import { LocationsModule } from './locations/location.module';
import { ContactModule } from './contact/contact.module';
import { UploadModule } from './upload/upload.module';
import { GroupsModule } from './groups/group.module';
import { DepartmentsModule } from './departments/department.module';
import { PositionsModule } from './positions/position.module';
import { VacationsModule } from './vacations/vacation.module';
import { StatisticsModule } from './statistics/statistics.module';
import { EventsModule } from './events/events.module';
import { ClientStatisticsModule } from './client-statistics/client-statistics.module';
import { UtilsModule } from './utils/utils.module';
import { SlidesModule } from './slides/slides.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    TeachersModule,
    StudentsModule,
    GroupsModule,
    ServicesModule,
    EmployeesModule,
    AboutModule,
    LocationsModule,
    ContactModule,
    UploadModule,
    DepartmentsModule,
    PositionsModule,
    VacationsModule,
    StatisticsModule,
    EventsModule,
    ClientStatisticsModule,
    UtilsModule,
    SlidesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

