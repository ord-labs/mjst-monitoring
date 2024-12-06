import appConfig from "../config/app.config";
import nodemailer from "nodemailer";

const EMAIL = appConfig.SMTP_EMAIL;
const PASSWORD = appConfig.SMTP_PASSWORD;

const createEmail = (recipients: string[], subject: string, htmlToSend: any) => {
    const config = {
        from: EMAIL,
        to: recipients,
        subject: subject,
        html: htmlToSend
    };
    return config;
};

const createMailerTransport = () => {
    console.log("EMAIL: ", EMAIL);
    console.log("PASSWORD: ", PASSWORD);
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    });
};

export const sendEmail = async (recipients: string[], subject: string, htmlToSend: string) => {
    try {
        const nodeMailerTransport = createMailerTransport();

        nodeMailerTransport.verify((error) => {
            if (error) return;
            console.log("Ready to send email");
        });

        const emailConfig = createEmail(recipients, subject, htmlToSend);

        await nodeMailerTransport.sendMail(emailConfig);

        return new Response(
            JSON.stringify({
                success: true,
                status: 200
            })
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                error: (error as Error).message
            })
        );
    }
};
