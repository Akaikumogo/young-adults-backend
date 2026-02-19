/**
 * Migration script to clean localhost URLs from image fields in database
 * Converts URLs like "http://localhost:3000/uploads/..." to "/uploads/..."
 * 
 * Run with: npm run migrate:clean-urls
 * Or: ts-node src/database/scripts/clean-localhost-urls.ts
 */

import { connect, disconnect, model, Schema } from 'mongoose';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/young-adults';

// Pattern to match localhost URLs
const LOCALHOST_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i;

// Function to clean URL - removes localhost prefix, keeps /uploads/... path
function cleanUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return url || null;
  
  // If already starts with /uploads/, return as is
  if (url.startsWith('/uploads/')) {
    return url;
  }
  
  // If it's a localhost URL, extract the path
  if (LOCALHOST_PATTERN.test(url)) {
    const match = url.match(/\/uploads\/.*$/);
    if (match) {
      return match[0]; // Returns /uploads/...
    }
    // If no /uploads/ found, try to extract any path after domain
    const pathMatch = url.match(/\/[^/].*$/);
    if (pathMatch) {
      return pathMatch[0];
    }
  }
  
  // If it's a full URL but not localhost, keep as is (external URL)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's already a relative path, return as is
  return url;
}

// Collections and their image/video fields to clean
const COLLECTIONS_TO_CLEAN = [
  {
    name: 'employees',
    fields: ['image'],
  },
  {
    name: 'courses',
    fields: ['image'],
  },
  {
    name: 'events',
    fields: ['eventImage', 'eventVideo'],
  },
  {
    name: 'locations',
    fields: ['image'],
  },
  {
    name: 'services',
    fields: ['flag'], // Services use flag field
  },
  {
    name: 'statistics',
    fields: ['image'],
  },
  {
    name: 'hero',
    fields: ['image', 'video'],
  },
  {
    name: 'about',
    fields: ['image1', 'image2', 'image3', 'image4'],
  },
  {
    name: 'slides',
    fields: ['image', 'video'],
  },
  {
    name: 'clientstatistics',
    fields: ['image'], // If exists
  },
];

async function cleanCollectionUrls(collectionName: string, fields: string[]) {
  try {
    const Collection = model(collectionName);
    const documents = await Collection.find({}).lean().exec();
    
    let updatedCount = 0;
    
    for (const doc of documents) {
      let needsUpdate = false;
      const updateData: any = {};
      
      for (const field of fields) {
        const currentValue = (doc as any)[field];
        if (currentValue) {
          const cleanedValue = cleanUrl(currentValue);
          if (cleanedValue !== currentValue) {
            updateData[field] = cleanedValue;
            needsUpdate = true;
          }
        }
      }
      
      if (needsUpdate) {
        await Collection.updateOne(
          { _id: doc._id },
          { $set: updateData }
        );
        updatedCount++;
        console.log(`Updated ${collectionName} document ${doc._id}:`, updateData);
      }
    }
    
    console.log(`\n✅ ${collectionName}: Updated ${updatedCount} out of ${documents.length} documents`);
    return updatedCount;
  } catch (error: any) {
    if (error.name === 'MissingSchemaError') {
      console.log(`⚠️  ${collectionName}: Collection not found, skipping...`);
      return 0;
    }
    console.error(`❌ Error cleaning ${collectionName}:`, error.message);
    return 0;
  }
}

async function main() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    let totalUpdated = 0;

    for (const collection of COLLECTIONS_TO_CLEAN) {
      console.log(`\n📋 Processing ${collection.name}...`);
      const updated = await cleanCollectionUrls(collection.name, collection.fields);
      totalUpdated += updated;
    }

    console.log(`\n\n✨ Migration completed!`);
    console.log(`📊 Total documents updated: ${totalUpdated}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run migration
if (require.main === module) {
  main().catch(console.error);
}

export { cleanUrl, cleanCollectionUrls };
