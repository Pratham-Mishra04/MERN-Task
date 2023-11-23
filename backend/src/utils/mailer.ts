import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import * as path from 'path';
import { ENV } from '../config/env';

interface Config {
    email: string;
    subject: string;
    body: string;
    template: string;
}

const sendEmail = async (config: Config): Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: ENV.EMAIL_HOST,
        port: Number(ENV.EMAIL_PORT),
        auth: {
            user: ENV.EMAIL_USERNAME,
            pass: ENV.EMAIL_PASS,
        },
    });

    const handlebarOptions: hbs.NodemailerExpressHandlebarsOptions = {
        viewEngine: {
            extname: '.handlebars',
            partialsDir: path.resolve('templates'),
            defaultLayout: false,
        },
        viewPath: path.resolve('templates'),
        extName: '.handlebars',
    };

    transporter.use('compile', hbs(handlebarOptions));

    const mailOptions: nodemailer.SendMailOptions & hbs.TemplateOptions = {
        from: ENV.EMAIL_USER,
        to: config.email,
        subject: config.subject,
        template: config.template,
        context: {
            text: config.body,
        },
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
