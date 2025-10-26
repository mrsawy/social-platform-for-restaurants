import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUserRequest } from 'src/auth/types/IUserRequest.interface';
import { PaginateOptions, Types } from 'mongoose';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) { }

  @Post(":restaurantId")
  @UseGuards(AuthGuard)
  create(
    @Param('restaurantId') restaurantId: string,
    @Req() request: IUserRequest,
  ) {
    return this.followService.create({ restaurantId: new Types.ObjectId(restaurantId), userId: request.user.id });
  }

  @Get("/restaurant/:restaurantId")
  findAllRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Query() query: PaginateOptions
  ) {
    if (!query.page) {
      query.page = 1
    }
    if (!query.limit || query.limit > 100) {
      query.limit = 10
    }
    return this.followService.findAll(query, { restaurantId });
  }

  @Get("/user/:userId")
  findAllUser(
    @Param('userId') userId: string,
    @Query() query: PaginateOptions
  ) {
    if (!query.page) {
      query.page = 1
    }
    if (!query.limit || query.limit > 100) {
      query.limit = 10
    }
    return this.followService.findAll(query, { userId });
  }

  @Delete(':restaurantId')
  @UseGuards(AuthGuard)
  remove(
    @Param('restaurantId') restaurantId: string,
    @Req() request: IUserRequest,
  ) {
    return this.followService.remove({ restaurantId: new Types.ObjectId(restaurantId), userId: request.user.id });
  }
}
