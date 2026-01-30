import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Position, PositionDocument } from './schemas/position.schema';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectModel(Position.name) private positionModel: Model<PositionDocument>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    const position = new this.positionModel(createPositionDto);
    return position.save();
  }

  async findAll(): Promise<Position[]> {
    return this.positionModel.find({ is_active: true }).sort({ name: 1 }).exec();
  }

  async findAllAdmin(): Promise<Position[]> {
    return this.positionModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<Position> {
    const position = await this.positionModel.findById(id).exec();
    if (!position) {
      throw new NotFoundException('Position not found');
    }
    return position;
  }

  async update(id: string, updatePositionDto: UpdatePositionDto): Promise<Position> {
    const position = await this.positionModel
      .findByIdAndUpdate(id, updatePositionDto, { new: true })
      .exec();

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    return position;
  }

  async remove(id: string): Promise<void> {
    const result = await this.positionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Position not found');
    }
  }
}

