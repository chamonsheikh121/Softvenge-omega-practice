/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'), // name of env variable
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<number>('EMAIL_PORT') === 465, // true for 465
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendForgetPassMail(to: string, token: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Authentication task1" <${this.configService.get('EMAIL_USER')}>`,
      to,
      subject: 'Reset Your Password in 10m',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color:#007bff;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        
        <a href="${resetUrl}" 
           style="
             display: inline-block;
             padding: 12px 24px;
             margin: 20px 0;
             background-color: #007bff;
             color: #ffffff;
             text-decoration: none;
             border-radius: 6px;
             font-weight: bold;
           ">
          Reset Password
        </a>
        
        <p>If you did not request a password reset, please ignore this email.</p>
        
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
        <p style="font-size: 12px; color: gray;">This link will expire in 1 hour.</p>
      </div>
    `,
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log('Password reset email sent: %s', info.messageId);
    return info;
  }
}
