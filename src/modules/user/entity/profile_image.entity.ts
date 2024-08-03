/**
File Name : profile_image.entity
Description : 회원 프로필 이미지 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.08.01  박수정      Created     
2024.08.01  박수정      Modified    회원 프로필 이미지 기능 추가
2024.08.02  박수정      Modified    DB 컬럼명 수정
2024.08.03  박수정      Modified    공통 필드 Entity 생성
*/

import { CommonEntity } from 'shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('profile_image')
export class ProfileImage extends CommonEntity {
    @Column()
    path: number;
}
