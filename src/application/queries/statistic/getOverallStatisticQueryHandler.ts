import { IStatisticRepository } from '../../../domain/iRepositories/IStatisticRepository';

export class GetOverallStatisticQueryHandler {
    constructor(private statisticRepository: IStatisticRepository) {}

    async handle() {
        const statistics = await this.statisticRepository.getStatistics();
        return statistics;
    }
}
