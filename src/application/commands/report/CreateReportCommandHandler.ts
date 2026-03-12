import Report from '../../../domain/models/Report';
import { IReportRepository } from '../../../domain/iRepositories/IReportRepository';
import { CreateReportCommand } from './CreateReportCommand';

export class CreateReportCommandHandler {
    constructor(private readonly reportRepository: IReportRepository) {}
    async handle(cmd: CreateReportCommand): Promise<Report> {
        return await this.reportRepository.createReport(
            cmd.userId,
            cmd.categoryId,
            cmd.title,
            cmd.description,
            cmd.priority
        );
    }
}
