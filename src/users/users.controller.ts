import { Controller, Post, Body, Res, UsePipes, HttpStatus, Get, Query, Delete, Param, Put } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomValidationPipe } from '../common/pipes/validation.pipe';
import { sendResponse } from '../common/utils/response.util';
import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Res() res: Response) {
    try {
      const { data, meta } = await this.usersService.findAllPaginated(+page, +limit);

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
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const newUser = await this.usersService.create(createUserDto);
      sendResponse(res, HttpStatus.OK, 'success', 'User created successfully', newUser);
    } catch (error) {
      sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {

      const user = await this.usersService.findOne(id);

      if (!user) {
        return sendResponse(res, HttpStatus.NOT_FOUND, 'error', `User with ID ${id} not found.`, null);
      }

      return sendResponse(res, HttpStatus.OK, 'success', 'User fetched successfully', user);
    } catch (error) {
      return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
    }
  }

  @Put(':id')
  @UsePipes(CustomValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto,
    @Res() res: Response
  ) {
    try {

      const existingUser = await this.usersService.findById(id);
      if (!existingUser) {
        return sendResponse(res, HttpStatus.NOT_FOUND, 'error', `User with ID ${id} not found.`, null);
      }

      const updatedUser = await this.usersService.update(id, updateData);

      return sendResponse(res, HttpStatus.OK, 'success', 'User updated successfully', updatedUser);
    } catch (error) {
      return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.usersService.findById(id);
      if (!user) {
        return sendResponse(res, HttpStatus.NOT_FOUND, 'error', `User with ID ${id} not found.`, null);
      }

      await this.usersService.delete(id);

      return sendResponse(res, HttpStatus.OK, 'success', `User with ID ${id} has been deleted successfully.`, null);
    } catch (error) {
      return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
    }
  }
}
