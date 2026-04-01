import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { Group } from '../database/entities/group.entity';
import { GroupHistory } from '../database/entities/group-history.entity';
import { Student } from '../database/entities/student.entity';
import { Course } from '../database/entities/course.entity';
import { Employee } from '../database/entities/employee.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { MoveStudentDto } from './dto/move-student.dto';
import { User } from '../database/entities/user.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(GroupHistory) private historyRepo: Repository<GroupHistory>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
  ) {}

  private async attachStudents(groups: Group[]): Promise<any[]> {
    if (!groups.length) return [];
    const ids = groups.map((g) => g._id);
    const students = await this.studentRepo.find({
      where: { group: { _id: In(ids) } },
      relations: ['course', 'employee'],
    });
    const byGroup: Record<string, Student[]> = {};
    for (const s of students) {
      const gid = (s.group as Group | null)?._id;
      if (!gid) continue;
      if (!byGroup[gid]) byGroup[gid] = [];
      byGroup[gid].push(s);
    }
    return groups.map((g) => ({
      ...g,
      students: byGroup[g._id] || [],
    }));
  }

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const course = await this.courseRepo.findOne({
      where: { _id: createGroupDto.course },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    let employee: Employee | null = null;
    if (createGroupDto.employee) {
      employee = await this.employeeRepo.findOne({
        where: { _id: createGroupDto.employee },
      });
    }

    const group = this.groupRepo.create({
      name: createGroupDto.name,
      description: createGroupDto.description ?? null,
      course,
      maxStudents: createGroupDto.maxStudents ?? 30,
      daysOfWeek: createGroupDto.daysOfWeek ?? null,
      startTime: createGroupDto.startTime ?? null,
      endTime: createGroupDto.endTime ?? null,
      employee,
      is_active: createGroupDto.is_active !== false,
    });

    return this.groupRepo.save(group);
  }

  async findAll(courseId?: string): Promise<any[]> {
    const where = courseId ? { course: { _id: courseId } } : {};
    const groups = await this.groupRepo.find({
      where,
      relations: ['course', 'employee'],
      order: { createdAt: 'DESC' },
    });
    return this.attachStudents(groups);
  }

  async findOne(id: string): Promise<any> {
    const group = await this.groupRepo.findOne({
      where: { _id: id },
      relations: ['course', 'employee'],
    });
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    const [withStudents] = await this.attachStudents([group]);
    return withStudents;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<any> {
    const group = await this.groupRepo.findOne({
      where: { _id: id },
      relations: ['course', 'employee'],
    });
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (updateGroupDto.name !== undefined) group.name = updateGroupDto.name;
    if (updateGroupDto.description !== undefined) {
      group.description = updateGroupDto.description ?? null;
    }
    if (updateGroupDto.maxStudents !== undefined) {
      group.maxStudents = updateGroupDto.maxStudents;
    }
    if (updateGroupDto.daysOfWeek !== undefined) {
      group.daysOfWeek = updateGroupDto.daysOfWeek ?? null;
    }
    if (updateGroupDto.startTime !== undefined) {
      group.startTime = updateGroupDto.startTime ?? null;
    }
    if (updateGroupDto.endTime !== undefined) {
      group.endTime = updateGroupDto.endTime ?? null;
    }
    if (updateGroupDto.is_active !== undefined) {
      group.is_active = updateGroupDto.is_active;
    }

    if (updateGroupDto.course) {
      const course = await this.courseRepo.findOne({
        where: { _id: updateGroupDto.course },
      });
      if (!course) throw new NotFoundException('Course not found');
      group.course = course;
    }

    if (updateGroupDto.employee !== undefined) {
      if (updateGroupDto.employee) {
        const emp = await this.employeeRepo.findOne({
          where: { _id: updateGroupDto.employee },
        });
        group.employee = emp;
      } else {
        group.employee = null;
      }
    }

    await this.groupRepo.save(group);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    const inGroup = await this.studentRepo.find({
      where: { group: { _id: id } },
    });
    for (const s of inGroup) {
      s.group = null;
      await this.studentRepo.save(s);
    }
    await this.groupRepo.delete({ _id: id });
  }

  async countStudentsInGroup(groupId: string): Promise<number> {
    return this.studentRepo.count({ where: { group: { _id: groupId } } });
  }

  async addStudentsToGroup(groupId: string, studentIds: string[]): Promise<any> {
    const group = await this.groupRepo.findOne({ where: { _id: groupId } });
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const currentCount = await this.countStudentsInGroup(groupId);
    if (
      group.maxStudents &&
      currentCount + studentIds.length > group.maxStudents
    ) {
      throw new BadRequestException(
        `Group is full. Maximum ${group.maxStudents} students allowed.`,
      );
    }

    const groupFull = await this.groupRepo.findOneOrFail({
      where: { _id: groupId },
    });
    for (const sid of studentIds) {
      const st = await this.studentRepo.findOne({ where: { _id: sid } });
      if (st) {
        st.group = groupFull;
        await this.studentRepo.save(st);
      }
    }

    return this.findOne(groupId);
  }

  async removeStudentFromGroup(
    groupId: string,
    studentId: string,
  ): Promise<any> {
    const group = await this.groupRepo.findOne({ where: { _id: groupId } });
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const student = await this.studentRepo.findOne({
      where: { _id: studentId, group: { _id: groupId } },
    });
    if (student) {
      student.group = null;
      await this.studentRepo.save(student);
    }

    return this.findOne(groupId);
  }

  async moveStudent(
    moveStudentDto: MoveStudentDto,
    movedBy?: string,
  ): Promise<Student> {
    const { studentId, toGroupId, reason } = moveStudentDto;

    const student = await this.studentRepo.findOne({
      where: { _id: studentId },
      relations: ['group', 'course'],
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const fromGroupId = student.group?._id;

    if (toGroupId) {
      const toGroup = await this.findOne(toGroupId);
      const studentCourseId = student.course._id;
      const toCourseId =
        typeof toGroup.course === 'object' && toGroup.course
          ? (toGroup.course as Course)._id
          : toGroup.course;
      if (toCourseId !== studentCourseId) {
        throw new BadRequestException(
          'Cannot move student to group from different course',
        );
      }

      const toCount = await this.countStudentsInGroup(toGroupId);
      if (toGroup.maxStudents && toCount >= toGroup.maxStudents) {
        throw new BadRequestException('Target group is full');
      }

      await this.addStudentsToGroup(toGroupId, [studentId]);
    } else if (fromGroupId) {
      await this.removeStudentFromGroup(fromGroupId, studentId);
    }

    const history = this.historyRepo.create({
      student,
      fromGroup: fromGroupId
        ? await this.groupRepo.findOne({ where: { _id: fromGroupId } })
        : null,
      toGroup: toGroupId
        ? await this.groupRepo.findOne({ where: { _id: toGroupId } })
        : null,
      movedBy: movedBy
        ? await this.historyRepo.manager.getRepository(User).findOne({
            where: { _id: movedBy },
          })
        : null,
      reason: reason ?? null,
      movedAt: new Date(),
    });
    await this.historyRepo.save(history);

    const updated = await this.studentRepo.findOne({
      where: { _id: studentId },
      relations: ['group', 'course'],
    });
    if (!updated) {
      throw new NotFoundException('Student not found');
    }
    return updated;
  }

  async getUnassignedStudents(courseId: string): Promise<Student[]> {
    return this.studentRepo.find({
      where: { course: { _id: courseId }, group: IsNull() },
      relations: ['course', 'employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async getStudentHistory(studentId: string): Promise<GroupHistory[]> {
    return this.historyRepo.find({
      where: { student: { _id: studentId } },
      relations: ['fromGroup', 'toGroup', 'movedBy'],
      order: { movedAt: 'DESC' },
    });
  }
}
