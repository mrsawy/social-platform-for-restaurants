import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './entities/restaurant.entity';
import mongoose, { ClientSession, PaginateModel, Types } from 'mongoose';
import { FilterRestaurantDto } from './dto/filter-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: PaginateModel<Restaurant>
  ) { }

  async create(createRestaurantDto: CreateRestaurantDto & { createdById: mongoose.Types.ObjectId }) {
    await this.restaurantModel.create(createRestaurantDto);
    return { success: true, message: 'Restaurant created successfully' };
  }

  async findAll(filterDto: FilterRestaurantDto) {
    const { cuisines, page, limit } = filterDto;
    // Build filter query
    const filter: Record<string, any> = {};
    // Filter by multiple cuisines (restaurants that have ANY of the provided cuisines)
    if (cuisines && cuisines.length > 0) {
      filter.cuisines = {
        $in: cuisines.map(id => new Types.ObjectId(id))
      };
    }
    // Use pagination
    const options = {
      page: page || 1,
      limit: limit || 10,
      populate: 'cuisines',
      sort: { createdAt: -1 }
    };
    const result = await this.restaurantModel.paginate(filter, options);
    return result;
  }

  async findOne(identifier: string) {
    let foundedRestaurant: Restaurant | null;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      foundedRestaurant = await this.restaurantModel.findById(identifier).populate('cuisines');
    } else {
      foundedRestaurant = await this.restaurantModel.findOne({ slug: identifier }).populate('cuisines');
    }
    if (!foundedRestaurant) throw new NotFoundException("Restaurant Not Found")
    return foundedRestaurant;
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = await this.findOne(id);
    restaurant.set(updateRestaurantDto);
    await restaurant.save();
    return { success: true, message: 'Restaurant updated successfully' };
  }

  async findNearby(longitude: number, latitude: number, maxDistance = 1000) {
    const restaurants = await this.restaurantModel
      .find({
        isActive: true,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: maxDistance // in meters (1km = 1000m)
          }
        }
      })
      .populate('cuisines')
      .limit(20)
      .exec();

    return {
      success: true,
      data: restaurants,
      count: restaurants.length
    };
  }

  async remove(id: string) {
    const restaurant = await this.findOne(id);
    await restaurant.deleteOne();
    return { success: true, message: 'restaurant deleted successfully' };
  }



  async inCreaseFollowers(id: string, session?: ClientSession) {
    const restaurant = await this.findOne(id);
    restaurant.totalFollowers += 1;
    await restaurant.save({ session });
    return { success: true, message: 'Follower added' };
  }

  async decreaseFollowers(id: string, session?: ClientSession) {
    const restaurant = await this.findOne(id);
    restaurant.totalFollowers -= 1;
    await restaurant.save({ session });
    return { success: true, message: 'Follower removed' };
  }


  

}
