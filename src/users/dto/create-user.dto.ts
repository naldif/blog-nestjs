import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { IsUnique } from 'src/common/decorators/is-unique.decorator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsUnique('user', 'email', { message: 'Email is already taken' })
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;
}