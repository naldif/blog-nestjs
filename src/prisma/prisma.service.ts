import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect(); // Menghubungkan Prisma ke database
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Menutup koneksi Prisma
  }
}
