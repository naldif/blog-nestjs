import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { BlogService } from './blog.service';
import { sendResponse } from 'src/common/utils/response.util';

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
}
