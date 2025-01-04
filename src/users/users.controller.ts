import { Controller, Post, Body, Res, UsePipes, UseFilters, HttpStatus, Get, Query, ConflictException } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '../common/dtos/create-user.dto';
import { CustomValidationPipe  } from '../common/pipes/validation.pipe';
import { sendResponse } from '../common/utils/response.util';
import { UsersService } from './users.service';


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

        sendResponse(res, HttpStatus.OK, 'success', 'Data retrieved successfully', data, null, meta);
      } catch (error) {
        sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
      }
    }

    @Post()
    @UsePipes(CustomValidationPipe) // Gunakan CustomValidationPipe untuk validasi format
    async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
      try {
        const newUser = await this.usersService.create(createUserDto);
        sendResponse(res, HttpStatus.OK, 'success', 'User created successfully', newUser);
      } catch (error) {
        sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
      }
    }
    // @Post()
    // @UsePipes(new ValidationPipe({ transform: true }))  // Gunakan ValidationPipe standar
    // async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    //     try {
    //     const newUser = await this.usersService.create(createUserDto);
    //     res.status(HttpStatus.CREATED).json({
    //         statusCode: HttpStatus.CREATED,
    //         message: 'User created successfully',
    //         data: newUser,
    //     });
    //     } catch (error) {
    //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    //         message: 'Something went wrong',
    //         error: error.message,
    //     });
    //     }
    // }

    // @Get(':id')
    // async findOne(@Param('id') id: string, @Res() res: Response) {
    //     try {
    //         const numericId = parseInt(id, 10); // Konversi id menjadi number
    //         if (isNaN(numericId)) {
    //             return sendResponse(res, HttpStatus.BAD_REQUEST, 'error', 'Invalid ID format', null);
    //         }

    //         const user = await this.usersService.findOne(numericId);

    //         if (!user) {
    //             return sendResponse(res, HttpStatus.NOT_FOUND, 'error', 'User not found', null);
    //         }

    //         return sendResponse(res, HttpStatus.OK, 'success', 'Users fetched successfully', user);
    //     } catch (error) {
    //         return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
    //     }
    // }

   
    // @Put(':id')
    // async update(
    //     @Param('id') id: number,
    //     @Body() updateData: { name?: string; email?: string },
    //     @Res() res: Response
    // ) {
    //     try {
    //         const updatedUser = await this.usersService.update(id, updateData);

    //         if (!updatedUser) {
    //             return sendResponse(res, HttpStatus.NOT_FOUND, 'error', 'User not found', null);
    //         }

    //         sendResponse(res, HttpStatus.OK, 'success', 'User updated successfully', updatedUser);
    //     } catch (error) {
    //         sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
    //     }
    // }

    // @Delete(':id')
    // async delete(@Param('id') id: string, @Res() res: Response) {
    //     try {
    //         const numericId = parseInt(id, 10); // Konversi id menjadi number

    //         // Validasi format ID
    //         if (isNaN(numericId)) {
    //             return sendResponse(res, HttpStatus.BAD_REQUEST, 'error', 'Invalid ID format', null);
    //         }

    //         // Coba hapus user berdasarkan ID
    //         const deletedUser = await this.usersService.delete(numericId);

    //         // Jika user tidak ditemukan
    //         if (!deletedUser) {
    //             return sendResponse(res, HttpStatus.NOT_FOUND, 'error', 'User not found', null);
    //         }

    //         // Jika user berhasil dihapus
    //         sendResponse(res, HttpStatus.OK, 'success', 'User deleted successfully', deletedUser);
    //     } catch (error) {
    //         sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'error', 'Something went wrong', null, error.message);
    //     }
    // }

}
