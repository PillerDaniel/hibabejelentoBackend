import { IReportRepository } from '../../domain/iRepositories/IReportRepository';
import Report from '../../domain/models/Report';
import { ReportStatus } from '../../domain/enums/ReportStatus';
import dataSource from '../db/dataSource';
import { AppError } from '../../domain/errors/AppError';
export class ReportRepository implements IReportRepository {
    repo = dataSource.getRepository(Report);

    async getReportsByUser(
        userId: string,
        page: number,
        limit: number,
        status?: string,
        priority?: number,
        categoryId?: string
    ): Promise<{ reports: Report[]; total: number }> {
        const skip = (page - 1) * limit;
        const whereConditions: any = { reportedBy: { id: userId } };
        if (status) {
            whereConditions.status = status;
        }
        if (priority !== undefined) {
            whereConditions.priority = priority;
        }
        if (categoryId) {
            whereConditions.category = { id: categoryId };
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
        managed?: string,
        categoryId?: string
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
        if (categoryId) {
            whereConditions.category = { id: categoryId };
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

    async updateReportStatus(
        reportId: string,
        status: ReportStatus,
        userId: string
    ): Promise<Report | null> {
        const report = await this.repo.findOne({
            where: { id: reportId },
            relations: ['managedBy'],
        });

        if (!report) {
            return null;
        }

        if (report.managedBy && report.managedBy.id !== userId) {
            return null;
        }

        if (report.status === status) {
            throw new AppError(
                400,
                'Report is already in this status',
                'A  hibajegy már ebben az státuszban van'
            );
        }

        if (status === ReportStatus.OPEN) {
            report.managedBy = null;
        }

        report.status = status;
        //save changes to db
        await this.repo.save(report);

        //fetch the report with relations, beacause of TypeORM save method doesnt return relations
        return await this.repo.findOne({
            where: { id: reportId },
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
                    id: true,
                    name: true,
                },
            },
        });
    }

    async assignReport(
        reportId: string,
        maintainerId: string
    ): Promise<Report | null> {
        const report = await this.repo.findOne({
            where: { id: reportId },
            relations: ['managedBy'],
        });

        if (!report) {
            return null;
        }

        if (report.managedBy !== null) {
            throw new AppError(
                400,
                'Report is already assigned',
                'A hibajegyet már kezelik'
            );
        }

        report.status = ReportStatus.IN_PROGRESS;
        report.managedBy = { id: maintainerId } as any;
        await this.repo.save(report);

        return await this.repo.findOne({
            where: { id: reportId },
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
                    id: true,
                    name: true,
                },
            },
        });
    }

    async getReportById(reportId: string): Promise<Report | null> {
        const report = await this.repo.findOne({
            where: { id: reportId },
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
                    id: true,
                    name: true,
                },
            },
        });
        return report;
    }

    async editReport(
        reportId: string,
        title: string,
        description: string,
        priority: number,
        categoryId: string
    ): Promise<Report | null> {
        const report = await this.repo.findOne({
            where: { id: reportId },
            relations: ['reportedBy', 'managedBy', 'category'],
        });

        if (!report) {
            return null;
        }

        report.title = title;
        report.description = description;
        report.priority = priority;
        report.category = { id: categoryId } as any;

        await this.repo.save(report);

        return await this.repo.findOne({
            where: { id: reportId },
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
                    id: true,
                    name: true,
                },
            },
        });
    }
}
