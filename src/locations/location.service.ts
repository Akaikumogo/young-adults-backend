import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from './schemas/location.schema';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(@InjectModel(Location.name) private locationModel: Model<LocationDocument>) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = new this.locationModel(createLocationDto);
    return location.save();
  }

  async findAll(): Promise<Location[]> {
    return this.locationModel.find({ is_active: true }).exec();
  }

  async findAllAdmin(): Promise<Location[]> {
    return this.locationModel.find().exec();
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationModel.findById(id).exec();
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<Location> {
    const location = await this.locationModel
      .findByIdAndUpdate(id, updateLocationDto, { new: true })
      .exec();

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return location;
  }

  async remove(id: string): Promise<void> {
    const result = await this.locationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Location not found');
    }
  }
}

