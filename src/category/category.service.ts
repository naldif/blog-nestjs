import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) { }

  async findById(id: string) {
      return this.prisma.category.findUnique({
        where: { id: id }
      })
  }

  async create(createCategoryDto: CreateCategoryDto) {
      try {
          const newCategory = await this.prisma.category.create({
            data: createCategoryDto,
          });

          return newCategory;
      } catch (error) {
          console.error('Error creating categoru:', error);
          throw new Error(`Error creating blog: ${error.message}`);
      }
  }

  async findAll(page: number = 1, limit: number = 10) {
      const skip = (page - 1) * limit;
      const take = limit;

      const total = await this.prisma.category.count();

      const data = await this.prisma.category.findMany({
          skip,
          take,
          orderBy: {
            id: 'asc'
          }
      })

      const meta = {
          total,
          currentPage: page,
          lastPage: Math.ceil(total / limit),
          perPage: limit
      };

      return { data, meta }

  }

  findOne(id: string) {
      return this.prisma.category.findUnique({
          where: { id: id }
      })
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
      try {
          const updateCategory = await this.prisma.category.update({
            where: { id: id },
            data: updateCategoryDto
          })

          return updateCategory;
      } catch (error) {
          console.error('Terjadi kesalahan saat memperbarui category:', error);
          throw error;
      }
  }

  async remove(id: string) {
      try {
          await this.prisma.category.delete({
              where: { id: id }
          })
      } catch (error) {
          console.error('Terjadi kesalahan saat menghapus category:', error);
      }
  }
}
