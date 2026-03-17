import { IReportRepository } from '../../../domain/iRepositories/IReportRepository';
import { EditReportCommand } from './EditReportCommand';

export class EditReportCommandHandler {
    constructor(private reportRepository: IReportRepository) {}
    async handle(cmd: EditReportCommand) {
        return await this.reportRepository.editReport(
            cmd.reportId,
            cmd.title,
            cmd.description,
            cmd.priority,
            cmd.categoryId
        );
    }
}
