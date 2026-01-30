import { connect, disconnect, model, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

const UserSchema = new Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'moderator', 'teacher'] },
  avatar_url: { type: String },
  is_active: { type: Boolean, default: true },
  last_login: { type: Date },
}, { timestamps: true });

async function bootstrap() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/young-adults';

  try {
    await connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const UserModel = model('User', UserSchema);

    // Check if admin already exists
    const existingAdmin = await UserModel.findOne({ email: 'admin@gmail.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('Email: admin@gmail.com');
      console.log('Password: @dm1n');
      await disconnect();
      return;
    }

    // Create default admin user
    const hashedPassword = await bcrypt.hash('@dm1n', 10);
    
    await UserModel.create({
      full_name: 'Admin User',
      email: 'admin@gmail.com',
      phone: '+998901234567',
      password: hashedPassword,
      role: 'admin',
      is_active: true,
    });

    console.log('✅ Default admin user created successfully!');
    console.log('Email: admin@gmail.com');
    console.log('Password: @dm1n');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

bootstrap();
