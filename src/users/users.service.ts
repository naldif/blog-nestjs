/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    //Get all users
    async getAll() {
        return this.prisma.user.findMany();
    }

    //Create new user
    async create(createUserDto: CreateUserDto) {
        // Periksa apakah email sudah ada
        const existingUser = await this.prisma.user.findUnique({
          where: { email: createUserDto.email },
        });
    
        if (existingUser) {
          // Jika email sudah ada, lemparkan ConflictException dengan pesan khusus
          return {
            status: 'error',
            message: {
              email: ['Email already in use'],
            },
          };
        }
    
        // Jika tidak ada, lanjutkan untuk membuat user
        return this.prisma.user.create({
          data: createUserDto,
        });
      }
    
}