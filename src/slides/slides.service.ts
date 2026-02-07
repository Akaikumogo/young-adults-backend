import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slide, SlideDocument } from './schemas/slide.schema';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';

@Injectable()
export class SlidesService {
  constructor(
    @InjectModel(Slide.name) private slideModel: Model<SlideDocument>,
  ) {}

  async create(createSlideDto: CreateSlideDto): Promise<SlideDocument> {
    const slide = new this.slideModel(createSlideDto);
    return slide.save();
  }

  async findAll(): Promise<SlideDocument[]> {
    return this.slideModel.find().sort({ order: 1, createdAt: -1 }).exec();
  }

  async findActive(): Promise<SlideDocument[]> {
    return this.slideModel
      .find({ is_active: true })
      .sort({ order: 1, createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<SlideDocument> {
    const slide = await this.slideModel.findById(id).exec();
    if (!slide) {
      throw new NotFoundException('Slide not found');
    }
    return slide;
  }

  async update(id: string, updateSlideDto: UpdateSlideDto): Promise<SlideDocument> {
    const slide = await this.slideModel
      .findByIdAndUpdate(id, updateSlideDto, { new: true })
      .exec();
    if (!slide) {
      throw new NotFoundException('Slide not found');
    }
    return slide;
  }

  async remove(id: string): Promise<void> {
    const result = await this.slideModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Slide not found');
    }
  }
}
