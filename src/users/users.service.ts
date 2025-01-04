/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../common/dtos/create-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findByEmail(email: string) {
      return await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
    }
    
    //Get all users
    async findAllPaginated(page: number = 1, limit: number = 10) {
      const skip = (page - 1) * limit;
      const take = limit;
    
      // Hitung total data
      const total = await this.prisma.user.count();
    
      // Ambil data dengan pagination
      const data = await this.prisma.user.findMany({
        skip,
        take,
        orderBy: {
          id: 'asc', // Contoh: Urutkan berdasarkan `createdAt`
        },
      });
    
      // Metadata
      const meta = {
        total,
        currentPage: page,
        lastPage: Math.ceil(total / limit),
        perPage: limit,
      };
    
      return { data, meta };
    }
    

    //Create new user
    async create(createUserDto: CreateUserDto) {
      try {

        // Membuat user baru
        const newUser = await this.prisma.user.create({
          data: createUserDto,
        });
  
        return newUser;
      } catch (error) {
        throw error; // Error ini akan ditangani oleh controller
      }
    }
}