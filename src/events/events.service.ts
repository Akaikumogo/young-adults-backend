import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { SiteEvent } from '../database/entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(SiteEvent) private eventRepo: Repository<SiteEvent>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<SiteEvent> {
    const row = this.eventRepo.create(
      createEventDto as DeepPartial<SiteEvent>,
    );
    return this.eventRepo.save(row);
  }

  async findAll(): Promise<SiteEvent[]> {
    return this.eventRepo.find({
      where: { is_active: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllAdmin(): Promise<SiteEvent[]> {
    return this.eventRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<SiteEvent> {
    const event = await this.eventRepo.findOne({ where: { _id: id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<SiteEvent> {
    const event = await this.findOne(id);
    Object.assign(event, updateEventDto);
    return this.eventRepo.save(event);
  }

  async remove(id: string): Promise<void> {
    const result = await this.eventRepo.delete({ _id: id });
    if (!result.affected) {
      throw new NotFoundException('Event not found');
    }
  }
}
