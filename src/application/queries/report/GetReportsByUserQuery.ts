export class GetReportByUserQuery {
    constructor(
        public userId: string,
        public page: number = 1,
        public limit: number = 12,
        public status?: string,
        public priority?: number,
        public categoryId?: string
    ) {}
}
