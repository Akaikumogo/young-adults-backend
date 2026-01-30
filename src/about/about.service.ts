import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { About, AboutDocument } from './schemas/about.schema';
import { UpdateAboutDto } from './dto/update-about.dto';

@Injectable()
export class AboutService {
  constructor(@InjectModel(About.name) private aboutModel: Model<AboutDocument>) {}

  async findOne(): Promise<About | null> {
    return this.aboutModel.findOne({ is_active: true }).exec();
  }

  async findOneAdmin(): Promise<About | null> {
    return this.aboutModel.findOne().exec();
  }

  async createOrUpdate(updateAboutDto: UpdateAboutDto): Promise<About> {
    const existing = await this.aboutModel.findOne().exec();
    
    if (existing) {
      return this.aboutModel
        .findByIdAndUpdate(existing._id, updateAboutDto, { new: true })
        .exec();
    } else {
      const about = new this.aboutModel(updateAboutDto);
      return about.save();
    }
  }
}

