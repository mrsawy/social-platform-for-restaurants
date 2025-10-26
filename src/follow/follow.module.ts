import { Module, Res } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from './entities/follow.entity';
import { UserModule } from 'src/user/user.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]),
    UserModule,
    RestaurantModule,
    AuthModule
  ],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule { }
