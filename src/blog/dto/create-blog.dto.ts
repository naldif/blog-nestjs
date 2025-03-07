import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { Status } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateBlogDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    slug?: string; // Bisa kosong karena di-generate otomatis

    @IsOptional()
    @IsString()
    image?: string; // Bisa kosong jika tidak ada file yang di-upload

    @IsEnum(Status)
    status: Status = Status.WAITING;

    @IsOptional()
    @Type(() => String)
    userId: string;

    @IsNotEmpty()
    categoryId: string;

}  
