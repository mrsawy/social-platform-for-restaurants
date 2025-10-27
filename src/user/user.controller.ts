import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUserRequest } from 'src/auth/types/IUserRequest.interface';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: User, // you can switch to UserResponseDto later
  })


  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Conflict error' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }


  @Get('recommendations')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get restaurant recommendations based on user preferences' })
  @ApiResponse({ status: 200, description: 'Recommended restaurants retrieved successfully' })
  async getRecommendations(@Request() request: IUserRequest) {
    console.log('User from request:', request.user);
    return await this.userService.getRecommendations(request.user._id as string);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get user by id or email/username/phone' })
  @ApiOkResponse({
    description: 'User found and returned',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }


}
