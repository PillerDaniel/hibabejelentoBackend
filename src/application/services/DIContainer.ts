//interfaces
import { IUserRepository } from '../../domain/iRepositories/IUserRepository';
import { ISessionStore } from '../../domain/iRepositories/ISessionStore';
import { IReportRepository } from '../../domain/iRepositories/IReportRepository';
import { ICategoryRepository } from '../../domain/iRepositories/ICategoryRepository';

//repositories
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { RedisSessionStore } from '../../infrastructure/RedisSessionStore';
import { ReportRepository } from '../../infrastructure/repositories/ReportRepository';
import { CategoryRepository } from '../../infrastructure/repositories/CategoryRepository';

//command handlers
import { CreateUserCommandHandler } from '../commands/user/CreateUserCommandHandler';
import { LoginUserCommandHandler } from '../commands/user/LoginUserCommandHandler';
import { LogOutCommandHandler } from '../commands/user/LogOutCommandHandler';
import { CreateReportCommandHandler } from '../commands/report/CreateReportCommandHandler';
import { EditReportStatusCommandHandler } from '../commands/report/EditReportStatusCommandHandler';
import { AssignReportToMaintainerCommandHandler } from '../commands/report/AssignReportToMaintainerCommandHandler';

//query handlers
import { GetReportsByUserQueryHandler } from '../queries/report/GetReportsByUserQueryHandler';
import { GetReportsForMaintainerQueryHandler } from '../queries/report/GetReportsForMaintainerQueryHandler';
import { GetAllCategoryQueryHandler } from '../queries/category/GetAllCategoryQueryHandler';

export class DIContainer {
    private static instance: DIContainer;

    //repos
    private _userRepository: IUserRepository | null = null;
    private _sessionStore: ISessionStore | null = null;
    private _reportRepository: IReportRepository | null = null;
    private _categoryRepository: ICategoryRepository | null = null;
    //command handlers
    private _createUserCommandHandler: CreateUserCommandHandler | null = null;
    private _loginUserHandler: LoginUserCommandHandler | null = null;
    private _logOutCommandHandler: LogOutCommandHandler | null = null;
    private _createReportCommandHandler: CreateReportCommandHandler | null =
        null;
    private _editReportStatusCommandHandler: EditReportStatusCommandHandler | null =
        null;
    private _assignReportToMaintainerCommandHandler: AssignReportToMaintainerCommandHandler | null =
        null;

    //query handlers
    private _getReportByUserQueryHandler: GetReportsByUserQueryHandler | null =
        null;
    private _getReportsForMaintainerQueryHandler: GetReportsForMaintainerQueryHandler | null =
        null;
    private _getAllCategoryQueryHandler: GetAllCategoryQueryHandler | null =
        null;

    private constructor() {}

    public static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    //repositories
    public get userRepository(): IUserRepository {
        if (!this._userRepository) {
            this._userRepository = new UserRepository();
        }
        return this._userRepository;
    }

    public get reportRepository(): IReportRepository {
        if (!this._reportRepository) {
            this._reportRepository = new ReportRepository();
        }
        return this._reportRepository;
    }

    public get categoryRepository(): ICategoryRepository {
        if (!this._categoryRepository) {
            this._categoryRepository = new CategoryRepository();
        }
        return this._categoryRepository;
    }

    public get sessionStore(): ISessionStore {
        if (!this._sessionStore) {
            this._sessionStore = new RedisSessionStore();
        }
        return this._sessionStore;
    }

    //command handlers
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

    public get createReportCommandHandler(): CreateReportCommandHandler {
        if (!this._createReportCommandHandler) {
            this._createReportCommandHandler = new CreateReportCommandHandler(
                this.reportRepository
            );
        }
        return this._createReportCommandHandler;
    }

    public get editReportStatusCommandHandler(): EditReportStatusCommandHandler {
        if (!this._editReportStatusCommandHandler) {
            this._editReportStatusCommandHandler =
                new EditReportStatusCommandHandler(this.reportRepository);
        }
        return this._editReportStatusCommandHandler;
    }

    public get assignReportToMaintainerCommandHandler(): AssignReportToMaintainerCommandHandler {
        if (!this._assignReportToMaintainerCommandHandler) {
            this._assignReportToMaintainerCommandHandler =
                new AssignReportToMaintainerCommandHandler(
                    this.reportRepository
                );
        }
        return this._assignReportToMaintainerCommandHandler;
    }

    //query handlers
    public get getReportByUserQueryHandler(): GetReportsByUserQueryHandler {
        if (!this._getReportByUserQueryHandler) {
            this._getReportByUserQueryHandler =
                new GetReportsByUserQueryHandler(this.reportRepository);
        }
        return this._getReportByUserQueryHandler;
    }
    public get getReportForMaintainerQueryHandler(): GetReportsForMaintainerQueryHandler {
        if (!this._getReportsForMaintainerQueryHandler) {
            this._getReportsForMaintainerQueryHandler =
                new GetReportsForMaintainerQueryHandler(this.reportRepository);
        }
        return this._getReportsForMaintainerQueryHandler;
    }
    public get getAllCategoryQueryHandler(): GetAllCategoryQueryHandler {
        if (!this._getAllCategoryQueryHandler) {
            this._getAllCategoryQueryHandler = new GetAllCategoryQueryHandler(
                this.categoryRepository
            );
        }
        return this._getAllCategoryQueryHandler;
    }
}

export const container = DIContainer.getInstance();
