import { Controller, Post, UseGuards, Request, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Public()
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const accessToken = await this.authService.login(loginDto);

    // Set token ke cookie
        res.cookie('access_token', accessToken, {
        httpOnly: true, // Mencegah akses cookie dari JavaScript (keamanan)
        secure: false, // Set `true` jika menggunakan HTTPS
        maxAge: 60 * 60 * 1000, // Expired dalam 1 jam
        });

        return res.json({ message: 'Login successful' });
    }
}
