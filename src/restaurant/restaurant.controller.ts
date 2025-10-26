import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CuisineService } from 'src/cuisine/cuisine.service';
import { FilterRestaurantDto } from './dto/filter-restaurant.dto';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUserRequest } from 'src/auth/types/IUserRequest.interface';
import { request } from 'http';

@ApiTags('restaurants')
@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private cuisineService: CuisineService
  ) { }


  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'Restaurant created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid cuisine IDs or duplicate unique name' })
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Request() request: IUserRequest
  ) {
    const areCuisinesValid = await this.cuisineService.validateCuisines(
      createRestaurantDto.cuisinesIds
    );

    if (!areCuisinesValid) {
      throw new BadRequestException(
        'One or more cuisine IDs are invalid or inactive'
      );
    }
    const userId = request.user.id.toString()
    return this.restaurantService.create({ ...createRestaurantDto, createdById: new Types.ObjectId(userId as string) });
  }

  @Get()
  @ApiOperation({
    summary: 'List all restaurants with optional filters',
    description: 'Filter by multiple cuisines, with pagination support'
  })
  @ApiResponse({ status: 200, description: 'Restaurants retrieved successfully' })
  async findAll(filterDto: FilterRestaurantDto) {
    return this.restaurantService.findAll(filterDto);
  }


  @Get('nearby')
  @ApiOperation({
    summary: 'Find nearby restaurants within 1km radius',
    description: 'Uses geospatial query to find restaurants near given coordinates'
  })
  @ApiQuery({ name: 'longitude', required: true, type: Number, example: 31.2357 })
  @ApiQuery({ name: 'latitude', required: true, type: Number, example: 30.0444 })
  @ApiQuery({ name: 'maxDistance', required: false, type: Number, example: 1000, description: 'Distance in meters (default: 1000m = 1km)' })
  @ApiResponse({ status: 200, description: 'Nearby restaurants retrieved successfully' })
  async findNearby(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('maxDistance') maxDistance?: number
  ) {
    return this.restaurantService.findNearby(
      Number(longitude),
      Number(latitude),
      maxDistance ? Number(maxDistance) : 1000
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get restaurant by ID or unique name (slug)',
    description: 'Accepts either MongoDB ObjectId or unique name (slug)'
  })
  @ApiResponse({ status: 200, description: 'Restaurant retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async findOne(@Param('id') id: string) {
    return await this.restaurantService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update restaurant by ID' })
  @ApiResponse({ status: 200, description: 'Restaurant updated successfully' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @ApiResponse({ status: 400, description: 'Invalid data or duplicate unique name' })
  async update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto, @Request() request: IUserRequest) {
    if (updateRestaurantDto.cuisinesIds) {
      const areCuisinesValid = await this.cuisineService.validateCuisines(
        updateRestaurantDto.cuisinesIds
      );

      if (!areCuisinesValid) {
        throw new BadRequestException(
          'One or more cuisine IDs are invalid or inactive'
        );
      }
    }
    const foundedRestaurant = await this.restaurantService.findOne(id);
    if (foundedRestaurant.createdById !== request.user.id) throw new UnauthorizedException("Unauthorized to edit this restaurant")

    return await this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete (deactivate) restaurant by ID',
    description: 'hard delete - actually delete from db'
  })
  @ApiResponse({ status: 200, description: 'Restaurant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async remove(@Param('id') id: string) {
    return await this.restaurantService.remove(id);
  }




}
