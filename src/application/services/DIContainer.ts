//interfaces
import { IUserRepository } from '../../domain/iRepositories/IUserRepository';
import { ISessionStore } from '../../domain/iRepositories/ISessionStore';

//repositories
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { RedisSessionStore } from '../../infrastructure/RedisSessionStore';

//command handlers
import { CreateUserCommandHandler } from '../commands/CreateUserCommandHandler';
import { LoginUserCommandHandler } from '../commands/LoginUserCommandHandler';
import { LogOutCommandHandler } from '../commands/LogOutCommandHandler';

export class DIContainer {
    private static instance: DIContainer;

    //repos
    private _userRepository: IUserRepository | null = null;
    private _sessionStore: ISessionStore | null = null;

    //handlers
    private _createUserCommandHandler: CreateUserCommandHandler | null = null;
    private _loginUserHandler: LoginUserCommandHandler | null = null;
    private _logOutCommandHandler: LogOutCommandHandler | null = null;

    private constructor() {}

    public static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    public get userRepository(): IUserRepository {
        if (!this._userRepository) {
            this._userRepository = new UserRepository();
        }
        return this._userRepository;
    }

    public get sessionStore(): ISessionStore {
        if (!this._sessionStore) {
            this._sessionStore = new RedisSessionStore();
        }
        return this._sessionStore;
    }

    public get createUserHandler(): CreateUserCommandHandler {
        if (!this._createUserCommandHandler) {
            this._createUserCommandHandler = new CreateUserCommandHandler(
                this.userRepository
            );
        }
        return this._createUserCommandHandler;
    }

    public get loginUserHandler(): LoginUserCommandHandler {
        if (!this._loginUserHandler) {
            this._loginUserHandler = new LoginUserCommandHandler(
                this.userRepository,
                this.sessionStore
            );
        }
        return this._loginUserHandler;
    }

    public get logOutCommandHandler(): LogOutCommandHandler {
        if (!this._logOutCommandHandler) {
            this._logOutCommandHandler = new LogOutCommandHandler(
                this.sessionStore
            );
        }
        return this._logOutCommandHandler;
    }
}

export const container = DIContainer.getInstance();
