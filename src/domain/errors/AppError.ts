export class AppError extends Error {
    public statusCode!: number;
    public messageHu!: string;
    public messageEn!: string;

    constructor(statusCode: number, messageEn: string, messageHu: string) {
        super(messageEn);
        this.statusCode = statusCode;
        this.messageEn = messageEn;
        this.messageHu = messageHu;
    }
}
