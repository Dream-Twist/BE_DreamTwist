/**
File Name : user.entity
Description : User Entity
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created
2024.07.20  박수정      Modified    회원 기능 추가
2024.08.01  박수정      Modified    Entity 변경
2024.08.02  박수정      Modified    DB 컬럼명 수정
2024.08.03  박수정      Modified    공통 필드 Entity 생성
*/

import { CommonEntity } from 'shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('users')
export class User extends CommonEntity {
    @Column({ name: 'profile_image_id' })
    profileImageId: number;

    @Column({ name: 'google_id' })
    googleId: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({ unique: true })
    nickname: string;

    @Column({ name: 'is_online', default: false })
    isOnline: boolean;

    @Column({ name: 'refresh_token', nullable: true })
    refreshToken: string;
}
