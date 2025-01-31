import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateBlogDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    slug: string;

    image: string;

    @IsEnum(Status)
    status: Status = Status.WAITING;

    @IsOptional() // UserId akan diproses dari request atau konteks autentikasi
    @Type(() => Number) // Mengonversi userId ke tipe number
    userId: number;
}  
