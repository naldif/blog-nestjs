import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Res, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CustomValidationPipe } from 'src/common/pipes/validation.pipe';
import { sendResponse } from 'src/common/utils/response.util';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @UsePipes(CustomValidationPipe)
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @Res() res: Response
    ) {
        try {
            const newCategory = await this.categoryService.create(createCategoryDto);
            return sendResponse(res, HttpStatus.OK, 'success', 'Category created successfully', newCategory);
        } catch (error) {
            return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', error.message);
        }
    }

    @Get()
    async findAll(
        @Query('page') page = 1, 
        @Query('limit') limit = 10,
        @Res() res: Response
    ) {
        try {
            const {data, meta} = await this.categoryService.findAll(+page, +limit);

            if (data. length === 0) {
                return sendResponse(res, 404, 'error', 'No data found');
            }

            sendResponse(res, HttpStatus.OK, 'success', 'Data retrieved succesfully', data, meta);
        } catch (error) {
            sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', error.message);
        } 
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {
            const category = await this.categoryService.findOne(id);

            if(!category) {
                return sendResponse(res, HttpStatus.NOT_FOUND, 'error', `Category with ID ${id} not found.`, null);
            }

            return sendResponse(res, HttpStatus.OK, 'success', 'Category fatched successfully', category);
        } catch (error) {
            return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
        }
    }

    @Patch(':id')
    @UsePipes(CustomValidationPipe)
    async update(
        @Param('id') id: string, 
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Res() res: Response
    ) {
        try {
            const existingCategory = await this.categoryService.findById(id);
            if (!existingCategory) {
                return sendResponse(res, HttpStatus.NOT_FOUND, 'error', `Category with ID ${id} not found`, null);
            }

            const updateCategory = await this.categoryService.update(id, updateCategoryDto);
            return sendResponse(res, HttpStatus.OK, 'success', 'Blog updated successfully', updateCategory);
          } catch (error) {
            
            return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
        }
    } 

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        try {
            const category = await this.categoryService.findById(id);
            if(!category) {
                return sendResponse(res, HttpStatus.NOT_FOUND, 'error', `Category with ID ${id} not found`, null);
            }

            await this.categoryService.remove(id);

            return sendResponse(res, HttpStatus.OK, 'success', `Category with ID ${id} has been deleted successfully.`, null);
        } catch (error) {
            return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
        }
    }
}
