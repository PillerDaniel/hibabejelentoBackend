export class ChangeUserPasswordCommand {
    constructor(
        public username: string,
        public oldPassword: string,
        public newPassword: string
    ) {}
}
