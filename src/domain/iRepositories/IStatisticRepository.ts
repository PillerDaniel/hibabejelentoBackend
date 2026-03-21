export interface IStatisticRepository {
    getStatistics(): Promise<any>;
    getStatisticsForMaintainer(maintainerId: string): Promise<any>;
}
