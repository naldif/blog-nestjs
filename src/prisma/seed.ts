// src/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Seeding database...');

    // Fungsi untuk meng-hash password
    const hashPassword = async (password: string): Promise<string> => {
        const saltRounds = 10; // Jumlah salt rounds (tingkat kekuatan hashing)
        return await bcrypt.hash(password, saltRounds);
    };

    // Buat atau hubungkan permission
    const permissions = ['read_users', 'delete_users', 'create_users'];

    const permissionObjects = await Promise.all(
        permissions.map((name) =>
            prisma.permission.upsert({
                where: { name },
                update: {},
                create: { name },
            })
        )
    );

    // Buat atau hubungkan Role Admin
    const adminRole = await prisma.role.upsert({
        where: { name: 'admin' },
        update: {},
        create: {
            name: 'admin',
            permissions: {
                connect: permissionObjects.map((p) => ({ id: p.id })),
            },
        },
    });

    // Buat atau hubungkan Role User
    const userRole = await prisma.role.upsert({
        where: { name: 'user' },
        update: {},
        create: {
            name: 'user',
            permissions: {
                connect: { id: permissionObjects[0].id }, // Hanya 'read_users'
            },
        },
    });

    // Hash password
    const adminPassword = await hashPassword('admin123');
    const userPassword = await hashPassword('user123');

    // Buat atau hubungkan User Admin
    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@example.com',
            password: adminPassword,
            roles: { connect: { id: adminRole.id } },
        },
    });

    // Buat atau hubungkan User Biasa
    await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            name: 'Regular User',
            email: 'user@example.com',
            password: userPassword,
            roles: { connect: { id: userRole.id } },
        },
    });

    console.log('✅ Seeder selesai.');
}

main()
    .catch((e) => {
        console.error('❌ Error saat menjalankan seeder:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
