import { GetMaintainersQuery } from './GetMaintainersQuery';
import { IUserRepository } from '../../../domain/iRepositories/IUserRepository';
import User from '../../../domain/models/User';

export class GetMaintainersQueryHandler {
    constructor(private userRepository: IUserRepository) {}

    async handle(query: GetMaintainersQuery) {
        const maintainers = await this.userRepository.getMaintainers(
            query.page,
            query.limit
        );
        return maintainers;
    }
}
