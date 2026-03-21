import { IStatisticRepository } from '../../domain/iRepositories/IStatisticRepository';
import Report from '../../domain/models/Report';
import Category from '../../domain/models/Category';
import dataSource from '../db/dataSource';

export class StatisticRepository implements IStatisticRepository {
    private reportRepo = dataSource.getRepository(Report);
    private categoryRepo = dataSource.getRepository(Category);

    async getStatistics(): Promise<any> {
        return await this.categoryRepo
            .createQueryBuilder('category')
            .leftJoin('category.reports', 'report')
            .select('category.name', 'categoryName')
            .addSelect('COUNT(report.id)::INTEGER', 'totalReports')
            .addSelect(
                'COUNT(report.id) FILTER (WHERE report.closedAt IS NOT NULL)::INTEGER',
                'closedReports'
            )
            .addSelect('AVG(report.closedAt - report.createdAt)', 'averageTime')
            .groupBy('category.id')
            .addGroupBy('category.name')
            .orderBy('"totalReports"', 'DESC')
            .getRawMany();
    }

    async getStatisticsForMaintainer(maintainerId: string): Promise<any> {
        return await this.categoryRepo
            .createQueryBuilder('category')
            .leftJoin('category.reports', 'report')
            .where('report.managedById = :maintainerId', { maintainerId })
            .select('category.name', 'categoryName')
            .addSelect('COUNT(report.id)::INTEGER', 'totalReports')
            .addSelect(
                'COUNT(report.id) FILTER (WHERE report.closedAt IS NOT NULL)::INTEGER',
                'closedReports'
            )
            .addSelect('AVG(report.closedAt - report.createdAt)', 'averageTime')
            .groupBy('category.id')
            .addGroupBy('category.name')
            .orderBy('"totalReports"', 'DESC')
            .getRawMany();
    }
}
