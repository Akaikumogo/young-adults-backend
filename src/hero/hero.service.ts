import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hero } from '../database/entities/hero.entity';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';

@Injectable()
export class HeroService {
  constructor(
    @InjectRepository(Hero) private readonly heroRepo: Repository<Hero>,
  ) {}

  async findAllPublic(): Promise<Hero[]> {
    return this.heroRepo.find({
      where: { is_active: true },
      order: { priority: 'ASC', createdAt: 'DESC' },
    });
  }

  async findAllAdmin(): Promise<Hero[]> {
    return this.heroRepo.find({
      order: { priority: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Hero> {
    const hero = await this.heroRepo.findOne({ where: { _id: id } });
    if (!hero) {
      throw new NotFoundException(`Hero with ID ${id} not found`);
    }
    return hero;
  }

  async create(createHeroDto: CreateHeroDto): Promise<Hero> {
    const hero = this.heroRepo.create(createHeroDto);
    return this.heroRepo.save(hero);
  }

  async update(id: string, updateHeroDto: UpdateHeroDto): Promise<Hero> {
    const hero = await this.findOne(id);
    Object.assign(hero, updateHeroDto);
    return this.heroRepo.save(hero);
  }

  async remove(id: string): Promise<void> {
    const result = await this.heroRepo.delete({ _id: id });
    if (!result.affected) {
      throw new NotFoundException(`Hero with ID ${id} not found`);
    }
  }
}
