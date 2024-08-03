/**
File Name : fairytale.entity
Description : 동화 스토리 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created     
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
2024.08.01  박수정      Modified    Entity 변경
2024.08.02  박수정      Modified    DB 컬럼명 수정
*/

import { Entity, Column, BaseEntity } from 'typeorm';

@Entity('fairytale')
export class Fairytale extends BaseEntity {
    @Column({ name: 'user_id' })
    userId: number;

    @Column()
    title: string;

    @Column({
        type: 'enum',
        enum: ['우화', '환경', '사랑', '모험', '추리', '기타'],
    })
    theme: string;

    @Column('json')
    content: JSON;

    @Column({ name: 'privated_at', type: 'timestamp', nullable: true })
    privatedAt: Date;
}
