import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { IsEmailUnique } from '../../common/validators/users/is-email-unique.decorator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmailUnique({ message: 'Email is already taken' })
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;
}