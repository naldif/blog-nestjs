/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { sendResponse } from '../common/helpers/response.helper';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll(@Res() res: Response) {
        try {
            const users = await this.usersService.findAll(); 
            sendResponse(res, HttpStatus.OK, 'success', 'Users fetched successfully', users);
        } catch (error) {
            sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {
            const numericId = parseInt(id, 10); // Konversi id menjadi number
            if (isNaN(numericId)) {
                return sendResponse(res, HttpStatus.BAD_REQUEST, 'error', 'Invalid ID format', null);
            }

            const user = await this.usersService.findOne(numericId);

            if (!user) {
                return sendResponse(res, HttpStatus.BAD_REQUEST, 'error', 'User not found', null);
            }

            sendResponse(res, HttpStatus.OK, 'success', 'Users fetched successfully', user);
        } catch (error) {
            sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
        }
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

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateData: { name?: string; email?: string },
        @Res() res: Response
    ) {
        try {
            const updatedUser = await this.usersService.update(id, updateData);

            if (!updatedUser) {
                return sendResponse(res, HttpStatus.NOT_FOUND, 'error', 'User not found', null);
            }

            sendResponse(res, HttpStatus.OK, 'success', 'User updated successfully', updatedUser);
        } catch (error) {
            sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Res() res: Response) {
        try {
            const numericId = parseInt(id, 10); // Konversi id menjadi number

            // Validasi format ID
            if (isNaN(numericId)) {
                return sendResponse(res, HttpStatus.BAD_REQUEST, 'error', 'Invalid ID format', null);
            }

            // Coba hapus user berdasarkan ID
            const deletedUser = await this.usersService.delete(numericId);

            // Jika user tidak ditemukan
            if (!deletedUser) {
                return sendResponse(res, HttpStatus.NOT_FOUND, 'error', 'User not found', null);
            }

            // Jika user berhasil dihapus
            sendResponse(res, HttpStatus.OK, 'success', 'User deleted successfully', deletedUser);
        } catch (error) {
            sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
        }
    }

}
