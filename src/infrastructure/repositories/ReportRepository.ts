import { IReportRepository } from '../../domain/iRepositories/IReportRepository';
import Report from '../../domain/models/Report';
import dataSource from '../db/dataSource';
export class ReportRepository implements IReportRepository {
    repo = dataSource.getRepository(Report);

    async getReportsByUser(
        userId: string,
        page: number,
        limit: number,
        status?: string,
        priority?: number
    ): Promise<{ reports: Report[]; total: number }> {
        const skip = (page - 1) * limit;
        const whereConditions: any = { reportedBy: { id: userId } };
        if (status) {
            whereConditions.status = status;
        }
        if (priority !== undefined) {
            whereConditions.priority = priority;
        }
        const [reports, total]: [Report[], number] =
            await this.repo.findAndCount({
                where: whereConditions,
                relations: ['reportedBy', 'managedBy', 'category'],
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    priority: true,
                    createdAt: true,
                    reportedBy: {
                        username: true,
                    },
                    managedBy: {
                        username: true,
                        role: true,
                    },
                    category: {
                        name: true,
                    },
                },
                order: { createdAt: 'DESC' },
                skip,
                take: limit,
            });

        return { reports: reports, total };
    }
    async getReportsForMaintaner(
        userId: string,
        page: number,
        limit: number,
        status?: string,
        priority?: number,
        managed?: string
    ): Promise<{ reports: Report[]; total: number }> {
        const skip = (page - 1) * limit;
        const whereConditions: any = {};
        if (managed === 'true') {
            whereConditions.managedBy = { id: userId };
        }
        if (status) {
            whereConditions.status = status;
        }
        if (priority !== undefined) {
            whereConditions.priority = priority;
        }

        const [reports, total]: [Report[], number] =
            await this.repo.findAndCount({
                where: whereConditions,
                relations: ['reportedBy', 'managedBy', 'category'],
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    priority: true,
                    createdAt: true,
                    reportedBy: {
                        username: true,
                    },
                    managedBy: {
                        username: true,
                        role: true,
                    },
                    category: {
                        name: true,
                    },
                },
                order: { createdAt: 'DESC' },
                skip,
                take: limit,
            });

        return { reports: reports, total };
    }

    async createReport(
        userId: string,
        categoryId: string,
        title: string,
        description: string,
        priority: number
    ): Promise<Report> {
        const report = this.repo.create({
            reportedBy: { id: userId },
            category: { id: categoryId },
            title,
            description,
            priority,
        });
        return await this.repo.save(report);
    }
}
