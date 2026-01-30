import { connect, disconnect, model, Schema } from 'mongoose';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables from .env file if it exists
try {
  const envPath = resolve(__dirname, '../../../.env');
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch (error) {
  // .env file doesn't exist or can't be read, use environment variables
}

// Course Schema
const CourseSchema = new Schema({
  name: String,
  name_uz: String,
  name_en: String,
  name_ru: String,
  description: String,
  description_uz: String,
  description_en: String,
  description_ru: String,
  duration: String,
  duration_uz: String,
  duration_en: String,
  duration_ru: String,
  daysPerWeek: Number,
  hoursPerDay: Number,
  icon: String,
  image: String,
  teachers: [Schema.Types.ObjectId],
  is_active: Boolean,
}, { timestamps: true, strict: false });

// Service Schema
const ServiceSchema = new Schema({
  name: String,
  name_uz: String,
  name_en: String,
  name_ru: String,
  flag: String,
  description: String,
  description_uz: String,
  description_en: String,
  description_ru: String,
  minIELTS: String,
  order: Number,
  is_active: Boolean,
}, { timestamps: true, strict: false });

// About Schema
const AboutSchema = new Schema({
  title: String,
  title_uz: String,
  title_en: String,
  title_ru: String,
  content: String,
  content_uz: String,
  content_en: String,
  content_ru: String,
  images: [String],
  is_active: Boolean,
}, { timestamps: true, strict: false });

// Location Schema
const LocationSchema = new Schema({
  name: String,
  name_uz: String,
  name_en: String,
  name_ru: String,
  address: String,
  address_uz: String,
  address_en: String,
  address_ru: String,
  phone: String,
  image: String,
  coordinates: { lat: Number, lng: Number },
  is_active: Boolean,
}, { timestamps: true, strict: false });

async function migrateMultilingual() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/young-adults';

  if (!mongoUri) {
    console.error('❌ MONGODB_URI is not set in environment variables');
    console.error('   Please set MONGODB_URI in your .env file or environment');
    process.exit(1);
  }

  console.log(`🔗 Attempting to connect to MongoDB...`);
  console.log(`   URI: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials

  try {
    await connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('✅ Connected to MongoDB');

    const CourseModel = model('Course', CourseSchema);
    const ServiceModel = model('Service', ServiceSchema);
    const AboutModel = model('About', AboutSchema);
    const LocationModel = model('Location', LocationSchema);

    // Migrate Courses
    console.log('\n📚 Migrating Courses...');
    const courses = await CourseModel.find({
      $or: [
        { name: { $exists: true, $ne: null } },
        { description: { $exists: true, $ne: null } },
        { duration: { $exists: true, $ne: null } }
      ]
    }).exec();

    let coursesUpdated = 0;
    for (const course of courses) {
      const updateData: any = {};
      
      if (course.name && !course.name_uz) {
        updateData.name_uz = course.name;
        updateData.name_en = '';
        updateData.name_ru = '';
      }
      
      if (course.description && !course.description_uz) {
        updateData.description_uz = course.description;
        updateData.description_en = '';
        updateData.description_ru = '';
      }
      
      if (course.duration && !course.duration_uz) {
        updateData.duration_uz = course.duration;
        updateData.duration_en = '';
        updateData.duration_ru = '';
      }

      if (Object.keys(updateData).length > 0) {
        await CourseModel.updateOne(
          { _id: course._id },
          { $set: updateData }
        );
        coursesUpdated++;
      }
    }
    console.log(`✅ Updated ${coursesUpdated} courses`);

    // Migrate Services
    console.log('\n🌍 Migrating Services...');
    const services = await ServiceModel.find({
      $or: [
        { name: { $exists: true, $ne: null } },
        { description: { $exists: true, $ne: null } }
      ]
    }).exec();

    let servicesUpdated = 0;
    for (const service of services) {
      const updateData: any = {};
      
      if (service.name && !service.name_uz) {
        updateData.name_uz = service.name;
        updateData.name_en = '';
        updateData.name_ru = '';
      }
      
      if (service.description && !service.description_uz) {
        updateData.description_uz = service.description;
        updateData.description_en = '';
        updateData.description_ru = '';
      }

      if (Object.keys(updateData).length > 0) {
        await ServiceModel.updateOne(
          { _id: service._id },
          { $set: updateData }
        );
        servicesUpdated++;
      }
    }
    console.log(`✅ Updated ${servicesUpdated} services`);

    // Migrate About
    console.log('\n📄 Migrating About...');
    const abouts = await AboutModel.find({
      $or: [
        { title: { $exists: true, $ne: null } },
        { content: { $exists: true, $ne: null } }
      ]
    }).exec();

    let aboutsUpdated = 0;
    for (const about of abouts) {
      const updateData: any = {};
      
      if (about.title && !about.title_uz) {
        updateData.title_uz = about.title;
        updateData.title_en = '';
        updateData.title_ru = '';
      }
      
      if (about.content && !about.content_uz) {
        updateData.content_uz = about.content;
        updateData.content_en = '';
        updateData.content_ru = '';
      }

      if (Object.keys(updateData).length > 0) {
        await AboutModel.updateOne(
          { _id: about._id },
          { $set: updateData }
        );
        aboutsUpdated++;
      }
    }
    console.log(`✅ Updated ${aboutsUpdated} about records`);

    // Migrate Locations
    console.log('\n📍 Migrating Locations...');
    const locations = await LocationModel.find({
      $or: [
        { name: { $exists: true, $ne: null } },
        { address: { $exists: true, $ne: null } }
      ]
    }).exec();

    let locationsUpdated = 0;
    for (const location of locations) {
      const updateData: any = {};
      
      if (location.name && !location.name_uz) {
        updateData.name_uz = location.name;
        updateData.name_en = '';
        updateData.name_ru = '';
      }
      
      if (location.address && !location.address_uz) {
        updateData.address_uz = location.address;
        updateData.address_en = '';
        updateData.address_ru = '';
      }

      if (Object.keys(updateData).length > 0) {
        await LocationModel.updateOne(
          { _id: location._id },
          { $set: updateData }
        );
        locationsUpdated++;
      }
    }
    console.log(`✅ Updated ${locationsUpdated} locations`);

    console.log('\n✅ Migration completed successfully!');
    console.log(`\nSummary:`);
    console.log(`  - Courses: ${coursesUpdated}`);
    console.log(`  - Services: ${servicesUpdated}`);
    console.log(`  - About: ${aboutsUpdated}`);
    console.log(`  - Locations: ${locationsUpdated}`);

  } catch (error: any) {
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\n❌ Cannot connect to MongoDB server');
      console.error('   Please check:');
      console.error('   1. MongoDB is running (mongod)');
      console.error('   2. MONGODB_URI in .env file is correct');
      console.error('   3. Network/firewall settings allow connection');
      console.error(`\n   Attempted URI: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
    } else {
      console.error('❌ Error during migration:', error);
    }
    throw error;
  } finally {
    await disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run migration
migrateMultilingual()
  .then(() => {
    console.log('\n🎉 Migration script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });

