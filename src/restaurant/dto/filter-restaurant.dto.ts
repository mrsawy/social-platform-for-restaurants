import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsMongoId, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterRestaurantDto {
  @ApiProperty({ 
    description: 'Filter by cuisine IDs (can provide multiple)',
    required: false,
    isArray: true,
    example: ['507f1f77bcf86cd799439011']
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  cuisines?: string[];

  @ApiProperty({ description: 'Page number', required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}