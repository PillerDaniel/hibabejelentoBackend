import { IReportRepository } from '../../../domain/iRepositories/IReportRepository';
import { EditReportStatusCommand } from './EditReportStatusCommand';

export class EditReportStatusCommandHandler {
    constructor(private reportRepository: IReportRepository) {}

    async handle(cmd: EditReportStatusCommand) {
        return await this.reportRepository.updateReportStatus(
            cmd.reportId,
            cmd.status,
            cmd.userId
        );
    }
}
