import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateOptions } from 'mongoose';
import { Cuisine } from './entities/cuisine.entity';
import { CreateCuisineDto } from './dto/create-cuisine.dto';
import { UpdateCuisineDto } from './dto/update-cuisine.dto';

@Injectable()
export class CuisineService {
  constructor(
    @InjectModel(Cuisine.name)
    private cuisineModel: PaginateModel<Cuisine>
  ) { }

  async create(createCuisineDto: CreateCuisineDto) {
    const existingCuisine = await this.cuisineModel.findOne({
      $or: [
        { name: createCuisineDto.name },
        { slug: createCuisineDto.slug }
      ]
    });

    if (existingCuisine) {
      throw new BadRequestException('Cuisine with this name or slug already exists');
    }

    const cuisine = await this.cuisineModel.create(createCuisineDto);
    return { success: true, data: cuisine };
  }

  async findAll(PaginateOptions: PaginateOptions) {
    return this.cuisineModel.paginate(PaginateOptions);
  }

  async findOne(id: string) {
    return this.cuisineModel.findById(id).exec();
  }

  async validateCuisines(cuisineIds: string[]): Promise<boolean> {
    const validCuisines = await this.cuisineModel.find({
      _id: { $in: cuisineIds },
      isActive: true
    }).exec();

    return validCuisines.length === cuisineIds.length;
  }

  async update(id: string, updateCuisineDto: UpdateCuisineDto) {
    await this.cuisineModel.findByIdAndUpdate(id, updateCuisineDto);
    return { success: true, message: 'Cuisine updated successfully' };
  }

  async remove(id: string) {
    await this.cuisineModel.findByIdAndDelete(id);
    return { success: true, message: 'Cuisine deleted successfully' };
  }
}