import { Injectable, ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
    constructor() {
        super({
            exceptionFactory: (errors: ValidationError[]) => {
                const formattedErrors = this.formatErrors(errors);
                return new BadRequestException({
                    status: 'error',
                    message: 'Validation failed',
                    errors: formattedErrors,
                });
            },
        });
    }

    // Hanya validasi format input, bukan pengecekan unik
    private formatErrors(errors: ValidationError[]): any {
        const formattedErrors = {};

        errors.forEach((error) => {
            if (error.constraints) {
                Object.keys(error.constraints).forEach((constraint) => {
                    if (!formattedErrors[error.property]) {
                        formattedErrors[error.property] = [];
                    }
                    formattedErrors[error.property].push(error.constraints[constraint]);
                });
            }
        });

        return formattedErrors;
    }
}
