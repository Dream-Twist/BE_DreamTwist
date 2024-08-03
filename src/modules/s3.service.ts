/**
File Name : s3.service
Description : AWS S3 Service
Author : 박수정

History
Date        Author      Status      Description
2024.07.27  박수정      Created     
2024.07.27  박수정      Modified    AWS S3 설정 추가
2024.08.02  박수정      Modified    이미지 업로드 방식 변경 - Presigned URL
2024.08.02  원경혜      Modified    AI 이미지 업로드 추가
*/

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
    private s3Client: S3Client;
    private readonly defaultImgURL: string;
    private readonly bucketName: string;
    private readonly region: string;

    constructor(private configService: ConfigService) {
        this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME');
        this.region = this.configService.get('AWS_REGION');

        this.s3Client = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            },
        });

        this.defaultImgURL = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/img/imgjpg.jpg`;
    }

    // 서버가 S3에 이미지 직접 업로드
    async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        try {
            await this.s3Client.send(command);
            return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
        } catch (err) {
            console.error('Error', err);
            throw new InternalServerErrorException('이미지 업로드에 실패했습니다.');
        }
    }

    // S3에서 Presigned URL 생성 요청
    async generatePresignedURL(key: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        try {
            return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
        } catch (err) {
            console.error('Error', err);
            throw new InternalServerErrorException('Presigned URL 생성에 실패했습니다.');
        }
    }

    getDefaultImgURL(): string {
        return this.defaultImgURL;
    }

    // S3에 AI 이미지 업로드
    async uploadAiImage(fileName: string, fileStream: Readable): Promise<string> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
                Body: fileStream,
                ContentType: 'image/png',
                ACL: 'public-read',
            });

            await this.s3Client.send(command);
            return `http://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
        } catch (err) {
            console.error('Error', err);
            throw new Error('이미지 업로드에 실패했습니다.'); // 500 에러
        }
    }
}
