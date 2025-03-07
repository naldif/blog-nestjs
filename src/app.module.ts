/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BlogModule } from './blog/blog.module';
import { CategoryModule } from './category/category.module';
import { IsUniqueConstraint } from './common/validators/is-unique.validator';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersModule, BlogModule, CategoryModule, PrismaModule],
  controllers: [AppController],
  providers: [PrismaService, AppService, IsUniqueConstraint],
  exports: [IsUniqueConstraint],
})
export class AppModule {}
