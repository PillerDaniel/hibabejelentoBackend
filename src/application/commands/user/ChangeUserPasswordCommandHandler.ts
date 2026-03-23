import { IUserRepository } from '../../../domain/iRepositories/IUserRepository';
import { ChangeUserPasswordCommand } from './ChangeUserPasswordCommand';
import bcrypt from 'bcrypt';
import { AppError } from '../../../domain/errors/AppError';

export class ChangeUserPasswordCommandHandler {
    constructor(private readonly userRepository: IUserRepository) {}

    async handle(cmd: ChangeUserPasswordCommand): Promise<void> {
        const user = await this.userRepository.findByUsername(cmd.username);

        if (!user) {
            throw new AppError(
                404,
                'User not found.',
                'A megadott felhasználó nem található.'
            );
        }

        const isMatch = await bcrypt.compare(cmd.oldPassword, user.password);

        if (!isMatch) {
            throw new AppError(
                401,
                'Invalid password.',
                'A megadott régi jelszó helytelen.'
            );
        }

        const isSamePassword = await bcrypt.compare(
            cmd.newPassword,
            user.password
        );

        if (isSamePassword) {
            throw new AppError(
                400,
                'New password cannot be the same as old one.',
                'Az új jelszó nem egyezhet meg a régivel.'
            );
        }

        const newPasswordHash = await bcrypt.hash(cmd.newPassword, 10);
        await this.userRepository.changePassword(user.id, newPasswordHash);
    }
}
