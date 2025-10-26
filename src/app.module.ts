import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowModule } from './follow/follow.module';
import { CuisineModule } from './cuisine/cuisine.module';
import { AuthModule } from './auth/auth.module';
import { configDotenv } from 'dotenv';

configDotenv();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI_DEV)
    , UserModule
    , RestaurantModule, FollowModule, CuisineModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
