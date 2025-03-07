import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {}

    async validate(value: any, args: ValidationArguments) {
        if (!this.prisma) {
            console.error('⚠️ PrismaService tidak tersedia!');
            return false;
        }

        const [tableName, columnName] = args.constraints;
    
        if (!tableName || !columnName) {
            console.error('⚠️ Parameter tableName atau columnName tidak ditemukan!');
            return false;
        }
    
        const model = (this.prisma as any)[tableName];
    
        if (!model) {
            console.error(`⚠️ Model '${tableName}' tidak ditemukan di Prisma!`);
            return false;
        }
    
        try {
            const exists = await model.findFirst({
            where: { [columnName]: value },
            });
    
            return !exists;
        } catch (error) {
            console.error(`⚠️ Error Prisma saat mengecek uniqueness: ${error.message}`);
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        const [tableName, columnName] = args.constraints;
        return `${columnName} sudah digunakan. Harap pilih yang lain.`;
    }
}
