import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import databaseConfig from '../config/database.config';
import { User, UserDocument, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    try {
      const defaultEmail = this.configService.get<string>('DEFAULT_ADMIN_EMAIL') || 'admin@gmail.com';
      const defaultPassword = this.configService.get<string>('DEFAULT_ADMIN_PASSWORD') || '@dm1n';
      const defaultName = this.configService.get<string>('DEFAULT_ADMIN_NAME') || 'Admin User';
      const defaultPhone = this.configService.get<string>('DEFAULT_ADMIN_PHONE') || '+998901234567';

      // Check if admin already exists
      const existingAdmin = await this.userModel.findOne({ email: defaultEmail });
      
      if (existingAdmin) {
        console.log('✅ Admin user already exists');
        console.log(`Email: ${defaultEmail}`);
        console.log(`Password: ${defaultPassword}`);
        return;
      }

      // Create default admin user
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      await this.userModel.create({
        full_name: defaultName,
        email: defaultEmail,
        phone: defaultPhone,
        password: hashedPassword,
        role: 'admin',
        is_active: true,
      });

      console.log('✅ Default admin user created successfully!');
      console.log(`Email: ${defaultEmail}`);
      console.log(`Password: ${defaultPassword}`);
    } catch (error) {
      console.error('❌ Error creating admin user:', error);
    }
  }
}

