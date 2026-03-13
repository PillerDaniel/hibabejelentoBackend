import { randomBytes } from 'crypto';

export class PasswordGenerator {
    public static generate(length: number = 8): string {
        const charset =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';

        const bytes = randomBytes(length);

        for (let i = 0; i < length; i++) {
            password += charset[bytes[i] % charset.length];
        }

        return password;
    }
}
