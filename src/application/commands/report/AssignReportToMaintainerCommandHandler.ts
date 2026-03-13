import { IReportRepository } from '../../../domain/iRepositories/IReportRepository';
import { AssignReportToMaintainerCommand } from './AssignReportToMaintainerCommand';

export class AssignReportToMaintainerCommandHandler {
    constructor(private reportRepository: IReportRepository) {}
    async handle(cmd: AssignReportToMaintainerCommand) {
        return await this.reportRepository.assignReport(
            cmd.reportId,
            cmd.maintainerId
        );
    }
}
