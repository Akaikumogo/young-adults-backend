import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../database/entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepo.create(createServiceDto);
    return this.serviceRepo.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepo.find({
      where: { is_active: true },
      order: { order: 'ASC' },
    });
  }

  async findAllAdmin(): Promise<Service[]> {
    return this.serviceRepo.find({ order: { order: 'ASC' } });
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepo.findOne({ where: { _id: id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    Object.assign(service, updateServiceDto);
    return this.serviceRepo.save(service);
  }

  async remove(id: string): Promise<void> {
    const result = await this.serviceRepo.delete({ _id: id });
    if (!result.affected) {
      throw new NotFoundException('Service not found');
    }
  }
}
