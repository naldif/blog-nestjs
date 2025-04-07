import { IsNotEmpty, IsString,  } from "class-validator";
import { IsUnique } from "src/common/validators/is-unique.validator";

export class CreateCategoryDto {

    @IsNotEmpty()
    @IsString()
    @IsUnique('category', 'name', { message: 'Category name must be unique' })
    name: string;
}
