import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { MailerService } from 'src/mailer/mailer.service';
import { SigninDto } from './dto/signinDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dto/resetPasswordDto';
import * as speakEasy from "speakeasy"
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmationDto';
import { DeleteAccountDto } from './dto/deleteAccountDto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mailerService: MailerService,
        private readonly JwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async signup(signupDto: SignupDto) {
        const { username, email, password } = signupDto
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (user) {
            await this.mailerService.sendAccountAlreadyExist(email, username);
            throw new ConflictException("User already exist.")
        }
        const hash = await bcrypt.hash(password, 10)
        await this.prismaService.user.create({
            data: {
                email: email,
                username: username,
                password: hash
            }
        })
        await this.mailerService.sendSignupConfirmation(email);
        return { message: "User sucesfully created !" }
    }

    async signin(signinDto: SigninDto) {
        const { email, password } = signinDto
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (!user) throw new ConflictException('User not found.')
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new UnauthorizedException('Incorrect username or password.')
        const payload = {
            sub: user.userId,
            email: user.email,
            username: user.username
        }
        const token = this.JwtService.sign(payload, { expiresIn: "100y", secret: this.configService.get("JWT_SECRET") });
        return {
            token, user: {
                username: user.username,
                email: user.email
            }
        }
    }

    async resetPasswordRequest(resetPasswordDto: ResetPasswordDto) {
        const { email } = resetPasswordDto;
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (!user) throw new ConflictException('User not found.')
        const code = speakEasy.totp({
            secret: this.configService.get("OTP_SECRET"),
            digits : 6,
            step : 60 * 15,
            encoding : "base32"
        })
        const url = "http://localhost:3000/auth/reset-password-confirmation"
        await this.mailerService.sendResetPassword(email, url, code);
        return{
            message: "Reset password mail has been sent"
        }
    }

    async resetPasswordConfirmation(resetPasswordConfirmationDto: ResetPasswordConfirmationDto) {
        const { email, password, code } = resetPasswordConfirmationDto;
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (!user) throw new ConflictException('User not found.')
        const match = speakEasy.totp.verify({
            secret: this.configService.get("OTP_SECRET"),
            token : code,
            digits : 6,
            step : 60 * 15,
            encoding : "base32"
        })
        if(!match) throw new UnauthorizedException("Invalid/expired token.")
        const hash = await bcrypt.hash(password, 10);
        await this.prismaService.user.update({where : {email}, data: {password : hash}})
        return{
            message: "Password updated !"
        }
    }

    async deleteAccount(userId: number, deleteAccountDto : DeleteAccountDto) {
        const { password } = deleteAccountDto;
        const user = await this.prismaService.user.findUnique({ where: { userId } });
        if (!user) throw new ConflictException('User not found.')
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new UnauthorizedException('Incorrect username or password.')
        await this.prismaService.user.delete({where : {userId : userId}});
        return {
            message: "User deleted."
        }
    }
}
