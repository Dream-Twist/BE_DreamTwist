/**
File Name : fairytale-img.entity
Description : 동화 이미지 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.07.26  박수정      Created     
2024.07.26  박수정      Modified    동화 이미지 업로드 기능 추가
2024.08.01  박수정      Modified    Entity 변경
2024.08.02  박수정      Modified    DB 컬럼명 수정
2024.08.03  박수정      Modified    공통 필드 Entity 생성
*/

import { CommonEntity } from 'shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('fairytale_img')
export class FairytaleImg extends CommonEntity {
    @Column({ name: 'fairytale_id' })
    fairytaleId: number;

    @Column({
        name: 'creation_way',
        type: 'enum',
        enum: ['default', 'upload', 'ai', 'palette', 'mix'],
    })
    creationWay: string;

    @Column('json')
    path: JSON;
}
