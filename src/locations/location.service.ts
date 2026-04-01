import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../database/entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location) private locationRepo: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepo.create(createLocationDto);
    return this.locationRepo.save(location);
  }

  async findAll(): Promise<Location[]> {
    return this.locationRepo.find({
      where: { is_active: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllAdmin(): Promise<Location[]> {
    return this.locationRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepo.findOne({ where: { _id: id } });
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    return location;
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findOne(id);
    Object.assign(location, updateLocationDto);
    return this.locationRepo.save(location);
  }

  async remove(id: string): Promise<void> {
    const result = await this.locationRepo.delete({ _id: id });
    if (!result.affected) {
      throw new NotFoundException('Location not found');
    }
  }
}
