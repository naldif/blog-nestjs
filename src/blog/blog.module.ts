import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  providers: [
    BlogService,
    PrismaService,
  ],
  controllers: [BlogController],
  exports: [BlogService],
})
export class BlogModule {}
