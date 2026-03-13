export class GetReportsForMaintainerQuery {
    constructor(
        public userId: string,
        public page: number,
        public limit: number,
        public status?: string,
        public priority?: number,
        public managed?: string,
        public categoryId?: string
    ) {}
}
