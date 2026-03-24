import { IUserRepository } from '../../../domain/iRepositories/IUserRepository';
import { GetUserProfileQuery } from './GetUserProfileQuery';

export class GetUserProfileQueryHandler {
    constructor(private readonly userRepository: IUserRepository) {}

    async handle(query: GetUserProfileQuery) {
        const user = await this.userRepository.getProfileData(query.userId);
        return user;
    }
}
