import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCuisineDto {
    @ApiProperty({ example: 'Asian' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'asian' })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty({ example: 'Asian cuisine including Chinese, Japanese, Thai, etc.', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}