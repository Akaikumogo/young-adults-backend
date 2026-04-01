import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

function omitPassword<T extends User>(user: T): Omit<T, 'password'> {
  const { password: _, ...rest } = user;
  return rest as Omit<T, 'password'>;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const saved = await this.userRepo.save({
      ...createUserDto,
      password: hashedPassword,
      avatar_url: createUserDto.avatar_url ?? null,
      is_public: createUserDto.is_public !== false,
    });

    return omitPassword(saved);
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepo.find({ order: { createdAt: 'DESC' } });
    return users.map((u) => omitPassword(u));
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepo.findOne({ where: { _id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return omitPassword(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { phone } });
  }

  /** Full row including password — for auth only */
  async findByLogin(login: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: [{ email: login }, { phone: login }],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(updateUserDto)) {
      if (v !== undefined) patch[k] = v;
    }
    if (updateUserDto.password) {
      patch.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (Object.keys(patch).length) {
      await this.userRepo.update({ _id: id }, patch as any);
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepo.delete({ _id: id });
    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepo.update({ _id: id }, { last_login: new Date() });
  }

  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepo.findOne({ where: { _id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update({ _id: id }, { password: hashedPassword });
  }
}
