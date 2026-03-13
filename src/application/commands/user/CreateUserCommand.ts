export class CreateUserCommand {
    constructor(
        public username: string,
        public firstName: string,
        public lastName: string,
        public email: string
    ) {}
}
