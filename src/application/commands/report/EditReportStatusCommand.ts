import { ReportStatus } from '../../../domain/enums/ReportStatus';
export class EditReportStatusCommand {
    constructor(
        public reportId: string,
        public status: ReportStatus,
        public userId: string
    ) {}
}
