export class GetMaintainersQuery {
    constructor(
        public page: number = 1,
        public limit: number = 12
    ) {}
}
