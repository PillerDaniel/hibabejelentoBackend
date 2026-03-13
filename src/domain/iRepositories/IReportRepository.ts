import { ReportStatus } from '../enums/ReportStatus';
import Report from '../models/Report';

export interface IReportRepository {
    getReportsByUser(
        userId: string,
        page: number,
        limit: number,
        status?: string,
        priority?: number,
        categoryId?: string
    ): Promise<{ reports: Report[]; total: number }>;

    getReportsForMaintaner(
        userId: string,
        page: number,
        limit: number,
        status?: string,
        priority?: number,
        managed?: string,
        categoryId?: string
    ): Promise<{ reports: Report[]; total: number }>;

    createReport(
        userId: string,
        categoryId: string,
        title: string,
        description: string,
        priority: number
    ): Promise<Report>;

    updateReportStatus(
        reportId: string,
        status: ReportStatus,
        userId: string
    ): Promise<Report | null>;

    assignReport(
        reportId: string,
        maintainerId: string
    ): Promise<Report | null>;
}
