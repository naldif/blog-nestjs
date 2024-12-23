/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    
    private users = [
        { id:1, name:"Jhon Doe", email: "john@example.com" },
        { id:2, name:"Jane Doe", email: "jane@example.com" },
    ]

    async findAll() {
        return this.users;
    }

    findOne(id: number) {
        return this.users.find(user => user.id === id);
    }

   async create(user: {name: string; email: string}){
        const newUser = { id: this.users.length + 1, ...user};
        this.users.push(newUser);
        return newUser;
    }

    delete(id: number){
        this.users = this.users.filter(user => user.id !== id);
        return {message: `User with id ${id} deleted`};
    }
}
