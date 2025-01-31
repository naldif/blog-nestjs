import { Body, Controller, Get, HttpStatus, Post, Query, Res, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { BlogService } from './blog.service';
import { sendResponse } from 'src/common/utils/response.util';
import { CustomValidationPipe } from 'src/common/pipes/validation.pipe';
import { CreateBlogDto } from 'src/common/dtos/blog/create-blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions } from 'src/common/utils/file-upload.util';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Get()
    async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Res() res: Response) {
        try {
            const { data, meta } = await this.blogService.findAllPaginate(+page, +limit);

            if(data.length === 0 ) {
                return sendResponse(res, 404, 'error', 'No data found');
            }

            sendResponse(res, HttpStatus.OK, 'success', 'Data retrieved successfully', data, meta);
        } catch (error) {
            sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', error.message);
        }
    }

    @Post()
    @UsePipes(CustomValidationPipe)
    @UseInterceptors(FileInterceptor('image', fileUploadOptions)) // Gunakan FileInterceptor untuk menangani upload
    async create(
        @Body() createBlogDto: CreateBlogDto, 
        @UploadedFile() file: Express.Multer.File, // Mengambil file yang diupload
        @Res() res: Response
    ) {
        try {
        const newBlog = await this.blogService.create(createBlogDto, file); // Kirim file ke service
            sendResponse(res, HttpStatus.OK, 'success', 'Blog created successfully', newBlog);
        } catch (error) {
            sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
        }
    }
}
