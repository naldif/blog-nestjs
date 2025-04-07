import { BadRequestException, Injectable } from '@nestjs/common';
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
            // Validasi unik (opsional tapi disarankan)
            const exists = await this.prisma.category.findUnique({
                where: { name: createCategoryDto.name },
            });
            if (exists) {
                throw new BadRequestException('Category name must be unique');
            }

            const newCategory = await this.prisma.category.create({
                data: {
                    name: createCategoryDto.name, // pastikan name ada dan valid
                },
            });

            return newCategory;
        } catch (error) {
            console.error('Error creating category:', error);
            throw new Error(`Error creating category: ${error.message}`);
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
