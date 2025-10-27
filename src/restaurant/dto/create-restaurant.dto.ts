import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayMinSize, ArrayMaxSize, IsNotEmpty, IsNumber, IsMongoId } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRestaurantDto {
    @ApiProperty({ example: 'KFC' })
    @IsString()
    @IsNotEmpty()
    nameEnglish: string;

    @ApiProperty({ example: 'البيك' })
    @IsString()
    @IsNotEmpty()
    nameArabic: string;

    @ApiProperty({ example: 'kfc' })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty({ example: ['Asian', 'Burgers'], isArray: true })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(3)
    @IsMongoId({ each: true })
    cuisinesIds: string[];

    @ApiProperty({ example: [31.2357, 30.0444], description: '[longitude, latitude]' })
    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    @IsNumber({}, { each: true })
    coordinates: number[];

}
