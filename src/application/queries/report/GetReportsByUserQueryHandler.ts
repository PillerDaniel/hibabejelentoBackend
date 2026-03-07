import { GetReportByUserQuery } from './GetReportsByUserQuery';
import { IReportRepository } from '../../../domain/iRepositories/IReportRepository';

export class GetReportsByUserQueryHandler {
    constructor(private reportRepository: IReportRepository) {}

    async handle(query: GetReportByUserQuery) {
        const reports = await this.reportRepository.getReportsByUser(
            query.userId,
            query.page,
            query.limit,
            query.status,
            query.priority
        );
        return reports;
    }
}
