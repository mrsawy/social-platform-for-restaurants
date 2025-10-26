import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUserRequest } from 'src/auth/types/IUserRequest.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }




  @Get('recommendations')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get restaurant recommendations based on user preferences',
    description: 'Returns a list of recommended restaurants'
  })
  @ApiResponse({ status: 200, description: 'Recommended restaurants retrieved successfully' })
  async getRecommendations(@Request() request: IUserRequest) {
    return await this.userService.getRecommendations(request.user.id.toString());
  }
}
