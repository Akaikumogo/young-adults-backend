import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import databaseConfig from '../config/database.config';
import { typeOrmEntities, User } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useFactory: (configService: ConfigService) => {
        const base = {
          type: 'postgres' as const,
          entities: typeOrmEntities,
          synchronize: configService.get<boolean>('database.synchronize') ?? true,
          logging: process.env.NODE_ENV === 'development',
        };
        const url = configService.get<string>('database.url');
        if (url) {
          return { ...base, url };
        }
        return {
          ...base,
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.database'),
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    try {
      const defaultEmail =
        this.configService.get<string>('DEFAULT_ADMIN_EMAIL') || 'admin@gmail.com';
      const defaultPassword =
        this.configService.get<string>('DEFAULT_ADMIN_PASSWORD') || '@dm1n';
      const defaultName =
        this.configService.get<string>('DEFAULT_ADMIN_NAME') || 'Admin User';
      const defaultPhone =
        this.configService.get<string>('DEFAULT_ADMIN_PHONE') || '+998901234567';

      const existingAdmin = await this.userRepo.findOne({
        where: { email: defaultEmail },
      });

      if (existingAdmin) {
        console.log('✅ Admin user already exists');
        console.log(`Email: ${defaultEmail}`);
        console.log(`Password: ${defaultPassword}`);
        return;
      }

      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      await this.userRepo.save({
        full_name: defaultName,
        email: defaultEmail,
        phone: defaultPhone,
        password: hashedPassword,
        role: 'admin',
        is_active: true,
        is_public: true,
        avatar_url: null,
        last_login: null,
      });

      console.log('✅ Default admin user created successfully!');
      console.log(`Email: ${defaultEmail}`);
      console.log(`Password: ${defaultPassword}`);
    } catch (error) {
      console.error('❌ Error creating admin user:', error);
    }
  }
}
