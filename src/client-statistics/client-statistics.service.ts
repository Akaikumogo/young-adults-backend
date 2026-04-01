import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientStatistics } from '../database/entities/client-statistics.entity';
import { CreateClientStatisticsDto } from './dto/create-client-statistics.dto';
import { UpdateClientStatisticsDto } from './dto/update-client-statistics.dto';

@Injectable()
export class ClientStatisticsService {
  constructor(
    @InjectRepository(ClientStatistics)
    private clientStatisticsRepo: Repository<ClientStatistics>,
  ) {}

  async create(createDto: CreateClientStatisticsDto): Promise<ClientStatistics> {
    const isNumeric = this.isNumericValue(createDto.value);
    if (!isNumeric && !createDto.title_uz?.trim()) {
      throw new BadRequestException(
        'Title (UZ) is required when value is not a number',
      );
    }

    const row = this.clientStatisticsRepo.create(createDto);
    return this.clientStatisticsRepo.save(row);
  }

  async findAll(): Promise<ClientStatistics[]> {
    return this.clientStatisticsRepo.find({
      where: { is_active: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllAdmin(): Promise<ClientStatistics[]> {
    return this.clientStatisticsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<ClientStatistics> {
    const row = await this.clientStatisticsRepo.findOne({ where: { _id: id } });
    if (!row) {
      throw new NotFoundException(`Client statistics with ID ${id} not found`);
    }
    return row;
  }

  async update(
    id: string,
    updateDto: UpdateClientStatisticsDto,
  ): Promise<ClientStatistics> {
    const existing = await this.findOne(id);

    const value =
      updateDto.value !== undefined ? updateDto.value : existing.value;
    const isNumeric = this.isNumericValue(value);

    if (!isNumeric) {
      const title_uz =
        updateDto.title_uz !== undefined
          ? updateDto.title_uz
          : existing.title_uz;
      if (!title_uz?.trim()) {
        throw new BadRequestException(
          'Title (UZ) is required when value is not a number',
        );
      }
    }

    Object.assign(existing, updateDto);
    return this.clientStatisticsRepo.save(existing);
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientStatisticsRepo.delete({ _id: id });
    if (!result.affected) {
      throw new NotFoundException(`Client statistics with ID ${id} not found`);
    }
  }

  private isNumericValue(value: string | number): boolean {
    if (typeof value === 'number') return true;
    if (typeof value === 'string') {
      return !isNaN(Number(value)) && !isNaN(parseFloat(value));
    }
    return false;
  }
}
