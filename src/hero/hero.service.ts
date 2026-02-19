import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hero, HeroDocument } from './schemas/hero.schema';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';

@Injectable()
export class HeroService {
  constructor(
    @InjectModel(Hero.name)
    private readonly heroModel: Model<HeroDocument>,
  ) {}

  async findAllPublic(): Promise<Hero[]> {
    return this.heroModel
      .find({ is_active: true })
      .sort({ priority: 1, createdAt: -1 })
      .exec();
  }

  async findAllAdmin(): Promise<Hero[]> {
    return this.heroModel
      .find()
      .sort({ priority: 1, createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Hero> {
    const hero = await this.heroModel.findById(id).exec();
    if (!hero) {
      throw new NotFoundException(`Hero with ID ${id} not found`);
    }
    return hero;
  }

  async create(createHeroDto: CreateHeroDto): Promise<Hero> {
    const hero = new this.heroModel(createHeroDto);
    return hero.save();
  }

  async update(id: string, updateHeroDto: UpdateHeroDto): Promise<Hero> {
    const hero = await this.heroModel
      .findByIdAndUpdate(id, updateHeroDto, { new: true })
      .exec();
    if (!hero) {
      throw new NotFoundException(`Hero with ID ${id} not found`);
    }
    return hero;
  }

  async remove(id: string): Promise<void> {
    const result = await this.heroModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Hero with ID ${id} not found`);
    }
  }
}

