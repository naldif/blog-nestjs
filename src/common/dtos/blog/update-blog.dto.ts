import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateBlogDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsString()
    @IsOptional()
    image?: string;

    @IsEnum(Status)
    @IsOptional()
    status?: Status;
}