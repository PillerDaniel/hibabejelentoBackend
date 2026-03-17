import { IReportRepository } from '../../../domain/iRepositories/IReportRepository';
import { EditReportCommand } from './EditReportCommand';
import { logReportEdit } from '../../utils/bot';

export class EditReportCommandHandler {
    constructor(private reportRepository: IReportRepository) {}
    async handle(cmd: EditReportCommand) {
        const result = await this.reportRepository.editReport(
            cmd.reportId,
            cmd.title,
            cmd.description,
            cmd.priority,
            cmd.categoryId
        );

        if (!result) {
            return null;
        }

        logReportEdit(
            result.oldReport,
            result.editedReport,
            cmd.editedByUserId
        );
        return result.editedReport;
    }
}
