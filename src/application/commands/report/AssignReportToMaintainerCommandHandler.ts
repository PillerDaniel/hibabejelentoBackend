import { IReportRepository } from '../../../domain/iRepositories/IReportRepository';
import { AssignReportToMaintainerCommand } from './AssignReportToMaintainerCommand';
import { logReportAssign } from '../../utils/bot';

export class AssignReportToMaintainerCommandHandler {
    constructor(private reportRepository: IReportRepository) {}
    async handle(cmd: AssignReportToMaintainerCommand) {
        const result = await this.reportRepository.assignReport(
            cmd.reportId,
            cmd.maintainerId
        );

        if (result) {
            logReportAssign(cmd.reportId, cmd.maintainerId);
        }
        return result;
    }
}
