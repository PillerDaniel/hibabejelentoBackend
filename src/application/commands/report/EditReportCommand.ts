export class EditReportCommand {
    constructor(
        public reportId: string,
        public title: string,
        public description: string,
        public priority: number,
        public categoryId: string
    ) {}
}
