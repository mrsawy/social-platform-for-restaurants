import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import mongoose, { ClientSession, PaginateModel } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: PaginateModel<User>
  ) { }
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, process.env.SALT_ROUNDS);
    return await this.userModel.create({ ...createUserDto, password: hashedPassword });
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(identifier: string) {
    let foundedUser: User | null = null;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      foundedUser = await this.userModel.findById(identifier)
    } else {
      foundedUser = await this.userModel
        .findOne({
          $or: [{ email: identifier }, { username: identifier }, { phone: identifier }]
        })
    }
    if (!foundedUser) throw new NotFoundException("User Not Found")
    return foundedUser;
  }

  async inCreaseFollowing(id: string, session?: ClientSession) {
    const user = await this.findOne(id);
    user.profile.totalFollowing += 1;
    await user.save({ session });
    return { success: true, message: 'Follower added' };
  }

  async decreaseFollowing(id: string, session?: ClientSession) {
    const user = await this.findOne(id);
    user.profile.totalFollowing -= 1;
    await user.save({ session });
    return { success: true, message: 'Follower removed' };
  }

  async getRecommendations(userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);

    const result = await this.userModel.aggregate([
      // 1) Match the target user
      {
        $match: { _id: objectId }
      },

      // 2) Find users with shared favorite cuisines
      {
        $lookup: {
          from: "users",
          let: {
            userCuisines: "$preferences.favoriteCuisinesIds",
            userId: "$_id"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    // Exclude the current user
                    { $ne: ["$_id", "$$userId"] },
                    // Check if arrays have any common elements
                    {
                      $gt: [
                        {
                          $size: {
                            $setIntersection: [
                              "$$userCuisines",
                              "$preferences.favoriteCuisinesIds"
                            ]
                          }
                        },
                        0
                      ]
                    }
                  ]
                }
              }
            },
            // Project only needed fields to reduce data size
            {
              $project: {
                _id: 1,
                fullName: 1,
                "preferences.favoriteCuisinesIds": 1
              }
            }
          ],
          as: "similarUsers"
        }
      },

      // 3) Get restaurant IDs followed by similar users
      {
        $lookup: {
          from: "follows",
          let: { similarUserIds: "$similarUsers._id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$userId", "$$similarUserIds"] }
              }
            },
            // Get unique restaurant IDs
            {
              $group: {
                _id: "$restaurantId"
              }
            }
          ],
          as: "restaurantIds"
        }
      },

      // 4) Get full restaurant details
      {
        $lookup: {
          from: "restaurants",
          let: { restIds: "$restaurantIds._id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$restIds"] }
              }
            },
            // Populate cuisines
            {
              $lookup: {
                from: "cuisines",
                localField: "cuisinesIds",
                foreignField: "_id",
                as: "cuisines"
              }
            }
          ],
          as: "recommendedRestaurants"
        }
      },

      // 5) Format final output
      {
        $project: {
          _id: 0,
          similarUsers: {
            $map: {
              input: "$similarUsers",
              as: "user",
              in: {
                _id: "$$user._id",
                fullName: "$$user.fullName",
                sharedCuisines: {
                  $setIntersection: [
                    "$preferences.favoriteCuisinesIds",
                    "$$user.preferences.favoriteCuisinesIds"
                  ]
                }
              }
            }
          },
          recommendedRestaurants: 1
        }
      }
    ]);

    return result[0] || { similarUsers: [], recommendedRestaurants: [] };
  }
}
