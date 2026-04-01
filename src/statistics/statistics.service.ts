import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistics } from '../database/entities/statistics.entity';
import { CreateStatisticsDto } from './dto/create-statistics.dto';
import { UpdateStatisticsDto } from './dto/update-statistics.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistics) private statisticsRepo: Repository<Statistics>,
  ) {}

  async findAll(): Promise<Statistics[]> {
    return this.statisticsRepo.find({
      where: { is_active: true },
      order: { order: 'ASC' },
    });
  }

  async findAllAdmin(): Promise<Statistics[]> {
    return this.statisticsRepo.find({ order: { order: 'ASC' } });
  }

  async findOne(id: string): Promise<Statistics> {
    const statistics = await this.statisticsRepo.findOne({ where: { _id: id } });
    if (!statistics) {
      throw new NotFoundException(`Statistics with ID ${id} not found`);
    }
    return statistics;
  }

  async create(createStatisticsDto: CreateStatisticsDto): Promise<Statistics> {
    const statistics = this.statisticsRepo.create(createStatisticsDto);
    return this.statisticsRepo.save(statistics);
  }

  async update(
    id: string,
    updateStatisticsDto: UpdateStatisticsDto,
  ): Promise<Statistics> {
    const statistics = await this.findOne(id);
    Object.assign(statistics, updateStatisticsDto);
    return this.statisticsRepo.save(statistics);
  }

  async remove(id: string): Promise<void> {
    const result = await this.statisticsRepo.delete({ _id: id });
    if (!result.affected) {
      throw new NotFoundException(`Statistics with ID ${id} not found`);
    }
  }
}
