import mongoose from 'mongoose';
import { config as dotenvConfig } from 'dotenv';


async function clearDB() {
    dotenvConfig();
    
    if (!process.env.MONGODB_URI_DEV) {
        console.error('❌ MONGO_URI not found in .env');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI_DEV);
    await mongoose.connection.db?.dropDatabase();

    console.log('✅ Database cleared successfully');
    await mongoose.disconnect();
    process.exit(0);
}

clearDB();
