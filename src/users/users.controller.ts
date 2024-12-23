/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { sendResponse } from '../common/helpers/response.helper';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @UseInterceptors(ResponseInterceptor)
    async findAll(@Res() res: Response) {
        try {
            const users = await this.usersService.findAll(); 
            sendResponse(res, HttpStatus.OK, 'success', 'Users fetched successfully', users);
        } catch (error) {
            sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(Number(id));
    }

    @Post()
    async create(
        @Body() user: { name: string; email: string },
        @Res() res: Response
    ) {
        try {
            const newUser = await this.usersService.create(user);
            sendResponse(res, HttpStatus.CREATED, 'success', 'User created successfully', newUser);
        } catch (error) {
            sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
        }
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.usersService.delete(Number(id));
    }
}
