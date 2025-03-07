import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { BlogService } from './blog.service';
import { sendResponse } from 'src/common/utils/response.util';
import { CustomValidationPipe } from 'src/common/pipes/validation.pipe';
import { CreateBlogDto } from 'src/blog/dto/create-blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions } from 'src/common/utils/file-upload.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateBlogDto } from 'src/blog/dto/update-blog.dto';

@Controller('blog')
export class BlogController {
    constructor(
        private readonly blogService: BlogService,
        private prisma: PrismaService,
    ) { }

    @Get()
    async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Res() res: Response) {
        try {
            const { data, meta } = await this.blogService.findAllPaginate(+page, +limit);

            if (data.length === 0) {
                return sendResponse(res, 404, 'error', 'No data found');
            }

            sendResponse(res, HttpStatus.OK, 'success', 'Data retrieved successfully', data, meta);
        } catch (error) {
            sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', error.message);
        }
    }

    @Post()
    @UsePipes(CustomValidationPipe)
    @UseInterceptors(FileInterceptor('image', fileUploadOptions)) // Gunakan interceptor untuk upload file
    async create(
        @Body() createBlogDto: CreateBlogDto,
        @UploadedFile() file: Express.Multer.File, // Mengambil file yang diupload
        @Res() res: Response
    ) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: createBlogDto.userId,
                },
            });

            if (!user) {
                return sendResponse(res, HttpStatus.NOT_FOUND, 'error', `User with ID ${createBlogDto.userId} not found.`, null);
            }

            // Cek apakah category dengan ID yang diberikan ada
            const category = await this.prisma.category.findUnique({
                where: {
                    id: createBlogDto.categoryId,
                },
            });

            if (!category) {
                return sendResponse(res, HttpStatus.NOT_FOUND, 'error', `Category with ID ${createBlogDto.categoryId} not found.`, null);
            }

            const newBlog = await this.blogService.create(createBlogDto, file);
            return sendResponse(res, HttpStatus.OK, 'success', 'Blog created successfully', newBlog);
        } catch (error) {
            return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {

            const blog = await this.blogService.findOne(id);

            if (!blog) {
                return sendResponse(res, HttpStatus.NOT_FOUND, 'error', `Blog with ID ${id} not found.`, null);
            }

            return sendResponse(res, HttpStatus.OK, 'success', 'Blog fetched successfully', blog);
        } catch (error) {
            return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
        }
    }

    @Put(':id')
    @UsePipes(CustomValidationPipe)
    @UseInterceptors(FileInterceptor('image', fileUploadOptions))
    async update(
        @Param('id') id: string,
        @Body() updateBlogDto: UpdateBlogDto,
        @UploadedFile() file: Express.Multer.File,
        @Res() res: Response
    ) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: updateBlogDto.userId,
                },
            });

            if (!user) {
                return sendResponse(res, HttpStatus.NOT_FOUND, 'error', `User with ID ${updateBlogDto.userId} not found.`, null);
            }

            // Cek apakah category dengan ID yang diberikan ada
            const category = await this.prisma.category.findUnique({
                where: {
                    id: updateBlogDto.categoryId,
                },
            });

            if (!category) {
                return sendResponse(res, HttpStatus.NOT_FOUND, 'error', `Category with ID ${updateBlogDto.categoryId} not found.`, null);
            }

            const existingBlog = await this.blogService.findById(id);
            if (!existingBlog) {
                return sendResponse(res, HttpStatus.NOT_FOUND, 'error', `User with ID ${id} not found`, null);
            }

            const updatedBlog = await this.blogService.update(id, updateBlogDto, file);
            return sendResponse(res, HttpStatus.OK, 'success', 'Blog updated successfully', updatedBlog);
        } catch (error) {
            return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
        }
    }

    @Delete(':id')
    async delete(@Param('id') id:string, @Res() res: Response) {
        try {
            const blog = await this.blogService.findById(id);
            if(!blog) {
                return sendResponse(res, HttpStatus.NOT_FOUND, 'error', `Blog with ID ${id} not found.`, null);
            }

            await this.blogService.delete(id);

            return sendResponse(res, HttpStatus.OK, 'success', `Blog with ID ${id} has been deleted successfully.`,  null);
        } catch (error) {
            return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
        }
    }

}
