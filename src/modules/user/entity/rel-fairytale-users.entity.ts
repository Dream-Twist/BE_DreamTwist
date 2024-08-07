/**
File Name : rel-fairytale-users.entity
Description : 중간 테이블 Entity - 동화 스토리, 회원
Author : 박수정

History
Date        Author      Status      Description
2024.08.01  박수정      Created     
2024.08.01  박수정      Modified    중간 테이블 생성
2024.08.02  박수정      Modified    DB 컬럼명 수정
2024.08.03  박수정      Modified    공통 필드 Entity 생성
*/

import { CommonEntity } from 'shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('rel_fairytale_users')
export class RelFairytaleUsers extends CommonEntity {
    @Column({ name: 'fairytale_id' })
    fairytaleId: number;

    @Column({ name: 'user_id' })
    userId: number;
}
