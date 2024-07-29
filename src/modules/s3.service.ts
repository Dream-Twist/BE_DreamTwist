/**
File Name : s3.service
Description : AWS S3 Service
Author : 박수정

History
Date        Author      Status      Description
2024.07.27  박수정      Created     
2024.07.27  박수정      Modified    AWS S3 설정 추가
*/

import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
    private s3Client: S3Client;
    private readonly defaultImgUrl: string;
    private readonly bucketName: string;
    private readonly region: string;
    private readonly accessKeyId: string;
    private readonly secretAccessKey: string;

    constructor(private configService: ConfigService) {
        this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME');
        this.region = this.configService.get('AWS_REGION');
        this.accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        this.secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');

        this.s3Client = new S3Client({
            region: this.configService.get('AWS_REGION'),
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            },
        });

        this.defaultImgUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/img/imgjpg.jpg`;
    }

    async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        try {
            await this.s3Client.send(command);
            return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
        } catch (err) {
            console.error('Error', err);
            throw new Error('이미지 업로드에 실패했습니다.');
        }
    }

    getDefaultImgUrl(): string {
        return this.defaultImgUrl;
    }
}
