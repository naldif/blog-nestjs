import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from 'src/blog/dto/create-blog.dto';
import { PrismaService } from '../prisma/prisma.service';
import slugify from 'slugify';
import { Blog } from '@prisma/client';
import { UpdateBlogDto } from 'src/blog/dto/update-blog.dto';
import { deleteImageFromStorage } from 'src/common/utils/image-service.util';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BlogService {
    constructor(private prisma: PrismaService) { }

    async findById(blogId: string): Promise<any> {
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
            orderBy: { id: 'asc' },
            select: {
                id: true,
                title: true,
                description: true,
                slug: true,
                image: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                user: { select: { name: true } }, // Gunakan 'user' karena ini sesuai model
                category: { select: { name: true } }
            },
        });
    
        // Mapping ulang untuk mengganti 'user' menjadi 'author'
        const formattedData = data.map(({ user, category, ...blog }) => ({
            ...blog,
            author: user.name, // Menggunakan user.name dan memberi alias 'author'
            category: category.name
        }));
    
        const meta = {
            total,
            currentPage: page,
            lastPage: Math.ceil(total / limit),
            perPage: limit,
        };
    
        return { data: formattedData, meta };
    }

    async create(createBlogDto: CreateBlogDto, file: Express.Multer.File) {
        try {
            const slug = slugify(createBlogDto.title, {
                lower: true,
                strict: true,
                trim: true,
            });

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

    async findOne(blogId: string): Promise<Partial<Blog> | null> {
        return this.prisma.blog.findUnique({
            where: { id: blogId }
        })
    }

    async update(blogId: string, updateData: UpdateBlogDto, file: Express.Multer.File): Promise<Blog> {
        try {

            // Mengambil data blog yang ada untuk mengecek gambar lama
            const existingBlog = await this.prisma.blog.findUnique({
                where: { id: blogId },
                select: { image: true },  // Hanya mengambil field 'image' untuk mengecek apakah gambar ada
            });

            // Jika ada gambar baru yang diunggah, hapus gambar lama
            if (file && existingBlog?.image) {
                // Debug log untuk memeriksa path gambar lama
                await deleteImageFromStorage(existingBlog.image); // Hapus gambar lama
            }

            // Jika ada file baru, simpan gambar baru dan ambil path-nya
            let newImagePath = existingBlog?.image; // Jika tidak ada gambar baru, gunakan gambar lama

            if (file) {
                // Menyimpan gambar baru dan mendapatkan path-nya
                newImagePath = await this.saveImage(file);
            }

            const slug = slugify(updateData.title, {
                lower: true,
                strict: true,
                trim: true,
            });

            // Update data blog dengan path gambar baru (atau gambar lama jika tidak ada gambar baru)
            const updatedData = {
                ...updateData,
                image: newImagePath, 
                slug: slug,
            };

            // Mengupdate data blog di database
            const updatedBlog = await this.prisma.blog.update({
                where: { id: blogId },
                data: updatedData,
            });

            return updatedBlog;
        } catch (error) {
            console.error('Terjadi kesalahan saat memperbarui blog:', error);
            throw error;  // Lemparkan error untuk ditangani lebih lanjut
        }
    }

    async delete(blogId: string): Promise<void> {
        try {
            // Cari blog terlebih dahulu
            const blog = await this.prisma.blog.findUnique({
                where: { id: blogId },
                select: { image: true }, // Ambil hanya field image
            });

            // Hapus gambar jika ada
            if (blog.image) {
                await deleteImageFromStorage(blog.image);
            }

            // Hapus data blog dari database
            await this.prisma.blog.delete({
                where: { id: blogId },
            });

            console.log(`Blog dengan ID ${blogId} berhasil dihapus`);
        } catch (error) {
            console.error('Terjadi kesalahan saat menghapus blog:', error);
            throw error;
        }
    }

    async saveImage(file: Express.Multer.File): Promise<string> {
        const uploadPath = path.resolve(__dirname, '..', 'uploads', file.filename); // Save in the uploads folder (adjust as needed)
        console.log('Path gambar baru', uploadPath);
        try {
            // You can store the file in your server's 'uploads' folder or a cloud service
            // For simplicity, we just return the filename here, but it can be the full URL or path if using cloud storage
            return `/uploads/${file.filename}`; // You could store the full path or URL if you're using cloud storage (e.g., S3)
        } catch (error) {
            console.error('Error saving image:', error);
            throw new Error('Failed to save the image');
        }
    }

}
