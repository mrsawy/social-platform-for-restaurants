import { NestFactory } from '@nestjs/core';

import { SeederService } from './seeders.service';
import { SeederModule } from './seeders.module';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(SeederModule);

    const seeder = app.get(SeederService);

    try {
        await seeder.seed();
        await app.close();
        console.log('Seeding Success');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        await app.close();
        process.exit(1);
    }
}

bootstrap();