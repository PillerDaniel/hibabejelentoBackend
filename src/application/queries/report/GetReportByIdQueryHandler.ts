import { IReportRepository } from '../../../domain/iRepositories/IReportRepository';
import { GetReportByIdQuery } from './GetReportByIdQuery';

export class GetReportByIdQueryHandler {
    constructor(private reportRepository: IReportRepository) {}

    async handle(query: GetReportByIdQuery) {
        const report = await this.reportRepository.getReportById(
            query.reportId
        );
        return report;
    }
}
