import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from '../database/entities/position.entity';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position) private positionRepo: Repository<Position>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    const position = this.positionRepo.create(createPositionDto);
    return this.positionRepo.save(position);
  }

  async findAll(): Promise<Position[]> {
    return this.positionRepo.find({
      where: { is_active: true },
      order: { name: 'ASC' },
    });
  }

  async findAllAdmin(): Promise<Position[]> {
    return this.positionRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Position> {
    const position = await this.positionRepo.findOne({ where: { _id: id } });
    if (!position) {
      throw new NotFoundException('Position not found');
    }
    return position;
  }

  async update(
    id: string,
    updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    const position = await this.findOne(id);
    Object.assign(position, updatePositionDto);
    return this.positionRepo.save(position);
  }

  async remove(id: string): Promise<void> {
    const result = await this.positionRepo.delete({ _id: id });
    if (!result.affected) {
      throw new NotFoundException('Position not found');
    }
  }
}
