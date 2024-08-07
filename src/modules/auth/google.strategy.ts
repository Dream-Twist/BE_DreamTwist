/**
File Name : google.strategy
Description : Google Strategy
Author : 박수정

History
Date        Author      Status      Description
2024.07.30  박수정      Created     
2024.08.01  박수정      Modified    Google Strategy 추가
*/

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.CALL_BACK_URL,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { id, emails, name } = profile;
        const fullName = name.familyName ? `${name.givenName} ${name.familyName}` : name.givenName;

        const user = {
            googleId: id,
            email: emails[0].value,
            name: fullName,
        };

        done(null, user);
    }
}
