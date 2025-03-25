// src/auth/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true; // Jika @Public() ada, lewati autentikasi
        }

        const request = context.switchToHttp().getRequest<Request>();

        // Ambil token dari cookie jika tidak ada di Authorization header
        if (!request.headers.authorization && request.cookies?.access_token) {
            request.headers.authorization = `Bearer ${request.cookies.access_token}`;
        }

        return super.canActivate(context);
    }
}