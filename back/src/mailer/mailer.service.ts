import { Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer"
import { config } from "dotenv"
config({path : '../../.env'})


@Injectable()
export class MailerService {
    private async transporter(){
        const transport = nodemailer.createTransport({
            host: process.env.MAIL_SERVER,
            port: 465,
            ignoreTLS: true,
            tls: {
                rejectUnauthorized: false,
            },
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASS
            }
        })
        return transport
    }

    async sendSignupConfirmation(userEmail : string){
        (await this.transporter()).sendMail({
            from: process.env.MAIL_USERNAME,
            to: userEmail,
            subject: "Register",
            html: "<h3>Registration successfull !</h3>"
        });
    }

    async sendAccountAlreadyExist(userEmail : string, username : string){
        (await this.transporter()).sendMail({
            from: process.env.MAIL_USERNAME,
            to: userEmail,
            subject: "Account already exist",
            html: `<h3>Account ${username} already exist !</h3>`
        });
    }

    async sendResetPassword(userEmail : string, url : string, code : string){
        (await this.transporter()).sendMail({
            from: process.env.MAIL_USERNAME,
            to: userEmail,
            subject: "Reset password",
            html: 
            `
                <a href=${url}>Reset password</a>
                <p>Secret code : <strong>${code}</strong></p>
            
            `
        });
    }
}
