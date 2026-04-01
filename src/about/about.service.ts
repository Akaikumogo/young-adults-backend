import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { About } from '../database/entities/about.entity';
import { UpdateAboutDto } from './dto/update-about.dto';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About) private aboutRepo: Repository<About>,
  ) {}

  async findOne(): Promise<About | null> {
    return this.aboutRepo.findOne({ where: { is_active: true } });
  }

  async findOneAdmin(): Promise<About | null> {
    const rows = await this.aboutRepo.find({
      order: { createdAt: 'ASC' },
      take: 1,
    });
    return rows[0] ?? null;
  }

  async createOrUpdate(updateAboutDto: UpdateAboutDto): Promise<About> {
    const rows = await this.aboutRepo.find({
      order: { createdAt: 'ASC' },
      take: 1,
    });
    const existing = rows[0];

    if (existing) {
      Object.assign(existing, updateAboutDto);
      return this.aboutRepo.save(existing);
    }

    const row = this.aboutRepo.create(
      updateAboutDto as Partial<About>,
    ) as About;
    return this.aboutRepo.save(row);
  }
}
