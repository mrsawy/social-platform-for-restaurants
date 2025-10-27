import { configDotenv } from 'dotenv';
configDotenv();

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cuisine, CuisineSchema } from 'src/cuisine/entities/cuisine.entity';
import { Follow, FollowSchema } from 'src/follow/entities/follow.entity';
import { Restaurant, RestaurantSchema } from 'src/restaurant/entities/restaurant.entity';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { SeederService } from './seeders.service';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI_DEV!),
    MongooseModule.forFeature([
      { name: Cuisine.name, schema: CuisineSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: User.name, schema: UserSchema },
      { name: Follow.name, schema: FollowSchema },
    ]),
  ],
  providers: [SeederService],
})
export class SeederModule { }