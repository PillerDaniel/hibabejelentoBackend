import nodemailer from 'nodemailer';
import config from 'config';
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: config.get('nodemailer.email'),
        pass: config.get('nodemailer.password'),
    },
    secure: true,
    port: 465,
});
