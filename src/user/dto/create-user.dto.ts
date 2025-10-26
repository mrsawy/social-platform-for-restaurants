import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional, IsObject, IsEnum, IsNumber, IsMongoId, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
    @IsOptional()
    @IsString()
    detailedAddress?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    zipCode?: string;

    @IsNotEmpty()
    @IsString()
    country: string;
}

export class SocialLinksDto {
    @IsOptional()
    @IsString()
    linkedin?: string;

    @IsOptional()
    @IsString()
    twitter?: string;
}

export class ProfileDto {

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    dateOfBirth?: Date;

    @IsOptional()
    @IsObject()
    @Type(() => AddressDto)
    address?: AddressDto;

    @IsOptional()
    @IsObject()
    @Type(() => SocialLinksDto)
    socialLinks?: SocialLinksDto;
}

export class PreferencesDto {
    @IsOptional()
    @IsString()
    language?: string;

    @IsOptional()
    @IsBoolean()
    darkMode?: boolean;
}

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Matches(/^\+?\d+$/, { message: 'Phone must contain only digits and may start with +' })
    phone: string;


    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    fullName?: string;
    
    @IsObject()
    @Type(() => ProfileDto)
    profile?: ProfileDto;

    @IsOptional()
    @IsObject()
    @Type(() => PreferencesDto)
    preferences?: PreferencesDto;
}