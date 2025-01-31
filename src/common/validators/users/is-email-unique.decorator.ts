import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsEmailUnique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,  // Pastikan validationOptions diteruskan
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const prismaService = new PrismaService(); // Pastikan PrismaService terinisialisasi
          const user = await prismaService.user.findUnique({
            where: { email: value },
          });
          return !user; // Jika user ditemukan, return false (invalid)
        },
      },
    });
  };
}
