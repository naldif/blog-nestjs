/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    private users = [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Doe", email: "jane@example.com" },
    ]

    async findAll() {
        return this.users;
    }

    async findOne(id: number) {
        return this.users.find(user => user.id === id);
        // return user || null; // Return `null` jika user tidak ditemukan
    }
    
    async create(user: { name: string; email: string }) {
        const newUser = { id: this.users.length + 1, ...user };
        this.users.push(newUser);
        return newUser;
    }

    async update(id: number, updateData: { name?: string; email?: string }) {
        const userIndex = this.users.findIndex(user => user.id === +id); // Gunakan '+' untuk mengonversi string ke number

        if (userIndex === -1) {
            return null; // Return null jika user tidak ditemukan
        }

        this.users[userIndex] = { ...this.users[userIndex], ...updateData };
        return this.users[userIndex];
    }
    
    async delete(id: number) {
        const userIndex = this.users.findIndex(user => user.id === id);
    
        if (userIndex === -1) {
            return null; // Return null jika user tidak ditemukan
        }
    
        const deletedUser = this.users[userIndex]; // Simpan user yang dihapus
        this.users.splice(userIndex, 1); // Hapus user dari array
    
        return deletedUser; // Kembalikan data user yang dihapus
    }
}