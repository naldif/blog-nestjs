import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsEnum(Status)
    status: Status = Status.WAITING;

    @IsOptional() // UserId akan diproses dari request atau konteks autentikasi
    userId: number;
}
