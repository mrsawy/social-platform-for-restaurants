
import { configDotenv } from 'dotenv';
configDotenv();
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowModule } from './follow/follow.module';
import { CuisineModule } from './cuisine/cuisine.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI_DEV)
    , UserModule
    , RestaurantModule, FollowModule, CuisineModule, AuthModule
  ],
  
})
export class AppModule { }
