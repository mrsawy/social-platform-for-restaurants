import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PaginateOptions } from 'mongoose';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CuisineService } from './cuisine.service';
import { CreateCuisineDto } from './dto/create-cuisine.dto';
import { UpdateCuisineDto } from './dto/update-cuisine.dto';
import { ISAdmin } from 'src/user/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('cuisines')
@Controller('cuisine')
export class CuisineController {
  constructor(private readonly cuisineService: CuisineService) { }

  @Post()
  @UseGuards(AuthGuard, ISAdmin)
  @ApiOperation({ summary: 'Create a new cuisine (Admin only)' })
  create(@Body() createCuisineDto: CreateCuisineDto) {
    return this.cuisineService.create(createCuisineDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all cuisines' })
  @ApiQuery({ name: 'Paginated Options', required: false, type: Boolean })
  findAll(@Query() query: PaginateOptions) {
    return this.cuisineService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cuisine by ID' })
  findOne(@Param('id') id: string) {
    return this.cuisineService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, ISAdmin)
  @ApiOperation({ summary: 'Updated Cuisine (Admin only)' })
  update(@Param('id') id: string, @Body() updateCuisineDto: UpdateCuisineDto) {
    return this.cuisineService.update(id, updateCuisineDto);
  }


  @Delete(':id')
  @UseGuards(AuthGuard, ISAdmin)
  @ApiOperation({ summary: 'Delete cuisine (Admin only)' })
  remove(@Param('id') id: string) {
    return this.cuisineService.remove(id);
  }
}
