/**
File Name : jwt-auth.guard
Description : JWT Auth Guard
Author : 박수정

History
Date        Author      Status      Description
2024.08.04  박수정      Created     
2024.08.04  박수정      Modified    JWT Auth Guard 기능 추가
*/

import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        req.user = user;

        return user;
    }
}
