/**
File Name : point.repository
Description : 포인트 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.08.02  이유민      Created     
2024.08.02  이유민      Modified    포인트 기능 추가
*/

import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Point } from 'src/modules/billing/entity/point.entity';

@Injectable()
export class PointRepository extends Repository<Point> {
    constructor(private dataSource: DataSource) {
        super(Point, dataSource.createEntityManager());
    }

    async createPoint(PointData: Partial<Point>): Promise<Point> {
        const point = this.create(PointData);
        return this.save(point);
    }

    async updatePointByUserId(user_id: number, pointsChange: number): Promise<Point> {
        const userPoints = await this.findOne({ where: { user_id } });
        userPoints.points += pointsChange;
        return this.save(userPoints);
    }

    async findPointByUserId(user_id: number): Promise<Point | undefined> {
        const res = await this.dataSource
            .getRepository(Point)
            .createQueryBuilder('point')
            .select(['point.user_id', 'point.points'])
            .where('point.user_id = :user_id', { user_id })
            .getOne();

        return res;
    }
}
