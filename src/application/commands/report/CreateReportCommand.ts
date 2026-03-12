export class CreateReportCommand {
    constructor(
        public userId: string,
        public categoryId: string,
        public title: string,
        public description: string,
        public priority: number
    ) {}
}
