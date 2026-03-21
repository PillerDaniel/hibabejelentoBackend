import { GetUserByIdQuery } from './GetUserByIdQuery';
import { IUserRepository } from '../../../domain/iRepositories/IUserRepository';

export class GetUserByIdQueryHandler {
    constructor(private readonly userRepository: IUserRepository) {}

    async handle(query: GetUserByIdQuery) {
        const user = await this.userRepository.getById(query.userId);
        return user;
    }
}
