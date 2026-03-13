import { IReportRepository } from '../../../domain/iRepositories/IReportRepository';
import { GetReportsForMaintainerQuery } from './GetReportsForMaintainerQuery';
export class GetReportsForMaintainerQueryHandler {
    constructor(private reportRepository: IReportRepository) {}
    async handle(query: GetReportsForMaintainerQuery) {
        const reports = await this.reportRepository.getReportsForMaintaner(
            query.userId,
            query.page,
            query.limit,
            query.status,
            query.priority,
            query.managed,
            query.categoryId
        );
        return reports;
    }
}
