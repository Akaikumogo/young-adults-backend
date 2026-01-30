import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientStatistics, ClientStatisticsDocument } from './schemas/client-statistics.schema';
import { CreateClientStatisticsDto } from './dto/create-client-statistics.dto';
import { UpdateClientStatisticsDto } from './dto/update-client-statistics.dto';

@Injectable()
export class ClientStatisticsService {
  constructor(
    @InjectModel(ClientStatistics.name)
    private clientStatisticsModel: Model<ClientStatisticsDocument>,
  ) {}

  async create(createDto: CreateClientStatisticsDto): Promise<ClientStatistics> {
    // Validate: if value is not numeric, title_uz is required
    const isNumeric = this.isNumericValue(createDto.value);
    if (!isNumeric && !createDto.title_uz?.trim()) {
      throw new BadRequestException('Title (UZ) is required when value is not a number');
    }

    const clientStatistics = new this.clientStatisticsModel(createDto);
    return clientStatistics.save();
  }

  async findAll(): Promise<ClientStatistics[]> {
    return this.clientStatisticsModel
      .find({ is_active: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllAdmin(): Promise<ClientStatistics[]> {
    return this.clientStatisticsModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<ClientStatistics> {
    const clientStatistics = await this.clientStatisticsModel.findById(id).exec();
    if (!clientStatistics) {
      throw new NotFoundException(`Client statistics with ID ${id} not found`);
    }
    return clientStatistics;
  }

  async update(
    id: string,
    updateDto: UpdateClientStatisticsDto,
  ): Promise<ClientStatistics> {
    // Get existing document to check current value
    const existing = await this.clientStatisticsModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException(`Client statistics with ID ${id} not found`);
    }

    // Determine the value to use (new or existing)
    const value = updateDto.value !== undefined ? updateDto.value : existing.value;
    const isNumeric = this.isNumericValue(value);

    // Validate: if value is not numeric, title_uz is required
    if (!isNumeric) {
      const title_uz = updateDto.title_uz !== undefined ? updateDto.title_uz : existing.title_uz;
      if (!title_uz?.trim()) {
        throw new BadRequestException('Title (UZ) is required when value is not a number');
      }
    }

    const clientStatistics = await this.clientStatisticsModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    return clientStatistics;
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientStatisticsModel.findByIdAndDelete(id).exec();
    if (!result) {
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
