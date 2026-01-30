import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './schemas/group.schema';
import { GroupHistory, GroupHistoryDocument } from './schemas/group-history.schema';
import { Student, StudentDocument } from '../students/schemas/student.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { MoveStudentDto } from './dto/move-student.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(GroupHistory.name) private historyModel: Model<GroupHistoryDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<GroupDocument> {
    const group = new this.groupModel(createGroupDto);
    return group.save();
  }

  async findAll(courseId?: string): Promise<GroupDocument[]> {
    const query = courseId ? { course: courseId } : {};
    return this.groupModel
      .find(query)
      .populate('course')
      .populate({
        path: 'students',
        select: 'full_name phone email avatar_url course teacher',
        populate: [
          { path: 'course', select: 'name' },
          { path: 'teacher', select: 'full_name email' }
        ]
      })
      .populate('teacher')
      .exec();
  }

  async findOne(id: string): Promise<GroupDocument> {
    const group = await this.groupModel
      .findById(id)
      .populate('course')
      .populate({
        path: 'students',
        select: 'full_name phone email avatar_url course teacher',
        populate: [
          { path: 'course', select: 'name' },
          { path: 'teacher', select: 'full_name email' }
        ]
      })
      .populate('teacher')
      .exec();

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<GroupDocument> {
    const group = await this.groupModel
      .findByIdAndUpdate(id, updateGroupDto, { new: true })
      .populate('course')
      .populate({
        path: 'students',
        select: 'full_name phone email avatar_url course teacher',
        populate: [
          { path: 'course', select: 'name' },
          { path: 'teacher', select: 'full_name email' }
        ]
      })
      .populate('teacher')
      .exec();

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  async remove(id: string): Promise<void> {
    const group = await this.findOne(id);
    
    // Remove students from group before deleting
    await this.studentModel.updateMany(
      { group: id },
      { $unset: { group: 1 } }
    ).exec();

    await this.groupModel.findByIdAndDelete(id).exec();
  }

  async addStudentsToGroup(groupId: string, studentIds: string[]): Promise<GroupDocument> {
    const group = await this.groupModel.findById(groupId).exec();
    
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Get current student IDs (handle both populated and non-populated)
    const currentStudentIds = group.students.map((s: any) => 
      typeof s === 'object' && s._id ? s._id.toString() : s.toString()
    );

    // Check max students limit
    if (group.maxStudents && currentStudentIds.length + studentIds.length > group.maxStudents) {
      throw new BadRequestException(
        `Group is full. Maximum ${group.maxStudents} students allowed.`
      );
    }

    // Add students to group
    const uniqueStudentIds = [...new Set([...currentStudentIds, ...studentIds])];
    
    // Update students' group reference
    await this.studentModel.updateMany(
      { _id: { $in: studentIds } },
      { $set: { group: groupId } }
    ).exec();

    group.students = uniqueStudentIds as any;
    await group.save();

    // Return populated group
    return this.findOne(groupId);
  }

  async removeStudentFromGroup(groupId: string, studentId: string): Promise<GroupDocument> {
    const group = await this.groupModel.findById(groupId).exec();
    
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Remove student from group (handle both populated and non-populated)
    group.students = group.students.filter((s: any) => {
      const id = typeof s === 'object' && s._id ? s._id.toString() : s.toString();
      return id !== studentId;
    }) as any;

    // Update student's group reference
    await this.studentModel.findByIdAndUpdate(studentId, {
      $unset: { group: 1 }
    }).exec();

    await group.save();

    // Return populated group
    return this.findOne(groupId);
  }

  async moveStudent(moveStudentDto: MoveStudentDto, movedBy?: string): Promise<StudentDocument> {
    const { studentId, toGroupId, reason } = moveStudentDto;

    const student = await this.studentModel.findById(studentId).exec();
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const fromGroupId = student.group?.toString();

    // If moving to a group, validate it exists
    if (toGroupId) {
      const toGroup = await this.findOne(toGroupId);
      
      // Check if group belongs to same course
      if (toGroup.course.toString() !== student.course.toString()) {
        throw new BadRequestException('Cannot move student to group from different course');
      }

      // Check max students limit
      if (toGroup.maxStudents && toGroup.students.length >= toGroup.maxStudents) {
        throw new BadRequestException('Target group is full');
      }

      // Add to new group
      await this.addStudentsToGroup(toGroupId, [studentId]);
    } else {
      // Remove from current group
      if (fromGroupId) {
        await this.removeStudentFromGroup(fromGroupId, studentId);
      }
    }

    // Create history record
    const history = new this.historyModel({
      student: studentId,
      fromGroup: fromGroupId || undefined,
      toGroup: toGroupId || undefined,
      movedBy: movedBy || undefined,
      reason,
    });
    await history.save();

    return this.studentModel.findById(studentId).populate('group').populate('course').exec();
  }

  async getUnassignedStudents(courseId: string): Promise<StudentDocument[]> {
    return this.studentModel
      .find({
        course: courseId,
        $or: [{ group: { $exists: false } }, { group: null }],
      })
      .populate('course')
      .populate('teacher')
      .exec();
  }

  async getStudentHistory(studentId: string): Promise<GroupHistoryDocument[]> {
    return this.historyModel
      .find({ student: studentId })
      .populate('fromGroup')
      .populate('toGroup')
      .populate('movedBy')
      .sort({ movedAt: -1 })
      .exec();
  }
}

