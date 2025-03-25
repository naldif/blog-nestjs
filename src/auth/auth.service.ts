import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    // src/auth/auth.service.ts
    async login(loginDto: LoginDto): Promise<string> {
        const { email, password } = loginDto;
        const user = await this.usersService.findByEmail(email);
    
        if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
        }
    
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload); // Pastikan hanya mengembalikan token string
    }
  
}
