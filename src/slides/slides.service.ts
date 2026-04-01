import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slide } from '../database/entities/slide.entity';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';

@Injectable()
export class SlidesService {
  constructor(
    @InjectRepository(Slide) private slideRepo: Repository<Slide>,
  ) {}

  async create(createSlideDto: CreateSlideDto): Promise<Slide> {
    const slide = this.slideRepo.create(createSlideDto);
    return this.slideRepo.save(slide);
  }

  async findAll(): Promise<Slide[]> {
    return this.slideRepo.find({ order: { order: 'ASC', createdAt: 'DESC' } });
  }

  async findActive(): Promise<Slide[]> {
    return this.slideRepo.find({
      where: { is_active: true },
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Slide> {
    const slide = await this.slideRepo.findOne({ where: { _id: id } });
    if (!slide) {
      throw new NotFoundException('Slide not found');
    }
    return slide;
  }

  async update(id: string, updateSlideDto: UpdateSlideDto): Promise<Slide> {
    const slide = await this.findOne(id);
    Object.assign(slide, updateSlideDto);
    return this.slideRepo.save(slide);
  }

  async remove(id: string): Promise<void> {
    const result = await this.slideRepo.delete({ _id: id });
    if (!result.affected) {
      throw new NotFoundException('Slide not found');
    }
  }
}
