import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {
        console.log('🔥 PrismaService tersedia di Validator:', !!this.prisma);
    }

    async validate(value: any, args: ValidationArguments) {
        if (!this.prisma) {
            throw new Error('❌ PrismaService tidak tersedia di IsUniqueConstraint!');
        }

        const [model, column] = args.constraints;

        if (!(model in this.prisma)) {
            throw new Error(`❌ Model ${model} tidak ditemukan di Prisma!`);
        }

        const modelInstance = (this.prisma as any)[model];

        if (!modelInstance || typeof modelInstance.findUnique !== 'function') {
            throw new Error(`❌ Model ${model} tidak memiliki metode findUnique!`);
        }

        const exists = await modelInstance.findUnique({
            where: { [column]: value },
        });

        return !exists;
    }

    defaultMessage(args: ValidationArguments) {
        const [model, column] = args.constraints;
        return `${column} sudah digunaka n di tabel ${model}`;
    }
}

export function IsUnique(model: string, column: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [model, column],
            validator: IsUniqueConstraint,
        });
    };
}