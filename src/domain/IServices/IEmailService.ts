export interface IEmailService {
    sendRegisterEmail(to: string, subject: string, html: string): Promise<void>;
}
