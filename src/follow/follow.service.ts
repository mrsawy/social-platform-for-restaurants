import { Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Follow } from './entities/follow.entity';
import { Connection, FilterQuery, PaginateModel, PaginateOptions } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';

@Injectable()
export class FollowService {

  constructor(
    @InjectModel(Follow.name) private readonly followModel: PaginateModel<Follow>,
    private readonly restaurantService: RestaurantService,
    private readonly userService: UserService,
    @InjectConnection() private readonly connection: Connection,

  ) { }

  async create(createFollowDto: CreateFollowDto) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const newFollow = new this.followModel(createFollowDto);
      await newFollow.save({ session });

      await this.restaurantService.inCreaseFollowers(createFollowDto.restaurantId.toString(), session)
      await this.userService.inCreaseFollowing(createFollowDto.userId.toString(), session)

      await session.commitTransaction();
      session.endSession();
      return
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error)
      throw error;

    }
  }

  async findAll(options?: PaginateOptions, filters?: FilterQuery<Follow>) {
    return await this.followModel.paginate(filters, options)
  }

  async remove(deleteFollowDto: CreateFollowDto) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.followModel.findOneAndDelete({ userId: deleteFollowDto.userId, restaurantId: deleteFollowDto.restaurantId })
      await this.restaurantService.decreaseFollowers(deleteFollowDto.restaurantId.toString())
      await this.userService.decreaseFollowing(deleteFollowDto.userId.toString())
      return
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error)
      throw error;

    }
  }
}
