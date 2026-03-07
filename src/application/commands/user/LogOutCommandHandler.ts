import { ISessionStore } from '../../../domain/iRepositories/ISessionStore';
import { LogOutCommand } from './LogOutCommand';

export class LogOutCommandHandler {
    constructor(private readonly sessionStore: ISessionStore) {}
    async handle(cmd: LogOutCommand): Promise<void> {
        await this.sessionStore.deleteSession(cmd.redisSessionId);
    }
}
