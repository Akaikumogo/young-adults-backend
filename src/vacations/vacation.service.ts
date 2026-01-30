import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vacation, VacationDocument } from './schemas/vacation.schema';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { GetVacationsDto } from './dto/get-vacations.dto';

@Injectable()
export class VacationsService {
  constructor(
    @InjectModel(Vacation.name) private vacationModel: Model<VacationDocument>,
  ) {}

  async create(createVacationDto: CreateVacationDto): Promise<Vacation> {
    const vacation = new this.vacationModel({
      ...createVacationDto,
      employee_id: new Types.ObjectId(createVacationDto.employee_id),
      department_id: new Types.ObjectId(createVacationDto.department_id),
    });
    return vacation.save();
  }

  async findAll(query: GetVacationsDto): Promise<Vacation[]> {
    const filter: any = {};
    
    if (query.year) {
      filter.year = query.year;
    }
    
    if (query.department_id) {
      filter.department_id = new Types.ObjectId(query.department_id);
    }
    
    if (query.employee_id) {
      filter.employee_id = new Types.ObjectId(query.employee_id);
    }

    return this.vacationModel
      .find(filter)
      .populate('employee_id', 'name role')
      .populate('department_id', 'name code')
      .sort({ year: -1, month: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Vacation> {
    const vacation = await this.vacationModel
      .findById(id)
      .populate('employee_id')
      .populate('department_id')
      .exec();
    
    if (!vacation) {
      throw new NotFoundException('Vacation not found');
    }
    
    return vacation;
  }

  async findByEmployeeAndYear(employeeId: string, year: number): Promise<Vacation[]> {
    return this.vacationModel
      .find({
        employee_id: new Types.ObjectId(employeeId),
        year: year,
      })
      .sort({ month: 1 })
      .exec();
  }

  async findByDepartmentAndYear(departmentId: string, year: number): Promise<Vacation[]> {
    return this.vacationModel
      .find({
        department_id: new Types.ObjectId(departmentId),
        year: year,
      })
      .populate('employee_id', 'name role')
      .sort({ month: 1 })
      .exec();
  }

  async getVacationStatsByYearAndDepartment(year: number): Promise<any[]> {
    const stats = await this.vacationModel.aggregate([
      {
        $match: {
          year: year,
          has_vacation: true,
        },
      },
      {
        $group: {
          _id: {
            department_id: '$department_id',
            month: '$month',
          },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id.department_id',
          foreignField: '_id',
          as: 'department',
        },
      },
      {
        $unwind: '$department',
      },
      {
        $project: {
          department_id: '$_id.department_id',
          department_name: '$department.name',
          month: '$_id.month',
          count: 1,
        },
      },
    ]);

    return stats;
  }

  async upsertVacation(createVacationDto: CreateVacationDto): Promise<Vacation> {
    const filter = {
      employee_id: new Types.ObjectId(createVacationDto.employee_id),
      year: createVacationDto.year,
      month: createVacationDto.month,
    };

    const update = {
      department_id: new Types.ObjectId(createVacationDto.department_id),
      has_vacation: createVacationDto.has_vacation,
    };

    return this.vacationModel.findOneAndUpdate(
      filter,
      update,
      { upsert: true, new: true }
    ).exec();
  }

  async update(id: string, updateVacationDto: UpdateVacationDto): Promise<Vacation> {
    const updateData: any = { ...updateVacationDto };
    
    if (updateVacationDto.employee_id) {
      updateData.employee_id = new Types.ObjectId(updateVacationDto.employee_id);
    }
    
    if (updateVacationDto.department_id) {
      updateData.department_id = new Types.ObjectId(updateVacationDto.department_id);
    }

    const vacation = await this.vacationModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!vacation) {
      throw new NotFoundException('Vacation not found');
    }

    return vacation;
  }

  async remove(id: string): Promise<void> {
    const result = await this.vacationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Vacation not found');
    }
  }
}

