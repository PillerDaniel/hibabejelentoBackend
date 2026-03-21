import { GetStatisticForMaintainerQuery } from './getStatisticForMaintainerQuery';
import { IStatisticRepository } from '../../../domain/iRepositories/IStatisticRepository';

export class GetStatisticForMaintainerQueryHandler {
    constructor(private statisticRepository: IStatisticRepository) {}

    async handle(query: GetStatisticForMaintainerQuery) {
        const statistics =
            await this.statisticRepository.getStatisticsForMaintainer(
                query.maintainerId
            );
        return statistics;
    }
}
