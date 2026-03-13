import { IEmailService } from '../../domain/IServices/IEmailService';
import { transporter } from '../utils/nodemailerTransporter';
import config from 'config';

export class EmailService implements IEmailService {
    async sendRegisterEmail(
        to: string,
        subject: string,
        html: string
    ): Promise<void> {
        try {
            await transporter.sendMail({
                from: config.get('nodemailer.email'),
                to,
                subject,
                html,
            });
        } catch (error: any) {
            throw new Error('Failed to send email', error);
        }
    }
}
