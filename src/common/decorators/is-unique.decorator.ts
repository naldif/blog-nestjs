import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsUniqueConstraint } from '../validators/is-unique.validator';

export function IsUnique(table: string, column: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [table, column],
            validator: IsUniqueConstraint,
        });
    };
}
