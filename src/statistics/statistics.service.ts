import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Statistics, StatisticsDocument } from './schemas/statistics.schema';
import { CreateStatisticsDto } from './dto/create-statistics.dto';
import { UpdateStatisticsDto } from './dto/update-statistics.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Statistics.name)
    private statisticsModel: Model<StatisticsDocument>,
  ) {}

  async findAll(): Promise<Statistics[]> {
    return this.statisticsModel
      .find({ is_active: true })
      .sort({ order: 1 })
      .exec();
  }

  async findAllAdmin(): Promise<Statistics[]> {
    return this.statisticsModel.find().sort({ order: 1 }).exec();
  }

  async findOne(id: string): Promise<Statistics> {
    const statistics = await this.statisticsModel.findById(id).exec();
    if (!statistics) {
      throw new NotFoundException(`Statistics with ID ${id} not found`);
    }
    return statistics;
  }

  async create(createStatisticsDto: CreateStatisticsDto): Promise<Statistics> {
    const statistics = new this.statisticsModel(createStatisticsDto);
    return statistics.save();
  }

  async update(
    id: string,
    updateStatisticsDto: UpdateStatisticsDto,
  ): Promise<Statistics> {
    const statistics = await this.statisticsModel
      .findByIdAndUpdate(id, updateStatisticsDto, { new: true })
      .exec();
    if (!statistics) {
      throw new NotFoundException(`Statistics with ID ${id} not found`);
    }
    return statistics;
  }

  async remove(id: string): Promise<void> {
    const result = await this.statisticsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Statistics with ID ${id} not found`);
    }
  }
}

