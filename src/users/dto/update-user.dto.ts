import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    name?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Invalid email format' })
    email?: string;
}