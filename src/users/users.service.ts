import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../common/dtos/users/create-user.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from 'src/common/dtos/users/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findById(userId: number): Promise<any> {
    // Cari user berdasarkan ID
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  //Get all users
  async findAllPaginated(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const take = limit;
  
    // Hitung total data
    const total = await this.prisma.user.count();
  
    // Ambil data dengan pagination tanpa password
    const data = await this.prisma.user.findMany({
      skip,
      take,
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: false, // Jangan sertakan password
      },
    });    
  
    // Metadata untuk pagination
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
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });
      return newUser;
    } catch (error) {
      console.error('Error hashing password:', error);  // Log error hashing
      throw error;  // Lempar error jika perlu
    }    
  }

  // Fungsi untuk mendapatkan user berdasarkan ID
  async findOne(userId: number): Promise<User | null> {
    // Cari user berdasarkan ID
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  // Fungsi untuk mengupdate user berdasarkan ID
  async update(userId: number, updateData: UpdateUserDto): Promise<User> {
    // Update user dengan data baru
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async delete(userId: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}