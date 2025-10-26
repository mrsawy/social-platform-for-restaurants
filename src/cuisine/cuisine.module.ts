import { Module } from '@nestjs/common';
import { CuisineService } from './cuisine.service';
import { CuisineController } from './cuisine.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cuisine, CuisineSchema } from './entities/cuisine.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cuisine.name, schema: CuisineSchema }]),
    AuthModule
  ],
  controllers: [CuisineController],
  providers: [CuisineService],
  exports: [CuisineService],
})
export class CuisineModule { }
