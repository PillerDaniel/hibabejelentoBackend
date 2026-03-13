export class EmailTemplateService {
    public static getRegistrationEmailHtml(
        userName: string,
        password: string
    ): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: sans-serif; line-height: 1.6; color: #333; }
                .container { width: 100%; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 8px; overflow: hidden; }
                .header { background-color: #27374D; color: #ffffff; padding: 20px; text-align: center; }
                .content { padding: 30px; }
                .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #777; }
                .button { background-color: #526D82; color: white !important; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; font-weight: bold; }
                .label { font-weight: bold; color: #27374D; }
                .credential-box { background: #f4f4f4; padding: 20px; border-left: 4px solid #526D82; margin: 20px 0; }
                .warning { font-size: 13px; color: #856404; background-color: #fff3cd; border: 1px solid #ffeeba; padding: 10px; border-radius: 4px; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Üdvözöljük a Rendszerben!</h1>
                </div>
                <div class="content">
                    <p>Tisztelt <strong>${userName}</strong>!</p>
                    <p>Az adminisztrátor létrehozta az Ön felhasználói fiókját a Hibabejelentő rendszerben.</p>
                    
                    <div class="credential-box">
                        <p style="margin: 5px 0;"><span class="label">Felhasználónév:</span> ${userName}</p>
                        <p style="margin: 5px 0;"><span class="label">Jelszó:</span> <code style="font-size: 1.1em; background: #eee; padding: 2px 5px; border-radius: 3px;">${password}</code></p>
                    </div>

                    <div class="warning">
                        <strong>Figyelem:</strong> Biztonsági okokból javasoljuk, hogy az első bejelentkezés után azonnal változtassa meg jelszavát.
                    </div>

                    <div style="text-align: center;">
                        <a href="http://localhost:5173/login" class="button">Bejelentkezés a Dashboardra</a>
                    </div>
                </div>
                <div class="footer">
                    <p>Ez egy automatikus üzenet, kérjük ne válaszolj rá.</p>
                    <p>&copy; 2026 Hibabejelentő Rendszer</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}
