/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(Number(id));
    }

    @Post()
    create(@Body() user: {name: string; email: string}){
        return this.usersService.create(user);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.usersService.delete(Number(id));
    }
}
