import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../database/entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact) private contactRepo: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepo.create(createContactDto);
    return this.contactRepo.save(contact);
  }

  async findAll(): Promise<Contact[]> {
    return this.contactRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactRepo.findOne({ where: { _id: id } });
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findOne(id);
    Object.assign(contact, updateContactDto);
    return this.contactRepo.save(contact);
  }

  async remove(id: string): Promise<void> {
    const result = await this.contactRepo.delete({ _id: id });
    if (!result.affected) {
      throw new NotFoundException('Contact not found');
    }
  }
}
