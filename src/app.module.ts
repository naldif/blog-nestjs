import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BlogModule } from './blog/blog.module';
import { CategoryModule } from './category/category.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { IsUniqueConstraint } from './common/validators/is-unique.validator';
import { CategoryService } from './category/category.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    UsersModule,
    BlogModule,
    CategoryModule, 
    AuthModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    CategoryService,
    PrismaService,
    IsUniqueConstraint],
  exports: [IsUniqueConstraint],
})
export class AppModule {}
