import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from 'src/common/dtos/blog/create-blog.dto';
import { PrismaService } from '../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class BlogService {
    constructor(private prisma: PrismaService) { }

    async findById(blogId: number): Promise<any> {
        //cari blog berdasarkan ID
        return this.prisma.blog.findUnique({
            where: { id: blogId },
        });
    }

    async findAllPaginate(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const take = limit;

        const total = await this.prisma.blog.count();

        const data = await this.prisma.blog.findMany({
            skip,
            take,
            orderBy: {
                id: 'asc',
            },
        });

        const meta = {
            total,
            currentPage: page,
            lastPage: Math.ceil(total / limit),
            perPage: limit
        };

        return { data, meta }
    }

    async create(createBlogDto: CreateBlogDto, file: Express.Multer.File) {
        try {
            const slug = slugify(createBlogDto.title, {
                lower: true,
                strict: true,
                trim: true,
            });

            // const userId = Number(createBlogDto.userId);

            const newBlog = await this.prisma.blog.create({
                data: {
                    ...createBlogDto,
                    slug: slug,
                    image: file ? `/uploads/${file.filename}` : null,
                   
                },
            });

            return newBlog;
        } catch (error) {
            console.error('Error creating blog:', error);
            throw new Error(`Error creating blog: ${error.message}`);
        }
    }
}
