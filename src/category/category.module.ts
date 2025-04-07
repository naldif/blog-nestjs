import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IsUniqueConstraint } from 'src/common/validators/is-unique.validator';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    PrismaService, // <== WAJIB
    IsUniqueConstraint, // <== WAJIB
  ],
})
export class CategoryModule {}