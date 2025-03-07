import { IsNotEmpty, IsString,  } from "class-validator";
import { IsUnique } from "src/common/decorators/is-unique.decorator";

export class CreateCategoryDto {

    @IsNotEmpty()
    @IsString()
    @IsUnique('category', 'name', { message: 'Name is already taken' })
    name: string;
}
