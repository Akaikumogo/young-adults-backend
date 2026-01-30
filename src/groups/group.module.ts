import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupsService } from './group.service';
import { GroupsController } from './group.controller';
import { Group, GroupSchema } from './schemas/group.schema';
import { GroupHistory, GroupHistorySchema } from './schemas/group-history.schema';
import { Student, StudentSchema } from '../students/schemas/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: GroupHistory.name, schema: GroupHistorySchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}

