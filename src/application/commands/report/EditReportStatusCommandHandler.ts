import { IReportRepository } from '../../../domain/iRepositories/IReportRepository';
import { EditReportStatusCommand } from './EditReportStatusCommand';
import { logReportStatusChange } from '../../utils/bot';

export class EditReportStatusCommandHandler {
    constructor(private reportRepository: IReportRepository) {}

    async handle(cmd: EditReportStatusCommand) {
        const result = await this.reportRepository.updateReportStatus(
            cmd.reportId,
            cmd.status,
            cmd.userId
        );

        if (result) {
            logReportStatusChange(cmd.reportId, cmd.userId, cmd.status);
        }

        return result;
    }
}
