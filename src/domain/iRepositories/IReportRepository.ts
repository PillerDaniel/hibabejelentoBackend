import Report from '../models/Report';

export interface IReportRepository {
    getReportsByUser(
        userId: string,
        page: number,
        limit: number,
        status?: string,
        priority?: number
    ): Promise<{ reports: Report[]; total: number }>;

    getReportsForMaintaner(
        userId: string,
        page: number,
        limit: number,
        status?: string,
        priority?: number,
        managed?: string
    ): Promise<{ reports: Report[]; total: number }>;

    createReport(
        userId: string,
        categoryId: string,
        title: string,
        description: string,
        priority: number
    ): Promise<Report>;
}
